import { Body, Controller, Get, Post, Param, Delete} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { Gentleman } from 'entities/Gentleman';
import { AddGentlemanDto } from 'src/dto/gentleman/add.gentleman.dto';
import { DeleteGentlemanDto } from 'src/dto/gentleman/delete.gentleman.dto';
import { EditGentlemanDto } from 'src/dto/gentleman/edit.gentleman.dto';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { ApiResponse } from 'src/misc/api.response';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import MailerService from 'src/services/mailer/mailer.service';
import { DeleteResult } from 'typeorm';
import { GentlemanService } from '../../services/gentleman/gentleman.service';

@Controller('api')
export class GentlemanController {
  constructor(private readonly gentlemanService: GentlemanService,
              private readonly mailerService: MailerService) {}

  @Post('add/gentleman')
  @UseGuards(RoleCheckerGard)
  @AllowToRole('gentleman', 'gentlemanPremium', 'gentlemanVip', 'administrator')
  async addGentleman(@Body() data: AddGentlemanDto): Promise <Gentleman | ApiResponse> {
    const result = await this.gentlemanService.addGenleman(data);
    if(result instanceof Gentleman) await this.mailerService.sendEmail(result.email, 'hello')
    return result;
  }

  @Post('edit/gentleman')
  @UseGuards(RoleCheckerGard)
  @AllowToRole('gentleman', 'gentlemanPremium', 'gentlemanVip', 'administrator')
  async editGentleman(@Body() data: EditGentlemanDto): Promise <Gentleman | ApiResponse> {
    const result = await this.gentlemanService.editGentleman(data);
    if(result instanceof Gentleman) await this.mailerService.sendEmail(result.email, 'hello')
    return result;
  }

  @Get('get/gentleman/:id')
  @UseGuards(RoleCheckerGard)
  @AllowToRole('administrator', 'lady')
  async getGentlemanById(@Param('id') id: number):Promise<ApiResponse | Gentleman> {
    return await this.gentlemanService.getById(id);
  }

  @Get('get/gentlemanByUsermane/:username')
  @UseGuards(RoleCheckerGard)
  @AllowToRole('administrator', 'lady')
  async getGentlemanByUsername(@Param('username') username: string):Promise<ApiResponse | Gentleman> {
    return await this.gentlemanService.getByUsername(username);
  }

  @Get('get/gentlemanByEmail/:email')
  @UseGuards(RoleCheckerGard)
  @AllowToRole('administrator', 'lady')
  async getGentlemanByEmail(@Param('email') email: string):Promise<ApiResponse | Gentleman> {
    return await this.gentlemanService.getByEmail(email);
  }

  @Delete('delete/gentleman')
  @UseGuards(RoleCheckerGard)
  @AllowToRole('administrator')
  async deleteGentleman(@Body() data: DeleteGentlemanDto):Promise<ApiResponse | Gentleman>{
    return await this.gentlemanService.deleteGentleman(data);
  }
}