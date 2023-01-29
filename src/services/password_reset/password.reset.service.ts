import { Injectable } from "@nestjs/common";
import { Gentleman } from "entities/Gentleman";
import { Lady } from "entities/Lady";
import { ApiResponse } from "src/misc/api.response";
import { passwordHash } from "src/misc/password.hash";
import { GentlemanService } from "../gentleman/gentleman.service";
import { JwtService } from "../jwt/jwt.service";
import { LadyService } from "../lady/lady.service";
import {MailerService} from "../mailer/mailer.service";

@Injectable()
export class PasswordResetService{
    constructor(private readonly gentlemanService: GentlemanService,
                private readonly ladyService: LadyService,
                private readonly mailerService: MailerService,
                private readonly jwtService: JwtService) {}

    async sendResetLink(email: string, lady: string, body: string):Promise<ApiResponse> {
        const service = lady === 'true' ? this.ladyService : this.gentlemanService;

        const user = await service.getByEmail(email);
        if(user instanceof ApiResponse) return user;

        await this.mailerService.sendEmail(email,body);
        return new ApiResponse('ok', 'The link was sent to the email.', 200);
    }

    async resetPassword(email: string, password: string, lady: string, token: string):Promise<ApiResponse | Lady | Gentleman> {
        const service = lady === 'true' ? this.ladyService : this.gentlemanService;

        const user = await service.getByEmail(email) as any;
        if(user instanceof ApiResponse) return user;

        const tokenExists = await this.jwtService.getTokenByToken(token);
        if(!tokenExists) return new ApiResponse('error', 'User is not found!', -2001);

        if(password.length < 6) return new ApiResponse('error', 'Password must be 6 or more characters!', -22001);

        user.password = passwordHash(password);
        return await service.savedUser(user);
    }
}