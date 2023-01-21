import { Controller, Get, Param, Put } from "@nestjs/common";
import { PasswordResetService } from "src/services/password_reset/password.reset.service";

@Controller()
export class PasswordResetController{
    constructor(private readonly passwordResetService: PasswordResetService) {}

    @Get('resetLink/:email/:lady')
    async sendResetLink(@Param('email') email: string, @Param('lady') lady: string) {
        const body = ''
        return await this.passwordResetService.sendResetLink(email,lady,body);
    }

    @Put('resetPassword/:token/:lady/:password/:email')
    async resetPassword(@Param('token') token: string, @Param('lady') lady: string, @Param('password') password: string, @Param('email') email: string) {
        return await this.passwordResetService.resetPassword(email, password, lady, token);
    }
}