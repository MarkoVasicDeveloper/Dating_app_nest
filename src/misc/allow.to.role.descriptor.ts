import { SetMetadata } from "@nestjs/common"

export const AllowToRole = (...roles: ('administrator' | 'lady' | 'gentleman' | 'gentlemanPremium' | 'gentlemanVip')[]) => {
    return SetMetadata('allow_to_roles', roles);
}