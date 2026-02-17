import { sdDisk } from '@typegpu/sdf'
import { createShaderCanvas } from 'typegpu-shader-canvas'
import { f32, vec2f, vec3f, vec4f } from 'typegpu/data'
import { abs, length, select, sin, smoothstep } from 'typegpu/std'

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
    ({ uv, time, mouse, aspectRatio }) => {
      'use gpu'

      let color = vec3f()

      let aspectUv = uv.div(vec2f(1, aspectRatio))
      let outerCircle = sdDisk(vec2f(aspectUv), 0.5)
      color = color.add(stroke(outerCircle, 0.01))

      let aspectMouseUv = mouse.uv.div(vec2f(1, aspectRatio))
      let innerCircle = sdDisk(aspectUv.sub(aspectMouseUv), 0.2)
      color = color.add(fill(innerCircle))

      return vec4f(color, 1)
    },
  )

  shaderCanvas.startRendering()
  return shaderCanvas
}
