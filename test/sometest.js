import Doubt from '../src'

const shire = { population: 1, hobbits: ['Frodo', 'Lobelia'] }
const lair = { owner: 'Batman', queer: 'Robbin' }

'The shire'.doubt(async () => {
	await 500 .ms()
	'should contain many hobbits'.because(shire.population > 100).isTrue()

	// "is Batman's lair".because(shire).isDeeplyEqualTo(lair)
})

'Oh Боже'.doubt(()=> {
	NaN
		|> 'is not a number'.because(#)
		|> #.isNaN()
})