import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PhotosLady } from "entities/PhotosLady";
import { PhotosGentleman } from "entities/PhotosGentleman";
import { ApiResponse } from "src/misc/api.response";
import { AddPhotoDto } from "src/dto/photo/add.photo.dto";
import { Lady } from "entities/Lady";
import { Gentleman } from "entities/Gentleman";

@Injectable()
export class PhotoService{
    constructor(@InjectRepository(PhotosLady) private readonly photoLadyService:             Repository<PhotosLady>,
                @InjectRepository(PhotosGentleman) private readonly photosGentlemanService: Repository<PhotosGentleman>,
                @InjectRepository(Lady) private readonly ladyService: Repository<Lady>,
                @InjectRepository(Gentleman) private readonly gentlemanService: Repository<Gentleman>) {}

    async addPhoto(data: AddPhotoDto):Promise <PhotosGentleman | PhotosLady | ApiResponse> {
        if(data.lady) {
            const ladyUser = await this.ladyService.findOne({
                where: {
                    ladyId: data.id
                }
            })
            if(!ladyUser) return new ApiResponse('error', 'User is not found!!', -1001);
            const photo = new PhotosLady();
            photo.ladyId = data.id;
            photo.path = data.path;

            const savedPhoto = await this.photoLadyService.save(photo);
            if(!savedPhoto) return new ApiResponse('error', 'Photo is not saved!', -5001);
            return savedPhoto;
        }

        const gentlemanUser = await this.gentlemanService.findOne({
            where: {
                gentlemanId: data.id
            }
        })
        if(!gentlemanUser) return new ApiResponse('error', 'User is not found!!', -1002);

        const photo = new PhotosGentleman();
        photo.gentlemanId = data.id;
        photo.path = data.path;

        const savedPhoto = await this.photosGentlemanService.save(photo);
        if(!savedPhoto) return new ApiResponse('error', 'Photo is not saved!', -5001);
        return savedPhoto;
    }
}