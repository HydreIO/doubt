export default class {
  static name = 'Testing is simple'
  static loop = 1

  static ['foo'](affirm) {
    affirm({
      that   : 'Roses',
      should : 'be red'.red.underline,
      because: 'red',
      is     : 'red',
    })
  }

  static ['bar'](affirm) {
    affirm({
      that   : 'Violets',
      should : 'be blue'.cyan.underline,
      because: 'blue',
      is     : 'blue',
    })
  }

  static ['baz'](affirm) {
    affirm({
      that   : 'doubt',
      should : `be awesome`,
      because: { amazing: true },
      is     : { amazing: true },
    })
  }

  static ['toz'](affirm) {
    affirm({
      that   : 'your tests',
      should : `be too`,
      because: { 'using doubt': true },
      is     : { 'using doubt': true },
    })
  }
}
