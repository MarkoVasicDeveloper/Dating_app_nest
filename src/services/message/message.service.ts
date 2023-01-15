import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "entities/Message";
import { AddMessageDto } from "src/dto/messages/add.message.dto";
import { SaveMessageDto } from "src/dto/messages/save.message.dto";
import { ApiResponse } from "src/misc/api.response";
import { fillObject } from "src/misc/fill.object";
import { IsNull, Not, Repository } from "typeorm";
import { ChangeUnreadedMessageDto } from "src/dto/messages/change.unreaded.message.dto";

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

        const length = messages.message as any;
        if(length && length.length > 50) length.shift()
        
        if(typeof data.message === 'string' || data.message instanceof String){
            messages.message = fillObject(length, {
                date: new Date().toISOString(),
                from: data.lady ? data.ladyId : data.gentlemanId,
                message: data.message
            }) as any;
        }else{
            const unreadedMessage = data.message as any;
            unreadedMessage.forEach((message: {}) => {
                messages.message = fillObject(length, message) as any;
            })
        }
        
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

    async getMessages(gentlemanId: number, ladyId: number):Promise<Message[] | ApiResponse> {
        
        const userMessages = this.messagesServices.find({
            where: {
                gentlemanId,
                ladyId
            }
        });
        if(!userMessages) return new ApiResponse('ok', 'User has no messages', 200);

        return userMessages;
    }

    async changeUnreadedMessages(data: ChangeUnreadedMessageDto):Promise<ApiResponse | Message> {
        const messages = await this.findMessage(data.gentlemanId, data.ladyId);
        if(messages instanceof ApiResponse) return messages;
        
        if(data.message) {
            const savedMessage = await this.saveMessage({
                gentlemanId: data.gentlemanId,
                ladyId: data.ladyId,
                lady: data.lady,
                message: messages.unreadMessage
            })
            if(savedMessage instanceof ApiResponse) return savedMessage;
            messages.unreadMessage = null;

            const saveInDB = await this.messagesServices.save(messages);
            if(!saveInDB) return new ApiResponse('error', 'Messages are not saved!', -13002);
            return saveInDB;
        }
        return new ApiResponse('error', 'The data does not match', -13003);
    }

    async getUnreadedMessages(id: number, lady: string):Promise<ApiResponse | Message[]> {
        const query: {} = lady === 'true' ? {ladyId: id, unreadMessage: !null} : {gentlemanId: id, unreadMessage: Not(IsNull())}
        const ureadedMessage = await this.messagesServices.find({where: query});
        if(!ureadedMessage) return new ApiResponse('ok', 'All message is readed', 200);
        return ureadedMessage;
    }
}