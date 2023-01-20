import { Controller, Post, UseGuards } from '@nestjs/common';
import { SendMailDto } from 'src/dto/mailer/send.mail.dto';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import MailerService from 'src/services/mailer/mailer.service';

@Controller('api')
export class MailerController{
    constructor(private readonly mailerService: MailerService) {}

    @Post('sendEmail')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async sendMail(data: SendMailDto) {
        return await this.mailerService.sendEmail(data.email, data.body);
    }

    @Post('sendEmail/campaign')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async sendMultiplyMail(data: SendMailDto[]) {
        return await this.mailerService.emailMarketing(data);
    }
}