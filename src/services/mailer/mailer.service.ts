import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { emailTemplateAttachments, mailerConfig } from 'config/mailer';
import { GentlemanService } from '../gentleman/gentleman.service';
import { LadyService } from '../lady/lady.service';
import { AdministratorService } from '../administrator/administrator.service';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class MailerService {
  constructor(private readonly gentlemanService: GentlemanService,
              private readonly ladyService: LadyService,
              private readonly adminService: AdministratorService) {}
  async sendEmail(email: string, template: string, attachments: {filename: string, path: string, cid: string | null}[] | null = null, name: string | null = null, ip: string | null = null, userAgent: string | null = null, senderName: string | null = null, numberOfMessages: number | null = null) {
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


      transtort.use('compile', hbs({
        viewEngine: {
          extname: '.handlebars',
          partialsDir: './views',
          defaultLayout: false
        },
        viewPath: './views/',
        extName: '.handlebars'
      }))

      const mailerOptions = {
        from: mailerConfig.sender,
        to: email,
        subject: 'Dzentlmen i Dama <dzentlmenidamaapp@google.com>',
        encoding: 'UTF-8',
        template: template,
        attachments,
        context: {
          name,
          ip,
          userAgent,
          senderName,
          numberOfMessages
        }
      };

      return await transtort.sendMail(mailerOptions);
    } catch (error) {
      console.log(error)
      return error;
    }
  }

  async sendVerificationLink(email: string, name: string, template: string ) {
    await this.sendEmail(email, template, emailTemplateAttachments[template], name);
  }

  async sendMultipleMail(template: string, users: string[]) {
    users.forEach(async (user: string) => {
      await this.sendEmail(user, template);
    })
  }

  async sendMailToAllGentleman(template: string) {
    const allGentleman = await this.gentlemanService.getAllForMail();
    allGentleman.forEach(async gentleman => {
      await this.sendEmail(gentleman.email, template, emailTemplateAttachments[template], gentleman.username)
    })
  }

  async sendMailToAllLady(template: string) {
    const allLady = await this.ladyService.getAllForMail();
    allLady.forEach(async lady => {
      await this.sendEmail(lady.email, template, emailTemplateAttachments[template], lady.username)
    })
  }

  async sendMailToAllAdmin(template: string) {
    const allAdmin = await this.adminService.getAllAdministrator();
    allAdmin.forEach(async admin => {
      await this.sendEmail(admin.email, template, emailTemplateAttachments[template]);
    })
  }
}