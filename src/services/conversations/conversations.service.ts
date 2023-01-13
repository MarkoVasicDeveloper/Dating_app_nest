import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Gentleman } from "entities/Gentleman";
import { Lady } from "entities/Lady";
import { AcceptConversationDto } from "src/dto/conversation/accept.conversation.dto";
import { SendConversationRequestDto } from "src/dto/conversation/send.conversation.request.dto";
import { ApiResponse } from "src/misc/api.response";
import { fillObject } from "src/misc/fill.object";
import { Repository } from "typeorm";
import { GentlemanService } from "../gentleman/gentleman.service";
import { LadyService } from "../lady/lady.service";

@Injectable()
export class ConversationService{
    constructor(private readonly ladyService: LadyService,
                private readonly gentlemanService: GentlemanService) {}

    async sendConversationRequest(data: SendConversationRequestDto): Promise<ApiResponse> {
        if(data.lady) {

            const user = await this.ladyService.getByIdAndUsename(data.senderId,data.senderUsername)
            if(user instanceof ApiResponse) return user;

            const destinationUser = await this.gentlemanService.getById(data.destinationId);
            if(destinationUser instanceof ApiResponse) return destinationUser;

            const existRequest = destinationUser.conversationRequest as any;

            if(existRequest !== null && existRequest.some(item => item.id === user.ladyId && item.username === user.username)) return new ApiResponse('error', 'The request has already been sent', 6001);

            destinationUser.conversationRequest = fillObject(destinationUser.conversationRequest, {"id" : data.senderId, "username" : data.senderUsername});

            const savedData = await this.gentlemanService.savedUser(destinationUser);
            if(savedData instanceof ApiResponse) return savedData;

            return new ApiResponse('ok', "A conversation request has been sent", 200);
        }

        const user = await this.gentlemanService.getByIdAndUsename(data.senderId,data.senderUsername)
        if(user instanceof ApiResponse) return user;
        
        const destinationUser = await this.ladyService.getById(data.destinationId)
        if(destinationUser instanceof ApiResponse) return destinationUser;

        const existRequest = destinationUser.conversationRequest as any;

        if(existRequest !== null && existRequest.some(item => item.id === user.gentlemanId && item.username === user.username)) return new ApiResponse('error', 'The request has already been sent', 6001);

        destinationUser.conversationRequest = fillObject(destinationUser.conversationRequest, {"id" : data.senderId, "username" : data.senderUsername})
        
        const savedData = await this.ladyService.savedUser(destinationUser);
        if(savedData instanceof ApiResponse) return savedData;

        return new ApiResponse('ok', "A conversation request has been sent", 200);
    }

    async acceptConversation(data: AcceptConversationDto):Promise <ApiResponse> {
        if(data.lady) {
            const user = await this.ladyService.getByIdAndUsename(data.id,data.username)
            if(user instanceof ApiResponse) return user;

            let conversationRequest = user.conversationRequest as any;
            let requestData: {};

            conversationRequest.forEach(async (request: {id: string, username: string}, index: number) => {

                if(Number(request.id) === data.userId && request.username === data.userUsername) {
                    requestData = request;
                    if(conversationRequest.length === 1){
                        conversationRequest = null
                    }else {
                        delete conversationRequest[index]
                    }
                }
            })

            if(!requestData) return new ApiResponse('ok', 'Request is not found', 4001);

            user.conversations = fillObject(user.conversations, {"id" : data.userId, "username" : data.userUsername});

            user.conversationRequest = conversationRequest;
            const savedUser = await this.ladyService.savedUser(user);
            if(savedUser instanceof ApiResponse) return savedUser;

            const senderRequest = await this.gentlemanService.getByIdAndUsename(data.userId,data.userUsername);
            if(senderRequest instanceof ApiResponse) return senderRequest;

            senderRequest.conversations = fillObject(senderRequest.conversations, {"id" : user.ladyId, "username" : user.username})

            const savedSenderUser = await this.gentlemanService.savedUser(senderRequest);

            if(savedSenderUser instanceof ApiResponse) return savedSenderUser;

            return new ApiResponse('ok', `You are connection with ${savedSenderUser.username}`, 200);
        }

        const user = await this.gentlemanService.getByIdAndUsename(data.id,data.username)
        if(user instanceof ApiResponse) return user;

        let conversationRequest = user.conversationRequest as any;
        let requestData: {};

        conversationRequest.map(async (request: {id: string, username: string}, index: number) => {

            if(Number(request.id) === data.userId && request.username === data.userUsername) {

                requestData = request;

                if(conversationRequest.length === 1){
                    conversationRequest = null
                }else {
                    delete conversationRequest[index]
                }
            }
        })

        if(!requestData) return new ApiResponse('ok', 'Request is not found', 4001);

        user.conversations = fillObject(user.conversations, {"id" : data.userId, "username" : data.userUsername});

        user.conversationRequest = conversationRequest;
        const savedUser = await this.gentlemanService.savedUser(user);
        if(savedUser instanceof ApiResponse) return savedUser;

        const senderRequest = await this.ladyService.getByIdAndUsename(data.userId,data.userUsername)
        if(senderRequest instanceof ApiResponse) return senderRequest;

        senderRequest.conversations = fillObject(senderRequest.conversations, {"id" : data.id, "username" : data.username})

        const savedSenderUser = await this.ladyService.savedUser(senderRequest);

        if(savedSenderUser instanceof ApiResponse) return savedSenderUser;

        return new ApiResponse('ok', `You are connection with ${savedSenderUser.username}`, 200);
    }
}