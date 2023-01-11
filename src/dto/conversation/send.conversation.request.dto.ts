import * as validator from 'class-validator';

export class SendConversationRequestDto{

    @validator.IsNotEmpty()
    @validator.IsNumber()
    senderId: number

    @validator.IsNotEmpty()
    @validator.IsString()
    senderUsername: string

    @validator.IsNotEmpty()
    @validator.IsNumber()
    destinationId: number

    @validator.IsNotEmpty()
    @validator.IsBoolean()
    lady: boolean
}