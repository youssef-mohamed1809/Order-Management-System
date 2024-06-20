import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    
    constructor(private readonly UsersService:UsersService){}
    
    @Get(':userId/orders')
    getOrderHistory(@Param('userId', new ParseIntPipe()) userId:number){
        var response = this.UsersService.getOrderHistory(userId);
        return response
    }
}
