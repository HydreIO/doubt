import Doubt from '../src'

const shire = { population: 150, hobbits: ['Frodo', 'Lobelia'] }
const lair = { owner: 'Batman', queer: 'Robbin' }

'In the seven kingdoms'.doubt(async () => {
	'Jon Snow is a Lord commander'.because('he is a virgin').isEqualTo('HE IS A VIRGIN' |> #.toLowerCase())

	'Ygritte is thick af'.because('What is dead may never die'.length).isAbove(0)

	await 'what do we say to the god of death'
		.because(async () => {
			await 1000 .ms()
			throw new Error('Not today')
		})
		.fails()

	'The iron throne is made from a thousand swords'.because(1000).isBetween(1000, 1000)
})