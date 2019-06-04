import * as _ from './'
import Doubt from '../src'

'Because'.doubt(async () => {
	'isTrue'.because(true).isTrue()
	'isUndefined'.because(undefined).isUndefined()
	'isDefined'.because('').isDefined()
	'isFalse'.because(false).isFalse()
	'isEqualTo'.because(1).isEqualTo(1)
	'isDeeplyEqualTo'.because({ a: { a: 1 } }).isDeeplyEqualTo({ a: { a: 1 } })
	'isAbove'.because(1).isAbove(0)
	'isBelow'.because(0).isBelow(1)
	'isBetween'.because(0).isBetween(0, 1)
	'isNaN'.because(NaN).isNaN()
	'isTypeOf'.because(1).isTypeOf('number')
	'hasKeys'.because({ e: NaN, b: 1 }).hasKeys(['e'])

	class A {}
	'isInstanceOf'.because(new A()).isInstanceOf(A)

	await 'succeeds'.because(async () => {}).succeeds()
	await 'fails'.because(async () => throw new Error()).fails()
})
