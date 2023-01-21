import { Controller, Post, UseInterceptors, HttpException, HttpStatus, UploadedFile, Param, UseGuards, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { photoConfig } from 'config/photo';
import { PartnersPhoto } from 'entities/PartnersPhoto';
import { diskStorage } from 'multer';
import { ApiResponse } from 'src/misc/api.response';
import { ProducePhotoService } from 'src/services/produce_photo/produce.photo.service';
import { sharpResize } from '../photo/photo.controller';
import * as fs from 'fs';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';

@Controller('api')
export class ProducePhotoController{
    constructor(private readonly photoService: ProducePhotoService) {}

    @Post('uploadProducePhoto/:produceId/:companyName')
    @UseInterceptors(
        FileInterceptor('producePhoto', {
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
    async uploadProducePhoto(@UploadedFile() photo, @Param('produceId') produceId: number, @Param('companyName') companyName: string):Promise<ApiResponse | PartnersPhoto> {
        if(!photo) return new ApiResponse('error', 'Photo is not uploaded', -5002);

        const newPhoto = await this.photoService.addProducePhoto({
            produceId,
            path: photo.filename
        })

        if(newPhoto instanceof ApiResponse) return newPhoto;

        await sharpResize(photo.path, `Partners/${companyName}/`, photo.filename, 600, 400);

        fs.unlinkSync(photo.path);

        return newPhoto;
    }

    @Delete('delete/uploadPhoto/:produceId/:path/:companyName')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async deletePhoto(@Param('produceId') produceId: number, @Param('path') path: string, @Param('companyName') companyName: string){
        return await this.photoService.deletePhoto(produceId, path, companyName);
    }
}