import * as validator from 'class-validator';

export class AddSubscriptionDto{
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 50)
    title: string

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(20, 255)
    description: string

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    price: number

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    discont?: number
}