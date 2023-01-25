import * as validator from 'class-validator';

export class AddProducesDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    partnerId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    title: string

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    price: number

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(5, 255)
    description: string
}