import { GentlemanAboutService } from "src/services/gentleman_about/gentleman.about.service";
import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { AddGentlemanAboutDto } from "src/dto/gentleman_about/add.gentleman.about.dto";
import { GentlemanAbout } from "entities/GentlemanAbout";
import { ApiResponse } from "src/misc/api.response";
import { EditGentlemanAboutDto } from "src/dto/gentleman_about/edit.gentleman.about.dto";

@Controller('api')
export class GentlemanAboutController{
    constructor(private readonly gentlemanAboutService: GentlemanAboutService) {}

    @Post('add/gentlemanAbout')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator', 'gentleman', 'gentlemanPremium', 'gentlemanVip')
    async addGentlemanAbove(@Body() data: AddGentlemanAboutDto):Promise<GentlemanAbout | ApiResponse>{
        return await this.gentlemanAboutService.addGentlemanAbout(data);
    }

    @Post('edit/gentlemanAbout')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator', 'gentleman', 'gentlemanPremium', 'gentlemanVip')
    async editGentlemanAbove(@Body() data: EditGentlemanAboutDto):Promise<GentlemanAbout | ApiResponse>{
        return await this.gentlemanAboutService.editGentlemanAbout(data);
    }
}