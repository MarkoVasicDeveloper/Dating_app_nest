import { Controller, Post, Get, UseGuards, Body, Delete, Param, Put } from '@nestjs/common';
import { Subscription } from 'entities/Subscription';
import { AddSubscriptionDto } from 'src/dto/subscription/add.subscription.dto';
import { EditSubscriptionDto } from 'src/dto/subscription/edit.subscription.dto';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { ApiResponse } from 'src/misc/api.response';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import { SubscriptionService } from 'src/services/subscription/subscription.service';
import { DeleteResult } from 'typeorm';

@Controller('api')
export class SubscriptionController{
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post('add/subscription')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async addSubscription(@Body() data: AddSubscriptionDto):Promise<Subscription | ApiResponse>{
        return await this.subscriptionService.addSubscription(data);
    }

    @Post('edit/subscription')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async editSubscription(@Body() data: EditSubscriptionDto):Promise<Subscription | ApiResponse>{
        return await this.subscriptionService.editSubscription(data);
    }

    @Delete('delete/subscription/:id')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async deleteSubscription(@Param('id') id: number):Promise<DeleteResult | ApiResponse> {
        return await this.subscriptionService.deleteSubscription(id);
    }

    @Get('get/subscription/:id')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator', 'gentleman', 'gentlemanPremium', 'gentlemanVip', 'lady')
    async getSubscription(@Param('id') id: number):Promise<ApiResponse | Subscription>{
        return await this.subscriptionService.getSubscriptionById(id);
    }

    @Put('get/allSubscription')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator', 'gentleman', 'gentlemanPremium', 'gentlemanVip', 'lady')
    async getAllSubscription():Promise<Subscription[]> {
        return await this.subscriptionService.getAllSubscription();
    }
}