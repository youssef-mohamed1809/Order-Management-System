import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDto } from './DTOs/createOrder.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly OrdersService:OrdersService){}


    @Post()
    createOrder(@Body() message:createOrderDto){
        var response = this.OrdersService.createOrder(message.userId);
    }

}
