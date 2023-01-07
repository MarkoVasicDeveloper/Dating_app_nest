import { InjectRepository } from "@nestjs/typeorm";
import { Lady } from "entities/Lady";
import { AddLadyDto } from "src/dto/lady/add.lady.dto";
import { ApiResponse } from "src/misc/api.response";
import { Repository } from "typeorm";
import * as crypto from 'crypto';

export class LadyService {
    constructor(@InjectRepository(Lady) private readonly ladyService: Repository<Lady>) {}

    async addLady(data: AddLadyDto) : Promise <Lady | ApiResponse> {
        try {
            const passwordHash = crypto.createHash('sha512');
            passwordHash.update(data.password);
            const passwordHashString = passwordHash.digest('hex').toString().toUpperCase();

            const lady = new Lady();
            lady.email = data.email;
            lady.password = passwordHashString;
            lady.username = data.username;
            lady.years = data.years;

            const savedLady = await this.ladyService.save(lady);

            return savedLady;

        } catch (error) {
            return new ApiResponse('error', error, -2001);
        }
    }

    async getByUsername(username: string): Promise<Lady | ApiResponse> {
        const lady = await this.ladyService.findOne({
            where: {
                username
            }
        })

        if(!lady) return new ApiResponse('error', 'Wrong username', -2002);
        return lady;
    }
}