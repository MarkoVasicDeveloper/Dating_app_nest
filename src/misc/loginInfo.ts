export class LoginInfo {
    id: number
    username: string
    token: string
    refreshToken: string
    expire: string

    constructor(id: number, username: string, token: string, refreshToken: string, expire: string) {
        this.id = id
        this.username = username
        this.token = token
        this.refreshToken = refreshToken
        this.expire = expire
    }
}