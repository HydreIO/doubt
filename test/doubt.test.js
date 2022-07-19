import { pipeline, PassThrough } from 'stream'

import reporter from 'tap-spec-emoji'

import Doubt from '../src/index.js'

const through = new PassThrough()

pipeline(through, reporter(), process.stdout, () => {})

const doubt = Doubt({
  stdout: through,
  title: 'Testing is simple',
  calls: 4,
})

doubt['Roses are red']({
  because: 'red',
  is: 'red',
})

doubt['Violets are blue']({
  because: 'blue',
  is: 'blue',
})

doubt['Doubt is awesome']({
  because: { amazing: true },
  is: { amazing: true },
})

doubt['Your tests should be too']({
  because: { 'using doubt': true },
  is: { 'using doubt': true },
})
