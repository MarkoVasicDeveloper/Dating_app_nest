import * as validator from "class-validator";

export class EditLadiesWishisDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    ladyId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    question: string

    @validator.IsNotEmpty()
    @validator.IsString()
    answer: string
}