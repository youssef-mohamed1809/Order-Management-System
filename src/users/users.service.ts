import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}
    async getOrderHistory(userid){
        const user = await this.prisma.user.findUnique({
            where: {
                userId: userid
            },
            include: {
                order: true
            }
        })


        console.log(user.order);
        var message:string = "";
        for(const order of user.order){

            message += "Order\n";
            message += ("Date: " + order.date);
            //Get Products
            const current_order = await this.prisma.order.findUnique({
                where: {
                    orderId: order.orderId
                },
                include: {
                    productOrder: true
                }
            })

            console.log(current_order);

            for(const product of current_order.productOrder){
                const productName = await this.getProductName(product.productId);
                message += (productName + ", quantity: " + product.quantity);
            }
            message += "\n\n";
        }
        return message;
    }
    private async getProductName(productId:number){
        const product = await this.prisma.product.findUnique({
            where: {
                productId: productId
            }
        })

        return product.name;
    }

}
