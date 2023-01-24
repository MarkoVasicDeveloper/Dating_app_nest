import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { mailerConfig } from 'config/mailer';
import { GentlemanService } from '../gentleman/gentleman.service';
import { LadyService } from '../lady/lady.service';
import { AdministratorService } from '../administrator/administrator.service';

@Injectable()
export default class MailerService {
  constructor(private readonly gentlemanService: GentlemanService,
              private readonly ladyService: LadyService,
              private readonly adminService: AdministratorService) {}
  async sendEmail(email: string, body: string) {
    const Oauth2 = new google.auth.OAuth2(
        mailerConfig.client_id,
        mailerConfig.client_secret,
        mailerConfig.redirect_url
    );
    Oauth2.setCredentials({ refresh_token: mailerConfig.refreshToken });

    try {
      const accessToken = await Oauth2.getAccessToken();

      const transtort = nodemailer.createTransport({
        service: 'Gmail',
        port: 587,
        secure: false,
        auth: {
          type: 'OAuth2',
          user: 'dzentlmenidamaapp@gmail.com',
          clientId: mailerConfig.client_id,
          clientSecret: mailerConfig.client_secret,
          refreshToken: mailerConfig.refreshToken,
          accessToken: accessToken as any,
        },
        tls: { rejectUnauthorized: false },
      });

      const mailerOptions = {
        from: mailerConfig.sender,
        to: email,
        subject: 'Dzentlmen i Dama <dzentlmenidamaapp@google.com>',
        encoding: 'UTF-8',
        html: body,
      };

      return await transtort.sendMail(mailerOptions);
    } catch (error) {
      return error;
    }
  }

  async emailMarketing(data: {email:string, body: string}[]) {
    data.forEach(async (object:any) => {
      await this.sendEmail(object.email, object.body);
    })
  }

  async sendMailToAllGentleman(data: {body: string}) {
    const allGentleman = await this.gentlemanService.getAllForMail();
    allGentleman.forEach(async gentleman => {
      await this.sendEmail(gentleman.email, data.body)
    })
  }

  async sendMailToAllLady(data: {body: string}) {
    const allLady = await this.ladyService.getAllForMail();
    allLady.forEach(async lady => {
      await this.sendEmail(lady.email, data.body)
    })
  }

  async sendMailToAllAdmin(data: {body: string}) {
    const allAdmin = await this.adminService.getAllAdministrator();
    allAdmin.forEach(async admin => {
      await this.sendEmail(admin.email, data.body);
    })
  }
}