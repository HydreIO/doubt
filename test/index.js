import * as _ from './'
import Doubt from '../src'

'hydre/doubt is awesome'.doubt(async () => {
	'true isTrue'.because(true).isTrue()
	'undefined isUndefined'.because(undefined).isUndefined()
	'"" isDefined'.because('').isDefined()
	'false isFalse'.because(false).isFalse()
	'1 isEqualTo 1'.because(1).isEqualTo(1)
	'0 isNotEqualTo 1'.because(0).isNotEqualTo(1)
	'{ a: { a: 1 } } isDeeplyEqualTo { a: { a: 1 } }'.because({ a: { a: 1 } }).isDeeplyEqualTo({ a: { a: 1 } })
	'1 isAbove 0'.because(1).isAbove(0)
	'0 isBelow 1'.because(0).isBelow(1)
	'0 isBetween 0 and 1'.because(0).isBetween(0, 1)
	'NaN isNaN'.because(NaN).isNaN()
	'1 isTypeOf number'.because(1).isTypeOf('number')
	'{ e: NaN, b: 1 } hasKeys ["e"]'.because({ e: NaN, b: 1 }).hasKeys(['e'])

	class A { }
	'new A() isInstanceOf class A {}'.because(new A()).isInstanceOf(A)

	await 'a promise succeeds'.because(async () => { }).succeeds()
	await 'a throw fails'.because(async () => { throw new Error() }).fails()
})

Doubt.onEnd(() => { console.log('onEnd called!') })