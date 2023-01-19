import * as validator from 'class-validator';

export class EditAdministratorDto{
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    id: number

    @validator.IsNotEmpty()
    @validator.IsString()
    username: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    editUsername?: string

    @validator.IsNotEmpty()
    @validator.IsString()
    password: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(6, 50)
    editPassword?: string
}