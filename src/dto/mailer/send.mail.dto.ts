import * as validator from 'class-validator';

export class SendMailDto{

    @validator.IsNotEmpty()
    @validator.IsEmail()
    email:string

    @validator.IsNotEmpty()
    @validator.IsString()
    body: string
}