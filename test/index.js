import '../src/doubt.js'

'Testing is simple'.doubt(() => {
  'roses'
      .should('be %s', 'red'.red.underline)
      .because('red')
      .is('red')

  'violets'
      .should('be %s', 'blue'.cyan.underline)
      .because('blue')
      .is('blue')

  'this library'
      .should('be amazing')
      .because({ amazing: true })
      .is({ amazing: true })

  'your test'
      .should('be amazing too')
      .because({ 'using doubt': true })
      .is({ 'using doubt': true })
})
