import * as validator from 'class-validator';

export class ChangeUnreadedMessageDto{
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    gentlemanId: number

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    ladyId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    message: any;

    @validator.IsNotEmpty()
    @validator.IsBoolean()
    lady: boolean
}