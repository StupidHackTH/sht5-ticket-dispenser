import type { FastifyPluginCallback } from 'fastify'

import { firestore } from '@services/firebase'

import {
    checkIfAlreadyReserved,
    DispenserResponseBuilder,
    getTicket,
    reserveTicket,
    validateDispenserBody
} from './services'

import type { PostChallenge } from './types'

const dispenser: FastifyPluginCallback = (app, _, done) => {
    app.post<PostChallenge>(
        '/dispenser/:challenge',
        async (
            {
                params: { challenge },
                body,
                body: { email = '', key, production = false }
            },
            res
        ) => {
            let Response = new DispenserResponseBuilder(res)

            try {
                let validated = validateDispenserBody(body)

                if (validated instanceof Error)
                    return Response.error(validated.message)

                let tickets = await getTicket({ challenge, key })

                if (tickets instanceof Error)
                    return Response.error(tickets.message)

                let reservedBox = firestore.collection('reserve').doc(email)

                let { ticket: reservedTicket, error } =
                    await checkIfAlreadyReserved(reservedBox)

                if (error instanceof Error)
                    return Response.error('Already reserved', reservedTicket)

                let ticket = await reserveTicket({
                    tickets,
                    email,
                    challenge,
                    reservedBox,
                    production
                })

                if (ticket instanceof Error)
                    return Response.error(ticket.message)

                Response.ok({
                    info: 'Successfully, reserved a ticket',
                    ticket
                })
            } catch (error) {
                console.warn(error)

                res.send({
                    success: false,
                    info: 'Something went wrong, please try again later',
                    ticket: null
                })
            }
        }
    )

    done()
}

export default dispenser
