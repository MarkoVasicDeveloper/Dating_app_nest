import * as validator from 'class-validator';

export class AddLadyDto{
    @validator.IsString()
    @validator.Length(3, 55)
    username: string

    @validator.IsString()
    @validator.Length(3, 55)
    password: string

    @validator.IsEmail()
    email: string

    @validator.IsNotEmpty()
    @validator.IsNumber()
    years: number
}