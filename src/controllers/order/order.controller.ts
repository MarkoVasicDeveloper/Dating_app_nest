import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { payment } from "config/payment";
import { Order } from "entities/Order";
import { Response } from "express";
import { AddOrderDto } from "src/dto/order/add.order.dto";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { OrderService } from "src/services/order/order.service";
import { DeleteResult } from "typeorm";
import * as paypal from '@paypal/checkout-server-sdk';
import { ProducesService } from "src/services/produces/produces.service";
import { GentlemanService } from "src/services/gentleman/gentleman.service";
import MailerService from "src/services/mailer/mailer.service";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { Administrator } from "entities/Administrator";

const paypalClient = new paypal.core.PayPalHttpClient(new paypal.core.SandboxEnvironment(payment.CLIENT_ID, payment.SECRET));

@Controller()
export class OrderController{
    constructor(private readonly orderService: OrderService,
                private readonly produceService: ProducesService,
                private readonly gemtlemanService: GentlemanService,
                private readonly mailerService: MailerService,
                private readonly adminService: AdministratorService) {}


    @Post('pay-order')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentleman','gentlemanPremium','gentlemanVip','lady')
    async payOrder(@Body() data: {username: string, email: string, orderId: number, lady: boolean}, @Res() response: Response):Promise<ApiResponse | any> {
        
        const order = await this.orderService.getOrder(data.username, data.email, data.orderId);
        if(order instanceof ApiResponse) return order;

        const produce = await this.produceService.getById(order.produceId);
        if(produce instanceof ApiResponse) return produce;
        
        const request = new paypal.orders.OrdersCreateRequest();
        const total = order.quantity * order.price;

        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'RSD',
                        value: total + '',
                        breakdown: {
                            item_total: {
                                currency_code: 'RSD',
                                value: total + ''
                            },
                            discount: {
                                currency_code: "RSD",
                                value: '0'
                            },
                            handling: {
                                currency_code: "RSD",
                                value: '0'
                            },
                            insurance: {
                                currency_code: "RSD",
                                value: '0'
                            },
                            shipping: {
                                currency_code: "RSD",
                                value: '0'
                            },
                            shipping_discount: {
                                currency_code: "RSD",
                                value: '0'
                            },
                            tax_total: {
                                currency_code: "RSD",
                                value: '0'
                            }
                        }
                    },
                    items: [{
                        name: produce.title,
                        unit_amount: {
                            currency_code: 'RSD',
                            value: produce.price + ''
                        },
                        quantity: order.quantity + '',
                        category: 'DIGITAL_GOODS'
                    }]
                }
            ]
        });

        try {
            const payOrder = await paypalClient.execute(request);
            if(produce.title === 'gentlemanPremium' || produce.title === 'gentlemanVip') {
                const user = await this.gemtlemanService.getById(order.customerId);
                if(user instanceof ApiResponse) return user;
                user.privileges = produce.title;
                await this.gemtlemanService.savedUser(user);
                await this.mailerService.sendEmail(user.email, 'Thanks!');
                await this.orderService.changeStatus('realized', order.orderId);
            }

            const allAdmin = await this.adminService.getAllAdministrator();
            allAdmin.forEach(async (admin: Administrator) => await this.mailerService.sendEmail(admin.email, 'New order'));

            response.json({ id: payOrder.result.id })
        } catch (error) {
            return response.status(500).json({ error: error.message })
        }
    }

    @Post('order')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator','gentleman','gentlemanPremium','gentlemanVip','lady')
    async addOrder(@Body() data: AddOrderDto, @Res() response: Response):Promise<ApiResponse | Order> {
        const order = await this.orderService.addOrder(data);
        if(order instanceof ApiResponse) return order;

        const produce = await this.produceService.getById(order.produceId);
        if(produce instanceof ApiResponse) return produce;

        response.render('html', {
            paypalClientId: payment.CLIENT_ID,
            orderId: order.orderId,
            username: order.customerUsername,
            email: order.customerEmail,
            quantity: order.quantity,
            produce: produce.title,
            price: produce.price
        });
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