import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";

export class UpdateOrderDto{
    
    @ApiProperty({
        example: "SHIPPED",
        enum: Status
    })
    new_status: string
}