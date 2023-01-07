import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "entities/RefreshToken";
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
}