export class LoginInfo {
    role: 'administrator' | 'lady' | 'gentleman' | 'gentlemanPremium' | 'gentlemanVip'
    id: number
    username: string
    token: string

    constructor(id: number, username: string, token: string, role: 'administrator' | 'lady' | 'gentleman' | 'gentlemanPremium' | 'gentlemanVip') {
        this.id = id
        this.username = username
        this.token = token
        this.role = role
    }
}