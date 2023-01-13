import { Body, Controller, Post } from "@nestjs/common";
import { AcceptConversationDto } from "src/dto/conversation/accept.conversation.dto";
import { SendConversationRequestDto } from "src/dto/conversation/send.conversation.request.dto";
import { ApiResponse } from "src/misc/api.response";
import { ConversationService } from "src/services/conversations/conversations.service";

@Controller('api')
export class ConversationController{
    constructor(private readonly conversationService: ConversationService) {}

    @Post('conversationRequest')
    async conversationRequest(@Body() data: SendConversationRequestDto):Promise<ApiResponse> {
        return await this.conversationService.sendConversationRequest(data);
    }

    @Post('acceptConversation')
    async acceptConversation(@Body() data: AcceptConversationDto):Promise <ApiResponse>{
        return await this.conversationService.acceptConversation(data);
    }
}