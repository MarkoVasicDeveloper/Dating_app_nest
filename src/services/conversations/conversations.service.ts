import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Gentleman } from "entities/Gentleman";
import { Lady } from "entities/Lady";
import { SendConversationRequestDto } from "src/dto/conversation/send.conversation.request.dto";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()
export class ConversationService{
    constructor(@InjectRepository(Lady) private readonly ladyService: Repository<Lady>,
                @InjectRepository(Gentleman) private readonly gentlemanService: Repository<Gentleman>) {}

    async sendConversationRequest(data: SendConversationRequestDto): Promise<ApiResponse> {
        if(data.lady) {
            const user = await this.ladyService.findOne({
                where: {
                    ladyId: data.senderId,
                    username: data.senderUsername
                }
            })
            if(!user) return new ApiResponse('error', 'User is not found', -1001);

            const destinationUser = await this.gentlemanService.findOne({
                where: {
                    gentlemanId: data.destinationId
                }
            })
            if(!destinationUser) return new ApiResponse('error', 'Destination user is not found', -1001);

            if(destinationUser.conversationRequest !== null) {
                destinationUser.conversationRequest = [...destinationUser.conversationRequest as any, {"id" : data.senderId, "username" : data.senderUsername}]
            }else{
                destinationUser.conversationRequest = [{
                    "id" : data.senderId,
                    "username" : data.senderUsername
                }]
            }

            const savedData = await this.gentlemanService.save(destinationUser);
            if(!savedData) return new ApiResponse('error', 'User is not saved', -5001)

            return new ApiResponse('ok', "A conversation request has been sent", 200);
        }

        const user = await this.gentlemanService.findOne({
            where: {
                gentlemanId: data.senderId,
                username: data.senderUsername
            }
        })
        if(!user) return new ApiResponse('error', 'User is not found', -1001);
        
        const destinationUser = await this.ladyService.findOne({
            where: {
                ladyId: data.destinationId
            }
        })
        if(!destinationUser) return new ApiResponse('error', 'Destination user is not found', -1001);

        if(destinationUser.conversationRequest !== null) {
            destinationUser.conversationRequest = [...destinationUser.conversationRequest as any, {"id" : data.senderId, "username" : data.senderUsername}]
        }else{
            destinationUser.conversationRequest = [{
                "id" : data.senderId,
                "username" : data.senderUsername
            }]
        }
        
        const savedData = await this.ladyService.save(destinationUser);
        if(!savedData) return new ApiResponse('error', 'User is not saved', -5001)

        return new ApiResponse('ok', "A conversation request has been sent", 200);
    }
}