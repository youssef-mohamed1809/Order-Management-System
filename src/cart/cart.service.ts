import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service';
const prisma = new PrismaClient()

@Injectable()
export class CartService {


  constructor(private prisma: PrismaService){}

    async add_to_cart(userId: number, productId:number, quantity:number) {

        const user = await prisma.user.findFirst({
          where: {userId: userId},
          include: {
            cart: true
          }
        });
      
        const cart = await prisma.cart.findFirst({
          where: {userId: user.userId},
          include: {
            ProductCart: true
          }
        })
      
        const product = await prisma.product.findFirst({
          where: {
            productId: productId
          }
        });
      
        // Check if quantity < stock
        if(product.stock < quantity){
          return 0;
        }
      
        await prisma.productCart.create({
          data: {
            cartId: cart.cartId,
            quantity: quantity,
            productId: productId
          }
        })
        return 1;        
      
       }
      
      
       async update_cart(userId:number, productId:number, quantity:number){
        const user = await prisma.user.findUnique({
          where: {userId: userId},
          include: {
            cart: true
          }
        });
      
        const cart = await prisma.cart.findUnique({
          where: {userId: user.userId},
          include: {
            ProductCart: true
          }
        })
      
        const product = await prisma.product.findUnique({
          where: {
            productId: productId
          }
        });
      
      
        var in_cart : Boolean = false;
        var index : number = -1;
      
        cart.ProductCart.forEach((prod, i) => {
          if(prod.productId == productId){
            in_cart = true;
            index = i;
          }
        })
      
        if(!in_cart){
          return 0;
        }
        
        // Update Cart Quantity
        await prisma.productCart.update({
      
          where: 
            {
              productId_cartId: {
                cartId: cart.cartId,
                productId: productId
              }
            },
      
      
          data:{
            quantity: quantity
          }
        })
      
      
        // Update Product Stock
        await prisma.product.update({
          where:{
            productId: productId
          },
          data:{
            stock: product.stock + (quantity - cart.ProductCart[index].quantity) 
          }
        })
        return 1;
       }
      
       async get_cart(userId:number){
        const user = await prisma.user.findUnique({
          where: {userId: userId},
          include: {
            cart: true
          }
        });
      
        const cart = await prisma.cart.findUnique({
          where: {userId: user.userId},
          include: {
            ProductCart: true
          }
        })
       
        var message:String = "";
      
        for(const element of cart.ProductCart){
          const product = await prisma.product.findUnique({
            where: {
              productId: element.productId
            }
          })
          
          const price:number = product.price * element.quantity;
          console.log(product);
          
          message += ("Name: " + product.name + "\n");
          message += ("Description: " + product.description + "\n");
          message += ("Price: " + price + "\n");
        
        }
        
      
      
        return message;
      
      }
      
      async delete_from_cart(userId:number, productId:number){
        const user = await prisma.user.findUnique({
          where: {userId: userId},
          include: {
            cart: true
          }
        });
      
        const cart = await prisma.cart.findUnique({
          where: {userId: user.userId},
          include: {
            ProductCart: true
          }
        })
      
        await prisma.productCart.delete({
          where: {
            productId_cartId: {
              cartId: cart.cartId,
              productId: productId
            }
            
          }
        })
      }
}
