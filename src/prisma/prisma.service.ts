import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Status } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{

    // Run this function when the PrismaService object is created
    async onModuleInit(){
        await this.$connect;
    }


    // Run this function when the PrismaService object is destroyed
    async onModuleDestroy() {
        await this.$disconnect;
    }

}
