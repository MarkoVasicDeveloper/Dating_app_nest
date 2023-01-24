import * as validator from 'class-validator';

export class AddRequestToAdminDto{
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    userId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(3, 50)
    username: string

    @validator.IsNotEmpty()
    @validator.IsEmail()
    email: string

    @validator.IsNotEmpty()
    @validator.IsBoolean()
    lady: boolean

    @validator.IsNotEmpty()
    @validator.IsObject()
    request: {
        type: 'violence' | 'getExtraInfo' | 'getInfo' | 'getMeeting'
        username: string
        email: string
        message: string
    }
}