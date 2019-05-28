import Tap from './Tap'
import path from 'path'
import csite from 'callsites'
import equal from 'fast-deep-equal'
import util from 'util'
import 'colors'

const DOUBT = 'DOUBT'
const IS_TRUE = 'IS_TRUE'
const IS_FALSE = 'IS_FALSE'
const IS_EQUAL = 'IS_EQUAL'
const IS_DEEPLY_EQUAL = 'IS_DEEPLY_EQUAL'
const IS_ABOVE = 'IS_ABOVE'
const IS_BELOW = 'IS_BELOW'
const IS_BETWEEN = 'IS_BETWEEN'
const SUCCEEDS = 'SUCCEEDS'
const FAILS = 'FAILS'

// TODO
// INSTEAD OF AWAIT DIRECT DANS DOUBT LA CALLBACK QUI INIT LES TESTS
// LA SAVE AVEC FN EN TANT QUE KEY ET AVEC LE TITRE POUR DISPLAY PLUS TARD
// CA POURRA AUSSI SERVIR POUR L'ASYNC MODE
// CAR LA LES TESTS ASYNC SONT SHOWN AU MAUVAIS ENDROIT

class Doubt {
	#tests = new Map()
	#doubts = new Set()

	constructor() {
		const getSet = ::this.#getSet
		const doubts = this.#doubts

		String.prototype.doubt = async function(fn) {
			doubts.add({ fn, title: this, file: csite()[1] |> #.getFileName() |> path.basename })
		}

		String.prototype.because = function(a) {
			const s = csite()[1] |> #.getFileName() |> path.basename |> getSet
			const add = payload => 
				({ title: this, a, err: new Error().stack.split('at ')[3].trim() })
				|> Object.assign(#, payload)
				|> s.add
			return {
				isTrue() {
					add({ type: IS_TRUE })
				},
				isFalse() {
					add({ type: IS_FALSE })
				},
				isEqualTo(b) {
					add({ type: IS_EQUAL, b })
				},
				isDeeplyEqualTo(b) {
					add({ type: IS_DEEPLY_EQUAL, b })
				},
				isAbove(b) {
					add({ type: IS_ABOVE, b })
				},
				isBelow(b) {
					add({ type: IS_BELOW, b })
				},
				isBetween(b, c) {
					add({ type: IS_BETWEEN, b, c })
				},
				succeeds() {
					add({ type: SUCCEEDS })
				},
				fails() {
					add({ type: FAILS })
				}
			}
		}
	}

	#getSet(filename) {
		return this.#tests.get(filename) || this.#tests.set(filename, new Set()).get(filename)
	}

	async execute() {
		for (let { fn, title, file } of this.#doubts) {
			this.#getSet(file).add({ type: DOUBT, title })
			await fn()
		}
	}

	async *run() {
		yield Tap.version
		for (let [file, set] of this.#tests.entries()) {
			yield `\n${'RUN..'.bold.black.bgYellow} ${file.white.bold.underline}`
			for (let t of set) {
				const { title, type } = t
				switch (type) {
					case DOUBT:
						yield Tap.title(title)
						break
					case IS_TRUE:
						yield Tap.test(title, !!t.a, {
							why: `${`${!!t.a}`.bold.red} should be strictly true`,
							at: t.err
						})
						break
					case IS_FALSE:
						yield Tap.test(title, !t.a, {
							why: `${`${!t.a}`.bold.red} should be strictly false`,
							at: t.err
						})
						break
					case IS_EQUAL:
						yield Tap.test(title, t.a === t.b, {
							why: `${`${t.a}`.red.bold} should be strictly equal to ${(t.b + '').green.bold}`,
							at: t.err
						})
						break
					case IS_DEEPLY_EQUAL:
						yield Tap.test(title, equal(t.a, t.b), {
							why: `${'actual'.red.bold} should be deeply equal to ${'expect'.green.bold}`,
							actual: inspect(t.a).bold,
							expect: inspect(t.b).bold,
							at: t.err
						})
						break
					case IS_ABOVE:
						yield Tap.test(title, t.a > t.b, {
							why: `${`${t.a}`.bold.red} should be above ${`${t.b}`.bold.green}`,
							at: t.err
						})
						break
					case IS_BELOW:
						yield Tap.test(title, t.a < t.b, {
							why: `${`${t.a}`.bold.red} should be below ${`${t.b}`.bold.green}`,
							at: t.err
						})
						break
					case IS_BETWEEN:
						yield Tap.test(title, t.a >= t.b && t.a <= t.c, {
							why: `${`${t.a}`.bold.red} should be inclusively in between ${
								`${t.b}`.bold.green
							} and ${`${t.c}`.bold.blue}`,
							at: t.err
						})
						break
					case SUCCEEDS:
						if (!t.a instanceof Promise) throw new Error(`${t.a} is not a promise`)
						try {
							if (typeof t.a === 'function') await t.a()
							else await t.a
							yield Tap.test(title, true)
						} catch (e) {
							yield Tap.test(title, false, {
								why: `${`promise`.bold.red} rejected with an error`,
								cause: e?.message.magenta.bold ?? '',
								at: t.err
							})
						}
						break
					case FAILS:
						if (!t.a instanceof Promise) throw new Error(`${t.a} is not a promise`)
						try {
							if (typeof t.a === 'function') await t.a()
							else await t.a
							yield Tap.test(title, false, {
								why: `${`promise`.bold.red} didn't rejected anything`,
								at: t.err
							})
						} catch (e) {
							yield Tap.test(title, true)
						}
						break
				}
			}
		}
		yield Tap.end
	}

}

function inspect(obj) {
	return util.inspect(obj, {
		showHidden: false,
		depth: 2,
		colors: true
	})
}

const doubt = new Doubt()

process.on('beforeExit', async () => {
	await doubt.execute()
	for await (let d of doubt.run()) d |> console.log
	process.exit()
})

export default doubt
