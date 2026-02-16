import typegpuPlugin from 'unplugin-typegpu/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [typegpuPlugin({}), dts({ include: ['src'] })],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['typegpu', 'typegpu/data'],
    },
  },
})
