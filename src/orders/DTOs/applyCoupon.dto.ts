import { ApiProperty } from "@nestjs/swagger";

export class ApplyCouponDto{
    
    @ApiProperty({
        example: 20
    })
    discount_percentage: number

    @ApiProperty({
        example: 1
    })
    userId: number
}