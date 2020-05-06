import '../src/doubt copy.js'

'Assertions'.doubt(async () => {
  'rose'
      .should('be red')
      .because('red')
      .is('red')

  'violet'
      .should('be blue')
      .because('blue')
      .is('blue')

  'one'
      .should('simply thanks god')
      .because({
        thanks: 'god',
        it    : {
          is: 'monday',
        },
      })
      .is({
        thanks: 'god',
        it    : {
          is: 'friday',
        },
      })
})
