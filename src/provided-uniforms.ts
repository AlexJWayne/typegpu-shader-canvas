import { type Infer, f32, i32, struct, vec2f } from 'typegpu/data'

import { Coordinate } from './coordinate-space'

export const Mouse = struct({
  ...Coordinate.propTypes,

  /** 1 if the mouse is over the canvas, 0 otherwise */
  isOver: i32,

  /** 1 if the left mouse button is down, 0 otherwise */
  down: i32,
})

export const ProvidedUniforms = struct({
  /** The resolution of the canvas, in pixels */
  resolution: vec2f,

  /** The aspect ratio of the canvas */
  aspectRatio: f32,

  /** Elapsed time since page load, in seconds */
  time: f32,

  /** The mouse state */
  mouse: Mouse,
})

export type ProvidedUniforms = Infer<typeof ProvidedUniforms>
