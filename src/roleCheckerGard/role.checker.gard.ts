import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Request } from 'express';

@Injectable()
export class RoleCheckerGard implements CanActivate{
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        const role = req.token.role;
        
        const allowedToRoles = this.reflector.get<('administrator' | 'lady' | 'gentleman' | 'gentlemanPremium' | 'gentlemanVip')[]>('allow_to_roles', context.getHandler());

        if(!allowedToRoles.includes(role)) return false;
        return true;
    }
}