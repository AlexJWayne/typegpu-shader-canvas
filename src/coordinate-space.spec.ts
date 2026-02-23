import { vec2f } from 'typegpu/data'
import { describe, expect, it } from 'vitest'

import { createCoordinateStruct } from './coordinate-space'

const uvBottomLeft = vec2f(0, 1)
const uvTopRight = vec2f(1, 0)

describe('createCoordinateStruct', () => {
  describe('with a [200,100] canvas', () => {
    const resolution = vec2f(200, 100)

    describe('pixelPos', () => {
      it('returns 0,0 at bottom left', () => {
        const { pixelPos } = createCoordinateStruct(uvBottomLeft, resolution)
        expect(pixelPos).toEqual(vec2f(0, 0))
      })

      it('returns 1,1 at top right', () => {
        const { pixelPos } = createCoordinateStruct(uvTopRight, resolution)
        expect(pixelPos).toEqual(vec2f(200, 100))
      })
    })

    describe('uv', () => {
      it('returns 0,0 at bottom left', () => {
        const { uv } = createCoordinateStruct(uvBottomLeft, resolution)
        expect(uv).toEqual(vec2f(0, 0))
      })

      it('returns 1,1 at top right', () => {
        const { uv } = createCoordinateStruct(uvTopRight, resolution)
        expect(uv).toEqual(vec2f(1, 1))
      })
    })

    describe('uvCentered', () => {
      it('returns -1,-1 at bottom left', () => {
        const { uvCentered } = createCoordinateStruct(uvBottomLeft, resolution)
        expect(uvCentered).toEqual(vec2f(-1, -1))
      })

      it('returns 1,1 at top right', () => {
        const { uvCentered } = createCoordinateStruct(uvTopRight, resolution)
        expect(uvCentered).toEqual(vec2f(1, 1))
      })
    })

    describe('uvCenteredAspect', () => {
      it('returns -2,-1 at bottom left', () => {
        const { uvCenteredAspect } = createCoordinateStruct(
          uvBottomLeft,
          resolution,
        )
        expect(uvCenteredAspect).toEqual(vec2f(-2, -1))
      })

      it('returns 2,1 at top right', () => {
        const { uvCenteredAspect } = createCoordinateStruct(
          uvTopRight,
          resolution,
        )
        expect(uvCenteredAspect).toEqual(vec2f(2, 1))
      })
    })

    describe('uvAspect', () => {
      it('returns 0,0 at bottom left', () => {
        const { uvAspect } = createCoordinateStruct(uvBottomLeft, resolution)
        expect(uvAspect).toEqual(vec2f(0, 0))
      })

      it('returns 2,1 at top right', () => {
        const { uvAspect } = createCoordinateStruct(uvTopRight, resolution)
        expect(uvAspect).toEqual(vec2f(2, 1))
      })
    })
  })
})
