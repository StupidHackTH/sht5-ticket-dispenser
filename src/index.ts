import { resolve } from 'path'

import fastify from 'fastify'

import helmet from 'fastify-helmet'
import compress from 'fastify-compress'
import staticPlugin from 'fastify-static'

import base from '@modules/base'
import dispenser from '@modules/dispenser'

import run from '@services/cluster'

const app = fastify()

const main = () =>
    app
        .register(helmet)
        .register(compress)
        .register(staticPlugin, {
            root: resolve('./public')
        })
        .register(base)
        .register(dispenser)
        .listen(3000, '0.0.0.0', (error, address) => {
            if (error) return console.error(error)

            console.log(`Running at ${address}`)
        })

run(main)
