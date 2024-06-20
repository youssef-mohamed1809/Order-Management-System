import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


@Injectable()
export class AppService {
 async add_to_cart(userId: number, productId:number, quantity:number) {

  //Get User

  const user = await prisma.user.findFirst({
    where: {userId: userId},
    include: {
      cart: true
    }
  });

  const product = await prisma.product.findFirst({
    where: {
      productId: productId
    }
  });

  // Check if quantity < stock
  if(product.stock < quantity){
    return 0;
  }

  //Check if product is already in cart
  const cart = await prisma.cart.findFirst({
    where: {userId: user.userId},
    include: {
      ProductCart: true
    }
  })

  var in_cart : Boolean = false;
  var index : number = -1;

  cart.ProductCart.forEach((prod, i) => {
    if(prod.productId == productId){
      in_cart = true;
      index = i;
    }
  })


  if(!in_cart){
    await prisma.productCart.create({
      data: {
        cartId: cart.cartId,
        quantity: quantity,
        productId: productId
      }
    })
    return 1;
  }

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

}






