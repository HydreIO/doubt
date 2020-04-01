import Tap from './Tap'
import path from 'path'
import csite from 'callsites'
import equal from 'fast-deep-equal'
import util from 'util'
import 'colors'

let only

class Doubt {
	#doubts = new Map()

	constructor() {
		const doubts = this.#doubts

		String.prototype.doubt = async function(fn) {
			const file = path.basename(csite()[1].getFileName())
			const set = doubts.get(file) || doubts.set(file, new Set()).get(file)
			set.add({ fn, title: this })
		}

		String.prototype.only = async function(fn) {
			const file = path.basename(csite()[1].getFileName())
			only = { file, fn, title: this }
		}

		String.prototype.because = function(a) {
			const at = new Error().stack.split('at ')[2].trim()
			const self = this
			return {
				isTrue() {
					Tap.test(self, !!a, {
						why: `${`${inspect(a)}`.bold.red} should be truthy`,
						at
					})
				},
				isUndefined() {
					Tap.test(self, a === undefined, {
						why: `${`${inspect(a)}`.bold.red} should be undefined`,
						at
					})
				},
				isDefined() {
					Tap.test(self, a !== undefined, {
						why: `${`${inspect(a)}`.bold.red} should be defined`,
						at
					})
				},
				isFalse() {
					Tap.test(self, !a, {
						why: `${`${inspect(a)}`.bold.red} should be falsy`,
						at
					})
				},
				isEqualTo(b) {
					Tap.test(self, a === b, {
						why: `${`${inspect(a)}`.red.bold} should be strictly equal to ${(inspect(b) + '').green.bold}`,
						at
					})
				},
				isNotEqualTo(b) {
					Tap.test(self, a !== b, {
						why: `${`${inspect(a)}`.red.bold} should not be equal to ${(inspect(b) + '').green.bold}`,
						at
					})
				},
				isDeeplyEqualTo(b) {
					Tap.test(self, equal(a, b), {
						why: `${'actual'.red.bold} should be deeply equal to ${'expect'.green.bold}`,
						actual: inspect(a).bold,
						expect: inspect(b).bold,
						at
					})
				},
				isAbove(b) {
					Tap.test(self, a > b, {
						why: `${`${inspect(a)}`.bold.red} should be above ${`${inspect(b)}`.bold.green}`,
						at
					})
				},
				isBelow(b) {
					Tap.test(self, a < b, {
						why: `${`${inspect(a)}`.bold.red} should be below ${`${inspect(b)}`.bold.green}`,
						at
					})
				},
				isBetween(b, c) {
					Tap.test(self, a >= b && a <= c, {
						why: `${`${inspect(a)}`.bold.red} should be inclusively in between ${`${inspect(b)}`.bold.green} and ${
							`${inspect(c)}`.bold.blue
							}`,
						at
					})
				},
				isNaN() {
					Tap.test(self, isNaN(a), {
						why: `${`${inspect(a)}`.bold.red} is not NaN`,
						at
					})
				},
				isTypeOf(b) {
					Tap.test(self, typeof a === b, {
						why: `${`${inspect(a)}`.bold.red} isn't typeOf ${`${inspect(b)}`.bold.green}`,
						at
					})
				},
				isInstanceOf(b) {
					Tap.test(self, a instanceof b, {
						why: `${`${inspect(a)}`.bold.red} isn't an instance of ${`${inspect(b)}`.bold.green}`,
						at
					})
				},
				hasKeys(b) {
					let missing = []
					for (let k of b)
						if (!a.hasOwnProperty(k)) missing.push(k)
					Tap.test(self, !missing.length, {
						why: `${`${inspect(a)}`.bold.red} is missing properties ${inspect(missing)}`,
						at
					})
				},
				async succeeds() {
					if (!a instanceof Promise) throw new Error(`${a} is not a promise`)
					try {
						if (typeof a === 'function') await a()
						else await a
						Tap.test(self, true)
					} catch (e) {
						Tap.test(self, false, {
							why: `${`promise`.bold.red} rejected with an error`,
							cause: e?.message.magenta.bold ?? '¯\\_(ツ)_/¯',
							a
						})
					}
				},
				async fails() {
					if (!a instanceof Promise) throw new Error(`${a} is not a promise`)
					try {
						if (typeof a === 'function') await a()
						else await a
						Tap.test(self, false, {
							why: `${`promise`.bold.red} didn't rejected anything`,
							at
						})
					} catch {
						Tap.test(self, true)
					}
				}
			}
		}
	}

	async run() {
		try {
			Tap.version()
			if (only) {
				const { file, fn, title } = only
				console.log(`# ${'___________________________________________'.yellow}
${'RUN..'.bold.black.bgYellow} (only) ${file.white.bold.underline}/${title.white.bold}`)
				Tap.title(title)
				await fn()
			} else {
				for (let [file, set] of this.#doubts.entries()) {
					console.log(`# ${'___________________________________________'.yellow}
${'RUN..'.bold.black.bgYellow} ${file.white.bold.underline}`)
					for (let { fn, title } of set) {
						Tap.title(title)
						await fn()
					}
				}
			}
			Tap.end()
		} catch (e) {
			console.error(e)
			process.exit(1)
		}
	}
}

function inspect(obj) {
	return util.inspect(obj, {
		showHidden: false,
		depth: 2,
		colors: true,
		compact: true
	})
}

const doubt = new Doubt()

process.on('beforeExit', async () => {
	await doubt.run()
	process.exit(Tap.shouldFail ? 1 : 0)
})

export default doubt
