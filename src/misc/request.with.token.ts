import { JwtDataDto } from "src/dto/jwt/jwt.dto";

declare module "express" {
    interface Request {
        token: JwtDataDto
    }
}