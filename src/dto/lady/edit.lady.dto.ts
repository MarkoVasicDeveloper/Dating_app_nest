import * as validator from 'class-validator';

export class EditLadyDto{
    @validator.IsString()
    @validator.Length(3, 55)
    username: string

    @validator.IsString()
    @validator.Length(3, 55)
    password: string

    editEmail?: string

    editYears?: number

    editUsername?: string

    editPassword?: string
}