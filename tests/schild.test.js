import Schild from '../dist/schild.esm'
const connectionString = {
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

const schild = new Schild
schild.connect(connectionString)

afterAll(() => {
  schild.disconnect()
})

describe('schild Methoden', () => {
  test('connection test', async () => {
    expect.assertions(1)
    expect(await schild.testConnection()).toBeTruthy()
  })
  test('getter models returns instance of test', async () => {
    expect.assertions(1)
    const Schueler = await schild.models.Schueler
    expect(new Schueler).toBeInstanceOf(Schueler)
  })
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
  test('getNutzer', async () => {
    expect.assertions(1)
    expect(await schild.getNutzer('hmt')).toHaveProperty('US_Privileges', '$')
  })
})
