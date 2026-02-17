export function createRenderLoop(render: () => void) {
  let isRendering = false

  function renderWithRequestAnimationFrame() {
    if (!isRendering) return
    render()
    requestAnimationFrame(renderWithRequestAnimationFrame)
  }

  return {
    startRendering() {
      isRendering = true
      renderWithRequestAnimationFrame()
    },
    stopRendering() {
      isRendering = false
    },
  }
}
