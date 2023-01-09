import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtDataDto } from 'src/dto/jwt/jwt.dto';
import * as jwt from 'jsonwebtoken';
import { secret } from 'config/jwtSecret';

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {

        if(!req.headers['authorization']) {
            throw new HttpException('Header not exist', HttpStatus.UNAUTHORIZED)
        }

        const token = req.headers['authorization'].split(' ')[1]

        let jwtDataObject: JwtDataDto;

        try {
            jwtDataObject = jwt.verify(token, secret) as any;
        } catch (error) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

         if (!jwtDataObject) {
            throw new HttpException('Token is incorect', HttpStatus.UNAUTHORIZED)
        }

        if (req.ip !== jwtDataObject.ipAddress) {
            throw new HttpException('Bad token found and ip', HttpStatus.UNAUTHORIZED)
        }

        const currentTimestamp = new Date().getTime() / 1000;
        if (currentTimestamp >= jwtDataObject.expire) {
            throw new HttpException('The token has expired', HttpStatus.UNAUTHORIZED);
        }

        req.token = jwtDataObject;

        next();
    }
}