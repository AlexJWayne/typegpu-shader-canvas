import { createShaderCanvas } from 'typegpu-shader-canvas'
import { f32, vec2f, vec3f, vec4f } from 'typegpu/data'
import { abs, length, select, sin, smoothstep } from 'typegpu/std'

export function runExample() {
  const shaderCanvas = createShaderCanvas(
    document.getElementById('canvas'),
    ({ uv, time, mouse, aspect }) => {
      'use gpu'

      let color = vec3f()

      const r = smoothstep(0, 0.08, abs(uv.y + sin(time * 3 + uv.x * 4) * 0.2))
      const g = smoothstep(0, 0.07, abs(uv.y + sin(time * 2 + uv.x * 5) * 0.2))
      const b = smoothstep(0, 0.06, abs(uv.y + sin(time * 1 + uv.x * 6) * 0.2))
      color = color.add(vec3f(1).sub(vec3f(r, g, b)))

      const mouseDistance = mouse.aspectUV.sub(aspect.uv)
      color = color.add(
        smoothstep(0.2, 0, length(mouseDistance)) *
          select(0.5, f32(1), mouse.down === 1),
      )

      return vec4f(color, 1)
    },
  )

  shaderCanvas.startRendering()
  return shaderCanvas
}
