import { VerificationAndPrivileguesService } from "src/services/verification_and_privileges/verification.privileges.service";
import { Get, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { RoleCheckerGard } from "src/roleCheckerGard/role.checker.gard";
import { AllowToRole } from "src/misc/allow.to.role.descriptor";
import { ApiResponse } from "src/misc/api.response";
import { Gentleman } from "entities/Gentleman";

@Controller('api')
export class VerificationAndPrivilegesController{
    constructor(private readonly privilegesService: VerificationAndPrivileguesService) {}

    @Get('/verification/:email')
    async verification(@Param('email') email:string):Promise<void> {
        return await this.privilegesService.verifiedEmail(email);
    }

    @Put('changePrivileges/:privileges/:id')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async changePrivileges(@Param('privileges') privileges: 'gentleman' | 'gentlemanPremium' | 'gentlemanVip', @Param('id') id: number):Promise<ApiResponse | Gentleman> {
        return await this.privilegesService.changePrivileges(id, privileges);
    }
}