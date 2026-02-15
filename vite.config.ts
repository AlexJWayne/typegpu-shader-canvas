import path from 'node:path'
import typegpuPlugin from 'unplugin-typegpu/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [typegpuPlugin({})],
  root: 'examples',
  resolve: {
    alias: {
      'typegpu-shader-canvas': path.resolve(__dirname, 'src/index.ts'),
    },
  },
})
