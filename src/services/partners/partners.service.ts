import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partners } from 'entities/Partners';
import { AddPartnersDto } from 'src/dto/partners/add.partners.dto';
import { EditPartnersDto } from 'src/dto/partners/edit.partners.dto';
import { ApiResponse } from 'src/misc/api.response';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class PartnersService{
    constructor(@InjectRepository(Partners) private readonly partnersService: Repository<Partners>){}

    async addPartners(data: AddPartnersDto):Promise<Partners | ApiResponse> {
        try {
            const partner = new Partners();
            partner.giftCategoryId = data.giftCategoryId;
            partner.name = data.name;
            partner.description = data.description;

            const savedPartner = await this.partnersService.save(partner);
            if(!savedPartner) return new ApiResponse('error', 'The partner is not saved!', -30002);
            return savedPartner;
        } catch (error) {
            return new ApiResponse('error','The partner already exists!', -30001);
        }
    }

    async editPartner(data: EditPartnersDto):Promise<Partners | ApiResponse> {
        const partner = await this.partnersService.findOne({
            where: {partnerId: data.partnerId}
        });
        if(!partner) return new ApiResponse('error','The partner is not found!', -30003);

        if(data.description) partner.description = data.description;
        if(data.name) partner.name = data.name;

        const savedPartner = await this.partnersService.save(partner);
        if(!savedPartner) return new ApiResponse('error', 'The partner is not saved!', -30002);
        return savedPartner;
    }

    async deletePartner(partnerId: number):Promise<DeleteResult | ApiResponse> {
        const partner = await this.partnersService.findOne({where:{partnerId}});
        if(!partner) return new ApiResponse('error','The partner is not found!', -30003);
        return await this.partnersService.delete(partner);
    }
}