import { Controller, Get, UseGuards } from '@nestjs/common';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import { GentlemanService } from 'src/services/gentleman/gentleman.service';
import { GentlemanAboutService } from 'src/services/gentleman_about/gentleman.about.service';
import { LadyService } from 'src/services/lady/lady.service';
import { LadyAboutService } from 'src/services/lady_about/lady.about.service';
import { activeUsers } from 'src/socket/gateway';

@Controller('api')
export class ReportController{
    constructor(private readonly gentlemanService: GentlemanService,
                private readonly ladyService: LadyService,
                private readonly gentlemanAboutService: GentlemanAboutService,
                private readonly ladyAboutService: LadyAboutService) {}

    @Get('basicReport')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async getBasicReport() {
        const lady = await this.ladyService.ladyReport();
        const ladyAbout = await this.ladyAboutService.ladyAboutBasicReport();
        const gentleman = await this.gentlemanService.gentlemanReport();
        const gentlemanAbout = await this.gentlemanAboutService.gentlemanAboutBasicReport();

        return {lady: [lady, ladyAbout], gentleman: [gentleman, gentlemanAbout], onlineUser:activeUsers};
    }
}