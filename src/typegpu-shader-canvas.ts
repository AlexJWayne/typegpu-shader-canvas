import tgpu, { type TgpuBufferReadonly } from 'typegpu'
import { type Infer, type v4f, vec2f } from 'typegpu/data'

import { FragmentParameters, createFragmentShader } from './fragment-shader'
import { trackMouse } from './mouse'
import { ProvidedUniforms } from './provided-uniforms'
import { createVertexShader, quadVertices } from './vertex-shader'

const root = await tgpu.init()
const presentationFormat = navigator.gpu.getPreferredCanvasFormat()

export function createShaderCanvas(
  canvas: HTMLElement | undefined | null,
  fragmentShaderImplementation: (
    fragmentParameters: Infer<typeof FragmentParameters>,
  ) => v4f,
) {
  validateCanvas(canvas)
  const ctx = getCtx(canvas)
  const providedUniformsBuffer = createProvidedUniformsBuffer(canvas)
  trackMouse(canvas, providedUniformsBuffer)

  const drawPipeline = createPipeline(
    fragmentShaderImplementation,
    providedUniformsBuffer.as('readonly'),
  )

  function render() {
    providedUniformsBuffer.writePartial({
      time: performance.now() / 1000,
    })

    drawPipeline(ctx)
  }

  function renderWithRequestAnimationFrame() {
    render()
    requestAnimationFrame(renderWithRequestAnimationFrame)
  }

  return {
    render,
    startRendering: renderWithRequestAnimationFrame,
  }
}

function createPipeline(
  fragmentShaderImplementation: (
    fragmentParameters: Infer<typeof FragmentParameters>,
  ) => v4f,
  providedUniformsBuffer: TgpuBufferReadonly<typeof ProvidedUniforms>,
) {
  const pipeline = root['~unstable']
    .withVertex(createVertexShader())
    .withFragment(
      createFragmentShader(
        fragmentShaderImplementation,
        providedUniformsBuffer,
      ),
      { color: { format: presentationFormat } },
    )
    .createPipeline()

  return function drawPipeline(ctx: GPUCanvasContext) {
    pipeline
      .withColorAttachment({
        color: {
          view: ctx.getCurrentTexture().createView(),
          loadOp: 'clear',
          storeOp: 'store',
        },
      })
      .draw(quadVertices.$.length, 1)
  }
}

function validateCanvas(
  canvas: HTMLElement | null | undefined,
): asserts canvas is HTMLCanvasElement {
  if (!canvas)
    throw new Error(
      `Canvas element is ${canvas === null ? 'null' : 'undefined'}`,
    )

  if (!(canvas instanceof HTMLCanvasElement))
    throw new Error(
      `Canvas must be an HTMLCanvasElement. got ${canvas === null ? 'null' : 'undefined'}`,
    )
}

function getCtx(canvas: HTMLCanvasElement): GPUCanvasContext {
  const ctx = canvas.getContext('webgpu')
  if (!ctx) throw new Error('Failed to get webgpu context')

  ctx.configure({
    device: root.device,
    format: presentationFormat,
    alphaMode: 'premultiplied',
  })

  return ctx
}

function createProvidedUniformsBuffer(canvas: HTMLCanvasElement) {
  const providedUniformsBuffer = root
    .createBuffer(ProvidedUniforms)
    .$usage('storage')

  providedUniformsBuffer.writePartial({
    resolution: vec2f(canvas.clientWidth, canvas.clientHeight),
    aspectRatio: canvas.clientWidth / canvas.clientHeight,
  })

  return providedUniformsBuffer
}
