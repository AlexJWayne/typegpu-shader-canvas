import { vec3f, vec4f } from 'typegpu/data'
import { abs, sin, smoothstep } from 'typegpu/std'

import { createShaderCanvas } from './typegpu-shader-canvas'

createShaderCanvas(document.getElementById('canvas'), ({ uv, time }) => {
  'use gpu'

  const r = smoothstep(0, 0.08, abs(uv.y + sin(time * 3 + uv.x * 4) * 0.2))
  const g = smoothstep(0, 0.07, abs(uv.y + sin(time * 2 + uv.x * 5) * 0.2))
  const b = smoothstep(0, 0.06, abs(uv.y + sin(time * 1 + uv.x * 6) * 0.2))

  return vec4f(vec3f(vec3f(1).sub(vec3f(r, g, b))), 1)
}).startRendering()
