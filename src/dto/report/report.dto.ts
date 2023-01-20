export class ReportDto{
    all: number
    allVerified: number
    allNonVerified: number
    allPrivileges: {
        gentleman: number,
        gentlemanPremium: number,
        gentlemanVip: number
    } | null
}