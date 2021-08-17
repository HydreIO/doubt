import { Console } from 'console'
import equal from 'fast-deep-equal'
import util from 'util'
import 'colors'

let failed = false

const suites = new Set()
const inspect = object =>
  util.inspect(object, {
    showHidden: false,
    depth     : 2,
    colors    : true,
    compact   : true,
  })
const expected = 'expected:'.white.italic
const but_found = 'but found:'.white.italic
const instead_of = 'instead of:'.white.italic
const blame = 'blame:'.white.italic
const fail = (tap, test_name, index, error) => {
  const begin = ''.reset.red
  const name = test_name.white.italic.bold.reset.red
  const unexpected_error = `${ begin }\
Unexpected error while executing [${ name }]`
  const head = `not ok ${ index } ${ unexpected_error }`

  failed = true
  tap.log(head)
  tap.group()
  tap.log('---')
  tap.log(error)
  tap.log('...')
  tap.groupEnd()
}

process.on('beforeExit', () => {
  suites.forEach(call_stats => {
    const {
      tap,
      stdout,
      title,
      calls,
      stats,
    } = call_stats()

    if (calls !== stats.called) {
      fail(
          tap,
          title,
          stats.called + 1,
          `Called ${ stats.called } times instead of ${ calls }`,
      )
    }

    stdout.end()
  })
  setImmediate(() => {
    process.exit(failed ? 1 : 0)
  })
})

export default ({
  title = 'Anonymous test',
  calls = 1,
  stdout = process.stdout,
} = {}) => {
  const tap = new Console({
    stdout,
    groupIndentation: 2,
  })
  const stats = {
    called : 0,
    started: Date.now(),
    ended  : Number.POSITIVE_INFINITY,
    call   : () => {
      stats.called++
      if (stats.called === calls) stats.ended = Date.now()
      return stats.called
    },
  }

  suites.add(() => ({
    tap,
    stdout,
    title,
    calls,
    stats,
  }))
  tap.log('TAP version 13')
  tap.log(`1..${ calls }`)
  tap.log(`# ${ title }`)

  return new Proxy(
      {},
      {
        get: (_, name) => ({ because, is } = {}) => {
          const message = `${ stats.call() } - ${ name }`

          if (equal(because, is)) tap.log(`ok ${ message }`)
          else {
            failed = true

            const [, , stack] = new Error('_').stack.split('at ')
            const found = `${ inspect(because) }`.bold
            const instead = `${ inspect(is) }`.bold
            const trace = stack
                .slice(stack.lastIndexOf('/'))
                .trim()
                .slice(1, -1)
            const prepend_trace = `${ trace }`.bold

            tap.log(`not ok ${ message }`)
            tap.group()
            tap.log('---')
            tap.log(`${ expected } ${ name }`)
            tap.log(`${ but_found } ${ found }`)
            tap.log(`${ instead_of } ${ instead }`)
            tap.log(`${ blame } ${ prepend_trace }`)
            tap.log('...')
            tap.groupEnd()
          }
        },
      },
  )
}
