# typegpu-shader-canvas

This library makes it easy to render TypeScript-based fragment shaders directly to a web-based canvas element through a WebGPU pipeline. This is made possible by the amazing [TypeGPU](https://typegpu.com) library.

- 🚫 No setting up a WebGPU device or pipeline
- 🚫 No need to render triangle geometry
- 🚫 No need to write vertex shaders
- ✨ Just provide a canvas, and your shader code, and look at the pretty pixels.


## Features

- 🖱️ Mouse event handling for position and left click state, including off-canvas tracking.
- 📐 Use `uv` (clip-space) or `xy` (pixel) coordinates.
- 🔄 Automatically start animating in a render loop.


**Note:** This library requires a browser with [WebGPU support](https://caniuse.com/webgpu).

## Installation

```bash
npm install typegpu-shader-canvas typegpu
npm install --save-dev unplugin-typegpu
```

### Build Plugin

Your build pipeline **must** include [`unplugin-typegpu`](https://docs.swmansion.com/TypeGPU/tooling/unplugin-typegpu/). This is what allows your shader to be compiled to WGSL for the WebGPU pipeline.


#### Vite example

```ts
// vite.config.ts
import typegpuPlugin from 'unplugin-typegpu/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [typegpuPlugin({})],
})
```

## Usage

Call `createShaderCanvas(canvas, fragmentShader)` with a reference to a `canvas` element and a [TypeGPU shader function](https://docs.swmansion.com/TypeGPU/fundamentals/functions/) that returns a `vec4f`. The returned vector has 4 components interpreted as `r, g, b, alpha`.

This gives you a shader canvas object. Call `startRendering()` to start continuous rendering, or call `render()` to render one frame.

### Example

[Live example](https://alexjwayne.github.io/typegpu-shader-canvas/)

```ts
import { vec3f, vec4f } from 'typegpu/data'
import { mix, sin } from 'typegpu/std'
import { createShaderCanvas } from 'typegpu-shader-canvas'

createShaderCanvas(
  document.getElementById('canvas'),
  ({ uv, time }) => {
    'use gpu'

    const color = mix(
      vec3f(1, 0, 0),
      vec3f(0, 0, 1),
      sin(time + uv.x) * 0.5 + 0.5
    )
    return vec4f(color, 1)
  },
).startRendering()
```

## API

### `createShaderCanvas(canvas, fragmentShader)`

Creates a WebGPU shader canvas that renders a fragment shader to the given `<canvas>` element.

**Parameters:**

- `canvas` — an `HTMLCanvasElement` (e.g. from `document.getElementById`)
- `fragmentShader` — a function that receives `FragmentParameters` and returns a `vec4f` color. Must contain a `'use gpu'` directive.

**Returns** an object with:

- `render()` — renders a single frame. Use this if you want to implement your own rendering trigger.
- `startRendering()` — start a continuous rendering loop with `requestAnimationFrame`.
- `stopRendering()` — stop the continuous rendering loop.
- `dispose()` — stop rendering and clean up all resources and event listeners.

### `FragmentParameters`

The struct passed to your fragment shader function, with these fields:

| Field         | Type    | Description                                  |
| ------------- | ------- | -------------------------------------------- |
| `uv`          | `vec2f` | Clip-space coordinates (-1 to 1)             |
| `xy`          | `vec2f` | Pixel coordinates                            |
| `time`        | `f32`   | Elapsed time in seconds since page load      |
| `mouse`       | `Mouse` | Mouse state (see below)                      |
| `resolution`  | `vec2f` | Canvas resolution in pixels                  |
| `aspectRatio` | `f32`   | Canvas aspect ratio (width / height)         |

#### `Mouse`

| Field    | Type    | Description                                |
| -------- | ------- | ------------------------------------------ |
| `xy`     | `vec2f` | Position in pixels on the canvas           |
| `uv`     | `vec2f` | Position in clip-space (-1 to 1)           |
| `isOver` | `i32`   | 1 if the mouse is over the canvas, else 0  |
| `down`   | `i32`   | 1 if the left mouse button is down, else 0 |

## Notes

- This module uses top-level `await` for WebGPU initialization, so it must be imported as an ES module.
- Call `dispose()` when you're done with a shader canvas to stop rendering and remove event listeners.


## TODO

- [x] Mouse tracking
- [x] Implement cleanup and teardown support
- [ ] Easier declaration of a custom data buffer
- [ ] Performance reporting
- [ ] More examples
- [x] Hosted examples
- [ ] Better handling when WebGPU is not supported
