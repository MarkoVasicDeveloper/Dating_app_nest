import { OnModuleInit } from "@nestjs/common";
import { OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { SubscribeMessage, WebSocketServer } from "@nestjs/websockets/decorators";
import { Gentleman } from "entities/Gentleman";
import { Lady } from "entities/Lady";
import { Message } from "entities/Message";
import { Server, Socket } from 'socket.io';
import { ApiResponse } from "src/misc/api.response";
import { GentlemanService } from "src/services/gentleman/gentleman.service";
import { LadyService } from "src/services/lady/lady.service";
import { MessagesService } from "src/services/message/message.service";
import { SocketService } from "src/services/socket/socket.service";

export let activeUsers = 0;
const online = [];

@WebSocketGateway(3001,{
    cors: {
        origin: []
    }
})
export class Gateway implements OnModuleInit, OnGatewayDisconnect{
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

            const userInfo = await this.socketService.checkUser(token, lady);
            
            if(userInfo instanceof ApiResponse) {
                socket.disconnect(true);
            } else{
                const id = userInfo instanceof Lady ? userInfo.ladyId : userInfo.gentlemanId;
                const user = {
                    username: userInfo.username, 
                    id,
                    lady: userInfo instanceof Lady ? true : false,
                    socketId: socket.id
                }
                online.push(user);
                activeUsers += 1;
            }
        })
    }

    async handleDisconnect(socket: Socket) {
        const index = online.findIndex((user: any) => user.socketId === socket.id );
        
        if(index) {
            const service = online[index].lady ? this.ladyService : this.gentlemanService
            const user = await service.getByIdAndUsename(online[index].id, online[index].username);
            if(user instanceof ApiResponse) return online.splice(index, 1);

            const conversation = user.conversations as any;

            if(conversation !== null) conversation.forEach((friendUser: any) => {
                const friend = online.find(client => client.username === friendUser.username);
                
                if(friend) socket.to(friend.socketId).emit('offline', {
                    id: online[index].id,
                    username: online[index].username,
                    lady: online[index].lady
                })
            })

            online.splice(index, 1);
            activeUsers -= 1;
        }
    }

    @SubscribeMessage('online')
    async onlineUser(socket: Socket) {
        const token = socket.handshake.headers.token
        const lady = socket.handshake.headers.lady
        if(!token) socket.disconnect(true);

        const userInfo = await this.socketService.checkUser(token, lady);

        if(userInfo instanceof ApiResponse) {
            socket.emit('error', userInfo);
            socket.disconnect(true);
            return;
        }

        const conversation = userInfo.conversations as any;
        const onlineFriends = [];
        conversation?.forEach((user: any) => {
            const friend = online.find(client => client.username === user.username && client.id === user.id);
            if(friend) onlineFriends.push(friend)
        })
        socket.emit('online', onlineFriends);

        onlineFriends.forEach(friend => socket.to(friend.socketId).emit('online', {
            username: userInfo.username, 
            id: userInfo instanceof Lady ? userInfo.ladyId : userInfo.gentlemanId, 
            socketId: socket.id,
            lady: userInfo instanceof Lady ? true : false
        }));
    }

    @SubscribeMessage('newMessage')
    async onNewMessage(socket: Socket, data: any) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            socket.emit('error', 'Data format must be JSON!');
            return;
        }
        const service = data.lady ? this.ladyService : this.gentlemanService;
        const gentlemanId = data.lady ? data.connectonId : data.id
        const ladyId = data.lady ? data.id : data.connectonId;
        
        const user = await service.getByIdAndUsename(data.id, data.username);
        if(user instanceof ApiResponse) return socket.emit('error', 'User is not found!');

        if(user instanceof Gentleman && user.privileges === 'gentleman' && user.numberOfMessage === 5){
            return socket.emit('error', 'You cannot send more then 5 message per day!');
        }

        const conversation = user.conversations as any;

        if(conversation !== null && conversation.some((userObject: {id: number, username: string}) => userObject.id === data.connectonId && userObject.username === data.connectionUsername)) {
            if(user instanceof Gentleman && user.privileges === 'gentleman'){
                user.numberOfMessage = user.numberOfMessage ? user.numberOfMessage + 1 : user.numberOfMessage = 1;
            }
            const userIsOnline = online.find(object => object.username === data.connectionUsername);
            
            let messageTable = await this.messageService.findMessage(data.lady ? data.connectonId : data.id,data.lady ? data.id : data.connectonId);

            if(messageTable instanceof ApiResponse) {
                messageTable = await this.messageService.addMessage({
                    gentlemanId, ladyId
                });
                if(messageTable instanceof ApiResponse) return socket.emit('error', messageTable);
            }
            
            if(!userIsOnline) {
                await this.messageService.saveUnreadMessage({
                    gentlemanId: data.lady ? data.connectonId : data.id,
                    lady: data.lady,
                    ladyId: data.lady ? data.id : data.connectonId,
                    message: data.message
                });
                
                return socket.emit('error', 'User is ofline, but message is saved as unreaded!');
            }

            await this.messageService.saveMessage({
                    gentlemanId: data.lady ? data.connectonId : data.id,
                    lady: data.lady,
                    ladyId: data.lady ? data.id : data.connectonId,
                    message: data.message
                })
            
            return this.server.to(userIsOnline.socketId).emit('receveMessage', {
                id: data.id,
                username: user.username,
                message: data.message
            });
        }

        return socket.emit('error', 'The conversation is not allowed or data is not complete!');
    }
}