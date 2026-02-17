import { type Infer, f32, i32, struct, vec2f } from 'typegpu/data'

export const Mouse = struct({
  /** The XY position in pixels on the canvas */
  xy: vec2f,

  /** The UV position on the canvas */
  uv: vec2f,

  /** 1 if the mouse is over the canvas, 0 otherwise */
  isOver: i32,

  /** 1 if the left mouse button is down, 0 otherwise */
  down: i32,
})

export const Aspect = struct({
  /** The aspect ratio of the canvas (width / height) */
  ratio: f32,

  /** The UV coordinates corrected for aspect ratio */
  uv: vec2f,
})

export const ProvidedUniforms = struct({
  /** Elapsed time since page load, in seconds */
  time: f32,

  /** The mouse state */
  mouse: Mouse,

  /** The resolution of the canvas, in pixels */
  resolution: vec2f,

  /** The aspect ratio of the canvas */
  aspectRatio: f32,
})

export type ProvidedUniforms = Infer<typeof ProvidedUniforms>
