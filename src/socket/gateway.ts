import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway } from "@nestjs/websockets";
import { MessageBody, SubscribeMessage, WebSocketServer } from "@nestjs/websockets/decorators";
import { Server } from 'socket.io';
import { ApiResponse } from "src/misc/api.response";
import { SocketService } from "src/services/socket/socket.service";

const online = [];

@WebSocketGateway(3001,{
    cors: {
        origin: []
    }
})
export class Gateway implements OnModuleInit{
    constructor(private readonly socketService: SocketService) {}

    @WebSocketServer()
    server: Server

    onModuleInit() {
        this.server.on('connection', async (socket) => {
            const token = socket.handshake.headers.token
            const lady = socket.handshake.headers.lady
            if(!token) socket.disconnect(true);

            const userInfo = await this.socketService.checkUser(token, lady)
            
            if(userInfo instanceof ApiResponse) {
                socket.disconnect(true)
            } else{
                userInfo['socketId'] = socket.id
                online.push(userInfo);
                this.server.emit('online', online);
            }
        })
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() data: any) {
        // console.log(activeUsers)
    }
}