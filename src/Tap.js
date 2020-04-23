import { PassThrough } from 'stream'

class Tap {
  tests = 0
  pass = 0
  #failed
  #stream = new PassThrough()

  log(str) {
    this.#stream.write(`${str}\n`)
  }

  [Symbol.asyncIterator]() {
    return this.#stream[Symbol.asyncIterator]()
  }

  version() {
    this.log('TAP version 13')
  }

  title(h1) {
    this.log(`# ${h1}`)
  }

  test(title, ok, err) {
    this.tests++
    const msg = `${this.tests} ${title}`
    if (ok) {
      this.pass++
      this.log(`ok ${msg}`)
    } else {
      this.#failed = true
      this.log(`not ok ${msg}
  ---${toLiteral(toLines(Object.entries(err)))}
  ...`)
    }
  }

  end() {
    this.log(`1..${this.tests}`)
    this.#stream.end()
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