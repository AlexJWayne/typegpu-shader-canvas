import { highlight } from 'sugar-high'

import { runExample as runLookAt } from './look-at'
import lookAtSource from './look-at.ts?raw'
import { runExample as runRgbWaves } from './rgb-waves'
import rgbWavesSource from './rgb-waves.ts?raw'

const examples: Record<string, { run(): { dispose(): void }; source: string }> =
  {
    'rgb-waves': { run: runRgbWaves, source: rgbWavesSource },
    'look-at': { run: runLookAt, source: lookAtSource },
  }

const codeEl = document.getElementById('code')!
const tabsEl = document.getElementById('tabs')!

let current: { dispose: () => void } | null = null

function activate(name: string) {
  if (current) current.dispose()

  const example = examples[name]
  if (!example) return

  current = example.run()
  codeEl.innerHTML = highlight(
    example.source
      .replace(/^export function.*\n/m, '')
      .replace(/^.*return shaderCanvas\n/m, '')
      .replace(/^}\n/m, '')
      .replace(/^  /gm, ''),
  )

  for (const tab of tabsEl.querySelectorAll('.tab')) {
    tab.classList.toggle(
      'active',
      (tab as HTMLElement).dataset.example === name,
    )
  }
}

tabsEl.addEventListener('click', (e) => {
  const tab = (e.target as HTMLElement).closest('.tab') as HTMLElement | null
  if (!tab) return
  const name = tab.dataset.example
  if (name) activate(name)
})

activate('rgb-waves')
