import { Body, Controller, Post, UseGuards, Get, Param, Delete, Put } from "@nestjs/common";
import { Administrator } from "entities/Administrator";
import { AddAdministratorDto } from "src/dto/administrator/add.administrator.dto";
import { DeleteAdminDto } from "src/dto/administrator/delete.administrator.dto";
import { EditAdministratorDto } from "src/dto/administrator/edit.administrator.dto";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { MailerService } from "src/services/mailer/mailer.service";
import { DeleteResult } from "typeorm";

@Controller('api')
export class AdministratorController{
    constructor(private readonly adminService: AdministratorService,
                private readonly mailerService: MailerService){}

    @Post('add/admin')
    @UseGuards(RoleCheckerGard)
    @AllowToRole("administrator")
    async createAdmin(@Body() data: AddAdministratorDto):Promise <Administrator | ApiResponse> {
        const admin = await this.adminService.createAdmin(data);
        if(admin instanceof Administrator) await this.mailerService.sendVerificationLink(admin.email, admin.username, 'defaultVerificationMail')
        return admin;
    }

    @Post('editAdmin')
    @UseGuards(RoleCheckerGard)
    @AllowToRole("administrator")
    async editAdmin(@Body() data: EditAdministratorDto):Promise<Administrator | ApiResponse> {
        const admin = await this.adminService.editAdministrator(data);
        if(admin instanceof Administrator && data.editEmail) await this.mailerService.sendVerificationLink(admin.email, admin.username, 'defaultEditVerificationMail')
        return admin;
    }

    @Put('getAdminByUsername/:username')
    @UseGuards(RoleCheckerGard)
    @AllowToRole("administrator")
    async getAdminByUsername(@Param('username') username: string):Promise<Administrator | ApiResponse>{
        return await this.adminService.getByUsername(username);
    }

    @Put('getAdmin/:id')
    @UseGuards(RoleCheckerGard)
    @AllowToRole("administrator")
    async getAdminById(@Param('id') id: number):Promise<Administrator | ApiResponse>{
        return await this.adminService.getById(id);
    }

    @Put('getAdminByEmail/:email')
    @UseGuards(RoleCheckerGard)
    @AllowToRole("administrator")
    async getAdminByEmail(@Param('email') email: string):Promise<Administrator | ApiResponse>{
        return await this.adminService.getByEmail(email);
    }

    @Delete('admin/delete')
    @UseGuards(RoleCheckerGard)
    @AllowToRole("administrator")
    async deleteAdmin(@Body() data: DeleteAdminDto):Promise<ApiResponse | DeleteResult> {
        return await this.adminService.deleteAdmin(data);
    }
}