import * as validator from 'class-validator';

export class EditGentlemanDto{
    @validator.IsString()
    @validator.Length(3, 50)
    username: string

    @validator.IsString()
    @validator.Length(6, 50)
    password: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsEmail()
    editEmail?: string

    @validator.IsOptional()
    @validator.IsString()
    @validator.Length(6, 50)
    editPassword?: string

    @validator.IsOptional()
    @validator.IsString()
    @validator.Length(3, 50)
    editUsername?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    editCity?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    editState?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsIn(['0','1'])
    editNotifications?: '0' | '1'

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    editDateOfBirth: string
}