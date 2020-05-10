import affirmation from './affirm.js'

export const k_cleanup = Symbol('cleanup')
export const k_execute = Symbol('execute')

const noop = () => {}
const race = timeout =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Too slow! the test took more than ${ timeout }ms`))
    }, timeout)
  })
const extract_functions = Clazz => {
  const properties = Object.getOwnPropertyNames(Clazz.prototype)
  const static_properties = Object.getOwnPropertyNames(Clazz)
  const functions = properties.filter(property => property !== 'constructor')
  const static_functions = static_properties.filter(property => {
    return typeof Clazz[property] === 'function'
  })

  return [...functions, ...static_functions]
}
const create_handle = ({
  loop_index, test_name, membrane, timeout,
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

        suite[k_cleanup] = async () => {
          try {
            await Reflect.apply(
                cleanup, suite, [],
            )
          } catch (error) {
            fail(error)
          }
        }

        suite[k_execute] = async () => {
          try {
            const values = [
              Reflect.apply(
                  test, suite, [
                    affirmation({
                      increment_test: () => ++membrane.test_count,
                      test_name,
                      loop_index,
                      tap           : membrane.tap,
                      fails         : membrane.fail.bind(membrane),
                    }),
                  ],
              ),
            ]

            if (timeout) values.push(race(timeout))
            await Promise.race(values)
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
      name = 'unnamed', loop = 1, timeout = false,
    } = Suite

    this.tap.log(`# ${ name } ${ `(x${ loop })`.yellow.bold }`)

    return Array.from({ length: loop })
        .fill(0)
        .flatMap((_, index) =>
          functions.map(test_name =>
            new Proxy(Suite,
                create_handle({
                  loop_index: index,
                  test_name,
                  membrane  : self,
                  timeout,
                }))))
  }
}
