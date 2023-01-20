import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { mailerConfig } from 'config/mailer';

@Injectable()
export default class MailerService {
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
}