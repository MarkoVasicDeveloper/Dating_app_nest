import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway } from "@nestjs/websockets";
import { MessageBody, SubscribeMessage, WebSocketServer } from "@nestjs/websockets/decorators";
import { Lady } from "entities/Lady";
import { Message } from "entities/Message";
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from "src/dto/socket/join.room.dto";
import { ApiResponse } from "src/misc/api.response";
import { GentlemanService } from "src/services/gentleman/gentleman.service";
import { LadyService } from "src/services/lady/lady.service";
import { MessagesService } from "src/services/message/message.service";
import { SocketService } from "src/services/socket/socket.service";

const online = [];

@WebSocketGateway(3001,{
    cors: {
        origin: []
    }
})
export class Gateway implements OnModuleInit{
    constructor(private readonly socketService: SocketService,
                private readonly gentlemanService: GentlemanService,
                private readonly ladyService: LadyService,
                private readonly messageService: MessagesService) {}

    @WebSocketServer()
    server: Server

    onModuleInit() {
        this.server.on('connection', async (socket) => {
            const token = socket.handshake.headers.token
            const lady = socket.handshake.headers.lady
            if(!token) socket.disconnect(true);

            const userInfo = await this.socketService.checkUser(token, lady)
            
            if(userInfo instanceof ApiResponse) {
                socket.disconnect(true);
            } else{
                const id = userInfo instanceof Lady ? userInfo.ladyId : userInfo.gentlemanId;
                const user = {
                    username: userInfo.username, 
                    id, 
                    email: userInfo.email,
                    socketId: socket.id
                }
                online.push(user);
                const conversation = userInfo.conversations as any;
                const onlineFriends = [];
                conversation?.forEach(user => {
                    const friend = online.find(client => client.username === user.username && client.id === user.id);
                    if(friend) onlineFriends.push(friend)
                })
                socket.emit('online', onlineFriends);

                onlineFriends.forEach(friend => this.server.to(friend.socketId).emit('online', onlineFriends));
            }
        })
    }

    @SubscribeMessage('newMessage')
    async onNewMessage(socket: Socket, data: any) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            socket.emit('error', 'Data format must be JSON!');
        }
        const service = data.lady ? this.ladyService : this.gentlemanService;
        
        const user = await service.getByIdAndUsename(data.id, data.username);
        if(user instanceof ApiResponse) return socket.emit('error', 'User is not found!');

        const conversation = user.conversations as any;

        if(conversation !== null && conversation.sort((userObject: {id: number, username: string}) => userObject.id === data.connectonId && userObject.username === data.username)) {
            
            const userIsOnline = online.find(object => object.username === data.connectionUsername);
            
            if(!userIsOnline) {
                const message = await this.messageService.saveUnreadMessage({
                    gentlemanId: data.lady ? data.connectonId : data.id,
                    lady: data.lady,
                    ladyId: data.lady ? data.id : data.connectonId,
                    message: data.message
                });
                
                if(message instanceof ApiResponse && message.statusCode !== 13001) {
                    const gentlemanId = data.lady ? data.connectonId : data.id
                    const ladyId = data.lady ? data.id : data.connectonId;

                    const newMessage = await this.messageService.addMessage({
                        gentlemanId, ladyId
                    });

                    if(newMessage instanceof ApiResponse) return socket.emit('error', message);

                    const savedMessage = await this.messageService.saveUnreadMessage({
                        gentlemanId: data.lady ? data.connectonId : data.id,
                        lady: data.lady,
                        ladyId: data.lady ? data.id : data.connectonId,
                        message: data.message
                    });
                    if(!savedMessage) return socket.emit('error', message);

                    return socket.emit('error', 'User is ofline, but message is saved as unreaded!');
                }
                
                return socket.emit('error', 'User is ofline, but message is saved as unreaded!');
            }
            
            return this.server.to(userIsOnline.socketId).emit('receveMessage', {
                id: data.id,
                username: user.username,
                message: data.message
            });
        }

        return socket.emit('error', 'The conversation is not allowed or data is not complete!');
    }
}