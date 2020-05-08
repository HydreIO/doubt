import equal from 'fast-deep-equal'
import PassThrough from 'minipass'
import util from 'util'
import { Console } from 'console'
import 'colors'

const FLUSH = 100
const extract_functions = Clazz => {
  const {
    name = 'unnamed', loop = 1,
  } = Clazz
  const properties = Object.getOwnPropertyNames(Clazz.prototype)
  const static_properties = Object.getOwnPropertyNames(Clazz)
  const functions = properties.filter(property => property !== 'constructor')
  const static_functions = static_properties.filter(property => {
    return typeof Clazz[property] === 'function'
  })

  return {
    loop,
    name,
    functions: [...functions, ...static_functions],
  }
}
const inspect = object =>
  util.inspect(object, {
    showHidden: false,
    depth     : 2,
    colors    : true,
    compact   : true,
  })

export default async function *(...suites) {
  if (suites.some(suite => typeof suite !== 'function'))
    throw new Error('All suites must be Classes')

  let test = 0
  let failed = false

  const stdout = new PassThrough()
  const tap = new Console({
    stdout,
    groupIndentation: 2,
  })

  tap.log('TAP version 13')

  for (const Suite of suites) {
    const {
      name, loop: length, functions,
    } = extract_functions(Suite)

    tap.log(`# ${ name } ${ `(x${ length })`.yellow.bold }`)
    // useless we just get the index
    // eslint-disable-next-line guard-for-in
    for (const index in Array.from({ length })) {
      for (const test_name of functions) {
        // for the sake of simplicity
        // eslint-disable-next-line no-loop-func
        const affirm = ({
          that = 'that is not defined'.bgRed.white.bold,
          should = 'should is not defined'.bgRed.white.bold,
          because = 'because is not defined'.bgRed.white.bold,
          is = 'is is not defined'.bgRed.white.bold,
        }) => {
          test++

          const ok = equal(because, is)
          const message = `${ test } - [${ index }] ${ that } \
${ `should`.blue.italic } ${ should }`

          if (ok) tap.log(`ok ${ message }`)
          else {
            failed = true

            const [, , stack] = new Error().stack.split('at ')

            tap.log(`not ok ${ message }`)
            tap.group()
            tap.log('---')
            tap.log(`${ 'I wanted:'.white.italic } ${ that }`)
            tap.log(`${ 'to:'.white.italic } ${ should }`)
            tap.log(`${ 'but found:'.white.italic } \
${ `${ inspect(because) }`.bold }`)
            tap.log(`${ 'instead of:'.white.italic } \
${ `${ inspect(is) }`.bold }`)
            tap.log(`${ 'blame:'.white.italic } \
${ `[${ test_name }]`.bold } \
${ stack.slice(stack.lastIndexOf('/')).trim()
      .slice(1, -1) }`)
            tap.log('...')
            tap.groupEnd()
          }
        }

        // actually that's okay here as this is the only function of the package
        // eslint-disable-next-line max-depth
        try {
          const suite = new Suite()
          const func = suite[test_name] ?? Suite[test_name]

          await Reflect.apply(
              func, suite, [affirm],
          )
        } catch (error) {
          failed = true
          tap.log(`not ok ${ test++ } \
${ 'Unexpected error while executing suite'.bold }`)
          tap.group()
          tap.log('---')
          tap.log(`test: ${ test_name }`)
          tap.log(`error: ${ error }`)
          tap.log('...')
          tap.groupEnd()
        }
      }
    }
  }

  tap.log(`1..${ test }`)
  process.on('beforeExit', async () => {
    stdout.end()
    await new Promise(resolve => setTimeout(resolve, FLUSH))
    process.exit(failed ? 1 : 0)
  })

  yield* stdout
}
