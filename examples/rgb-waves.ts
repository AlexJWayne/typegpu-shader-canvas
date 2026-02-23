import { createShaderCanvas } from 'typegpu-shader-canvas'
import { f32, type v2f, vec3f, vec4f } from 'typegpu/data'
import { abs, length, select, sin, smoothstep } from 'typegpu/std'

export function runExample() {
  function wave(
    time: number,
    centeredUV: v2f,
    strokeWidth: number,
    timeScale: number,
    frequency: number,
  ) {
    'use gpu'

    return smoothstep(
      0,
      strokeWidth,
      abs(
        centeredUV.y + sin(time * timeScale + centeredUV.x * frequency) * 0.2,
      ),
    )
  }

  const shaderCanvas = createShaderCanvas(
    document.getElementById('canvas'),
    ({ uvCenteredAspect, time, mouse }) => {
      'use gpu'

      let color = vec3f()

      const r = wave(time, uvCenteredAspect, 0.08, 3, 4)
      const g = wave(time, uvCenteredAspect, 0.07, 2, 5)
      const b = wave(time, uvCenteredAspect, 0.06, 1, 6)
      color = color.add(vec3f(1).sub(vec3f(r, g, b)))

      const mouseDistance = mouse.uvCenteredAspect.sub(uvCenteredAspect)
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
