import { PassThrough } from 'stream'

class Tap {
  tests = 0
  pass = 0
  #failed
  #stream = new PassThrough()

  log(string) {
    this.#stream.write(`${ string }\n`)
  }

  stream() {
    return this.#stream
  }

  version() {
    this.log('TAP version 13')
  }

  title(h1) {
    this.log(`# ${ h1 }`)
  }

  test(
      title, ok, error,
  ) {
    this.tests++

    const message = `${ this.tests } ${ title }`

    if (ok) {
      this.pass++
      this.log(`ok ${ message }`)
    } else {
      this.#failed = true
      this.log(`not ok ${ message }
  ---
  ${ Object.entries(error)
      .map(([key, value]) => `${ `${ key }:`.white.italic } ${ value }\n  `)
      .join('')
      .trim() }
  ...`)
    }
  }

  end() {
    this.log(`1..${ this.tests }`)
    this.#stream.end()
  }

  get shouldFail() {
    return this.#failed
  }
}

export default new Tap()
