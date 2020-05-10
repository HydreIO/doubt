import equal from 'fast-deep-equal'
import util from 'util'
import 'colors'

const default_assertion = {
  that   : 'that is not defined'.bgRed.white.bold,
  should : 'should is not defined'.bgRed.white.bold,
  because: 'because is not defined'.bgRed.white.bold,
  is     : 'is is not defined'.bgRed.white.bold,
}
const inspect = object =>
  util.inspect(object, {
    showHidden: false,
    depth     : 2,
    colors    : true,
    compact   : true,
  })
const i_wanted = 'I wanted:'.white.italic
const to = 'to:'.white.italic
const but_found = 'but found:'.white.italic
const instead_of = 'instead of:'.white.italic
const blame = 'blame:'.white.italic

export default ({
  test_count, test_name, loop_index, tap, fails,
}) => ({
  that,
  should,
  because,
  is,
} = default_assertion) => {
  const test_is_correct = equal(because, is)
  const message = `${ test_count } - \
[${ `${ loop_index }`.yellow }] ${ test_name.italic.bold } - ${ that } \
${ `should`.blue.italic } ${ should }`

  if (test_is_correct) tap.log(`ok ${ message }`)
  else {
    fails()

    const [, , stack] = new Error().stack.split('at ')
    const found = `${ inspect(because) }`.bold
    const instead = `${ inspect(is) }`.bold
    const prepend_name = `[${ test_name }]`.bold
    const trace = stack
        .slice(stack.lastIndexOf('/'))
        .trim()
        .slice(1, -1)

    tap.log(`not ok ${ message }`)
    tap.group()
    tap.log('---')
    tap.log(`${ i_wanted } ${ that }`)
    tap.log(`${ to } ${ should }`)
    tap.log(`${ but_found } ${ found }`)
    tap.log(`${ instead_of } ${ instead }`)
    tap.log(`${ blame } ${ prepend_name } ${ trace }`)
    tap.log('...')
    tap.groupEnd()
  }
}
