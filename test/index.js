import doubt from '../src/index.js'
import reporter from 'tap-spec-emoji'
import Suite from './doubt.test.js'
import { pipeline } from 'stream'
;(async () => {
  pipeline(
      await doubt(Suite), reporter(), process.stdout, error => {
        if (error) console.error(error)
      },
  )
})()
