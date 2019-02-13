import Schild from '../dist/schild.esm'
const connectionString = {
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
}

const schild = new Schild
schild.connect(connectionString, 'testing')

const {Schueler, Abschnitt, Fachklasse, Versetzung, Lehrer, Note, Fach, BKAbschluss, BKAbschlussFach, AbiAbschluss, AbiAbschlussFach,
  FHRAbschluss, FHRAbschlussFach, Sprachenfolge, FachGliederung, Vermerk, Schuelerfoto, Schule, Nutzer, Jahrgang} = require('../models/Models')

afterAll(() => {
  schild.disconnect()
})

describe('Schüler Model', () => {
  test('Schueler wird gefunden', async () => {
    expect.assertions(1)
    await expect(Schueler.query().where('ID', 1).first()).resolves.toBeInstanceOf(Schueler)
  })
  test('akt_halbjahr geht nicht', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 1).first()
    expect(s.akt_halbjahr).toBeUndefined()
  })
  test('Anrede geht', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 1).first()
    expect(s.anrede).toEqual('Frau')
  })
  test('Schüler_in geht', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 1).first()
    expect(s.schueler_in).toEqual('Schülerin')
  })
  test('Studierende_r geht', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 1).first()
    expect(s.studierende_r).toEqual('Studierende')
  })
  test('berufsbezeichnung_mw geht', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 1).eager('fachklasse').first()
    expect(s.berufsbezeichnung_mw).toEqual('Staatlich anerkannte Erzieherin - praxisintegrierte Form')
  })
  test('berufsbezeichnung_mw geht nicht', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 1).first()
    expect(s.berufsbezeichnung_mw).toEqual('Keine Fachklasse zugeordnet')
  })
  test('volljährig geht', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 1).first()
    expect(s.volljaehrig).toEqual(true)
  })
  test('volljährig_bei geht', async () => {
    expect.assertions(2)
    const s = await Schueler.query().where('ID', 1).first()
    expect(s.volljaehrig_bei('August 19, 2015 23:15:30')).toEqual(true)
    expect(s.volljaehrig_bei('August 19, 1996 23:15:30')).toEqual(true)
  })
  test('Schüler-Relations werden gefunden', async () => {
    expect.assertions(4)
    const s = await Schueler.query().where('ID', 995).eager('[abschnitte, fachklasse, bk_abschluss, bk_abschluss_faecher]').first()
    expect(s.abschnitte[0]).toBeInstanceOf(Abschnitt)
    expect(s.fachklasse).toBeInstanceOf(Fachklasse)
    expect(s.bk_abschluss).toBeInstanceOf(BKAbschluss)
    expect(s.bk_abschluss_faecher[0]).toBeInstanceOf(BKAbschlussFach)
  })
  test('Abi-Relations werden gefunden', async () => {
    expect.assertions(2)
    const s = await Schueler.query().where('ID', 279).eager('[abi_abschluss, abi_abschluss_faecher]').first()
    expect(s.abi_abschluss).toBeInstanceOf(AbiAbschluss)
    expect(s.abi_abschluss_faecher[0]).toBeInstanceOf(AbiAbschlussFach)
  })
  test('FHR-Relations werden gefunden', async () => {
    expect.assertions(2)
    const s = await Schueler.query().where('ID', 120).eager('[fhr_abschluss, fhr_abschluss_faecher]').first()
    expect(s.fhr_abschluss).toBeInstanceOf(FHRAbschluss)
    expect(s.fhr_abschluss_faecher[0]).toBeInstanceOf(FHRAbschlussFach)
  })
  test('Sprachenfolge-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 8).eager('sprachenfolgen').first()
    expect(s.sprachenfolgen[0]).toBeInstanceOf(Sprachenfolge)
  })
  test('Schuelerfoto-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 34).eager('schuelerfoto').first()
    expect(s.schuelerfoto).toBeInstanceOf(Schuelerfoto)
  })
  test('Vermerk-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 341).eager('vermerke').first()
    expect(s.vermerke[0]).toBeInstanceOf(Vermerk)
  })
  test('Versetzung-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 341).eager('versetzung').first()
    expect(s.versetzung).toBeInstanceOf(Versetzung)
  })
})

describe('Abschnitt-Model', () => {
  test('Abschnitt-Relations werden gefunden', async () => {
    expect.assertions(3)
    const s = await Schueler.query().where('ID', 995).eager('abschnitte.[lehrer, fachklasse, noten]').first()
    expect(s.abschnitte[0].lehrer).toBeInstanceOf(Lehrer)
    expect(s.abschnitte[0].fachklasse).toBeInstanceOf(Fachklasse)
    expect(s.abschnitte[0].noten[0]).toBeInstanceOf(Note)
  })
  test('V. Name des Klassenlehrers', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 1995).eager('abschnitte.[lehrer]').first()
    expect(s.abschnitte[0].v_name_klassenlehrer).toContain('B. De')
  })
  test('Klassenlehrer oder Klassenlehrerin', async () => {
    expect.assertions(2)
    const s = await Schueler.query().where('ID', 2405).eager('abschnitte.[lehrer]').first()
    expect(s.abschnitte[0].klassenlehrer_in).toEqual('Klassenlehrerin')
    const ss = await Schueler.query().where('ID', 1598).eager('abschnitte.[lehrer]').first()
    expect(ss.abschnitte[0].klassenlehrer_in).toEqual('Klassenlehrer')
  })
  test('Schuljahr im Format 2015/16 ausgeben', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 995).eager('abschnitte').first()
    expect(s.abschnitte[0].schuljahr).toEqual('2014/15')
  })
})

