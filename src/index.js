import Doubt from './doubt'

const shire = { population: 150, habitants: { hobbits: ['frodo'] } }
const compte = { population: 150, habitants: { hobbits: ['bilbo'] } }

'The shire'.doubt(async () => {
	'should contain many hobbits'.because(shire.population > 100).isTrue()
	'is exactly the same as la compte'.because(shire).isDeeplyEqualTo(compte)
})

'The many face god'.doubt(async () => {
	'should reject no one'.because(async () => {}).fails()
})

void (async function() {
	for await (let tap of Doubt.sync()) console.log(tap)
})()

// 	console.log('morray', 'morray 1'.true(true))
// 	console.log('hum')
// })

// process.on('exit', async () => {
// 	for (let d of Doubt.all()) await d.runSync()
// })
