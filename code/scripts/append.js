const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')

const append = () => {
    // eslint-disable-next-line quotes
    let header = `require('dotenv').config();`

    // -------------------
    // eslint-disable-next-line no-undef
    let isProduction = process.env.NODE_ENV === 'production'

    let file = resolve(isProduction ? 'build/index.js' : '.dev/index.js')
    let content = readFileSync(file, { encoding: 'utf8' })

    writeFileSync(file, header.trim() + content)
}

module.exports = append
