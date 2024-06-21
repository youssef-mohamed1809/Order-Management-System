import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService){}
    
    // Get the user's order history
    async getOrderHistory(userid){

        // Retrieve user data including their orders
        const user = await this.prisma.user.findUnique({
            where: {
                userId: userid
            },
            include: {
                order: true
            }
        });
        
        // Create a message of all the past orders of the user
        var message:string = "";
        for(const order of user.order){
            message += "Order\n";
            message += ("Date: " + order.date);
            
            // Get order data
            const current_order = await this.prisma.order.findUnique({
                where: {
                    orderId: order.orderId
                },
                include: {
                    productOrder: true
                }
            });
            console.log(current_order);

            // Add the product name and the quantity bought
            for(const product of current_order.productOrder){
                const productName = await this.getProductName(product.productId);
                message += (productName + ", quantity: " + product.quantity);
            }
            message += "\n\n";
        }
        return message;
    }


    // Get the product's name given it's ID
    private async getProductName(productId:number){
        const product = await this.prisma.product.findUnique({
            where: {
                productId: productId
            }
        })

        return product.name;
    }

}
