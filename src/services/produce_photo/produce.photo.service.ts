import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnersPhoto } from 'entities/PartnersPhoto';
import { AddProducePhotoDto } from 'src/dto/produce_photo/add.produce.photo.dto';
import { ApiResponse } from 'src/misc/api.response';
import { DeleteResult, Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class ProducePhotoService{
    constructor(@InjectRepository(PartnersPhoto) private readonly partnersPhotoService: Repository<PartnersPhoto>){}

    async addProducePhoto(data: AddProducePhotoDto):Promise<PartnersPhoto | ApiResponse> {
        const photo = new PartnersPhoto();
        photo.produceId = data.produceId;
        photo.path = data.path

        const savedPhoto = await this.partnersPhotoService.save(photo);
        if(!savedPhoto) return new ApiResponse('error', 'The photo is not saved!', -40002)

        return savedPhoto;
    }

    async deletePhoto(id: number, path: string, companyName):Promise<ApiResponse | DeleteResult> {
        const photo = await this.partnersPhotoService.findOne({
            where: {produceId: id, path}
        })
        if(!photo) return new ApiResponse('error', 'The photo is not found', -40001);
        
        fs.unlinkSync(`../Storage/Photo/Partners/${companyName}/${photo.path}`);
        return await this.partnersPhotoService.delete(photo);
    }
}