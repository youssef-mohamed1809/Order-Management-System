import { ApiProperty } from "@nestjs/swagger";

export class DeleteFromCartDto{
    
    @ApiProperty({
        example: 1
    })
    userId: number;

    @ApiProperty({
        example: 2
    })
    productId: number;
}