import * as validator from 'class-validator';

export class AttachmentsDto{
    @validator.IsNotEmpty()
    @validator.IsString()
    filename: string

    @validator.IsNotEmpty()
    @validator.IsString()
    cid: string
}