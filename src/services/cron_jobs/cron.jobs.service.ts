import { Injectable } from "@nestjs/common";
import { GentlemanService } from "../gentleman/gentleman.service";
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronJobsService{
    constructor(private readonly gentlemanService: GentlemanService) {}

    @Cron('0 0 5 * * *')
    async nullNumberOfMessage(): Promise<void> {
        const allGentleman = await this.gentlemanService.getByPrivileges('gentleman');
        allGentleman.forEach(async gentleman => {
            gentleman.numberOfMessage = 0;
            await this.gentlemanService.savedUser(gentleman);
        });
    }
}