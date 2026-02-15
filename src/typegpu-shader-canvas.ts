import tgpu, { type TgpuBufferReadonly } from 'typegpu'
import {
  type Infer,
  arrayOf,
  builtin,
  f32,
  struct,
  type v4f,
  vec2f,
  vec4f,
} from 'typegpu/data'

const root = await tgpu.init()
const presentationFormat = navigator.gpu.getPreferredCanvasFormat()

const Mouse = struct({
  xy: vec2f,
  uv: vec2f,
})
const ProvidedUniforms = struct({
  time: f32,
  mouse: Mouse,
})

const FragmentParameters = struct({
  uv: vec2f,
  ...ProvidedUniforms.propTypes,
})

export function createShaderCanvas(
  canvas: HTMLElement | undefined | null,
  fragmentShaderImplementation: (
    fragmentParameters: Infer<typeof FragmentParameters>,
  ) => v4f,
) {
  const ctx = getCtx(canvas)

  const providedUniformsBuffer = root
    .createBuffer(ProvidedUniforms)
    .$usage('storage')

  const drawPipeline = createPipeline(
    fragmentShaderImplementation,
    providedUniformsBuffer.as('readonly'),
  )

  function render() {
    if (!ctx) throw new Error('WebGPU context is not available')

    providedUniformsBuffer.write({
      time: performance.now() / 1000,
      mouse: Mouse({ xy: vec2f(), uv: vec2f() }),
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

function createFragmentShader(
  fragmentShaderImplementation: (
    fragmentParameters: Infer<typeof FragmentParameters>,
  ) => v4f,
  providedUniforms: TgpuBufferReadonly<typeof ProvidedUniforms>,
) {
  return tgpu['~unstable'].fragmentFn({
    in: { uv: vec2f },
    out: { color: vec4f },
  })(({ uv }) => {
    return {
      color: fragmentShaderImplementation(
        FragmentParameters({
          uv,
          time: providedUniforms.$.time,
          mouse: providedUniforms.$.mouse,
        }),
      ),
    }
  })
}

function getCtx(canvas: HTMLElement | undefined | null): GPUCanvasContext {
  if (!canvas)
    throw new Error(
      `Canvas element is ${canvas === null ? 'null' : 'undefined'}`,
    )

  if (!(canvas instanceof HTMLCanvasElement))
    throw new Error(
      `Canvas must be an HTMLCanvasElement. got ${canvas === null ? 'null' : 'undefined'}`,
    )

  const ctx = canvas.getContext('webgpu')
  if (!ctx) throw new Error('Failed to get webgpu context')

  ctx.configure({
    device: root.device,
    format: presentationFormat,
    alphaMode: 'premultiplied',
  })

  return ctx
}

const quadVertices = tgpu.const(arrayOf(vec2f, 6), [
  vec2f(-1, -1),
  vec2f(-1, 1),
  vec2f(1, 1),
  vec2f(1, 1),
  vec2f(1, -1),
  vec2f(-1, -1),
])

function createVertexShader() {
  return tgpu['~unstable'].vertexFn({
    in: { idx: builtin.vertexIndex },
    out: {
      clipPos: builtin.position,
      uv: vec2f,
    },
  })(({ idx }) => {
    const vertex = quadVertices.$[idx]!
    return {
      clipPos: vec4f(vertex, 0, 1),
      uv: vertex,
    }
  })
}
