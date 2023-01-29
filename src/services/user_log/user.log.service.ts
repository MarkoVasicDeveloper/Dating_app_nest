import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserLog } from "entities/UserLog";
import { AddUserLogDto } from "src/dto/user_log/user.log.dto";
import { ApiResponse } from "src/misc/api.response";
import { fillObject } from "src/misc/fill.object";
import { Repository } from "typeorm";
import {MailerService} from "../mailer/mailer.service";

@Injectable()
export class UserLogService{
    constructor(@InjectRepository(UserLog) private readonly userLogService: Repository<UserLog>,
                private readonly mailerService: MailerService){}

    async addUserLog(data: AddUserLogDto):Promise<UserLog | ApiResponse> {
        const userLog = new UserLog();
        userLog.email = data.email;
        userLog.ipAddresses = [{ip: data.ipAddress, time: new Date().toISOString()}];
        userLog.userAgent = [{agent: data.userAgent, time: new Date().toISOString()}];
        userLog.username = data.username;

        const savedUserLog = await this.userLogService.save(userLog);
        if(!savedUserLog) return new ApiResponse('error', 'The information is not saved!', -90001);
        return savedUserLog;
    }

    async editUserLog(userLog: UserLog, ipAddress?: string, userAgent?: string) {
        if(ipAddress) {
            const ip = userLog.ipAddresses as any;
            const ipExists = ip.map((object:{ip: string, time: string}) => {
                if(object.ip === ipAddress) return object;
            }).filter(ele => ele !== null);
            if(ipExists.length === 0) {
                userLog.ipAddresses = fillObject(userLog.ipAddresses, {ip: ipAddress, time: new Date().toISOString()})
                await this.userLogService.save(userLog);
                await this.mailerService.sendEmail(userLog.email, 'defaultUserLog', null, userLog.username, ipAddress, userAgent);
            }
        }

        if(userAgent) {
            const userAgentArray = userLog.userAgent as any;
            const agentExists = userAgentArray.map((object:{agent: string, time: string}) => {
                if(object.agent === userAgent) return object;
            }).filter(ele => ele !== null);
            if(agentExists.length === 0) {
                userLog.userAgent = fillObject(userLog.userAgent, {agent: userAgent, time: new Date().toISOString()});
                await this.userLogService.save(userLog);
            }
        }

        
    }

    async getUserLog(username: string, email: string):Promise<UserLog | ApiResponse> {
        const userLog = await this.userLogService.findOne({where:{email, username}});
        if(!userLog) return new ApiResponse('error', 'The user log is not found!', -90002);
        return userLog;
    }
}