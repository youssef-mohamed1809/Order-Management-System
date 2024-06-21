import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDto } from './DTOs/createOrder.dto';
import { UpdateOrderDto } from './DTOs/updateOrder.dto';
import { ApplyCouponDto } from './DTOs/applyCoupon.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
    constructor(private readonly OrdersService:OrdersService){}

    @ApiOperation({summary: "Create a new order from the products in the user's cart"})
    @Post()
    createOrder(@Body() message:createOrderDto){
        var response = this.OrdersService.createOrder(message.userId);
        if(response){
            return "Done";
        }

        return "An Error Ocurred";
    }

    @ApiOperation({summary: "Get the Order Data using it's ID"})
    @Get(':orderId')
    getOrderById(@Param('orderId', new ParseIntPipe()) orderid: number){
        var orderDetails = this.OrdersService.getOrderById(orderid);
        return orderDetails;
    }

    @ApiOperation({summary: "Update the Order's Status"})
    @Put(':orderId/status')
    updateOrderStatus(@Param('orderId', new ParseIntPipe()) orderid: number, @Body() message: UpdateOrderDto){
        var response = this.OrdersService.updateOrderStatus(orderid, message.new_status);
    }

    @ApiOperation({summary: "Apply a Discount Coupon to the last order the user ordered"})
    @Post('apply-coupon')
    applyCoupon(@Body() message:ApplyCouponDto){
        var response = this.OrdersService.applyCoupon(message.userId ,message.discount_percentage);
        if(response){
            return "Done"
        }
        return "An Error Occured"
    }




}
