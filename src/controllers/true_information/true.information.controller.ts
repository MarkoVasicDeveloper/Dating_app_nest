import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { TrueInformation } from "entities/TrueInformation";
import { AddTrueInformationDto } from "src/dto/true_information/add.true.information.dto";
import { EditTrueInformationDto } from "src/dto/true_information/edit.true.information.dto";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { TrueInformationService } from "src/services/true_information/true.information.service";

@Controller('api')
export class TrueInformationController{
    constructor(private readonly trueInformationService: TrueInformationService) {}

    @Post('add/trueInformation')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentleman','gentlemanPremium','gentlemanVip','lady')
    async addInformation(@Body() data: AddTrueInformationDto):Promise<TrueInformation | ApiResponse> {
        return await this.trueInformationService.addInformation(data);
    }

    @Post('edit/trueInformation')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentleman','gentlemanPremium','gentlemanVip','lady')
    async editInformation(@Body() data: EditTrueInformationDto):Promise<TrueInformation | ApiResponse> {
        return await this.trueInformationService.editInformation(data);
    }

    @Get('get/trueInformation/:id/:lady')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentleman','gentlemanPremium','gentlemanVip','lady')
    async getInformation(@Param('id') id: number, @Param('lady') lady: string) {
        return await this.trueInformationService.getTrueInformation(id, lady);
    }
}