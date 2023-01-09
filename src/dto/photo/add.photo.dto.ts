import * as validator from 'class-validator';

export class AddPhotoDto{
    @validator.IsNumber()
    @validator.IsPositive()
    @validator.IsNotEmpty()
    id: number

    @validator.IsString()
    @validator.IsNotEmpty()
    path: string

    @validator.IsNotEmpty()
    @validator.IsBoolean()
    lady: boolean
}