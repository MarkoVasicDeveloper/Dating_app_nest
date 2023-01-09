import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "entities/RefreshToken";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";

@Injectable()
export class JwtService {
    constructor(@InjectRepository(RefreshToken) private readonly jwtService: Repository<RefreshToken>) {}

    async createRefreshToken(token: string, username: string, expire: string):Promise<RefreshToken> {
        const refToken = new RefreshToken();
        refToken.refreshToken = token;
        refToken.username = username;
        refToken.expire = expire;

        return await this.jwtService.save(refToken);
    }

    async getTokenByUsername(username: string): Promise <RefreshToken> {
        const token = await this.jwtService.findOne({
            where: {
                username
            }
        })
    
        return token;
    }

    async deleteRefreshToken(refreshToken: string) {
        const token = await this.jwtService.findOne({
            where: {
                refreshToken
            }
        })

        if(token) return await this.jwtService.delete(token);
    }
}