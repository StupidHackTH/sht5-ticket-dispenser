import esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import alias from 'esbuild-plugin-alias'

import { resolve } from 'path'

import append from '../scripts/append.js'

await esbuild.build({
    entryPoints: ['src/index.ts'],
    platform: 'node',
    format: 'esm',
    target: 'node14',
    outdir: 'build',
    bundle: true,
    minify: true,
    plugins: [
        nodeExternalsPlugin(),
        alias({
            '@modules': resolve('./src/modules'),
            '@services': resolve('./src/services'),
            '@assets': resolve('./assets')
        })
    ]
})

append()
