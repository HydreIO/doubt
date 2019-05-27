'The shire'.doubt(async () => {
	const shire = { population: 150 }

	'should contain many hobbits'.false(shire.population < 100)
	'should have woods and fields and little rivers'.true(() => {
		const { woods, fields, rivers } = shire
		return woods && fields && rivers
	})
	await 'should always be at feast'.pass(async () => {})
	await 'should grow pipe weed'.reject(async () => throw new Error('no CBD allowed'))
})
                      