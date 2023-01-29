import { Controller, Post, UseGuards, Body, Param } from '@nestjs/common';
import { SendMailDto } from 'src/dto/mailer/send.mail.dto';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import {MailerService} from 'src/services/mailer/mailer.service';

@Controller('api')
export class MailerController{
    constructor(private readonly mailerService: MailerService) {}

    @Post('sendEmail')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async sendMail(@Body() data: SendMailDto) {
        return await this.mailerService.sendEmail(data.email, data.template, data.attachments as any, data.name);
    }

    @Post('sendEmail/multiplyUsers/:template')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async sendMultiplyEmail(@Body() data: string[], @Param('template') template: string) {
        await this.mailerService.sendMultipleMail(template, data)
    }

    @Post('sendEmail/allGentleman')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async sendMailToAllGentleman() {
        return await this.mailerService.sendMailToAllGentleman('defaultAllGentleman');
    }

    @Post('sendEmail/allLady')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async sendMailToAllLady() {
        return await this.mailerService.sendMailToAllLady('defaultAllLady');
    }
}