import { Controller, Get, Post, Req, Res,Body, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';

import { PrismaClient } from '@prisma/client'
import { AddToCartDTO } from './DTOs/addtocart.dto';
const prisma = new PrismaClient()

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}



  @Post('cart/add')
  addCart(@Body() message:AddToCartDTO){
    var response = this.appService.add_to_cart(message.userid, message.productId, message.quantity);
    if(response){
      return "Done";
    }
    return "An error occured";
  }


}
