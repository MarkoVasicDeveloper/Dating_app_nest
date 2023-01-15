export class JwtRefreshDataDto{
    role: 'administrator' | 'gentleman' | 'lady' | 'gentlemanPremium' | 'gentlemanVip';
    id: number
    username: string
    ipAddress: string
    expire: number

    toPlane() {
        return {
            role: this.role,
            id: this.id,
            ipAddress: this.ipAddress,
            expire: this.expire,
            username: this.username
        }
    }
}