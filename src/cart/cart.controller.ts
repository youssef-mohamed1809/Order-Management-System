import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './DTOs/addtocart.dto';

import { DeleteFromCartDto } from './DTOs/deleteFromCart.dto';


@Controller('cart')
export class CartController {

    constructor(private readonly cartService: CartService) {}



  @Post('add')
  addCart(@Body() message:AddToCartDTO){
    var response = this.cartService.add_to_cart(message.userid, message.productId, message.quantity);
    if(response){
      return "Done";
    }
    return "An error occured";
  }

  @Put('update')
  updateCart(@Body() message:AddToCartDTO){
    var response = this.cartService.update_cart(message.userid, message.productId, message.quantity); 
    if(response){
      return "Done";
    }
    return "An error occured";
  }

  @Get(':userId')
  getCart(@Param('userId', new ParseIntPipe()) userId: number){
    return this.cartService.get_cart(userId);
  }

  @Delete('remove')
  deleteFromCart(@Body() message:DeleteFromCartDto){
    var response = this.cartService.delete_from_cart(message.userId, message.productId);
    if(response){
      return "Done";
    }
    return "Error"
  }

}
