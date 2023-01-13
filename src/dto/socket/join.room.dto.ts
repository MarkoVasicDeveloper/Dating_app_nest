import * as validator from 'class-validator';

export class JoinRoomDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    id: number

    @validator.IsNotEmpty()
    @validator.IsString()
    username: string

    @validator.IsNotEmpty()
    @validator.IsBoolean()
    lady: boolean

    @validator.IsNotEmpty()
    @validator.IsNumber()
    connectonId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    connectionUsername: string

    @validator.IsNotEmpty()
    @validator.IsString()
    message: string
}