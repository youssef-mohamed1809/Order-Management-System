import { ApiProperty } from "@nestjs/swagger";


export class AddToCartDTO{
    
    @ApiProperty({
        example: 1
    })
    userid: number;

    @ApiProperty({
        example: 2
    })
    productId: number;

    @ApiProperty({
        example: 12
    })
    quantity: number;
}