import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ApiResponse } from 'src/misc/api.response';
import { existsSync } from 'node:fs';
import { emailTemplate, emailTemplateAttachments } from 'config/mailer';

@Injectable()
export class EmailTemplateService{

    async getAllTemplate():Promise<ApiResponse | string[]> {
        
        try {
            const allFiles = fs.readdirSync('./views/', {encoding: 'utf-8', withFileTypes: false});
            
            return allFiles.map((file: string) => {
                if(file.split('.').slice(-1)[0] === 'handlebars') return file;
            }).filter((file: string | undefined) => file !== undefined)
        } catch (error) {
            return new ApiResponse('error', 'Something is wrong!', -120001);
        }
    }

    async deleteEmailTemplate(template: string) {
        if(template.split('.').slice(-1)[0] !== 'handlebars') return new ApiResponse('error', 'Wrong extension', -120005);

        if(template.slice(0,7) === 'default') return new ApiResponse('error', 'You cant delete default email template', -120004);

        if(existsSync(`./views/${template}`)) {
            fs.unlinkSync(`./views/${template}`);
            delete emailTemplateAttachments[template];
            return new ApiResponse('ok', 'Template are deleted', -120002);
        }
        return new ApiResponse('error', 'Template is not found', -120003);
    }

    async deletePhoto(filename: string) {
        if(existsSync(`${emailTemplate.photoDestination}/EmailTemplate/${filename}`)) {
            fs.unlinkSync(`${emailTemplate.photoDestination}/EmailTemplate/${filename}`);
            return new ApiResponse('ok', 'Photo are deleted', -120002);
        }
        return new ApiResponse('error', 'Photo are not found', -120003);
    }

    async getAllPthoto() {
        try {
            return fs.readdirSync(`${emailTemplate.photoDestination}/EmailTemplate/`, {encoding: 'utf-8', withFileTypes: false});
        } catch (error) {
            return new ApiResponse('error', 'Something is wrong!', -120001);
        }
    }
}