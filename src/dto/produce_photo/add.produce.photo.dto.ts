import * as validator from 'class-validator';

export class AddProducePhotoDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    produceId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    path: string
}