import PassThrough from 'minipass'
import { Console } from 'console'
import Membrane, {
  k_cleanup, k_execute,
} from './membrane.js'

const FLUSH = 100

export default async function *(...suites) {
  if (suites.some(suite => typeof suite !== 'function'))
    throw new Error('All suites must be Classes')

  const stdout = new PassThrough()
  const tap = new Console({
    stdout,
    groupIndentation: 2,
  })
  const membrane = new Membrane(tap)

  tap.log('TAP version 13')

  for (const Suite of suites) {
    const SubSuites = membrane.isolate(Suite)

    await Promise.all(SubSuites.map(async SubSuite => {
      const sub_suite = new SubSuite()

      await sub_suite[k_execute]?.()
      await sub_suite[k_cleanup]?.()
    }))
  }

  tap.log(`1..${ membrane.test_count }`)
  process.on('beforeExit', async () => {
    stdout.end()
    await new Promise(resolve => setTimeout(resolve, FLUSH))
    process.exit(membrane.failed ? 1 : 0)
  })

  yield* stdout
}
