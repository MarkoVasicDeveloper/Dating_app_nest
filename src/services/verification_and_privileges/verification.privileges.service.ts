import { Gentleman } from "entities/Gentleman";
import { Lady } from "entities/Lady";
import { ApiResponse } from "src/misc/api.response";
import { AdministratorService } from "../administrator/administrator.service";
import { GentlemanService } from "../gentleman/gentleman.service";
import { LadyService } from "../lady/lady.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationAndPrivileguesService{
    constructor(private readonly gentlemanService: GentlemanService,
                private readonly ladyService: LadyService,
                private readonly adminService: AdministratorService) {}

    async verifiedEmail(email: string):Promise<void> {
        const gentleman = await this.gentlemanService.getByEmail(email);
        const lady = await this.ladyService.getByEmail(email);

        if(gentleman instanceof Gentleman) {
            gentleman.verified = '1';
            await this.gentlemanService.savedUser(gentleman);
        }

        if(lady instanceof Lady) {
            lady.verified = '1';
            await this.ladyService.savedUser(lady);
        }
    }

    async changePrivileges(id: number, privileges: 'gentleman' | 'gentlemanPremium' | 'gentlemanVip'):Promise<ApiResponse | Gentleman> {
        const user = await this.gentlemanService.getById(id);
        if(user instanceof ApiResponse) return user;

        user.privileges = privileges;
        return await this.gentlemanService.savedUser(user);
    }
}