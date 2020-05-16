import affirmation from './affirm.js'
import { CallTracker } from 'assert'

export const k_cleanup = Symbol('cleanup')
export const k_execute = Symbol('execute')

const noop = () => {}
const race = timeout => {
  let timer = -1

  const promise = new Promise((
      _, reject,
  ) => {
    timer = setTimeout(
        () => {
          reject(new Error(`Too slow! the test took more than ${ timeout }ms`))
        },
        timeout,
    )
  })

  return {
    cancel: () => clearTimeout(timer),
    promise,
  }
}
const extract_functions = Clazz => {
  const properties = Object.getOwnPropertyNames(Clazz.prototype)
  const static_properties = Object.getOwnPropertyNames(Clazz)
  const functions = properties.filter(property => property !== 'constructor')
  const static_functions = static_properties.filter(property => {
    return typeof Clazz[property] === 'function'
  })

  return [...functions,
    ...static_functions]
}
const create_handle = ({
  loop_index,
  test_name,
  membrane,
  timeout,
}) => {
  const fail = error => {
    const begin = ''.reset.red
    const name = test_name.white.italic.bold.reset.red
    const unexpected_error = `${ begin }\
Unexpected error while executing [${ name }]`
    const head = `not ok ${ membrane.test_count++ } ${ unexpected_error }`

    membrane.fail()
    membrane.tap.log(head)
    membrane.tap.group()
    membrane.tap.log('---')
    membrane.tap.log(error)
    membrane.tap.log('...')
    membrane.tap.groupEnd()
  }

  return {
    construct(Target) {
      let cleanup = noop

      try {
        const suite = new Target(fn => {
          cleanup = fn
        })
        const test = suite[test_name] ?? Target[test_name]
        const tracker = new CallTracker()

        suite[k_cleanup] = async () => {
          try {
            await Reflect.apply(
                cleanup,
                suite,
                [],
            )

            const [untracked] = tracker
                .report()
                .filter(({
                  actual, expected,
                }) =>
                  actual !== expected)

            if (untracked) {
              const violation = 'Tracker violation'.yellow
                  .bold
              const arrow = '->'.white.bold
              const actual = `${ untracked.actual }`.yellow
                  .bold
              const expected = `${ untracked.expected }`
                  .yellow.bold
              const time
                = untracked.actual === 1 ? 'time' : 'times'

              throw `${ violation } ${ arrow } affirm was called \
${ actual } ${ time } instead of ${ expected }`
            }
          } catch (error) {
            fail(error)
          }
        }

        suite[k_execute] = async () => {
          try {
            const execution = async () =>
              Reflect.apply(
                  test,
                  suite,
                  [
                    affirmation({
                      increment_test: () =>
                        ++membrane.test_count,
                      test_name,
                      loop_index,
                      tap  : membrane.tap,
                      fails: membrane.fail.bind(membrane),
                      tracker,
                    }),
                  ],
              )
            const timed_out = race(timeout)

            await Promise.race([
              execution().then(timed_out.cancel),
              timed_out.promise,
            ])
          } catch (error) {
            fail(error)
          }
        }

        return suite
      } catch (error) {
        fail(error)
      }

      return Object.create(null)
    },
  }
}

export default class {
  test_count = 0
  failed = false

  constructor(tap) {
    this.tap = tap
  }

  fail() {
    if (!this.failed) this.failed = true
  }

  isolate(Suite) {
    const functions = extract_functions(Suite)
    const self = this
    const {
      name = 'unnamed',
      loop = 1,
      timeout = 50,
    } = Suite

    this.tap.log(`# ${ name } ${ `(x${ loop })`.yellow.bold }`)

    return Array.from({ length: loop })
        .fill(0)
        .flatMap((
            _, index,
        ) =>
          functions.map(test_name =>
            new Proxy(
                Suite,
                create_handle({
                  loop_index: index,
                  test_name,
                  membrane  : self,
                  timeout,
                }),
            )))
  }
}
