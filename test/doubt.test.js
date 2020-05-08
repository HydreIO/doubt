import casual from 'casual'

export default class {
  static name = 'Testing is simple'
  static loop = 2

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
    affirm({
      that   : casual.country,
      should : `be a ${ this.#awesome() }`,
      because: { amazing: true },
      is     : { amazing: true },
    })
  }

  async ['use me'](affirm) {
    affirm({
      that   : casual.country,
      should : `be a ${ this.#awesome() }`,
      because: { 'using doubt': true },
      is     : { 'using doubt': false },
    })
  }
}
