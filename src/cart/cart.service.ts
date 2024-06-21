import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  //Create a new Prisma Service Instance
  constructor(private prisma: PrismaService){}

  // Add a product to cart 
  async add_to_cart(userId: number, productId:number, quantity:number) {
    //Retrieve user data along with their cart
    const user = await this.prisma.user.findUnique({
      where: {userId: userId},
      include: {
        cart: true
      }
    });
    // Create a new Cart if a user never added a product to cart
    if(!user.cart){
      const user = await this.prisma.user.update({
        where: {
          userId: userId
        },
        data: {
          //Create a new empty Cart
          cart: {create: {}}
        },
        include: {
          cart: true
        }
      });

      // Set the total price of the cart to 0
      await this.prisma.cart.update({
        where: {
          cartId: user.cart.cartId
        },
        data: {
          total_price: 0
        }
      })
    }
    // Retrieve Cart data and the products in it
    const cart = await this.prisma.cart.findFirst({
      where: {userId: user.userId},
      include: {ProductCart: true}
    });
    // Retrieve Product data
    const product = await this.prisma.product.findFirst({
      where: {
        productId: productId
      }
    });
    // Check if the user ordered a quantity more than that available in 
    if(product.stock < quantity){
      return 0;
    }
    await this.prisma.productCart.create({
      data: {
        cartId: cart.cartId,
        quantity: quantity,
        productId: productId
      }});
    const new_price = cart.total_price + (product.price * quantity);
    // Update the total cart's price
    await this.prisma.cart.update({
      where: {
        cartId: cart.cartId
      },
      data: {
        total_price: new_price
      }
    })
      return 1;        
  }

  // Update product quantity in cart
  async update_cart(userId:number, productId:number, quantity:number){
    
    // Retrieve user data along with their cart
    const user = await this.prisma.user.findUnique({
      where: {userId: userId},
      include: {
        cart: true
      }
    });
  
    // Retrieve cart data of the user 
    const cart = await this.prisma.cart.findUnique({
      where: {userId: user.userId},
      include: {
        ProductCart: true
      }
    });
  
    // Check if the product is present in the user's cart
    var in_cart : Boolean = false;
    var index : number = -1;
    var old_quantity;

    cart.ProductCart.forEach((prod, i) => {
      if(prod.productId == productId){
        in_cart = true;
        index = i;
        old_quantity = prod.quantity
      }
    });
  
    if(!in_cart){
      return 0;
    }
    
    // Update Cart Quantity
    await this.prisma.productCart.update({
      where: {
          productId_cartId: {
            cartId: cart.cartId,
            productId: productId
          }
        },
      data:{
        quantity: quantity
      }

    });
    
    //Retreive the product data
    const product = await this.prisma.product.findUnique({
      where: {
        productId: productId
      }
    });

    // Update Product Stock
    await this.prisma.product.update({
      where:{
        productId: productId
      },
      data:{
        stock: product.stock + (quantity - cart.ProductCart[index].quantity) 
      }
    });

    
    // Calculate the new total price of the cart
    const price_diff = (quantity - old_quantity) * product.price;
    const new_price = cart.total_price + price_diff;


    //Update Cart's Total Price
    await this.prisma.cart.update({
      where: {
        userId: userId
      },
      data: {
        total_price:  new_price
      }
    })
    return 1;
  }

  // Get the user's cart
  async get_cart(userId:number){

    //Retrieve user data along with their cart
    const user = await this.prisma.user.findUnique({
      where: {userId: userId},
      include: {
        cart: true
      }
    });
    
    //Retreive the user's cart
    const cart = await this.prisma.cart.findUnique({
      where: {userId: user.userId},
      include: {
        ProductCart: true
      }
    });
    
    // Loop through the user's cart and generate a message for each one
    var message : String = "";
    for(const element of cart.ProductCart){
      const product = await this.prisma.product.findUnique({
        where: {
          productId: element.productId
        }
      });
      const price:number = product.price * element.quantity;
      message += ("Name: " + product.name + "\n");
      message += ("Description: " + product.description + "\n");
      message += ("Price: " + price + "\n");
    }
    return message;
  }
  
  // Delete item from the cart
  async delete_from_cart(userId:number, productId:number){
    
    // Retrieve user data along with their cart
    const user = await this.prisma.user.findUnique({
      where: {userId: userId},
      include: {
        cart: true
      }
    });
    
    // Retreive the user's cart data
    const cart = await this.prisma.cart.findUnique({
      where: {userId: user.userId},
      include: {
        ProductCart: true
      }
    })
  
    // Delete the desired product from the user's cart
    await this.prisma.productCart.delete({
      where: {
        productId_cartId: {
          cartId: cart.cartId,
          productId: productId
        }
        
      }
    })
  }
}
