import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "src/dto/login/login.dto";
import { GentlemanService } from "src/services/gentleman/gentleman.service";
import { LadyService } from "src/services/lady/lady.service";
import { Request } from "express";
import { Req } from "@nestjs/common";
import { ApiResponse } from "src/misc/api.response";
import { JwtDataDto } from "src/dto/jwt/jwt.dto";
import * as jwt from 'jsonwebtoken';
import { secret } from "src/config/jwtSecret";
import { LoginInfo } from "src/misc/loginInfo";
import * as crypto from 'crypto';
import { JwtRefreshDataDto } from "src/dto/jwt/jwt.refrest.dto";
import { JwtService } from "src/services/jwt/jwt.service";
import { RefreshToken } from "entities/RefreshToken";

@Controller('auth')
export class AuthController {
    constructor(private readonly gentlemanService: GentlemanService,
                private readonly ladyService: LadyService,
                private readonly refreshService: JwtService) {}

    @Post('login')
    async login (@Body() data: LoginDto, @Req() req: Request): Promise<ApiResponse | LoginInfo> {
        const service = data.lady ? this.ladyService : this.gentlemanService;

        const user = await service.getByUsername(data.username) as any;

        if(!user) return new ApiResponse('error', 'Wrong username or password', 3001);

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toString().toUpperCase();

        if(user.password !== passwordHashString) return new ApiResponse('error', 'Wrong username or password', 3001);
        
        const jwtData = new JwtDataDto();
        jwtData.id = data.lady ? user.ladyId : user.gentlemanId;
        jwtData.ipAddress = req.ip;
        jwtData.expire = this.getDatePlus(60 * 5);
        jwtData.username = user.username;
        
        const token = jwt.sign(jwtData.toPlane(), secret);
        
        const refToken = await this.refreshService.getTokenByUsername(user.username);

        if(refToken) {
            const currentTime = new Date().getTime();
            const date = new Date(refToken.expire);
            const milliseconds = date.getTime();
            if(currentTime > milliseconds) {
                await this.refreshService.deleteRefreshToken(refToken.refreshToken);
            }else {
                return new LoginInfo(
                    jwtData.id,
                    jwtData.username,
                    token,
                    refToken.refreshToken,
                    refToken.expire
                )
            }
        } 

        const jwtRefreshData = new JwtRefreshDataDto();
        jwtRefreshData.id = jwtData.id;
        jwtRefreshData.username = jwtData.username;
        jwtRefreshData.expire = this.getDatePlus(60 * 60 * 24 * 31);
        jwtRefreshData.ipAddress = jwtData.ipAddress;

        const refreshToken = jwt.sign(jwtRefreshData.toPlane(), secret);

        await this.refreshService.createRefreshToken(refreshToken,jwtRefreshData.username, this.getDatabaseTime(this.getIsoFormat(jwtRefreshData.expire)))
        
        return new LoginInfo(
            jwtData.id,
            jwtData.username,
            token,
            refreshToken,
            this.getIsoFormat(jwtRefreshData.expire)
        )
    }

    private getDatePlus(numberOfSeconds: number) {
        return new Date().getTime() / 1000 + numberOfSeconds;
      }
    
    private getIsoFormat(timestamp: number) {
    const date = new Date();
    date.setTime(timestamp * 1000);
    return date.toISOString();
    }

    private getDatabaseTime(isoFormatTime: string) {
    return isoFormatTime.substr(0, 19).replace("T", " ");
    }
}