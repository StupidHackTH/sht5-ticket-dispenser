import cluster from 'cluster'
import { cpus } from 'os'

const available = cpus().length

const run = (app: () => void): void => {
    if (process.env.NODE_ENV !== 'production') return app()

    if (cluster.isMaster)
        for (let node = 0; node < available; node++) cluster.fork()
    else app()
}

export default run
