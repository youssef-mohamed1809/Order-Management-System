import { ApiProperty } from "@nestjs/swagger";

export class createOrderDto{
    @ApiProperty({
        example: 1
    })
    userId: number;
}