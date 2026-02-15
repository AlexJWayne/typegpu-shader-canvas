import tgpu from 'typegpu'
import { arrayOf, builtin, vec2f, vec4f } from 'typegpu/data'

export const quadVertices = tgpu.const(arrayOf(vec2f, 6), [
  vec2f(-1, -1),
  vec2f(-1, 1),
  vec2f(1, 1),
  vec2f(1, 1),
  vec2f(1, -1),
  vec2f(-1, -1),
])

export function createVertexShader() {
  return tgpu['~unstable'].vertexFn({
    in: { idx: builtin.vertexIndex },
    out: {
      clipPos: builtin.position,
      uv: vec2f,
    },
  })(({ idx }) => {
    const vertex = quadVertices.$[idx]!
    return {
      clipPos: vec4f(vertex, 0, 1),
      uv: vertex,
    }
  })
}
