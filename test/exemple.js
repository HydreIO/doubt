import Doubt from '../src/index.js'
import tap_spec from 'tap-spec-emoji'
import { pipeline } from 'stream'

pipeline(Doubt.stream(), tap_spec(), process.stdout, error => { if (error) console.log(error) })

const shire = { population: 150, hobbits: ['Frodo', 'Lobelia'] }
const lair = { owner: 'Batman', queer: 'Robbin' }

'Hydre/doubt'.doubt(() => {
	'is not vegan'.because(1).isEqualTo(1)
	'can fly'.because(1).isEqualTo('1')
	"is no diabeetus cat".because(() => { throw new Error('diabeetus intensifies') }).failsWith('hate sugar')
})

'The shire'.doubt(function testing() {

	'should contain many hobbits'.because(shire.population > 100).isTrue()

	"is Batman's lair".because(shire).isDeeplyEqualTo(lair)
})

'In the seven kingdoms'.doubt(async () => {

	await 500..ms()

	'Jon Snow is a Lord commander'.because('he is a virgin').isEqualTo('HE IS A VIRGIN'.toLowerCase())

	'Ygritte is thick af'.because('What is dead may never die'.length).isAbove(0)

	await 'what do we say to the god of death'
		.because(async () => {
			await 1000..ms()
			throw new Error('Not today')
		})
		.fails()

	await 'The iron throne is made from a thousand swords'.because(1000).isBetween(1000, async () => 1000)
})