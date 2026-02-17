import tgpu, { type TgpuBufferReadonly } from 'typegpu'
import { type Infer, f32, struct, type v4f, vec2f, vec4f } from 'typegpu/data'

import { Aspect, Mouse, ProvidedUniforms } from './provided-uniforms'

const FragmentMouse = struct({
  ...Mouse.propTypes,

  /** The mouse UV coordinates corrected for aspect ratio */
  aspectUV: vec2f,
})

const { aspectRatio: _, mouse: __, ...providedPropTypes } = ProvidedUniforms.propTypes

export const FragmentParameters = struct({
  uv: vec2f,
  xy: vec2f,
  ...providedPropTypes,
  mouse: FragmentMouse,
  aspect: Aspect,
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
          mouse: FragmentMouse({
            xy: providedUniforms.$.mouse.xy,
            uv: providedUniforms.$.mouse.uv,
            isOver: providedUniforms.$.mouse.isOver,
            down: providedUniforms.$.mouse.down,
            aspectUV: providedUniforms.$.mouse.uv.div(vec2f(1, providedUniforms.$.aspectRatio)),
          }),
          resolution: providedUniforms.$.resolution,
          aspect: Aspect({
            ratio: providedUniforms.$.aspectRatio,
            uv: uv.div(vec2f(1, providedUniforms.$.aspectRatio)),
          }),
        }),
      ),
    }
  })
}
