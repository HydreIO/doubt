import Tap from './Tap'
import path from 'path'
import csite from 'callsites'
import equal from 'fast-deep-equal'
import util from 'util'
import 'colors'
import through2 from 'through2'

let only
const is_async = fn => fn?.constructor?.name === "AsyncFunction"
const to_promise = fn => new Promise(res => { fn().then(res) })

class Doubt {
  #doubts = new Map()

  constructor(stream = process.stdout) {
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
      const at = new Error().stack.split('at ')[2].trim()
      const self = this

      return {
        isTrue() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await value()
                Tap.test(self, !!value, {
                  why: `${`${inspect(value)}`.bold.red} should be truthy`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  a
                })
              }
            })
          }
          Tap.test(self, !!value, {
            why: `${`${inspect(value)}`.bold.red} should be truthy`,
            at
          })
        },
        isUndefined() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await value()
                Tap.test(self, value === undefined, {
                  why: `${`${inspect(value)}`.bold.red} should be undefined`,
                  at
                })
              } catch (e) {
                console.error(e)
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, value === undefined, {
            why: `${`${inspect(value)}`.bold.red} should be undefined`,
            at
          })
        },
        isDefined() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await value()
                Tap.test(self, value !== undefined, {
                  why: `${`${inspect(value)}`.bold.red} should be defined`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, value !== undefined, {
            why: `${`${inspect(value)}`.bold.red} should be defined`,
            at
          })
        },
        isFalse() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await value()
                Tap.test(self, !value, {
                  why: `${`${inspect(value)}`.bold.red} should be falsy`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, !value, {
            why: `${`${inspect(value)}`.bold.red} should be falsy`,
            at
          })
        },
        isEqualTo(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await value()
                if (is_async(b)) b = await b()
                Tap.test(self, value === b, {
                  why: `${`${inspect(value)}`.red.bold} should be strictly equal to ${(inspect(b) + '').green.bold}`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promises`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, value === b, {
            why: `${`${inspect(value)}`.red.bold} should be strictly equal to ${(inspect(b) + '').green.bold}`,
            at
          })
        },
        isNotEqualTo(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await value()
                if (is_async(b)) b = await b()
                Tap.test(self, value !== b, {
                  why: `${`${inspect(value)}`.red.bold} should not be equal to ${(inspect(b) + '').green.bold}`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, value !== b, {
            why: `${`${inspect(value)}`.red.bold} should not be equal to ${(inspect(b) + '').green.bold}`,
            at
          })
        },
        isDeeplyEqualTo(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await value()
                if (is_async(b)) b = await b()
                Tap.test(self, equal(value, b), {
                  why: `${'actual'.red.bold} should be deeply equal to ${'expect'.green.bold}`,
                  actual: inspect(value).bold,
                  expect: inspect(b).bold,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, equal(value, b), {
            why: `${'actual'.red.bold} should be deeply equal to ${'expect'.green.bold}`,
            actual: inspect(value).bold,
            expect: inspect(b).bold,
            at
          })
        },
        isAbove(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await value()
                if (is_async(b)) b = await b()
                Tap.test(self, value > b, {
                  why: `${`${inspect(value)}`.bold.red} should be above ${`${inspect(b)}`.bold.green}`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, value > b, {
            why: `${`${inspect(value)}`.bold.red} should be above ${`${inspect(b)}`.bold.green}`,
            at
          })
        },
        isBelow(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await value()
                if (is_async(b)) b = await b()
                Tap.test(self, value < b, {
                  why: `${`${inspect(value)}`.bold.red} should be below ${`${inspect(b)}`.bold.green}`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, value < b, {
            why: `${`${inspect(value)}`.bold.red} should be below ${`${inspect(b)}`.bold.green}`,
            at
          })
        },
        isBetween(b, c) {
          if (is_async(value) || is_async(b) || is_async(c)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await value()
                if (is_async(b)) b = await b()
                if (is_async(c)) c = await c()
                Tap.test(self, value >= b && value <= c, {
                  why: `${`${inspect(value)}`.bold.red} should be inclusively in between ${`${inspect(b)}`.bold.green} and ${`${inspect(c)}`.bold.blue}`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, value >= b && value <= c, {
            why: `${`${inspect(value)}`.bold.red} should be inclusively in between ${`${inspect(b)}`.bold.green} and ${`${inspect(c)}`.bold.blue}`,
            at
          })
        },
        isNaN() {
          if (is_async(value)) {
            return to_promise(async () => {
              try {
                value = await value()
                Tap.test(self, isNaN(value), {
                  why: `${`${inspect(value)}`.bold.red} is not NaN`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, isNaN(value), {
            why: `${`${inspect(value)}`.bold.red} is not NaN`,
            at
          })
        },
        isTypeOf(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await value()
                if (is_async(b)) b = await b()
                Tap.test(self, typeof value === b, {
                  why: `${`${inspect(value)}`.bold.red} isn't typeOf ${`${inspect(b)}`.bold.green}`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, typeof value === b, {
            why: `${`${inspect(value)}`.bold.red} isn't typeOf ${`${inspect(b)}`.bold.green}`,
            at
          })
        },
        isInstanceOf(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await value()
                if (is_async(b)) b = await b()
                Tap.test(self, value instanceof b, {
                  why: `${`${inspect(value)}`.bold.red} isn't an instance of ${`${inspect(b)}`.bold.green}`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          Tap.test(self, value instanceof b, {
            why: `${`${inspect(value)}`.bold.red} isn't an instance of ${`${inspect(b)}`.bold.green}`,
            at
          })
        },
        hasKeys(b) {
          if (is_async(value) || is_async(b)) {
            return to_promise(async () => {
              try {
                if (is_async(value)) value = await value()
                if (is_async(b)) b = await b()
                let missing = []
                for (let k of b)
                  if (!value.hasOwnProperty(k)) missing.push(k)
                Tap.test(self, !missing.length, {
                  why: `${`${inspect(value)}`.bold.red} is missing properties ${inspect(missing)}`,
                  at
                })
              } catch (e) {
                Tap.test(self, false, {
                  why: `${`promise`.bold.red} rejected with an error`,
                  cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
                  value
                })
              }
            })
          }
          let missing = []
          for (let k of b)
            if (!value.hasOwnProperty(k)) missing.push(k)
          Tap.test(self, !missing.length, {
            why: `${`${inspect(value)}`.bold.red} is missing properties ${inspect(missing)}`,
            at
          })
        },
        async succeeds() {
          if (!is_async(value)) throw new Error(`${value} is not an async function`)
          try {
            await value()
            Tap.test(self, true)
          } catch (e) {
            Tap.test(self, false, {
              why: `${`promise`.bold.red} rejected with an error`,
              cause: e?.message?.magenta?.bold ?? '¯\\_(ツ)_/¯',
              value
            })
          }
        },
        async fails() {
          if (!is_async(value)) throw new Error(`${value} is not an async function`)
          try {
            await value()
            Tap.test(self, false, {
              why: `${`promise`.bold.red} didn't rejected anything`,
              at
            })
          } catch {
            Tap.test(self, true)
          }
        }
      }
    }
  }

  createStream() {
    Tap.stream = through2()
    return Tap.stream
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
  await doubt?.on_end?.({ total: Tap.tests, passed: Tap.pass })
  process.exit(Tap.shouldFail ? 1 : 0)
})

export default doubt
