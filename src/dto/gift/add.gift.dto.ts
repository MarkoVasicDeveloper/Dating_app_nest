import * as validator from 'class-validator';

export class AddGiftDto{
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3,50)
    name: string
}