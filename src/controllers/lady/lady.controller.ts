import { Body, Controller, Get, Post } from "@nestjs/common";
import { Lady } from "entities/Lady";
import { AddLadyDto } from "src/dto/lady/add.lady.dto";
import { ApiResponse } from "src/misc/api.response";
import { LadyService } from "src/services/lady/lady.service";

@Controller()
export class LadyContoller {
    constructor(private readonly ladyService: LadyService) {}

    @Post('add/lady')
    async addLady (@Body() data: AddLadyDto): Promise <Lady | ApiResponse> {
        return await this.ladyService.addLady(data);
    }
}