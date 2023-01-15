import * as validator from 'class-validator';

export class DeleteAdminDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    id: number

    @validator.IsNotEmpty()
    @validator.IsString()
    username: string

    @validator.IsNotEmpty()
    @validator.IsString()
    password: string

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    deleteId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    deleteUsername: string

    @validator.IsNotEmpty()
    @validator.IsEmail()
    deleteEmail: string
}