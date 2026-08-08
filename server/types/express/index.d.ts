export interface AuthUser {
    uid: string
    email?: string | null
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser
        }
    }
}

export {}
