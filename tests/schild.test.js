const schild = require('../schild')
schild.connect({
  testing: {
    client: 'mysql',
    useNullAsDefault: true,
    connection: {
      host: 'localhost',
      database: 'schild_berufskolleg',
      user: 'schild',
      password: 'schild',
      charset: 'utf8'
    }
  }
}, 'testing')

afterAll(() => {
  schild.disconnect()
})

describe('schild Methoden', () => {
  test('suche', async () => {
    expect.assertions(2)
    expect((await schild.suche('C1'))[0]).toHaveProperty('id')
    expect((await schild.suche('Denise'))[0]).toHaveProperty('id')
  })
  test('getSchueler', async () => {
    expect.assertions(2)
    expect(await schild.getSchueler(1942)).toHaveProperty('ID', 1942)
    expect((await schild.getSchueler(1623)).abschnitte).toHaveLength(4)
  })
  test('getKlasse', async () => {
    expect.assertions(2)
    expect((await schild.getKlasse('C16A2')).schueler).toHaveLength(27)
    expect((await schild.getKlasse('C16A2')).schueler[0]).toHaveProperty('ID', 1942)
  })
  test('getSchule', async () => {
    expect.assertions(1)
    expect(await schild.getSchule()).toHaveProperty('Ort', 'Bielefeld')
  })
  test('getSchuelerfoto', async () => {
    expect.assertions(1)
    expect(await schild.getSchuelerfoto(1234)).toContain('/9j/4')
  })
})
