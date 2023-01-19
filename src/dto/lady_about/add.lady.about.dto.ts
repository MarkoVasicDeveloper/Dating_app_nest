import * as validator from 'class-validator';

export class AddLadyAboutDto{
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    ladyId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(50, 255)
    about: string

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.Length(50, 255)
    aboutThePerson: string

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    height: number

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    weight: number

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.IsIn(['primary school', 'high school', 'college'])
    education: 'primary school' | 'high school' | 'college'

    @validator.IsNotEmpty()
    @validator.IsString()
    profession: string

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.IsIn(['married', 'free', 'complicated', 'married,but'])
    maritalStatus: 'married' | 'free' | 'complicated' | 'married,but'

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    children: number

    @validator.IsNotEmpty()
    @validator.IsString()
    language: string

    @validator.IsNotEmpty()
    @validator.IsString()
    @validator.IsIn(['0', '1'])
    true_information: '0' | '1'
}