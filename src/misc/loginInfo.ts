export class LoginInfo {
    role: 'administrator' | 'lady' | 'gentleman' | 'gentlemanPremium' | 'gentlemanVip'
    id: number
    username: string
    token: string
    refreshToken: string
    expire: string

    constructor(id: number, username: string, token: string, refreshToken: string, expire: string, role: 'administrator' | 'lady' | 'gentleman' | 'gentlemanPremium' | 'gentlemanVip') {
        this.id = id
        this.username = username
        this.token = token
        this.refreshToken = refreshToken
        this.expire = expire
        this.role = role
    }
}