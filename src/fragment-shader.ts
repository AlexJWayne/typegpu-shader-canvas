import tgpu, { type TgpuBufferReadonly } from 'typegpu'
import { type Infer, struct, type v4f, vec2f, vec4f } from 'typegpu/data'

import { Coordinate, createCoordinateStruct } from './coordinate-space'
import { ProvidedUniforms } from './provided-uniforms'

export const FragmentParameters = struct({
  ...Coordinate.propTypes,
  ...ProvidedUniforms.propTypes,
})
export type FragmentParameters = Infer<typeof FragmentParameters>

export function createFragmentShader(
  fragmentShaderImplementation: (
    fragmentParameters: Infer<typeof FragmentParameters>,
  ) => v4f,
  providedUniforms: TgpuBufferReadonly<typeof ProvidedUniforms>,
) {
  return tgpu.fragmentFn({
    in: { uv: vec2f },
    out: { color: vec4f },
  })(({ uv }) => {
    const coordinate = createCoordinateStruct(uv, providedUniforms.$.resolution)

    return {
      color: fragmentShaderImplementation(
        FragmentParameters({
          resolution: providedUniforms.$.resolution,
          aspectRatio: providedUniforms.$.aspectRatio,

          pixelPos: coordinate.pixelPos,
          uv: coordinate.uv,
          uvCentered: coordinate.uvCentered,
          uvAspect: coordinate.uvAspect,
          uvCenteredAspect: coordinate.uvCenteredAspect,

          time: providedUniforms.$.time,
          mouse: providedUniforms.$.mouse,
        }),
      ),
    }
  })
}
