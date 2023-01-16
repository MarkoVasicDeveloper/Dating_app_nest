import * as validator from 'class-validator';

export class DeleteLadyDto{
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    deleteId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    deleteUsername: string

    @validator.IsNotEmpty()
    @validator.IsEmail()
    deleteEmail: string
}