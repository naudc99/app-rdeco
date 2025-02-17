export interface TokenJWT {
    exp: number,
    iat: number,
    role: string,
    sub: string
}