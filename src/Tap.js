class Tap {
	#tests = 0
	#pass = 0
	#failed

	version() {
		console.log('TAP version 13')
	}

	title(h1) {
		console.log(`# ${h1}`)
	}

	test(title, ok, err) {
		this.#tests++
		const msg = `${this.#tests} ${title}`
		if (ok) console.log(`ok ${msg}`)
		else {
			this.#failed = true
			console.log(`not ok ${msg}
  ---${err |> Object.entries |> toLines |> toLiteral}
  ...`)
		}
	}

	end() {
		console.log(`1..${this.#tests}`)
	}

	get shouldFail() {
		return this.#failed
	}
}

function* toLines(entries) {
	for (let [key, val] of entries) yield `${`${key}`.italic}: ${val}`
}

function toLiteral(lines) {
	let res = ''
	for (const l of lines) res = `${res}\n    ${l}`
	return res
}

export default new Tap()
