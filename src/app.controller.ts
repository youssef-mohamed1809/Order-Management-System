import { Controller, Get, Post, Req, Res,Body, Param, ValidationPipe, UsePipes, Put, ParseIntPipe, Delete } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
