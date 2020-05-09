import affirmation from './affirm.js'

export const k_cleanup = Symbol('cleanup')
export const k_execute = Symbol('execute')

const noop = () => {}
const unexpected_error = 'Unexpected error while executing suite'.bold
const extract_functions = Clazz => {
  const properties = Object.getOwnPropertyNames(Clazz.prototype)
  const static_properties = Object.getOwnPropertyNames(Clazz)
  const functions = properties.filter(property => property !== 'constructor')
  const static_functions = static_properties.filter(property => {
    return typeof Clazz[property] === 'function'
  })

  return [...functions, ...static_functions]
}
const create_handle = (
    loop_index, test_name, membrane,
) => ({
  construct(Target) {
    let cleanup = noop

    const suite = new Target(fn => {
      cleanup = fn
    })
    const test = suite[test_name] ?? Target[test_name]

    suite[k_cleanup] = cleanup
    suite[k_execute] = async () => {
      try {
        await Reflect.apply(
            test, suite, [
              affirmation({
                test_count: ++membrane.test_count,
                test_name,
                loop_index,
                tap       : membrane.tap,
                fails     : membrane.fail.bind(membrane),
              }),
            ],
        )
      } catch (error) {
        const head = `not ok ${ this.test_count++ } ${ unexpected_error }`

        membrane.fail()
        membrane.tap.log(head)
        membrane.tap.group()
        membrane.tap.log('---')
        membrane.tap.log(`test: ${ test_name }`)
        membrane.tap.log(`error: ${ error }`)
        membrane.tap.log('...')
        membrane.tap.groupEnd()
      }
    }

    return suite
  },
})

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
      name = 'unnamed', loop = 1,
    } = Suite

    this.tap.log(`# ${ name } ${ `(x${ loop })`.yellow.bold }`)

    return Array.from({ length: loop })
        .fill(0)
        .flatMap((_, index) =>
          functions.map(test_name => new Proxy(Suite, create_handle(
              index, test_name, self,
          ))))
  }
}
