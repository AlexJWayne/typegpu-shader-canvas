import tgpu, { type TgpuBufferReadonly } from 'typegpu'
import { type Infer, struct, type v4f, vec2f, vec4f } from 'typegpu/data'

import { ProvidedUniforms } from './provided-uniforms'

export const FragmentParameters = struct({
  uv: vec2f,
  xy: vec2f,
  ...ProvidedUniforms.propTypes,
})
export type FragmentParameters = Infer<typeof FragmentParameters>

export function createFragmentShader(
  fragmentShaderImplementation: (
    fragmentParameters: Infer<typeof FragmentParameters>,
  ) => v4f,
  providedUniforms: TgpuBufferReadonly<typeof ProvidedUniforms>,
) {
  return tgpu['~unstable'].fragmentFn({
    in: { uv: vec2f },
    out: { color: vec4f },
  })(({ uv }) => {
    // Calculate pixel coordinates from clip space coordinates
    const xy = uv.add(vec2f(1, 1)).mul(providedUniforms.$.resolution).mul(0.5)

    return {
      color: fragmentShaderImplementation(
        FragmentParameters({
          uv,
          xy,
          time: providedUniforms.$.time,
          mouse: providedUniforms.$.mouse,
          resolution: providedUniforms.$.resolution,
          aspectRatio: providedUniforms.$.aspectRatio,
        }),
      ),
    }
  })
}
