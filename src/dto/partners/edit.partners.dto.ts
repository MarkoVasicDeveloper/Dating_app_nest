import * as validator from 'class-validator';

export class EditPartnersDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    partnerId: number

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    name?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    description?: string
}