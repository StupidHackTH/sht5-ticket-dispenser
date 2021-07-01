import type { RequestGenericInterface } from 'fastify'

export interface PostChallengeBody {
    key: string,
    email: string
    production: boolean
}

export interface PostChallengeParam {
    challenge: string
}

export interface PostChallenge extends RequestGenericInterface {
    Params: PostChallengeParam,
    Body: PostChallengeBody
}

export interface DispenserValue {
    key: string
    tickets: string[]
}

export interface ReservedValue {
    email: string
    ticket: string
    from: string
}

export interface DispenserResponse {
    success: boolean
    info: string
    ticket: string | null
}