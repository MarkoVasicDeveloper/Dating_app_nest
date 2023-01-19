import * as validator from 'class-validator';

export class AddAdministratorDto{
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 50)
    username: string

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(6, 50)
    password: string

    @validator.IsNotEmpty()
    @validator.IsEmail()
    email: string
}