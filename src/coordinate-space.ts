import tgpu from 'typegpu'
import { f32, struct, type v2f, vec2f } from 'typegpu/data'

export const Coordinate = struct({
  /** The pixel coordinates of the fragment */
  pixelPos: vec2f,

  /** The UV coordinates of the fragment. 0,0 is the bottom left corner, 1,1 is the top right corner */
  uv: vec2f,

  /** The UV coordinates of the fragment centered around the origin. -1,-1 is the bottom left corner, 1,1 is the top right corner */
  uvCentered: vec2f,

  /** The UV aspect ratio adjusted coordinates of the fragment centered around the origin. -X,-1 is the bottom left corner, X,1 is the top right corner */
  uvCenteredAspect: vec2f,

  /** The UV aspect ratio adjusted coordinates of the fragment. 0,0 is the bottom left corner, X,1 is the top right corner */
  uvAspect: vec2f,
})

export const createCoordinateStruct = tgpu.fn(
  [vec2f, vec2f],
  Coordinate,
)((uv: v2f, resolution: v2f) => {
  const pixelPos = flipY(uv.mul(resolution), resolution.y)
  const aspectScalar = vec2f(resolution.x / resolution.y, 1)
  const flippedUV = flipY(uv, 1)
  const uvCentered = flippedUV.mul(2).sub(1)

  return Coordinate({
    pixelPos,
    uv: flippedUV,
    uvCentered,
    uvCenteredAspect: uvCentered.mul(aspectScalar),
    uvAspect: flippedUV.mul(aspectScalar),
  })
})

const flipY = tgpu.fn(
  [vec2f, f32],
  vec2f,
)((p: v2f, yMax: number) => vec2f(p.x, yMax - p.y))
