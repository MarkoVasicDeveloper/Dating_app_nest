import * as validator from 'class-validator';

export class DeleteGentlemanDto {
    @validator.IsString()
    deleteUsername: string

    @validator.IsEmail()
    @validator.IsNotEmpty()
    deleteEmail: string

    deleteId: number
}