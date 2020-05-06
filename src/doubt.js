/* eslint-disable no-extend-native */
import tap from './tap.js'
import equal from 'fast-deep-equal'
import util from 'util'
import 'colors'
import stream from 'stream'

const pipeline = util.promisify(stream.pipeline)
const WAIT_BEFORE_EXIT = 100
const inspect = object =>
  util.inspect(object, {
    showHidden: false,
    depth     : 2,
    colors    : true,
    compact   : true,
  })

class Doubt {
  #suites = new Set()
  only
  stdout = true

  constructor() {
    const suites = this.#suites
    const self = this

    String.prototype.doubt = async function(fn) {
      suites.add({
        fn,
        title: this,
      })
    }

    String.prototype.only = async function(fn) {
      self.only = {
        fn,
        title: this,
      }
    }

    String.prototype.should = function(should) {
      const second = 2
      const where = new Error().stack.split('at ')[second].trim()
      const given = this
      return {
        because(actual) {
          return {
            is(expected) {
              tap.test(
                  `${ given } ${ `should`.blue.italic } ${ should }`,
                  equal(actual, expected),
                  {
                    'I wanted'  : given,
                    'to'          : should,
                    'but found' : `${ `${ inspect(actual) }`.bold }`,
                    'instead of': `${ `${ inspect(expected) }`.bold }`,
                    'blame'       : where,
                  },
              )
            },
          }
        },
      }
    }
  }

  stream() {
    this.stdout = false
    return tap.stream()
  }

  async run() {
    try {
      tap.version()
      if (this.only) {
        const {
          fn, title,
        } = this.only
        tap.title(title)
        await fn()
      } else {
        for (const {
          fn, title,
        } of this.#suites) {
          tap.title(title)
          await fn()
        }
      }

      tap.end()
      await new Promise(resolve => setTimeout(resolve, WAIT_BEFORE_EXIT))
    } catch (error) {
      console.error(error)
      // it's a cli
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1)
    }
  }

  async onStart(fn) {
    this.on_start = async () => fn()
  }

  async onEnd(fn) {
    this.on_end = async () => fn()
  }
}

const doubt = new Doubt()

process.on('beforeExit', async () => {
  await doubt.on_start?.()
  await doubt.run()
  if (doubt.stdout) await pipeline(tap.stream(), process.stdout)
  await doubt.on_end?.({
    total : tap.tests,
    passed: tap.pass,
  })
  process.exit(tap.shouldFail ? 1 : 0)
})

export default doubt
