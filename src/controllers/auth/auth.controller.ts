import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { LoginDto } from "src/dto/login/login.dto";
import { GentlemanService } from "src/services/gentleman/gentleman.service";
import { LadyService } from "src/services/lady/lady.service";
import { Request } from "express";
import { Req } from "@nestjs/common";
import { ApiResponse } from "src/misc/api.response";
import { JwtDataDto } from "src/dto/jwt/jwt.dto";
import * as jwt from 'jsonwebtoken';
import { secret } from "config/jwtSecret";
import * as crypto from 'crypto';
import { JwtRefreshDataDto } from "src/dto/jwt/jwt.refrest.dto";
import { JwtService } from "src/services/jwt/jwt.service";
import { Lady } from "entities/Lady";
import { Gentleman } from "entities/Gentleman";
import { LoginInfo } from "src/misc/loginInfo";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { UserLogService } from "src/services/user_log/user.log.service";
import { UserLog } from "entities/UserLog";
import { fillObject } from "src/misc/fill.object";
import { AddUserLogDto } from "src/dto/user_log/user.log.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly gentlemanService: GentlemanService,
                private readonly ladyService: LadyService,
                private readonly refreshService: JwtService,
                private readonly adminService: AdministratorService,
                private readonly userLogService: UserLogService) {}

    @Post('login')
    async login (@Body() data: LoginDto, @Req() req: Request): Promise<ApiResponse | LoginInfo> {
        let service: any;
        if(data.admin && data.admin === true) {
            service = this.adminService
        }else{
            service = data.lady ? this.ladyService : this.gentlemanService;
        }

        const user = await service.getByUsername(data.username);

        if(!user) return new ApiResponse('error', 'Wrong username or password', 3001);

        if(user.verified && user.verified === '0') return new ApiResponse('error', 'Email must be verified!', -20001);

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toString().toUpperCase();

        if(user.password !== passwordHashString) return new ApiResponse('error', 'Wrong username or password', 3001);

        user.lastLogIn = new Date().toISOString().replace('T', " ").slice(0,-5);
        await service.savedUser(user);

        const ip = req.socket?.remoteAddress || null;
        const userAgent = req.headers['user-agent']
        
        const userLog = await this.userLogService.getUserLog(user.username, user.email);
        if(userLog instanceof ApiResponse) {
            const newUserLog = new AddUserLogDto();
            newUserLog.email = user.email;
            newUserLog.username = user.username;
            newUserLog.ipAddress = ip;
            newUserLog.userAgent = userAgent;

            await this.userLogService.addUserLog(newUserLog);
        }else{
            await this.userLogService.editUserLog(userLog, ip, userAgent);
        }
        
        const jwtData = new JwtDataDto();
        jwtData.role = user instanceof Lady ? 'lady' : user instanceof Gentleman ? user.privileges : 'administrator';
        jwtData.id = user instanceof Lady ? user.ladyId : user instanceof Gentleman ? user.gentlemanId : user.administratorId;
        jwtData.ipAddress = ip;
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
                    jwtData.role
                )
            }
        } 

        const jwtRefreshData = new JwtRefreshDataDto();
        jwtRefreshData.role = jwtData.role;
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
            jwtData.role
        )
    }

    @Get('refresh/:token')
    async refresh(@Param('token') token: string) {
        let tokenObject: JwtDataDto;
        try {
            tokenObject = jwt.verify(token, secret) as any;
        } catch (error) {
            return new ApiResponse('error', 'Bad token found!', -401);
        };

        const refreshToken = await this.refreshService.getTokenByUsername(tokenObject.username);
        if(!refreshToken) return new ApiResponse('error', 'You must to log in again!', -8900);

        let refreshTokenObject: JwtRefreshDataDto;
        
        try {
            refreshTokenObject = jwt.verify(refreshToken.refreshToken, secret) as any;
        } catch (error) {
            return new ApiResponse('error', 'Someting is wrong!', -401);
        }

        const currentTime = new Date().getTime();
        const date = new Date(refreshToken.expire);
        const milliseconds = date.getTime();
        
        if(currentTime > milliseconds) return new ApiResponse('error', 'The refresh token has expired! You must log in again', -401);

        if(refreshTokenObject.username !== tokenObject.username && refreshTokenObject.role !== tokenObject.role) return new ApiResponse('error', 'You must to log in again!', -401);

        tokenObject.expire = this.getDatePlus(60 * 5);

        const newToken = jwt.sign(tokenObject, secret);

        return new LoginInfo(
            tokenObject.id,
            tokenObject.username,
            newToken,
            tokenObject.role
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