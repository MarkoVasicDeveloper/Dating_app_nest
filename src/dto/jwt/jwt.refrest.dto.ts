export class JwtRefreshDataDto{
    id: number
    username: string
    ipAddress: string
    expire: number

    toPlane() {
        return {
            id: this.id,
            ipAddress: this.ipAddress,
            expire: this.expire,
            username: this.username
        }
    }
}