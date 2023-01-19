import * as validator from 'class-validator';

export class EditLadyAboutDto{
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    ladyId: number

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(50, 255)
    about?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(50, 255)
    aboutThePerson?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    height?: number

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    weight?: number

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.IsIn(['primary school', 'high school', 'college'])
    education?: 'primary school' | 'high school' | 'college'

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    profession?: string

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.IsIn(['married', 'free', 'complicated', 'married,but'])
    maritalStatus?: 'married' | 'free' | 'complicated' | 'married,but'

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    children?: number

    @validator.IsOptional()
    @validator.IsNotEmpty()
    @validator.IsString()
    language?: string
}