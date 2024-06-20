import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService){}


    async createOrder(userid:number){
        const cart = await this.prisma.cart.findUnique({
            where: {
                userId: userid
            },
            include: {
                ProductCart: true
            }
        })
        const cart_items = cart.ProductCart;



        const productOrder = cart_items.map(cart_item => ({
            productId: cart_item.productId,
            quantity: cart_item.quantity
        }))
        
        await this.prisma.order.create({
            data: {
                userId: userid,
                status: 'ORDERED',
                productOrder: {
                    create: productOrder
                },
            }
        })

        //Delete Everything from Cart
        await this.prisma.productCart.deleteMany({
            where: {
                cartId: cart.cartId
            }
        })

        return 1;        
    }

    async getOrderById(orderid : number){
        const order = await this.prisma.order.findUnique({
            where: {
                orderId: orderid
            }
        })


        return order;
    }

    async updateOrderStatus(orderid: number, status: string){

        
        
        
        var status_enum:Status|null;

        switch(status){
            case "ORDERED" || "Ordered" || "ordered":
                status_enum = 'ORDERED'       
                break;
            case "SHIPPED" || "Shipped" || "shipped":
                status_enum = 'SHIPPED'
                break;
            case "RECEIVED" || "Received" || "received":
                status_enum = 'RECEIVED'
                break;
            default:
                return 0
        }


        await this.prisma.order.update({
            where: {
                orderId: orderid
            },

            data: {
                status: status_enum
            }
        })
    }


}
