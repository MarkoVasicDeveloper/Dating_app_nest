import { Injectable } from "@nestjs/common";
import { GentlemanService } from "../gentleman/gentleman.service";
import { Cron } from '@nestjs/schedule';
import { LadyService } from "../lady/lady.service";
import { Lady } from "entities/Lady";
import { Gentleman } from "entities/Gentleman";
import { MailerService } from "../mailer/mailer.service";
import { ApiResponse } from "src/misc/api.response";

@Injectable()
export class CronJobsService{
    constructor(private readonly gentlemanService: GentlemanService,
                private readonly ladyService: LadyService,
                private readonly mailerService: MailerService) {}

    @Cron('0 0 5 * * *')
    async nullNumberOfMessage(): Promise<void> {
        const allGentleman = await this.gentlemanService.getByPrivileges('gentleman');
        allGentleman.forEach(async gentleman => {
            gentleman.numberOfMessage = 0;
            await this.gentlemanService.savedUser(gentleman);
        });
    }

    @Cron('0 30 * * * *')
    async unreadedMessageNotification():Promise<void> {
        for(let key in unreadedMessageCronJob) {
            const recipientService = unreadedMessageCronJob[key].lady ? this.ladyService : this.gentlemanService;

            const senderService = unreadedMessageCronJob[key].lady ? this.gentlemanService : this.ladyService;

            const recipient = await recipientService.getById(unreadedMessageCronJob[key].recipient);
            const sender = await senderService.getById(unreadedMessageCronJob[key].sender);
            const senderUsername = sender instanceof ApiResponse ? null : sender.username;

            if(recipient instanceof Lady || recipient instanceof Gentleman && recipient.notifications === '1') await this.mailerService.sendEmail(recipient.email, 'defaultNotification', null, recipient.username, null, null, senderUsername, unreadedMessageCronJob[key].unreadedMessage.length);
        }
        unreadedMessageCronJob = {};
    }
}

export var unreadedMessageCronJob = {};