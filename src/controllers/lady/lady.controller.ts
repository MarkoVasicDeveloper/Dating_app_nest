import { Body, Controller, Post } from "@nestjs/common";
import { Lady } from "entities/Lady";
import { AddLadyDto } from "src/dto/lady/add.lady.dto";
import { ApiResponse } from "src/misc/api.response";
import { LadyService } from "src/services/lady/lady.service";
import MailerService from "src/services/mailer/mailer.service";

@Controller('api')
export class LadyContoller {
    constructor(private readonly ladyService: LadyService,
                private readonly mailerService: MailerService) {}

    @Post('add/lady')
    async addLady (@Body() data: AddLadyDto): Promise <Lady | ApiResponse> {
        const result = await this.ladyService.addLady(data);
        if(result instanceof Lady) await this.mailerService.sendEmail(result.email, 'hello');
        return result;
    }
}