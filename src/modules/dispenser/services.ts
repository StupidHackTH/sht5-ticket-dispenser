import type { FastifyReply } from 'fastify'

import { firestore } from '@services/firebase'
import { randomPick } from '@services/random'

import type {
    DispenserResponse,
    DispenserValue,
    PostChallengeBody,
    ReservedValue
} from './types'

export class DispenserResponseBuilder {
    #res: FastifyReply

    constructor(res: FastifyReply) {
        this.#res = res
    }

    #base({
        success = false,
        info = 'Something went wrong',
        ticket = null
    }: Partial<DispenserResponse>): DispenserResponse {
        return {
            success,
            info,
            ticket
        }
    }

    ok({ info, ticket }: Pick<DispenserResponse, 'info' | 'ticket'>) {
        this.#res.send(this.#base({ success: true, info, ticket }))
    }

    error(info: DispenserResponse['info'], ticket: string | null = null) {
        this.#res.send(this.#base({ info, ticket }))
    }
}

export const validateDispenserBody = ({
    email = '',
    key = ''
}: PostChallengeBody) => {
    if (!email) return new Error('Email is required')
    if (!key) return new Error('Key is required')

    return null
}

export const getTicket = async ({
    challenge,
    key
}: {
    challenge: string
    key: string
}) => {
    let ticketBox = firestore.collection('tickets').doc(challenge)

    let dispenser = await ticketBox.get()

    if (!dispenser.exists) return new Error('Dispenser not exists')

    let { key: dispenserKey, tickets } = dispenser.data() as DispenserValue

    if (key !== dispenserKey) return new Error('Incorrect dispenser key')

    return tickets
}

type FirestoreReference =
    FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>

export const checkIfAlreadyReserved = async (
    reservedBox: FirestoreReference
) => {
    let reserved = await reservedBox.get()

    if (!reserved.exists) {
        return {
            ticket: null,
            error: null
        }
    }

    let { ticket } = reserved.data() as ReservedValue

    return {
        ticket,
        error: new Error('Already reserved')
    }
}

export const reserveTicket = async ({
    tickets,
    reservedBox,
    email,
    challenge,
    production
}: {
    tickets: string[]
    reservedBox: FirestoreReference
    email: string
    challenge: string
    production: boolean
}) => {
    try {
        let ticket = randomPick(tickets)

        await reservedBox.set({
            email,
            ticket,
            from: challenge
        } as ReservedValue)

        let ticketBox = firestore.collection('tickets').doc(challenge)
        let leftTickets = [...tickets]
        let reservedTicketIndex = tickets.indexOf(ticket)

        if (reservedTicketIndex === -1)
            return new Error(
                'Race condition occured, Someone already reserved this ticket, please try again'
            )

        leftTickets.splice(reservedTicketIndex, 1)

        if (production)
            await ticketBox.update({
                tickets: leftTickets
            } as DispenserValue)

        return ticket
    } catch (error) {
        return new Error(error || 'Something went wrong, please try again')
    }
}
