import { Body, Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";
import { AddRequestToAdminDto } from "src/dto/request_to_admin/requset.to.admin.dto";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { RequestToAdminService } from "src/services/request_to_admin/request.to.admin";
import { DeleteResult } from "typeorm";

@Controller('api')
export class RequestToAdministratorController{
    constructor(private readonly requestService: RequestToAdminService) {}

    @Post('requestToAdmin')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('gentleman','gentlemanPremium','gentlemanVip','lady')
    async addRequest(@Body() data: AddRequestToAdminDto):Promise<ApiResponse> {
        return await this.requestService.addRequest(data);
    }

    @Delete('requestToAdmin/delete/:username/:email')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async deleteRequest(@Param('username') username: string, @Param('email') email: string):Promise<DeleteResult | ApiResponse> {
        return await this.requestService.deleteRequest(username, email);
    }
}