import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDto } from './DTOs/createOrder.dto';
import { UpdateOrderDto } from './DTOs/updateOrder.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly OrdersService:OrdersService){}


    @Post()
    createOrder(@Body() message:createOrderDto){
        var response = this.OrdersService.createOrder(message.userId);
        if(response){
            return "Done";
        }

        return "An Error Ocurred";
    }


    @Get(':orderId')
    getOrderById(@Param('orderId', new ParseIntPipe()) orderid: number){
        var orderDetails = this.OrdersService.getOrderById(orderid);
        return orderDetails;
    }

    @Put(':orderId/status')
    updateOrderStatus(@Param('orderId', new ParseIntPipe()) orderid: number, @Body() message: UpdateOrderDto){
        var response = this.OrdersService.updateOrderStatus(orderid, message.new_status);
    }




}
