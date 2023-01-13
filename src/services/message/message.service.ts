import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "entities/Message";
import { AddMessageDto } from "src/dto/messages/add.message.dto";
import { SaveMessageDto } from "src/dto/messages/save.message.dto";
import { ApiResponse } from "src/misc/api.response";
import { fillObject } from "src/misc/fill.object";
import { Repository } from "typeorm";

export class MessagesService {
    constructor(@InjectRepository(Message) private readonly messagesServices: Repository<Message>) {}

    async findMessage(gentlemanId: number, ladyId: number):Promise<Message | ApiResponse> {
        const messages = await this.messagesServices.findOne({
            where: {
                gentlemanId: gentlemanId,
                ladyId: ladyId
            }
        });
        if(!messages) return new ApiResponse('error', 'The conversation does not exists!', -12001);
        return messages;
    }

    async addMessage(data: AddMessageDto):Promise<Message | ApiResponse> {
        const message = new Message();
        message.gentlemanId = data.gentlemanId;
        message.ladyId = data.ladyId;

        const savedMessage = await this.messagesServices.save(message);
        if(!savedMessage) return new ApiResponse('error', 'Messages table is not created!', -13002);
        return message;
    }

    async saveMessage(data: SaveMessageDto):Promise<Message | ApiResponse> {
        const messages = await this.findMessage(data.gentlemanId, data.ladyId);
        if(messages instanceof ApiResponse) return messages;

        messages.message = fillObject(messages.message, {
            date: new Date().toISOString(),
            from: data.lady ? data.ladyId : data.gentlemanId,
            message: data.message
        }) as any;

        const savedMessage = await this.messagesServices.save(messages);
        if(!savedMessage) return new ApiResponse('error', 'Message is not saved!', -13001);
        return savedMessage;
    }

    async saveUnreadMessage(data: SaveMessageDto):Promise <Message | ApiResponse> {
        const messages = await this.findMessage(data.gentlemanId, data.ladyId);
        if(messages instanceof ApiResponse) return messages;
        
        messages.unreadMessage = fillObject(messages.unreadMessage, {
            date: new Date().toISOString(),
            from: data.lady ? data.ladyId : data.gentlemanId,
            message: data.message
        }) as any;

        const savedMessage = await this.messagesServices.save(messages);
        if(!savedMessage) return new ApiResponse('error', 'Message is not saved!', -13001);
        return savedMessage;
    }
}