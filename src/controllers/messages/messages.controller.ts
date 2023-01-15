import { MessagesService } from "src/services/message/message.service";
import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { Message } from "entities/Message";
import { ApiResponse } from "src/misc/api.response";
import { ChangeUnreadedMessageDto } from "src/dto/messages/change.unreaded.message.dto";

@Controller('api')
export class MessagesController{
    constructor(private readonly meessageService: MessagesService) {}

    @Get(':id/:lady')
    async getMessage(@Param('id') gentlemanId: number, @Param('lady') ladyId: number):Promise<Message[] | ApiResponse> {
        return await this.meessageService.getMessages(gentlemanId, ladyId);
    }

    @Post('changeMessage')
    async changeUnrededMessage(@Body() data: ChangeUnreadedMessageDto):Promise <ApiResponse | Message> {
        return await this.meessageService.changeUnreadedMessages(data);
    }

    @Get('unreadedMessage/:id/:lady')
    async getUnreadedMessage(@Param('id') id: number, @Param('lady') lady: string):Promise<ApiResponse | Message[]> {
        return await this.meessageService.getUnreadedMessages(id, lady);
    }
}