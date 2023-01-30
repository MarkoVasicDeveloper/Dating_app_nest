import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrueInformation } from 'entities/TrueInformation';
import { AddTrueInformationDto } from 'src/dto/true_information/add.true.information.dto';
import { EditTrueInformationDto } from 'src/dto/true_information/edit.true.information.dto';
import { ApiResponse } from 'src/misc/api.response';
import { Repository } from 'typeorm';
import { GentlemanService } from '../gentleman/gentleman.service';
import { LadyService } from '../lady/lady.service';

@Injectable()
export class TrueInformationService{
    constructor(@InjectRepository(TrueInformation) private readonly trueInformationService: Repository<TrueInformation>,
                private readonly gentlemanService: GentlemanService,
                private readonly ladyService: LadyService) {}

    async addInformation(data: AddTrueInformationDto):Promise<TrueInformation | ApiResponse> {
        const service = data.lady ? this.ladyService : this.gentlemanService;

        const user = await service.getByIdAndUsename(data.userId, data.username);
        if(user instanceof ApiResponse) return user;

        const newInformation = new TrueInformation();
        newInformation.address = data.address;
        newInformation.city = data.city;
        newInformation.name = data.name;
        newInformation.phone = data.phone;
        newInformation.surname = data.surname;
        newInformation.userId = data.userId;
        newInformation.lady = data.lady ? '1' : '0';

        const savedInformation = await this.trueInformationService.save(newInformation);
        if(!savedInformation) return new ApiResponse('error', 'The information is not saved!', -140001);
        return savedInformation;
    }

    async editInformation(data: EditTrueInformationDto):Promise<TrueInformation | ApiResponse> {
        const service = data.lady ? this.ladyService : this.gentlemanService;

        const user = await service.getByIdAndUsename(data.userId, data.username);
        if(user instanceof ApiResponse) return user;

        const information = await this.getTrueInformation(data.userId, data.lady ? 'true' : 'false');
        if(information instanceof ApiResponse) return information;

        if(data.address) information.address = data.address;
        if(data.city) information.city = data.city;
        if(data.name) information.name = data.name;
        if(data.phone) information.phone = data.phone;
        if(data.surname) information.surname = data.surname;

        const savedInformation = await this.trueInformationService.save(information);
        if(!savedInformation) return new ApiResponse('error', 'The information is not saved!', -140001);
        return savedInformation;
    }

    async getTrueInformation(userId: number, lady: string):Promise<TrueInformation | ApiResponse> {
        const information = await this.trueInformationService.findOne({
            where:{
                userId,
                lady: lady === 'true' ? '1' : '0'
            }
        });

        if(!information) return new ApiResponse('error', 'The information is not found!', -140002);
        return information;
    }
}