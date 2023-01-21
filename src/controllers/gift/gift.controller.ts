import { Body, Controller, Get, Param, Post, Put, UseGuards, Delete } from "@nestjs/common";
import { GiftCategory } from "entities/GiftCategory";
import { AddGiftDto } from "src/dto/gift/add.gift.dto";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { GiftService } from "src/services/gift/gift.service";
import { DeleteResult } from "typeorm";

@Controller('api')
export class GiftController{
    constructor(private readonly giftService: GiftService) {}

    @Post('add/giftCategory')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async addGiftCategory(@Body() data: AddGiftDto):Promise<ApiResponse | GiftCategory> {
        return await this.giftService.addGiftCategory(data);
    }

    @Put('edit/giftCategory/:id/:name')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async editGiftCategory(@Param('id') id: number, @Param('name') name: string):Promise<ApiResponse | GiftCategory> {
        return await this.giftService.editCategory(id, name);
    }

    @Get('get/giftCategory/:id/:name')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator', 'gentleman', 'gentlemanPremium', 'gentlemanVip', 'lady')
    async getGiftCategoryByIdOrName(@Param('id') id: string | null, @Param('name') name: string | null):Promise<ApiResponse | GiftCategory> {
        return await this.giftService.getByIdOrName(id, name);
    }

    @Put('get/allGiftCategory')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator', 'gentleman', 'gentlemanPremium', 'gentlemanVip', 'lady')
    async getAllGiftCategory():Promise<GiftCategory[]> {
        return await this.giftService.getAllCategory();
    }

    @Delete('delete/category/:id')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async deleteCategory(@Param('id') id: number):Promise<DeleteResult | ApiResponse> {
        return await this.giftService.deleteCategory(id);
    }
}