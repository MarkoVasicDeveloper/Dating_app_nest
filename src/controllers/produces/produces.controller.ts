import { Controller, Post, UseGuards, Delete, Param, Body, Get } from '@nestjs/common';
import { Produces } from 'entities/Produces';
import { AddProducesDto } from 'src/dto/produces/add.produces.dto';
import { EditProducesDto } from 'src/dto/produces/edit.produce.dto';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { ApiResponse } from 'src/misc/api.response';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import { ProducesService } from 'src/services/produces/produces.service';
import { DeleteResult } from 'typeorm';

@Controller('api')
export class ProducesController{
    constructor(private readonly producesService: ProducesService) {}

    @Post('produce/add')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async addProduce(@Body() data: AddProducesDto):Promise<Produces | ApiResponse> {
        return await this.producesService.addProduce(data);
    }

    @Post('produce/edit')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async editProduce(@Body() data: EditProducesDto):Promise<Produces | ApiResponse> {
        return await this.producesService.editProduce(data);
    }

    @Delete('delete/produce/:produceId/:partnerId')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async deleteProduce(@Param('produceId') produceId: number, @Param('partnerId') partnerId: number):Promise<DeleteResult | ApiResponse> {
        return await this.producesService.deleteProduce(produceId, partnerId);
    }

    @Get('search/produce/:query')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentlemanPremium','gentlemanVip','gentleman','lady')
    async searchProduce(@Param('query') query: string):Promise<Produces[]>{
        return await this.producesService.search(query);
    }
}