import * as validator from 'class-validator';

export class EditTrueInformationDto{
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

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    name?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    surname?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    address?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    city?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    phone?: string
}