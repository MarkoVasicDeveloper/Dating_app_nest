import { Body, Controller, Post, UseGuards, Get, Param, Delete, Put } from "@nestjs/common";
import { Lady } from "entities/Lady";
import { BlockTheUserDto } from "src/dto/gentleman/block.the.user.dto";
import { AddLadyDto } from "src/dto/lady/add.lady.dto";
import { DeleteLadyDto } from "src/dto/lady/delete.lady.dto";
import { EditLadyDto } from "src/dto/lady/edit.lady.dto";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { GentlemanService } from "src/services/gentleman/gentleman.service";
import { LadyService } from "src/services/lady/lady.service";
import {MailerService} from "src/services/mailer/mailer.service";
import { DeleteResult } from "typeorm";

@Controller('api')
export class LadyContoller {
    constructor(private readonly ladyService: LadyService,
                private readonly mailerService: MailerService,
                private readonly gentlemanService: GentlemanService) {}

    @Post('add/lady')
    async addLady (@Body() data: AddLadyDto): Promise <Lady | ApiResponse> {
        const result = await this.ladyService.addLady(data);
        if(result instanceof Lady) await this.mailerService.sendVerificationLink(result.email, result.username, 'defaultVerificationMail');
        return result;
    }

    @Post('edit/lady')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('lady', 'administrator')
    async editLady(@Body() data: EditLadyDto):Promise<Lady | ApiResponse>{
        const result = await this.ladyService.editLady(data);
        if(result instanceof Lady && data.editEmail) await this.mailerService.sendVerificationLink(result.email, result.username, 'defaultEditVerificationMail');
        return result;
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
    @AllowToRole('gentleman', 'gentlemanPremium', 'gentlemanVip')
    async getAllLady(@Param('page') page: number, @Param('id') id: number):Promise<Lady[] | ApiResponse>{
        const gentleman = await this.gentlemanService.getById(id);
        if(gentleman instanceof ApiResponse) return gentleman;
        return await this.ladyService.getAll(page, gentleman);
    }

    @Get('get/allLady/administrator')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async getAllByAdmin():Promise<Lady[]>{
        return await this.ladyService.getAllByAdmin();
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

    @Get('search/lady/:query/:id')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentlemanPremium','gentlemanVip')
    async searchLady(@Param('query') query: string, @Param('id') id: number):Promise<Lady[] | ApiResponse>{
        const gentleman = await this.gentlemanService.getById(id);
        if(gentleman instanceof ApiResponse) return gentleman;
        const blockedArray = gentleman.blocked as any;
        const blockedBy = blockedArray ? blockedArray.map((object: {id: number, username: string}) => object.id): [0];
        return await this.ladyService.search(query, id, blockedBy);
    }
}