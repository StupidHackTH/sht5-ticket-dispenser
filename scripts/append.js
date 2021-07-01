import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const append = () => {
    let header = `import dotenv from 'dotenv'
dotenv.config();`

    // -------------------
    // eslint-disable-next-line no-undef
    let isProduction = process.env.NODE_ENV === 'production'

    let file = resolve(isProduction ? 'build/index.js' : '.dev/index.js')
    let content = readFileSync(file, { encoding: 'utf8' })

    writeFileSync(file, header.trim() + content)
}

export default append
