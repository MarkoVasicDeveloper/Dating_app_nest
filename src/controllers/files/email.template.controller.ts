import { Controller, Post, UseGuards, UseInterceptors, HttpException, HttpStatus, UploadedFile, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { emailTemplate, emailTemplateAttachments } from 'config/mailer';
import { diskStorage } from 'multer';
import { AllowToRole } from 'src/misc/allow.to.role.descriptor';
import { ApiResponse } from 'src/misc/api.response';
import { RoleCheckerGard } from 'src/roleCheckerGard/role.checker.gard';
import * as fs from 'fs';
import { Body, Put } from '@nestjs/common/decorators';
import { EmailTemplateService } from 'src/services/email_template/email.template.service';
import { sharpResize } from '../photo/photo.controller';
import { AttachmentDto } from 'src/dto/mailer/send.mail.dto';

@Controller('api')
export class EmailTemplateController{
    constructor(private readonly emailTemplateService: EmailTemplateService) {}
    
    @Post('save/emailTemplate')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    @UseInterceptors(
        FileInterceptor('emailTemplate', {
            storage: diskStorage({
                destination: emailTemplate.destination,
                filename: (req, file, callback) => {
                    
                    callback(null, file.originalname);
                
            }}),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(handlebars)$/)) {
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
    async saveFile(@UploadedFile() template, @Body() data: AttachmentDto[]):Promise<ApiResponse> {
        if(!template) {
            return new ApiResponse('error', 'Template is not uploaded! Check extension.', -5002);
        }
        
        emailTemplateAttachments[template.originalname] = {
            attachments: data
        }

        return new ApiResponse('ok','The template is saved!', 200);
    }

    @Post('emailTemplate/uploadPhoto')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    @UseInterceptors(
        FileInterceptor('emailPhoto', {
            storage: diskStorage({
                destination: emailTemplate.photoDestination,
                filename: (req, file, callback) => {
                    
                    callback(null, file.originalname);
                
            }}),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|png|webp)$/)) {
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
    async emailTemplatePhoto(@UploadedFile() emailTemplatePhoto) {
        if(!emailTemplatePhoto) {
            return new ApiResponse('error', 'Photo is not uploaded!', -120005);
        }

        await sharpResize(emailTemplatePhoto.path, '/EmailTemplate/', emailTemplatePhoto.filename, 800, 600);

        fs.unlinkSync(emailTemplatePhoto.path);

        return new ApiResponse('ok', 'Photo are saved!', -120006);
    }

    @Delete('delete/emailTemplatePhoto/:filename')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async deletePhoto(@Param('filename') filename: string) {
        return await this.emailTemplateService.deletePhoto(filename);
    }

    @Put('get/allEmailTemplate')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async getAllTemplate():Promise<ApiResponse | string[]> {
        return await this.emailTemplateService.getAllTemplate()
    }

    @Put('get/allEmailPhoto')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async getAllPhoto():Promise<ApiResponse | string[]> {
        return await this.emailTemplateService.getAllPthoto();
    }

    @Delete('delete/emailTemplate/:template')
    @UseGuards(RoleCheckerGard)
    @AllowToRole('administrator')
    async deleteEmailTemplate(@Param('template') template: string) {
        return await this.emailTemplateService.deleteEmailTemplate(template);
    }
}