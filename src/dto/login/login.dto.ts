import * as validator from 'class-validator';

export class LoginDto {
    @validator.IsNotEmpty()
    @validator.IsString()
    username: string

    @validator.IsNotEmpty()
    @validator.IsString()
    password: string

    @validator.IsNotEmpty()
    @validator.IsBoolean()
    lady: boolean
}