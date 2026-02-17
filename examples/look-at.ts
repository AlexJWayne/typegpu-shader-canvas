import { createShaderCanvas } from 'typegpu-shader-canvas'
import { f32, vec2f, vec3f, vec4f } from 'typegpu/data'
import { abs, length, select, sin, smoothstep } from 'typegpu/std'

export function runExample() {
  const shaderCanvas = createShaderCanvas(
    document.getElementById('canvas'),
    ({ uv, time, mouse, aspectRatio }) => {
      'use gpu'

      let color = vec3f(1, 0, 0)

      return vec4f(color, 1)
    },
  )

  shaderCanvas.startRendering()
  return shaderCanvas
}
