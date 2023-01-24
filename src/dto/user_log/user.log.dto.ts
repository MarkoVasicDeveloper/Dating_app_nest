import * as validator from 'class-validator';

export class AddUserLogDto{
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3,50)
    username: string

    @validator.IsNotEmpty()
    @validator.IsEmail()
    email: string

    @validator.IsNotEmpty()
    @validator.IsIP()
    ipAddress: string

    @validator.IsNotEmpty()
    @validator.IsString()
    userAgent: string
}