import * as validator from 'class-validator';

export class AddOrderDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    customerId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 50)
    customerUsername: string

    @validator.IsNotEmpty()
    @validator.IsEmail()
    customerEmail: string;

    @validator.IsNotEmpty()
    @validator.IsBoolean()
    lady: boolean

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    produceId: number

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    recipientId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 50)
    recipientUsername: string

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    quantity: number
}