import * as validator from 'class-validator';

export class AddAdministratorDto{
    @validator.IsNotEmpty()
    @validator.IsString()
    username: string

    @validator.IsNotEmpty()
    @validator.IsString()
    password: string

    @validator.IsNotEmpty()
    @validator.IsEmail()
    email: string
}