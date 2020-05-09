import casual from 'casual'

export default class {
  static name = 'Testing is simple'
  static loop = 1

  constructor(cleanup) {
    throw 1
    cleanup(async () => {
      throw 2
    })
  }

  static roses(affirm) {
    affirm({
      that   : 'Roses',
      should : 'be red'.red.underline,
      because: 'red',
      is     : 'red',
    })
  }

  static violets(affirm) {
    affirm({
      that   : 'Violets',
      should : 'be blue'.cyan.underline,
      because: 'blue',
      is     : 'blue',
    })
  }

  #awesome = () => casual.catch_phrase

  doubt(affirm) {
    throw 0
    affirm({
      that   : casual.country,
      should : `be a ${ this.#awesome() }`,
      because: { amazing: true },
      is     : { amazing: true },
    })
  }

  async ['use me'](affirm) {
    await new Promise(resolve => setTimeout(resolve, casual.integer(10, 100)))
    affirm({
      that   : casual.country,
      should : `be a ${ this.#awesome() }`,
      because: { 'using doubt': true },
      is     : { 'using doubt': true },
    })
  }
}
