import * as validator from 'class-validator';

export class AddGentlemanDto {
    @validator.IsString()
    @validator.Length(3, 50)
    username: string

    @validator.IsString()
    @validator.Length(6, 50)
    password: string

    @validator.IsEmail()
    @validator.IsString()
    email: string

    @validator.IsNotEmpty()
    @validator.IsString()
    city: string

    @validator.IsNotEmpty()
    @validator.IsString()
    state: string

    @validator.IsNotEmpty()
    @validator.IsIn(['0','1'])
    rules: '0' | '1'

    @validator.IsNotEmpty()
    @validator.IsIn(['0','1'])
    notifications: '0' | '1'

    @validator.IsNotEmpty()
    @validator.IsString()
    dateOfBirth: string
}