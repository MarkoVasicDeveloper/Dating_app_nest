import * as validator from 'class-validator';

export class SendMailDto{

    @validator.IsNotEmpty()
    @validator.IsEmail()
    email:string

    @validator.IsNotEmpty()
    @validator.IsString()
    template: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsArray()
    attachments?: AttachmentDto[] | null = null

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    name?: string | null = null
}

export class AttachmentDto{
    @validator.IsNotEmpty()
    @validator.IsString()
    fileName: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    path: string
}