describe('Note-Model', () => {
  test('Note-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 995).eager('abschnitte.noten.fach').first()
    expect(s.abschnitte[0].noten[0].fach).toBeInstanceOf(Fach)
  })
})

describe('Fachklasse-Model', () => {
  test('Fachgruppen-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 908).eager('fachklasse.fach_gliederungen').first()
    expect(s.fachklasse.fach_gliederungen[0]).toBeInstanceOf(FachGliederung)
  })
})

describe('Fach-Model', () => {
  test('Fach-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 908).eager('abschnitte.noten.fach.fach_gliederungen').first()
    expect(s.abschnitte[0].noten[0].fach.fach_gliederungen[0]).toBeInstanceOf(FachGliederung)
  })
})

describe('BKAbschlussFach-Model', () => {
  test('BKAbschlussFach-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 995).eager('bk_abschluss_faecher.fach').first()
    expect(s.bk_abschluss_faecher[0].fach).toBeInstanceOf(Fach)
  })
})

describe('AbiAbschlussFach-Model', () => {
  test('AbiAbschlussFach-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 279).eager('abi_abschluss_faecher.fach').first()
    expect(s.abi_abschluss_faecher[0].fach).toBeInstanceOf(Fach)
  })
})

describe('FHRAbschlussFach-Model', () => {
  test('FHRAbschlussFach-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 120).eager('fhr_abschluss_faecher.fach').first()
    expect(s.fhr_abschluss_faecher[0].fach).toBeInstanceOf(Fach)
  })
})

describe('Sprachenfolge-Model', () => {
  test('Sprachenfolge-Relations werden gefunden', async () => {
    expect.assertions(1)
    const s = await Schueler.query().where('ID', 8).eager('sprachenfolgen.fach').first()
    expect(s.sprachenfolgen[0].fach).toBeInstanceOf(Fach)
  })
})

describe('Versetzung-Model', () => {
  test('Versetzung-Relations werden gefunden', async () => {
    expect.assertions(4)
    const k = await Versetzung.query().where('Klasse', 'B15B2').eager('[schueler, fachklasse]').first()
    expect(k.schueler[0]).toBeInstanceOf(Schueler)
    expect(k.schueler).toHaveLength(18)
    expect(k.fachklasse).toBeInstanceOf(Fachklasse)
    expect(k.fachklasse.Bezeichnung).toEqual('Sozialassistent')
  })
})

describe('Schule Model', () => {
  test('Schulleiter_In geht', async () => {
    expect.assertions(1)
    const s = await Schule.query().where('ID', 1).first()
    expect(s.schulleiter_in).toEqual('Schulleiter')
  })
})

describe('alle Models durchtesten', () => {
  test('einmal checken', async () => {
    expect.assertions(20)
    expect(await Schueler.query().where('ID', 1).first()).toBeInstanceOf(Schueler)
    expect(await Abschnitt.query().where('ID', 17).first()).toBeInstanceOf(Abschnitt)
    expect(await Fachklasse.query().where('ID', 1).first()).toBeInstanceOf(Fachklasse)
    expect(await Jahrgang.query().where('ID', 5).first()).toBeInstanceOf(Jahrgang)
    expect(await Versetzung.query().where('ID', 5).first()).toBeInstanceOf(Versetzung)
    expect(await Lehrer.query().where('ID', 1).first()).toBeInstanceOf(Lehrer)
    expect(await Note.query().where('ID', 137).first()).toBeInstanceOf(Note)
    expect(await Fach.query().where('ID', 1).first()).toBeInstanceOf(Fach)
    expect(await BKAbschluss.query().where('Schueler_ID', 1).first()).toBeInstanceOf(BKAbschluss)
    expect(await BKAbschlussFach.query().where('ID', 40).first()).toBeInstanceOf(BKAbschlussFach)
    expect(await AbiAbschluss.query().where('ID', 1).first()).toBeInstanceOf(AbiAbschluss)
    expect(await AbiAbschlussFach.query().where('ID', 3204).first()).toBeInstanceOf(AbiAbschlussFach)
    expect(await FHRAbschluss.query().where('ID', 1).first()).toBeInstanceOf(FHRAbschluss)
    expect(await FHRAbschlussFach.query().where('ID', 3).first()).toBeInstanceOf(FHRAbschlussFach)
    expect(await Sprachenfolge.query().where('ID', 1).first()).toBeInstanceOf(Sprachenfolge)
    expect(await FachGliederung.query().where('Fach_ID', 216).first()).toBeInstanceOf(FachGliederung)
    expect(await Vermerk.query().where('ID', 1).first()).toBeInstanceOf(Vermerk)
    expect(await Schuelerfoto.query().where('Schueler_ID', 34).first()).toBeInstanceOf(Schuelerfoto)
    expect(await Schule.query().where('ID', 1).first()).toBeInstanceOf(Schule)
    expect(await Nutzer.query().where('ID', 1).first()).toBeInstanceOf(Nutzer)
  })
})

describe('JSON enthält alle virtuellen Properties', () => {
  test('alles durchchecken', async () => {
    expect.assertions(3)
    const s = await Schueler.query().where('ID', 995).eager('[abschnitte, fachklasse, bk_abschluss, bk_abschluss_faecher]').first()
    expect(s.toJSON().schueler_in).toEqual('Schülerin')
    expect(s.toJSON().anrede).toEqual('Frau')
    expect(s.toJSON().studierende_r).toEqual('Studierende')
  })
})
