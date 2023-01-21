import { Controller, Post, UseGuards, Body, Delete, Param } from '@nestjs/common';
import { Partners } from 'entities/Partners';
import { AddPartnersDto } from 'src/dto/partners/add.partners.dto';
import { EditPartnersDto } from 'src/dto/partners/edit.partners.dto';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { ApiResponse } from 'src/misc/api.response';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import { PartnersService } from 'src/services/partners/partners.service';
import { DeleteResult } from 'typeorm';

@Controller('api')
export class PartnersController{
    constructor(private readonly partnersService: PartnersService) {}

    @Post('partners/add')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async addPartners(@Body() data: AddPartnersDto):Promise<ApiResponse | Partners> {
        return await this.partnersService.addPartners(data);
    }

    @Post('partners/edit')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async editPartners(@Body() data: EditPartnersDto):Promise<ApiResponse | Partners> {
        return await this.partnersService.editPartner(data);
    }

    @Delete('delete/partners/:id')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async deletePartners(@Param('id') id: number):Promise<ApiResponse | DeleteResult> {
        return await this.partnersService.deletePartner(id);
    }
}