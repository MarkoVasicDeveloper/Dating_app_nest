import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Order } from "entities/Order";
import { AddOrderDto } from "src/dto/order/add.order.dto";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { OrderService } from "src/services/order/order.service";
import { DeleteResult } from "typeorm";

@Controller('api')
export class OrderController{
    constructor(private readonly orderService: OrderService) {}

    @Post('order')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentleman','gentlemanPremium','gentlemanVip','lady')
    async addOrder(@Body() data: AddOrderDto):Promise<ApiResponse | Order> {
        const order = await this.orderService.addOrder(data);
        // if(order instanceof Order) send an email with instructions
        return order;
    }

    @Get('orderStatus/:orderId/:status')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async changeStatus(@Param('orderId') orderId: number, @Param('status') status: "on_hold" | "approved" | "realized"):Promise<ApiResponse | Order> {
        return await this.orderService.changeStatus(status, orderId);
        // Change status after payment
    }

    @Delete('delete/order/:orderId/:customerId')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentleman','gentlemanPremium','gentlemanVip','lady')
    async deleteOrder(@Param('orderId') orderId: number, @Param('customerId') customerId: number):Promise<ApiResponse | DeleteResult> {
        return await this.orderService.deleteOrder(orderId, customerId);
    }
}