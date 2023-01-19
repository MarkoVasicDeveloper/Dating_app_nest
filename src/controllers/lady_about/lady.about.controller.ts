import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { LadyAbout } from 'entities/LadyAbout';
import { AddLadyAboutDto } from 'src/dto/lady_about/add.lady.about.dto';
import { EditLadyAboutDto } from 'src/dto/lady_about/edit.lady.about.dto';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { ApiResponse } from 'src/misc/api.response';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import { LadyAboutService } from 'src/services/lady_about/lady.about.service';

@Controller('api')
export class LadyAboutController{
    constructor(private readonly ladyAboutService: LadyAboutService) {}

    @Post('add/ladyAbout')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator', 'lady')
    async addLadyAbove(@Body() data: AddLadyAboutDto):Promise<LadyAbout | ApiResponse>{
        return await this.ladyAboutService.addLadyAbout(data);
    }

    @Post('edit/ladyAbout')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator', 'lady')
    async editGentlemanAbove(@Body() data: EditLadyAboutDto):Promise<LadyAbout | ApiResponse>{
        return await this.ladyAboutService.editLadyAbout(data);
    }
}