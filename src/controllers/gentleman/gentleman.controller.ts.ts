import { Body, Controller, Get, Post } from '@nestjs/common';
import { Gentleman } from 'entities/Gentleman';
import { AddGentlemanDto } from 'src/dto/gentleman/add.gentleman.dto';
import { ApiResponse } from 'src/misc/api.response';
import MailerService from 'src/services/mailer/mailer.service';
import { GentlemanService } from '../../services/gentleman/gentleman.service';

@Controller('api')
export class GentlemanController {
  constructor(private readonly gentlemanService: GentlemanService,
              private readonly mailerService: MailerService) {}

  @Post('add/gentleman')
  async addGentleman(@Body() data: AddGentlemanDto): Promise <Gentleman | ApiResponse> {
    const result = await this.gentlemanService.addGenleman(data);
    if(result instanceof Gentleman) await this.mailerService.sendEmail(result.email, 'hello')
    return result;
  }
}
