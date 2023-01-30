import * as validator from 'class-validator';

export class AddTrueInformationDto{
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    userId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    username: string

    @validator.IsNotEmpty()
    @validator.IsBoolean()
    lady: boolean

    @validator.IsNotEmpty()
    @validator.IsString()
    name: string

    @validator.IsNotEmpty()
    @validator.IsString()
    surname: string

    @validator.IsNotEmpty()
    @validator.IsString()
    address: string

    @validator.IsNotEmpty()
    @validator.IsString()
    city: string

    @validator.IsNotEmpty()
    @validator.IsString()
    phone: string
}