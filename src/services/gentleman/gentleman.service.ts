import { Injectable } from '@nestjs/common';
import { Gentleman } from 'entities/Gentleman';
import { AddGentlemanDto } from 'src/dto/gentleman/add.gentleman.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, LessThan, Repository } from "typeorm";
import * as crypto from 'crypto';
import { ApiResponse } from 'src/misc/api.response';
import * as fs from 'fs'; 
import { EditGentlemanDto } from 'src/dto/gentleman/edit.gentleman.dto';
import { passwordHash } from 'src/misc/password.hash';
import { DeleteGentlemanDto } from 'src/dto/gentleman/delete.gentleman.dto';
import { JwtService } from '../jwt/jwt.service';
import { BlockTheUserDto } from 'src/dto/gentleman/block.the.user.dto';
import { fillObject } from 'src/misc/fill.object';
import { ReportDto } from 'src/dto/report/report.dto';

@Injectable()
export class GentlemanService {
  constructor(@InjectRepository(Gentleman) private readonly gentlemanService:     Repository<Gentleman>,
              private readonly jwtService: JwtService) {}
  
  async addGenleman(data: AddGentlemanDto): Promise <Gentleman | ApiResponse> {

    try {
      const passwordString = crypto.createHash('sha512');
      passwordString.update(data.password);
      const passwordStringHash = passwordString.digest('hex').toString().toUpperCase();

      const gentleman = new Gentleman();
      gentleman.email = data.email;
      gentleman.password = passwordStringHash;
      gentleman.username = data.username;
      gentleman.city = data.city;
      gentleman.notifications = data.notifications;
      gentleman.rules = data.rules;
      gentleman.dateOfBirth = new Date(data.dateOfBirth).toString().slice(0,15);

      const savedGentleman = await this.gentlemanService.save(gentleman);

      fs.mkdirSync(`../Storage/Photo/Gentleman/${data.username}`, { recursive: true });
      
      return savedGentleman;

    } catch (error) {
      console.log(error)
      return new ApiResponse('error',"User already exists",  -1001)
    }
  }

  async getByUsername(username: string): Promise<Gentleman | ApiResponse> {
    const gentleman = await this.gentlemanService.findOne({
      where: {
        username
      }
    })

    if(!gentleman) return new ApiResponse('error', 'Wrong username', -1002);
    return gentleman;
  }

  async getById(id: number):Promise <Gentleman | ApiResponse> {
    const gentleman = await this.gentlemanService.findOne({
      where: {
        gentlemanId: id
      }
    })
    if(!gentleman) return new ApiResponse('error', 'User is not found', -1002);
    return gentleman;
  }

  async getByIdAndUsename(id: number, username: string):Promise<Gentleman | ApiResponse>{
    const gentleman = await this.gentlemanService.findOne({
      where: {
        gentlemanId: id,
        username
      },
      relations: ['gentlemanAbout']
    })
    if(!gentleman) return new ApiResponse('error', 'User is not found', -1002);
    return gentleman;
  }

  async getByEmail(email: string):Promise<Gentleman | ApiResponse>{
    const gentleman = await this.gentlemanService.findOne({
      where: {
        email
      }
    })
    if(!gentleman) return new ApiResponse('error', 'User is not found', -1002);
    return gentleman;
  }

  async savedUser(data: Gentleman):Promise<Gentleman | ApiResponse> {
    const user = await this.gentlemanService.save(data);
    if(!user) return new ApiResponse('error', 'User is not saved!', -2003);
    return user;
  }

  async editGentleman(data: EditGentlemanDto):Promise<Gentleman | ApiResponse> {
    const user = await this.gentlemanService.findOne({
      where: {
        username: data.username,
        password: passwordHash(data.password)
      }
    });
    if(!user) return new ApiResponse('error', 'User is not found!', -1002);

    if(data.editPassword) user.password = passwordHash(data.editPassword);
    if(data.editUsername) user.username = data.editUsername;
    if(data.editEmail) user.email = data.editEmail;
    if(data.editCity) user.city = data.editCity;
    if(data.editState) user.state = data.editState;
    if(data.editDateOfBirth) user.dateOfBirth = data.editDateOfBirth;
    if(data.editNotifications) user.notifications = data.editNotifications;

    return await this.gentlemanService.save(user);
  }

  async deleteGentleman(data: DeleteGentlemanDto):Promise<ApiResponse | Gentleman> {
    const user = await this.gentlemanService.findOne({
      where: {
          email: data.deleteEmail,
          username: data.deleteUsername,
          gentlemanId: data.deleteId
      }
  });
  if(!user) return new ApiResponse('error', 'User is not found!', -2002);

  const refreshToken = await this.jwtService.getTokenByUsername(user.username);
  await this.jwtService.deleteRefreshToken(refreshToken.refreshToken);

  fs.rmSync(`../Storage/Photo/Gentleman/${user.username}`, { recursive: true, force: true });

  return await this.gentlemanService.remove(user);
  }

  async blockTheGentleman(data: BlockTheUserDto):Promise<ApiResponse>{
    const gentleman = await this.getByIdAndUsename(data.blockId, data.blockUsername);
    if(gentleman instanceof ApiResponse) return gentleman;
    gentleman.blocked = fillObject(gentleman.blocked, {
      "id": data.id,
      "username": data.username
    })
    const savedGentleman = await this.gentlemanService.save(gentleman);
    if(!savedGentleman) return new ApiResponse('error', 'The user is not blocked!', -2004);
    return new ApiResponse('ok', 'The user has been blocked!', 200);
  }

  async getAll(page: number | null = 1):Promise<Gentleman[]> {
    return await this.gentlemanService.find({
      relations: ['gentlemanAbouts'],
      take: 50 * page
    });
  }

  async getAllForMail():Promise<Gentleman[]>{
    return await this.gentlemanService.find();
  }

  async getByPrivileges(privileges: 'gentleman' | 'gentlemanPremium' | 'gentlemanVip', page: number | null = 1) {
    return await this.gentlemanService.find({where:{privileges}, take: 50 * page})
  }

  async gentlemanReport():Promise<ReportDto> {
    const all = await this.gentlemanService.find();
    const verified = await this.gentlemanService.count({
      where: {
        verified: '1'
      }
    });
    const nonVerified = all.length - verified;

    const gentlemanVip = await this.gentlemanService.count({
      where: {
        privileges: 'gentlemanVip'
      }
    });

    const gentlemanPremium = await this.gentlemanService.count({
      where: {
        privileges: 'gentlemanPremium'
      }
    });
    const gentleman = all.length - gentlemanVip - gentlemanPremium;
    const report = new ReportDto();
    report.all = all.length;
    report.allNonVerified = nonVerified;
    report.allVerified = verified;
    report.allPrivileges = {
      gentleman,
      gentlemanPremium,
      gentlemanVip
    }
    return report;
  }

  async search(query: string):Promise<Gentleman[]> {
    const builder = this.gentlemanService.createQueryBuilder('gentleman');
    builder.where('(gentleman.username LIKE :kw OR gentleman.city LIKE :kw OR gentleman.privileges LIKE :kw)', { kw: '%' + query + '%'});

    return await builder.getMany();
  }

  async nonActive():Promise<Gentleman[]> {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    date.toISOString().replace('T', " ").slice(0, -5);
    
    return await this.gentlemanService.find({
      where: {
        lastLogIn: LessThan(date)
      }
    })
  }
}
