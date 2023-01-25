import { Body, Controller, Post, UseGuards, Get, Param, Delete, Put } from "@nestjs/common";
import { Lady } from "entities/Lady";
import { BlockTheUserDto } from "src/dto/gentleman/block.the.user.dto";
import { AddLadyDto } from "src/dto/lady/add.lady.dto";
import { DeleteLadyDto } from "src/dto/lady/delete.lady.dto";
import { EditLadyDto } from "src/dto/lady/edit.lady.dto";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { LadyService } from "src/services/lady/lady.service";
import MailerService from "src/services/mailer/mailer.service";
import { DeleteResult } from "typeorm";

@Controller('api')
export class LadyContoller {
    constructor(private readonly ladyService: LadyService,
                private readonly mailerService: MailerService) {}

    @Post('add/lady')
    async addLady (@Body() data: AddLadyDto): Promise <Lady | ApiResponse> {
        const result = await this.ladyService.addLady(data);
        if(result instanceof Lady) await this.mailerService.sendEmail(result.email, 'hello');
        return result;
    }

    @Post('edit/lady')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('lady', 'administrator')
    async editLady(@Body() data: EditLadyDto):Promise<Lady | ApiResponse>{
        return await this.ladyService.editLady(data);
    }

    @Get('get/lady/:id')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('gentleman', 'gentlemanPremium', 'gentlemanVip', 'administrator')
    async getLadyById(@Param('id') id: number):Promise<Lady | ApiResponse>{
        return await this.ladyService.getById(id);
    }

    @Get('get/ladyByUsername/:username')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('gentleman', 'gentlemanPremium', 'gentlemanVip', 'administrator')
    async getLadyByUsername(@Param('username') username: string):Promise<Lady | ApiResponse>{
        return await this.ladyService.getByUsername(username);
    }

    @Get('get/ladyByEmail/:email')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('gentleman', 'gentlemanPremium', 'gentlemanVip', 'administrator')
    async getLadyByEmail(@Param('email') email: string):Promise<Lady | ApiResponse>{
        return await this.ladyService.getByEmail(email);
    }

    @Get('get/allLady/:page/:id')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('gentleman', 'gentlemanPremium', 'gentlemanVip', 'administrator')
    async getAllLady(@Param('page') page: number, @Param('id') id: number):Promise<Lady[]>{
        return await this.ladyService.getAll(page, id);
    }

    @Delete('delete/lady')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async deleteLady(@Body() data: DeleteLadyDto):Promise<ApiResponse | Lady> {
        return await this.ladyService.deleteLady(data);
    }

    @Put('block/lady')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator', 'gentleman', 'gentlemanPremium', 'gentlemanVip')
    async blockTheUser(@Body() data: BlockTheUserDto):Promise<ApiResponse> {
    return await this.ladyService.blockTheLady(data);
    }

    @Get('search/lady/:query')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentlemanPremium','gentlemanVip')
    async searchLady(@Param('query') query: string):Promise<Lady[]>{
        return await this.ladyService.search(query);
    }
}