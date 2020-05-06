import '../src/doubt.js'

'Testing is simple'.doubt(() => {
  'roses'
      .should('be red')
      .because('red')
      .is('red')

  'violets'
      .should('be blue')
      .because('blue')
      .is('blue')
})
