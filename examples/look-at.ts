import { sdDisk } from '@typegpu/sdf'
import { createShaderCanvas } from 'typegpu-shader-canvas'
import { vec2f, vec3f, vec4f } from 'typegpu/data'
import { abs, length, smoothstep } from 'typegpu/std'

export function runExample() {
  function stroke(sdf: number, width: number) {
    'use gpu'
    return smoothstep(width, 0, abs(sdf))
  }

  function fill(sdf: number) {
    'use gpu'
    return smoothstep(0.01, 0, sdf)
  }

  const shaderCanvas = createShaderCanvas(
    document.getElementById('canvas'),
    ({ uv, mouse, aspectRatio }) => {
      'use gpu'

      let color = vec3f()

      let aspectUv = uv.div(vec2f(1, aspectRatio))
      let aspectMouseUv = mouse.uv.div(vec2f(1, aspectRatio))

      let outerCircle = sdDisk(aspectUv, 0.7)
      color = color.add(stroke(outerCircle, 0.01))

      let mouseDistance = length(aspectMouseUv)
      let lookAtOffset = aspectMouseUv.div(1 + mouseDistance * 2)
      let innerCircle = sdDisk(aspectUv.sub(lookAtOffset), 0.2)
      color = color.add(fill(innerCircle))

      let pupil = sdDisk(aspectUv.sub(lookAtOffset), 0.08)
      color = color.sub(fill(pupil))

      return vec4f(color, 1)
    },
  )

  shaderCanvas.startRendering()
  return shaderCanvas
}
