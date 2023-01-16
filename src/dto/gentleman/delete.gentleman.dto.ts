import * as validator from 'class-validator';

export class DeleteGentlemanDto {
    @validator.IsString()
    @validator.Length(3, 55)
    deleteUsername: string

    @validator.IsEmail()
    @validator.IsNotEmpty()
    deleteEmail: string

    deleteId: number
}