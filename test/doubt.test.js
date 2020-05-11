export default class {
  static name = 'Testing is simple'
  static loop = 1

  static ['foo'](affirmation) {
    const affirm = affirmation(1)

    affirm({
      that   : 'Roses',
      should : 'be red'.red.underline,
      because: 'red',
      is     : 'red',
    })
  }

  static ['bar'](affirmation) {
    const affirm = affirmation(1)

    affirm({
      that   : 'Violets',
      should : 'be blue'.cyan.underline,
      because: 'blue',
      is     : 'blue',
    })
  }

  static ['baz'](affirmation) {
    const affirm = affirmation(1)

    affirm({
      that   : 'doubt',
      should : `be awesome`,
      because: { amazing: true },
      is     : { amazing: true },
    })
  }

  static ['toz'](affirmation) {
    const affirm = affirmation(1)

    affirm({
      that   : 'your tests',
      should : `be too`,
      because: { 'using doubt': true },
      is     : { 'using doubt': true },
    })
  }
}
