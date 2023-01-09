import { Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { PhotosGentleman } from "entities/PhotosGentleman";
import { PhotosLady } from "entities/PhotosLady";
import { diskStorage } from 'multer';
import { photoConfig } from "config/photo";
import { AddPhotoDto } from "src/dto/photo/add.photo.dto";
import { ApiResponse } from "src/misc/api.response";
import { PhotoService } from "src/services/photo/photo.service";
import * as fs from 'fs';
import * as sharp from 'sharp';
import { Param } from "@nestjs/common/decorators";

@Controller('api')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) {}
    @Post('uploadPhoto/:id/:lady/:username')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: photoConfig.destination,
                filename: (req, file, callback) => {
                    const originalName = file.originalname;

                    const normalizeName = originalName.replace(/ /g, '-');

                    const randomNumber = new Array(10)
                        .fill(0)
                        .map(() => (Math.random() * 10).toFixed(0))
                        .join('');

                    let time = '';
                    const date = new Date();
                    time += date.getDate();
                    time += '-';
                    time += date.getMonth() + 1;
                    time += '-';
                    time += date.getFullYear();

                    const savedNameFile = time + '-' + randomNumber + '-' + normalizeName;

                    callback(null, savedNameFile);
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|png)$/)) {
                    callback(
                      new HttpException('Bad extencion', HttpStatus.UNAUTHORIZED),
                      false,
                    );
                    return;
                  }
          
                  callback(null, true);
            },
            limits: {
                files: 1
            }
        })
    )
    async uploadPhoto(@Param('id') id: number, @Param('lady') lady: string, @Param('username') username: string, @UploadedFile() photo): Promise <PhotosGentleman | PhotosLady | ApiResponse> {
        if(!photo) return new ApiResponse('error', 'Photo is not uploaded', -5002);

        const photoObject = new AddPhotoDto();
        photoObject.id = id;
        photoObject.path = photo.filename;
        photoObject.lady = lady === 'false' ? false : true;

        const savedPhoto = await this.photoService.addPhoto(photoObject);
        
        if(!savedPhoto) return new ApiResponse('error', 'Photo is not saved!',-5001);

        const folder = lady === 'true' ? `Lady/${username}/` : `Gentleman/${username}/`
        
        await this.sharpResize(photo.path, folder, photo.filename, 800, 600);

        fs.unlinkSync(photo.path);
        
        return savedPhoto;
    }

    private async sharpResize(
        path: string,
        folder: string,
        photoOriginalName: string,
        width: number,
        height: number,
      ) {
        await sharp(path)
          .resize({
            width: width,
            height: height,
            fit: 'fill',
          })
          .toFile(photoConfig.destination + folder + photoOriginalName);
      }
}