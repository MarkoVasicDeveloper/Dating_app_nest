import * as validator from 'class-validator';

export class BlockTheUserDto{
    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    id: number

    @validator.IsNotEmpty()
    @validator.IsString()
    username: string

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    blockId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    blockUsername: string
}