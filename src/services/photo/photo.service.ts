import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { PhotosLady } from "entities/PhotosLady";
import { PhotosGentleman } from "entities/PhotosGentleman";
import { ApiResponse } from "src/misc/api.response";
import { AddPhotoDto } from "src/dto/photo/add.photo.dto";
import { Lady } from "entities/Lady";
import { LadyService } from "../lady/lady.service";
import { GentlemanService } from "../gentleman/gentleman.service";
import * as fs from 'fs';

@Injectable()
export class PhotoService{
    constructor(@InjectRepository(PhotosLady) private readonly photoLadyService:             Repository<PhotosLady>,
                @InjectRepository(PhotosGentleman) private readonly photosGentlemanService: Repository<PhotosGentleman>,
                private readonly ladyService: LadyService,
                private readonly gentlemanService: GentlemanService) {}

    async addPhoto(data: AddPhotoDto):Promise <PhotosGentleman | PhotosLady | ApiResponse | any> {
        const service = data.lady ? this.ladyService : this.gentlemanService;
        const user = await service.getById(data.id);
        if(user instanceof ApiResponse) return user;
        
        if(user instanceof Lady) {
            const photo = new PhotosLady();
            photo.ladyId = user.ladyId;
            photo.path = data.path;

            const savedPhoto = await this.photoLadyService.save(photo);
            if(!savedPhoto) return new ApiResponse('error', 'Photo is not saved!', -5001);
            return savedPhoto;
        }

        const photo = new PhotosGentleman();
        photo.gentlemanId = user.gentlemanId;
        photo.path = data.path;

        const savedPhoto = await this.photosGentlemanService.save(photo);
        if(!savedPhoto) return new ApiResponse('error', 'Photo is not saved!', -5001);
        return savedPhoto;
    }

    async getAllPhoto(id: number, lady: string):Promise<PhotosGentleman[] | PhotosLady[] | ApiResponse> {
        const service = lady !== 'false' ? this.ladyService : this.gentlemanService;
        const photos = lady !== 'false' ? this.photoLadyService : this.photosGentlemanService;
        const query = lady !== 'false' ? {ladyId: id} : {gentlemanId: id};

        const user = await service.getById(id);
        if(user instanceof ApiResponse) return user;

        const allPhotos = await photos.find({
            where: query
        });

        return allPhotos;
    }

    async deletePhoto(id: number, photoPath: string, lady: string):Promise<ApiResponse | DeleteResult> {
        const service = lady !== 'false' ? this.ladyService : this.gentlemanService;
        const photos = lady !== 'false' ? this.photoLadyService : this.photosGentlemanService;
        const query = lady !== 'false' ? {ladyId: id, path: photoPath} : {gentlemanId: id, path: photoPath};

        const user = await service.getById(id);
        if(user instanceof ApiResponse) return user;

        const photo = await photos.findOne({
            where: query
        })
        if(!photo) return new ApiResponse('error', 'The photo is not found!', -6001);

        fs.unlinkSync(`../Storage/Photo/${lady === 'true' ?  'Lady': 'Gentleman'}/${user.username}/${photo.path}`);
        return await photos.delete(photo);
    }

    async changeThumb(id: number, photoPath: string, lady: string):Promise<ApiResponse | PhotosGentleman | PhotosLady> {
        const service = lady !== 'false' ? this.ladyService : this.gentlemanService;
        const changeThumbQuery = lady !== 'false' ? {ladyId: id, path: photoPath} : {gentlemanId: id, path: photoPath};

        const query = lady !== 'false' ? {ladyId: id} : { gentlemanId: id}
        const photoService = lady !== 'false' ? this.photoLadyService : this.photosGentlemanService
        
        const user = await service.getById(id);
        if(user instanceof ApiResponse) return user;

        const allPhotos: PhotosLady[] | PhotosGentleman[] = await photoService.find({
            where: query
        })

        allPhotos.forEach(async (photo: PhotosLady | PhotosGentleman) => {
            photo.thumb = '0';
            if(photo instanceof PhotosLady) await this.photoLadyService.save(photo);
            if(photo instanceof PhotosGentleman) await this.photosGentlemanService.save(photo);
        })

        const thumbPhoto = await photoService.findOne({
            where:changeThumbQuery
        });
        if(!thumbPhoto) return new ApiResponse('error','The photo is not found!', -6002);
        
        thumbPhoto.thumb = '1';
        if(thumbPhoto instanceof PhotosLady) return await this.photoLadyService.save(thumbPhoto);
        if(thumbPhoto instanceof PhotosGentleman) return await this.photosGentlemanService.save(thumbPhoto);
    }
}