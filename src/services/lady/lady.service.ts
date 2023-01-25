import { InjectRepository } from "@nestjs/typeorm";
import { Lady } from "entities/Lady";
import { AddLadyDto } from "src/dto/lady/add.lady.dto";
import { ApiResponse } from "src/misc/api.response";
import { DeleteResult, Repository } from "typeorm";
import * as crypto from 'crypto';
import * as fs from 'fs';
import { EditLadyDto } from "src/dto/lady/edit.lady.dto";
import { passwordHash } from "src/misc/password.hash";
import { DeleteLadyDto } from "src/dto/lady/delete.lady.dto";
import { JwtService } from "../jwt/jwt.service";
import { BlockTheUserDto } from "src/dto/gentleman/block.the.user.dto";
import { fillObject } from "src/misc/fill.object";
import { ReportDto } from "src/dto/report/report.dto";
import { LadiesWishesService } from "../ladies_wishies/ladies.wishes.service";
import { GentlemanService } from "../gentleman/gentleman.service";
import { Gentleman } from "entities/Gentleman";

export class LadyService {
    constructor(@InjectRepository(Lady) private readonly ladyService: Repository<Lady>,
                private readonly jwtService: JwtService,
                private readonly ladiesWishesService: LadiesWishesService,
                private readonly gentlemanService: GentlemanService) {}

    async addLady(data: AddLadyDto) : Promise <Lady | ApiResponse> {
        try {
            const lady = new Lady();
            lady.email = data.email;
            lady.password = passwordHash(data.password);
            lady.username = data.username;
            lady.city = data.city;
            lady.dataOfBirth = new Date(data.dateOfBirth).toString().slice(0,15);
            lady.state = data.state;
            lady.notification = data.notifications;
            lady.rules = data.rules;

            const savedLady = await this.ladyService.save(lady);

            fs.mkdirSync(`../Storage/Photo/Lady/${data.username}`, { recursive: true });

            await this.ladiesWishesService.addLadiesWishes(savedLady.ladyId);
            
            return savedLady;

        } catch (error) {
            return new ApiResponse('error', 'User already exists!', -2001);
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

    async getById(id: number):Promise<Lady | ApiResponse> {
        const lady = await this.ladyService.findOne({
            where: {
                ladyId: id
            }
        })

        if(!lady) return new ApiResponse('error', 'User is not found', -2002);
        return lady;
    }
    
    async getByIdAndUsename(id: number, username: string):Promise<Lady | ApiResponse> {
        const lady = await this.ladyService.findOne({
            where: {
                ladyId: id,
                username
            },
            relations: ['ladyAbouts']
        })

        if(!lady) return new ApiResponse('error', 'User is not found', -2002);
        return lady;
    }

    async getByEmail(email: string):Promise<Lady | ApiResponse> {
        const lady = await this.ladyService.findOne({
            where: {
                email
            }
        })

        if(!lady) return new ApiResponse('error', 'User is not found', -2002);
        return lady;
    }

    async savedUser(data: Lady):Promise<Lady | ApiResponse> {
        const savedUser = await this.ladyService.save(data);
        if(!savedUser) return new ApiResponse('error', 'User is not saved!', -5001);
        return savedUser;
    }

    async editLady(data: EditLadyDto):Promise<ApiResponse | Lady> {
        const user = await this.ladyService.findOne({
            where: {
                username: data.username,
                password: passwordHash(data.password)
            }
        });
        if(!user) return new ApiResponse('error', 'User is not found!', -2002);

        if(data.editPassword) user.password = passwordHash(data.editPassword);
        if(data.editUsername) user.username = data.editUsername;
        if(data.editEmail) user.email = data.editEmail;
        if(data.editCity) user.city = data.editCity;
        if(data.editState) user.state = data.editState;
        if(data.editDateOfBirth) user.dataOfBirth = data.editDateOfBirth;
        if(data.editNotifications) user.notification = data.editNotifications;

        return await this.ladyService.save(user);
    }

    async deleteLady(data: DeleteLadyDto):Promise<ApiResponse | Lady>{
        const user = await this.ladyService.findOne({
            where: {
                ladyId: data.deleteId,
                email: data.deleteEmail,
                username: data.deleteUsername
            }
        });
        
        if(!user) return new ApiResponse('error', 'User is not found!', -2002);

        const refreshToken = await this.jwtService.getTokenByUsername(user.username);
        await this.jwtService.deleteRefreshToken(refreshToken.refreshToken);

        fs.rmSync(`../Storage/Photo/Lady/${user.username}`, { recursive: true, force: true });

        return await this.ladyService.remove(user)
    }

    async blockTheLady(data: BlockTheUserDto):Promise<ApiResponse>{
        const lady = await this.getByIdAndUsename(data.blockId, data.blockUsername);
        if(lady instanceof ApiResponse) return lady;
        lady.blocked = fillObject(lady.blocked, {
          "id": data.id,
          "username": data.username
        })
        const savedGentleman = await this.ladyService.save(lady);
        if(!savedGentleman) return new ApiResponse('error', 'The user is not blocked!', -2004);
        return new ApiResponse('ok', 'The user has been blocked!', 200);
    }

    async getAll(page: number | null = 1, id: number):Promise<Lady[]> {
        const gentleman = await this.gentlemanService.getById(id);
        const allLady = await this.ladyService.find({
            relations: ['ladyAbouts'],
            take: 50 * page
        });

        if(gentleman instanceof Gentleman && gentleman.privileges === 'gentleman') {
            return allLady.slice(0,3);
        }
        return allLady;
    }

    async getAllForMail():Promise<Lady[]> {
        return await this.ladyService.find()
    }

    async ladyReport():Promise<ReportDto> {
        const all = await this.ladyService.find();
        const verified = await this.ladyService.count({
            where: {
            verified: '1'
            }
        });
        const nonVerified = all.length - verified;
        const report = new ReportDto();
        report.all = all.length;
        report.allNonVerified = nonVerified;
        report.allVerified = verified;
        report.allPrivileges = null
        return report;
    }

    async search(query: string):Promise<Lady[]> {
        const builder = this.ladyService.createQueryBuilder('lady');
        builder.where('(lady.username LIKE :kw OR lady.city LIKE :kw)', { kw: '%' + query + '%'});

        return await builder.getMany();
    }
}