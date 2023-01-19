import { MessagesService } from "src/services/message/message.service";
import { Body, Controller, Post, Get, Param, UseGuards } from "@nestjs/common";
import { Message } from "entities/Message";
import { ApiResponse } from "src/misc/api.response";
import { ChangeUnreadedMessageDto } from "src/dto/messages/change.unreaded.message.dto";
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";

@Controller('api')
export class MessagesController{
    constructor(private readonly meessageService: MessagesService) {}

    @Get(':id/:lady')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','lady','gentleman','gentlemanPremium','gentlemanVip')
    async getMessage(@Param('id') gentlemanId: number, @Param('lady') ladyId: number):Promise<Message[] | ApiResponse> {
        return await this.meessageService.getMessages(gentlemanId, ladyId);
    }

    @Post('changeMessage')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','lady','gentleman','gentlemanPremium','gentlemanVip')
    async changeUnrededMessage(@Body() data: ChangeUnreadedMessageDto):Promise <ApiResponse | Message> {
        return await this.meessageService.changeUnreadedMessages(data);
    }

    @Get('unreadedMessage/:id/:lady')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','lady','gentleman','gentlemanPremium','gentlemanVip')
    async getUnreadedMessage(@Param('id') id: number, @Param('lady') lady: string):Promise<ApiResponse | Message[]> {
        return await this.meessageService.getUnreadedMessages(id, lady);
    }
}