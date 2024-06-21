import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './DTOs/addtocart.dto';
import { DeleteFromCartDto } from './DTOs/deleteFromCart.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateCartDTO } from './DTOs/updateCart.dto';

// All endpints start with cart
@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: "Add a product to cart"})
  @Post('add')
  addCart(@Body() message:AddToCartDTO){
    var response = this.cartService.add_to_cart(message.userid, message.productId, message.quantity);
    if(response){
      return "Done";
    }
    return "An error occured";
  }

  @ApiOperation({ summary: "Update product quantity in cart"})
  @Put('update')
  updateCart(@Body() message:UpdateCartDTO){
    var response = this.cartService.update_cart(message.userid, message.productId, message.quantity); 
    if(response){
      return "Done";
    }
    return "An error occured";
  }

  @ApiOperation({ summary: "Get the user's cart"})
  @Get(':userId')
  getCart(@Param('userId', new ParseIntPipe()) userId: number){
    return this.cartService.get_cart(userId);
  }

  @ApiOperation({ summary: "Delete item from the cart"})
  @Delete('remove')
  deleteFromCart(@Body() message:DeleteFromCartDto){
    var response = this.cartService.delete_from_cart(message.userId, message.productId);
    if(response){
      return "Done";
    }
    return "Error"
  }

}
