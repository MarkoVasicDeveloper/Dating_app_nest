import { Gentleman } from "entities/Gentleman";
import { Lady } from "entities/Lady";
import { JwtDataDto } from "src/dto/jwt/jwt.dto";
import { ApiResponse } from "src/misc/api.response";
import * as jwt from 'jsonwebtoken'
import { secret } from "config/jwtSecret";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class SocketService{
    constructor(@InjectRepository(Lady) private readonly ladyService: Repository<Lady>,
                @InjectRepository(Gentleman) private readonly gentlemanService: Repository<Gentleman>) {}

    async checkUser(token: any, lady: any):Promise<Lady | Gentleman | ApiResponse> {
        const gender = lady === 'true' ? true : false;
        let tokenInfo: JwtDataDto;

        try {
            tokenInfo = jwt.verify(token, secret) as any;
        } catch (error) {
            return new ApiResponse('error', 'Bad token', -10001);
        }

        // const currentTimestamp = new Date().getTime() / 1000;
        // if (currentTimestamp >= tokenInfo.expire) {
        //     return new ApiResponse('error', 'The token has expired', -3002);
        // }

        if(gender) {
            const user = await this.ladyService.findOne({
                where: {
                    username: tokenInfo.username
                }
            })
    
            if(!user) return new ApiResponse('error', 'User is not found!', -1001);
            return user;
        }
        
        const user = await this.gentlemanService.findOne({
            where: {
                username: tokenInfo.username
            }
        })

        if(!user) return new ApiResponse('error', 'User is not found!', -1001);
        return user;
    }
}