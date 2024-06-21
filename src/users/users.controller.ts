import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    
    constructor(private readonly UsersService:UsersService){}
    
    @ApiOperation({summary: "Get the user's order history"})
    @Get(':userId/orders')
    getOrderHistory(@Param('userId', new ParseIntPipe()) userId:number){
        var response = this.UsersService.getOrderHistory(userId);
        return response
    }
}
