import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "entities/Order";
import { AddOrderDto } from "src/dto/order/add.order.dto";
import { ApiResponse } from "src/misc/api.response";
import { DeleteResult, Repository } from "typeorm";
import { GentlemanService } from "../gentleman/gentleman.service";
import { LadyService } from "../lady/lady.service";
import { ProducesService } from "../produces/produces.service";

@Injectable()
export class OrderService{
    constructor(@InjectRepository(Order) private readonly orderService: Repository<Order>,
                private readonly gentlemanService: GentlemanService,
                private readonly ladyService: LadyService,
                private readonly produceService: ProducesService) {}

    async addOrder(data: AddOrderDto):Promise<Order | ApiResponse> {
        const customerService = data.lady ? this.ladyService : this.gentlemanService;
        const recipientService = data.lady ? this.gentlemanService : this.ladyService;

        const customer = await customerService.getByEmail(data.customerEmail);
        if(customer instanceof ApiResponse) return customer;

        const recipient = await recipientService.getByIdAndUsename(data.recipientId, data.recipientUsername);
        if(recipient instanceof ApiResponse) return recipient;

        const produce = await this.produceService.getById(data.produceId);
        if(produce instanceof ApiResponse) return produce;

        const newOrder = new Order();
        newOrder.customerEmail = customer.email;
        newOrder.customerId = data.customerId
        newOrder.customerUsername = customer.username;
        newOrder.quantity = data.quantity;
        newOrder.produceId = produce.produceId;
        newOrder.price = data.quantity * produce.price;
        newOrder.recipientId = data.recipientId;

        const savedOrder = await this.orderService.save(newOrder);
        if(!savedOrder) return new ApiResponse('error', 'The order is not saved!', -60002);
        return savedOrder;
    }

    async deleteOrder(orderId: number, customerId: number):Promise<DeleteResult | ApiResponse> {
        const order = await this.orderService.findOne({where:{orderId}});
        if(!order) return new ApiResponse('error', 'The order is not found!', -60001);
        if(order.customerId !== Number(customerId)) return new ApiResponse('error', 'The data is not correctly ok!', -60002);
        return await this.orderService.delete(order);
    }

    async changeStatus(status: 'on_hold' | 'approved' | 'realized', orderId: number):Promise<ApiResponse | Order>{
        const order = await this.orderService.findOne({where:{orderId}});
        if(!order) return new ApiResponse('error', 'The order is not found!', -60001);

        order.status = status;

        const savedOrder = await this.orderService.save(order);
        if(!savedOrder) return new ApiResponse('error', 'The order is not saved!', -60002);
        return savedOrder;
    }
}