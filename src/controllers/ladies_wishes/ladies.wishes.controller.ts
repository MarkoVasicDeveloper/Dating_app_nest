import { Controller, Body, Post, UseGuards, Put, Param } from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { LadiesWishes } from 'entities/LadiesWishes';
import { EditLadiesWishisDto } from 'src/dto/ladies_wishes/edit.ladies.wisshes.dto';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { ApiResponse } from 'src/misc/api.response';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import { LadiesWishesService } from 'src/services/ladies_wishies/ladies.wishes.service';

@Controller('api')
export class LadiesWishesController{
    constructor(private readonly ladiesWishesService: LadiesWishesService) {}

    @Post('editWishes')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','lady')
    async editWishes(@Body() data: EditLadiesWishisDto):Promise<LadiesWishes | ApiResponse> {
        return await this.ladiesWishesService.editLadiesWishes(data);
    }

    @Put('wishes/:ladyId')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async getWishes(@Param('ladyId') ladyId: number):Promise<LadiesWishes | ApiResponse> {
        return await this.ladiesWishesService.getWishesByLadyId(ladyId);
    }

    @Patch('wishesQuestions')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async setWishesQuestion(@Body() data: []) {
        return await this.ladiesWishesService.setWishesQuestion(data);
    }
}