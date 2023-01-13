import * as validator from 'class-validator';

export class AddMessageDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    gentlemanId: number

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    ladyId: number
}