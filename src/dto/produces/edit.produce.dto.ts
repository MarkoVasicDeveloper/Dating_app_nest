import * as validator from 'class-validator';

export class EditProducesDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    produceId: number

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    title?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    price?: number
}