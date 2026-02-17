import { highlight } from 'sugar-high'

import './example'
import source from './example.ts?raw'

document.getElementById('code')!.innerHTML = highlight(source)
