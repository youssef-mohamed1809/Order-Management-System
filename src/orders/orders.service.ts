import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class OrdersService {


    constructor(private prisma: PrismaService){}

    // Create a new order from the products in the user's cart
    async createOrder(userid: number){

        // Get the user's cart data
        const cart = await this.prisma.cart.findUnique({
            where: {
                userId: userid
            },
            include: {
                ProductCart: true
            }
        });
        
        // Map the Product ID and Quantity attributes to a new variable including them only
        const cart_items = cart.ProductCart;
        const productOrder = cart_items.map(cart_item => ({
            productId: cart_item.productId,
            quantity: cart_item.quantity
        }))
        
        // Create the order
        await this.prisma.order.create({
            data: {
                userId: userid,
                status: 'ORDERED',
                productOrder: {
                    create: productOrder
                },
            }
        })

        /*
        Delete the Cart

        the each item in the cart are deleted individually first (due to foreign key constraints)
        then the cart itself is deleted
        */
        await this.prisma.productCart.deleteMany({
            where: {
                cartId: cart.cartId
            }
        })

        await this.prisma.cart.delete({
            where: {
                cartId: cart.cartId
            }
        })

        return 1;        
    }

    // Get the Order Data using it's ID
    async getOrderById(orderid: number){
        const order = await this.prisma.order.findUnique({
            where: {
                orderId: orderid
            }
        })
        return order;
    }

    // Update the Order's Status
    async updateOrderStatus(orderid: number, status: string){
        
        // Create a Status Enum with the status the user entered
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

        // Update the Order Status
        await this.prisma.order.update({
            where: {
                orderId: orderid
            },

            data: {
                status: status_enum
            }
        })
    }

    // Apply a Discount Coupon to the last order the user ordered
    async applyCoupon(userId: number, discount_percentage: number) {
        
        // Get the last order the user ordered
        const order = await this.prisma.order.findFirst({
            where: {
                userId: userId
            },

            orderBy: {
                date: 'desc'
            }
        });

        // Calculate the new Order's price
        const old_price = order.total_price;
        const value_removed = old_price * (discount_percentage / 100);
        const new_price = old_price - value_removed;

        // Update the Order's price with the new price
        await this.prisma.order.update({
            where: {
                orderId: order.orderId
            },
            data: {
                total_price: new_price
            }
        })

    }
}
