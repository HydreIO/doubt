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
    tap.version()
    if (this.only) {
      this.#suites.clear()
      this.#suites.add(this.only)
    }

    for (const suite of this.#suites) {
      const {
        fn, title,
      } = suite

      tap.title(title)
      try {
        await fn()
      } catch (error) {
        tap.test(
            'Unexpected error while executing the suite',
            false,
            { blame: error },
        )
      }
    }

    tap.end()
    await new Promise(resolve => setTimeout(resolve, WAIT_BEFORE_EXIT))
  }

  async onStart(fn) {
    this.on_start = async () => fn()
  }

  async onEnd(fn) {
    this.on_end = async () => fn()
  }
}

const doubt = new Doubt()

let ran = 0

process.on('beforeExit', async () => {
  if (ran !== 0) {
    console.error(`[doubt] infinite loop detected, exiting. \
The node beforeExit event can't be called multiple times! beware`)
    process.exit(1)
  }

  ran++
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
