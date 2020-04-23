import Tap from './Tap'
import path from 'path'
import csite from 'callsites'
import equal from 'fast-deep-equal'
import util from 'util'
import 'colors'
import stream from 'stream'

let only
const pipeline = util.promisify(stream.pipeline)
const AsyncFunction = Object.getPrototypeOf(async function() { }).constructor
const is_promise = fn => Promise.resolve(fn) === fn
const is_async = fn => fn instanceof AsyncFunction || is_promise(fn)
const to_promise = fn => new Promise(res => { fn().then(res) })

class Doubt {
  #doubts = new Map()
  stdout = true

  constructor() {
    const doubts = this.#doubts

    String.prototype.doubt = async function(fn) {
      const file = path.basename(csite()[1].getFileName())
      const set = doubts.get(file) || doubts.set(file, new Set()).get(file)
      set.add({ fn, title: this })
    }

    String.prototype.only = async function(fn) {
      const file = path.basename(csite()[1].getFileName())
      only = { file, fn, title: this }
    }

    String.prototype.because = function(value) {
      const where = new Error().stack.split('at ')[2].trim()
      const self = this
      const tap_fail = error => {
        if (!error.message) error.message = '~~this error has no message ¯\\_(ツ)_/¯'
        Tap.test(self, false, {
          why: `${'an error'.bold.red} was thrown`,
          cause: error?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
          where
        })
      }
      return {
        isTrue() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await (value instanceof AsyncFunction ? value() : value)
                Tap.test(self, !!value, {
                  why: `${`${inspect(value)}`.bold.red} should be truthy`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, !!value, {
            why: `${`${inspect(value)}`.bold.red} should be truthy`,
            where
          })
        },
        isUndefined() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await (value instanceof AsyncFunction ? value() : value)
                Tap.test(self, value === undefined, {
                  why: `${`${inspect(value)}`.bold.red} should be undefined`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, value === undefined, {
            why: `${`${inspect(value)}`.bold.red} should be undefined`,
            where
          })
        },
        isDefined() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await (value instanceof AsyncFunction ? value() : value)
                Tap.test(self, value !== undefined, {
                  why: `${`${inspect(value)}`.bold.red} should be defined`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, value !== undefined, {
            why: `${`${inspect(value)}`.bold.red} should be defined`,
            where
          })
        },
        isFalse() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await (value instanceof AsyncFunction ? value() : value)
                Tap.test(self, !value, {
                  why: `${`${inspect(value)}`.bold.red} should be falsy`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, !value, {
            why: `${`${inspect(value)}`.bold.red} should be falsy`,
            where
          })
        },
        isEqualTo(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await (value instanceof AsyncFunction ? value() : value)
                if (is_async(b)) b = await (b instanceof AsyncFunction ? b() : b)
                Tap.test(self, value === b, {
                  why: `${`${inspect(value)}`.red.bold} should be strictly equal to ${(inspect(b) + '').green.bold}`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, value === b, {
            why: `${`${inspect(value)}`.red.bold} should be strictly equal to ${(inspect(b) + '').green.bold}`,
            where
          })
        },
        isNotEqualTo(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await (value instanceof AsyncFunction ? value() : value)
                if (is_async(b)) b = await (b instanceof AsyncFunction ? b() : b)
                Tap.test(self, value !== b, {
                  why: `${`${inspect(value)}`.red.bold} should not be equal to ${(inspect(b) + '').green.bold}`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, value !== b, {
            why: `${`${inspect(value)}`.red.bold} should not be equal to ${(inspect(b) + '').green.bold}`,
            where
          })
        },
        isDeeplyEqualTo(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await (value instanceof AsyncFunction ? value() : value)
                if (is_async(b)) b = await (b instanceof AsyncFunction ? b() : b)
                Tap.test(self, equal(value, b), {
                  why: `${'actual'.red.bold} should be deeply equal to ${'expect'.green.bold}`,
                  actual: inspect(value).bold,
                  expect: inspect(b).bold,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, equal(value, b), {
            why: `${'actual'.red.bold} should be deeply equal to ${'expect'.green.bold}`,
            actual: inspect(value).bold,
            expect: inspect(b).bold,
            where
          })
        },
        isAbove(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await (value instanceof AsyncFunction ? value() : value)
                if (is_async(b)) b = await (b instanceof AsyncFunction ? b() : b)
                Tap.test(self, value > b, {
                  why: `${`${inspect(value)}`.bold.red} should be above ${`${inspect(b)}`.bold.green}`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, value > b, {
            why: `${`${inspect(value)}`.bold.red} should be above ${`${inspect(b)}`.bold.green}`,
            where
          })
        },
        isBelow(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await (value instanceof AsyncFunction ? value() : value)
                if (is_async(b)) b = await (b instanceof AsyncFunction ? b() : b)
                Tap.test(self, value < b, {
                  why: `${`${inspect(value)}`.bold.red} should be below ${`${inspect(b)}`.bold.green}`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, value < b, {
            why: `${`${inspect(value)}`.bold.red} should be below ${`${inspect(b)}`.bold.green}`,
            where
          })
        },
        isBetween(b, c) {
          if (is_async(value) || is_async(b) || is_async(c)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await (value instanceof AsyncFunction ? value() : value)
                if (is_async(b)) b = await (b instanceof AsyncFunction ? b() : b)
                if (is_async(c)) c = await (c instanceof AsyncFunction ? c() : c)
                Tap.test(self, value >= b && value <= c, {
                  why: `${`${inspect(value)}`.bold.red} should be inclusively in between ${`${inspect(b)}`.bold.green} and ${`${inspect(c)}`.bold.blue}`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, value >= b && value <= c, {
            why: `${`${inspect(value)}`.bold.red} should be inclusively in between ${`${inspect(b)}`.bold.green} and ${`${inspect(c)}`.bold.blue}`,
            where
          })
        },
        isNaN() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await (value instanceof AsyncFunction ? value() : value)
                Tap.test(self, isNaN(value), {
                  why: `${`${inspect(value)}`.bold.red} is not NaN`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, isNaN(value), {
            why: `${`${inspect(value)}`.bold.red} is not NaN`,
            where
          })
        },
        isTypeOf(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await (value instanceof AsyncFunction ? value() : value)
                if (is_async(b)) b = await (b instanceof AsyncFunction ? b() : b)
                Tap.test(self, typeof value === b, {
                  why: `${`${inspect(value)}`.bold.red} isn't typeOf ${`${inspect(b)}`.bold.green}`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, typeof value === b, {
            why: `${`${inspect(value)}`.bold.red} isn't typeOf ${`${inspect(b)}`.bold.green}`,
            where
          })
        },
        isInstanceOf(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await (value instanceof AsyncFunction ? value() : value)
                if (is_async(b)) b = await (b instanceof AsyncFunction ? b() : b)
                Tap.test(self, value instanceof b, {
                  why: `${`${inspect(value)}`.bold.red} isn't an instance of ${`${inspect(b)}`.bold.green}`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          Tap.test(self, value instanceof b, {
            why: `${`${inspect(value)}`.bold.red} isn't an instance of ${`${inspect(b)}`.bold.green}`,
            where
          })
        },
        hasKeys(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await (value instanceof AsyncFunction ? value() : value)
                if (is_async(b)) b = await (b instanceof AsyncFunction ? b() : b)
                let missing = []
                for (let k of b)
                  if (!value.hasOwnProperty(k)) missing.push(k)
                Tap.test(self, !missing.length, {
                  why: `${`${inspect(value)}`.bold.red} is missing properties ${inspect(missing)}`,
                  where
                })
              } catch (e) { tap_fail(e) }
            })
          }
          let missing = []
          for (let k of b)
            if (!value.hasOwnProperty(k)) missing.push(k)
          Tap.test(self, !missing.length, {
            why: `${`${inspect(value)}`.bold.red} is missing properties ${inspect(missing)}`,
            where
          })
        },
        pass() {
          if (typeof value !== 'function') throw new Error(`${value} is not a function`)
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                await (value instanceof AsyncFunction ? value() : value)
                Tap.test(self, true)
              } catch (e) { tap_fail(e) }
            })
          }
          try {
            value()
            Tap.test(self, true)
          } catch (e) { tap_fail(e) }
        },
        fails() {
          if (typeof value !== 'function') throw new Error(`${value} is not a function`)
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                await value()
                Tap.test(self, false, {
                  why: `${`nothing`.bold.red} was thrown`,
                  where
                })
              } catch (e) { Tap.test(self, true) }
            })
          }
          try {
            value()
            Tap.test(self, false, {
              why: `${`nothing`.bold.red} was thrown`,
              where
            })
          } catch { Tap.test(self, true) }
        },
        failsWith(b) {
          if (typeof value !== 'function') throw new Error(`${value} is not a function`)
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                // here it's always an async function
                await value()
                Tap.test(self, false, {
                  why: `${'nothing'.bold.red} was thrown`,
                  where
                })
              } catch (e) {
                if (is_async(b)) b = await b()
                if (e instanceof Error) e = e.constructor.name
                if (b instanceof Error) b = b.constructor.name
                Tap.test(self, e === b, {
                  why: `${`${inspect(e)}`.bold.magenta} is different from ${`${inspect(b)}`.bold.green}`,
                  where
                })
              }
            })
          }
          try {
            value()
            Tap.test(self, false, {
              why: `${'nothing'.bold.red} was thrown`,
              where
            })
          } catch (e) {
            if (e instanceof Error) e = e.constructor.name
            if (b instanceof Error) b = b.constructor.name
            Tap.test(self, e === b, {
              why: `${`${inspect(e)}`.bold.magenta} is different from ${`${inspect(b)}`.bold.green}`,
              where
            })
          }
        },
        failsWithMessage(b) {
          if (typeof value !== 'function') throw new Error(`${value} is not a function`)
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                // here it's always an async function
                await value()
                Tap.test(self, false, {
                  why: `${`nothing`.bold.red} was thrown`,
                  where
                })
              } catch (e) {
                if (is_async(b)) b = await b()
                Tap.test(self, e?.message === b, {
                  why: 'Messages are different',
                  found: `${inspect(e.message)}`.magenta.bold,
                  expect: `${b}`.green,
                  where
                })
              }
            })
          }
          try {
            value()
            Tap.test(self, false, {
              why: `${`nothing`.bold.red} was thrown`,
              where
            })
          } catch (e) {
            Tap.test(self, e?.message === b, {
              why: 'Messages are different',
              found: `${inspect(e.message)}`.magenta.bold,
              expect: `${b}`.green,
              where
            })
          }
        },
      }
    }
  }

  stream() {
    this.stdout = false
    return Tap
  }

  async run() {
    try {
      Tap.version()
      if (only) {
        const { file, fn, title } = only
        Tap.log(`# ${'___________________________________________'.yellow}
${'RUN..'.bold.black.bgYellow} (only) ${file.white.bold.underline}/${title.white.bold}`)
        Tap.title(title)
        if (is_async(fn)) await fn()
        else fn()
      } else {
        for (let [file, set] of this.#doubts.entries()) {
          Tap.log(`# ${'___________________________________________'.yellow}
${'RUN..'.bold.black.bgYellow} ${file.white.bold.underline}`)
          for (let { fn, title } of set) {
            Tap.title(title)
            if (is_async(fn)) await fn()
            else fn()
          }
        }
      }
      Tap.end()
      await 100..ms()
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }

  async onEnd(fn) {
    this.on_end = async () => fn()
  }
}

function inspect(obj) {
  return util.inspect(obj, {
    showHidden: false,
    depth: 2,
    colors: true,
    compact: true
  })
}

const doubt = new Doubt()

process.on('beforeExit', async () => {
  await doubt.run()
  if (doubt.stdout) await pipeline(Tap, process.stdout)
  await doubt.on_end?.({ total: Tap.tests, passed: Tap.pass })
  process.exit(Tap.shouldFail ? 1 : 0)
})

export default doubt
