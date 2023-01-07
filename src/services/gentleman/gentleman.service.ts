import { Injectable } from '@nestjs/common';
import { Gentleman } from 'entities/Gentleman';
import { AddGentlemanDto } from 'src/dto/gentleman/add.gentleman.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as crypto from 'crypto';
import { ApiResponse } from 'src/misc/api.response';

@Injectable()
export class GentlemanService {
  constructor(@InjectRepository(Gentleman) private readonly gentlemanService: Repository<Gentleman>) {}
  
  async addGenleman(data: AddGentlemanDto): Promise <Gentleman | ApiResponse> {

    try {
      const passwordString = crypto.createHash('sha512');
      passwordString.update(data.password);
      const passwordStringHash = passwordString.digest('hex').toString().toUpperCase();

      const gentleman = new Gentleman();
      gentleman.email = data.email;
      gentleman.password = passwordStringHash;
      gentleman.username = data.username;
      gentleman.years = data.years;

      const savedGentleman = await this.gentlemanService.save(gentleman);

      return savedGentleman;

    } catch (error) {
      return new ApiResponse('error',error,  -1001)
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
}
