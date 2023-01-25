import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'entities/Subscription';
import { AddSubscriptionDto } from 'src/dto/subscription/add.subscription.dto';
import { EditSubscriptionDto } from 'src/dto/subscription/edit.subscription.dto';
import { ApiResponse } from 'src/misc/api.response';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class SubscriptionService{
    constructor(@InjectRepository(Subscription) private readonly subscriptionService: Repository<Subscription>) {}

    async addSubscription(data: AddSubscriptionDto):Promise<Subscription | ApiResponse> {
        const subscription = new Subscription();
        subscription.description = data.description;
        if(data.discont) subscription.discont = data.discont;
        subscription.price = data.price;
        subscription.title = data.title;

        const savedSubscription = await this.subscriptionService.save(subscription);
        if(!savedSubscription) return new ApiResponse('error', 'The subscription is not saved', -110000);
        return savedSubscription;
    }

    async editSubscription(data: EditSubscriptionDto):Promise<Subscription | ApiResponse> {
        const subscription = await this.subscriptionService.findOne({where: {subscriptionId: data.subscriptionId}});
        if(!subscription) return new ApiResponse('error', 'The subscription is not found!', -110001);
        
        if(data.description) subscription.description = data.description;
        if(data.discont) subscription.discont = data.discont;
        if(data.price) subscription.price = data.price;
        if(data.title) subscription.title = data.title;

        const savedSubscription = await this.subscriptionService.save(subscription);
        if(!savedSubscription) return new ApiResponse('error', 'The subscription is not saved', -110000);
        return savedSubscription;
    }

    async deleteSubscription(subscriptionId: number):Promise<DeleteResult | ApiResponse> {
        const subscription = await this.subscriptionService.findOne({where: {subscriptionId}});
        if(!subscription) return new ApiResponse('error', 'The subscription is not found!', -110001);
        return await this.subscriptionService.delete(subscription);
    }

    async getSubscriptionById(id: number):Promise<Subscription | ApiResponse> {
        const subscription = await this.subscriptionService.findOne({where: {subscriptionId: id}});
        if(!subscription) return new ApiResponse('error', 'The subscription is not found!', -110001);
        return subscription;
    }

    async getAllSubscription():Promise<Subscription[]> {
        return await this.subscriptionService.find();
    }
}