import * as validator from "class-validator";

export class AcceptConversationDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    id: number

    @validator.IsNotEmpty()
    @validator.IsString()
    username: string

    @validator.IsNotEmpty()
    @validator.IsBoolean()
    lady: boolean

    @validator.IsNotEmpty()
    @validator.IsNumber()
    @validator.IsPositive()
    userId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    userUsername: string
}