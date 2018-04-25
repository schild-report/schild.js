'use strict'
const Knex = require('knex')
let knex
const { Model } = require('objection')
const {Schueler, Schule, Schuelerfoto, Versetzung} = require('./models/Models')
/*
Vorhandene Models:
Abschnitt, Fachklasse, Versetzung, Lehrer, Note, Fach, BKAbschluss, BKAbschlussFach, AbiAbschluss, AbiAbschlussFach,
FHRAbschluss, FHRAbschlussFach, Sprachenfolge, FachGliederung, Vermerk, Schuelerfoto, Schule, Nutzer
*/

let Schild = {
  suche: async function (pattern) {
    const schueler = await Schueler.query()
      .where(function () { this.where('Geloescht', '-').andWhere('Gesperrt', '-') })
      .andWhere(function () { this.where('Vorname', 'like', pattern + '%').orWhere('Name', 'like', pattern + '%') })
      .orderBy('AktSchuljahr', 'desc')
      .map(s => {
        return {
          value: `${s.Name}, ${s.Vorname} (${s.Klasse})`,
          status: s.Status,
          jahr: s.Jahr,
          id: s.ID
        }
      })
    const klasse = await Versetzung.query()
      .where('Klasse', 'like', pattern + '%')
      .orderBy('Klasse', 'desc')
      .map(k => {
        return { value: k.Klasse, id: k.Klasse }
      })
    return schueler.concat(klasse)
  },
  getSchueler: async function (id) {
    return Schueler.query()
      .where('ID', id)
      .eager('[abschnitte.[noten.fach, lehrer], fachklasse, versetzung, bk_abschluss, bk_abschluss_faecher.fach, fhr_abschluss, fhr_abschluss_faecher.fach, abi_abschluss, abi_abschluss_faecher.fach, vermerke]')
      .modifyEager('abschnitte', builder => { builder.orderBy('ID') })
      .first()
  },
  getKlasse: async function (klasse, jahr, abschnitt) {
    return Versetzung.query()
      .where('Klasse', klasse)
      // 2 = aktiv, 8 = mit Abschluss entlassen
      // .where(function() {
      //     this.where('Status', 2).orWhere('Status', 8)
      //   })
      .eager('[schueler.[abschnitte.[noten.fach, lehrer], bk_abschluss, bk_abschluss_faecher.fach, fhr_abschluss, fhr_abschluss_faecher.fach, abi_abschluss, abi_abschluss_faecher.fach, vermerke], fachklasse, jahrgang]')
      .modifyEager('schueler', builder => { builder.orderBy('Name') })
      .first()
  },
  getSchule: async function () {
    return Schule.query().first()
  },
  getSchuelerfoto: async function (id) {
    const data = await Schuelerfoto.query()
      .where('Schueler_ID', id).first()
    return Buffer.from(data.Foto, 'binary').toString('base64')
  }
}

module.exports = function (knexConfig, env = process.env.NODE_ENV) {
  if (knexConfig == null) knex.destroy()
  knex = Knex(knexConfig[env])
  Model.knex(knex)
  return Schild
}
