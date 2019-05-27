class Tap {
	#tests = 0
	#pass = 0
	#fail = 0

	version = 'TAP version 13'

	title(h1) {
		return `# ${h1}`
	}

	test(title, ok, err) {
		this.#tests++
		const msg = `${this.#tests} ${title}`
		if (ok) return `ok ${msg}`
		else
			return `not ok ${msg}
  ---${err |> Object.entries |> toLines |> toLiteral}
  ...`
	}

	get end() {
		return `1..${this.#tests}`
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
