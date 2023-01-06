import { Body, Controller, Get, Post } from '@nestjs/common';
import { Gentleman } from 'entities/Gentleman';
import { AddGentlemanDto } from 'src/dto/gentleman/add.gentleman.dto';
import { ApiResponse } from 'src/misc/api.response';
import { GentlemanService } from '../../services/gentleman/gentleman.service';

@Controller()
export class GentlemanController {
  constructor(private readonly gentlemanService: GentlemanService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  @Post('add/gentleman')
  async addGentleman(@Body() data: AddGentlemanDto): Promise <Gentleman | ApiResponse> {
    return await this.gentlemanService.addGenleman(data);
  }
}
