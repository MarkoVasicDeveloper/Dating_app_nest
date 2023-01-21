import * as validator from 'class-validator';

export class AddPartnersDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    giftCategoryId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 50)
    name: string

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(10, 255)
    description: string
}