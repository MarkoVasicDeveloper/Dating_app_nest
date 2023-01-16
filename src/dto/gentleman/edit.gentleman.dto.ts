import * as validator from 'class-validator';

export class EditGentlemanDto{
    @validator.IsString()
    @validator.Length(3, 55)
    username: string

    @validator.IsString()
    @validator.Length(3, 55)
    password: string

    editeEmail?: string

    editYears?: number

    editPassword?: string

    editUsername?: string
}