import type { TgpuBuffer } from 'typegpu'
import { type v2f, vec2f } from 'typegpu/data'

import { Mouse, ProvidedUniforms } from './provided-uniforms'

function getXY(event: MouseEvent, rect: DOMRect): v2f {
  return vec2f(event.clientX - rect.left, -(event.clientY - rect.top))
}

function getUV(rect: DOMRect, xy: v2f): v2f {
  return xy.div(vec2f(rect.width, rect.height)).mul(2).sub(vec2f(1, -1))
}

function getIsOver(rect: DOMRect, xy: v2f): 0 | 1 {
  const inX = xy.x >= 0 && xy.x <= rect.width
  const inY = xy.y <= 0 && xy.y >= -rect.height
  return inX && inY ? 1 : 0
}

function getMouseDown(event: MouseEvent): 0 | 1 {
  return (event.buttons & 1) !== 0 ? 1 : 0
}

export function trackMouse(
  canvas: HTMLElement,
  providedUniforms: TgpuBuffer<typeof ProvidedUniforms>,
): () => void {
  function handleMouseEvent(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    const xy = getXY(event, rect)

    providedUniforms.writePartial({
      mouse: Mouse({
        xy,
        uv: getUV(rect, xy),
        isOver: getIsOver(rect, xy),
        down: getMouseDown(event),
      }),
    })
  }

  document.addEventListener('mousemove', handleMouseEvent)
  canvas.addEventListener('mousedown', handleMouseEvent)
  canvas.addEventListener('mouseup', handleMouseEvent)

  return function untrackMouse() {
    document.removeEventListener('mousemove', handleMouseEvent)
    canvas.removeEventListener('mousedown', handleMouseEvent)
    canvas.removeEventListener('mouseup', handleMouseEvent)
  }
}
