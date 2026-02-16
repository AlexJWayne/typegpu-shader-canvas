import path from 'node:path'
import { fileURLToPath } from 'node:url'
import typegpuPlugin from 'unplugin-typegpu/vite'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [typegpuPlugin({})],
  root: 'examples',
  resolve: {
    alias: {
      'typegpu-shader-canvas': path.resolve(__dirname, 'src/index.ts'),
    },
  },
})
