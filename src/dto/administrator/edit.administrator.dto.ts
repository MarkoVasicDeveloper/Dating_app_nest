import * as validator from 'class-validator';

export class EditAdministratorDto{
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    id: number

    @validator.IsNotEmpty()
    @validator.IsString()
    username: string

    editUsername?: string

    @validator.IsNotEmpty()
    @validator.IsString()
    password: string

    editPassword?: string
}