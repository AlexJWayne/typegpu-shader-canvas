import path from 'node:path'
import { fileURLToPath } from 'node:url'
import typegpuPlugin from 'unplugin-typegpu/vite'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [typegpuPlugin({})],
  root: 'examples',
  base: '/typegpu-shader-canvas/',
  build: {
    outDir: path.resolve(__dirname, 'dist-examples'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'typegpu-shader-canvas': path.resolve(__dirname, 'src/index.ts'),
    },
  },
})
