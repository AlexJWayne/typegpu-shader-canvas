import { createShaderCanvas } from 'typegpu-shader-canvas'
import { vec3f, vec4f } from 'typegpu/data'
import { abs, floor, fract, length, sin, smoothstep, step } from 'typegpu/std'

export function runExample() {
  const shaderCanvas = createShaderCanvas(
    document.getElementById('canvas'),
    ({ time, uvCenteredAspect, mouse }) => {
      'use gpu'

      const scale = 5 * (1 + sin(time * 0.3) * 0.3)

      const gridValue = length(fract(uvCenteredAspect.mul(scale)).sub(0.5))
      const outerValue = smoothstep(0.2, 1, gridValue)
      const innerValue = smoothstep(0.35, 0.0, gridValue)

      const fragmentCell = floor(uvCenteredAspect.mul(scale))
      const mouseCell = floor(mouse.uvCenteredAspect.mul(scale))
      const diff = fragmentCell.sub(mouseCell)
      const inMouseCell =
        (1 - step(0.5, abs(diff.x))) * //
        (1 - step(0.5, abs(diff.y)))

      const r = sin(uvCenteredAspect.x * scale - time) * 0.5 + 0.6
      const b = sin(uvCenteredAspect.y * scale + time) * 0.5 + 0.6
      return vec4f(
        vec3f(r, 0, b)
          .mul(outerValue)
          .add(vec3f(innerValue * inMouseCell)),
        1,
      )
    },
  )

  shaderCanvas.startRendering()
  return shaderCanvas
}
