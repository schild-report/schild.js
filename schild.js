'use strict'
import Knex from 'knex'
import { Model } from 'objection'
import * as Models from './models/Models'

/*
Vorhandene Models:
Abschnitt, Fachklasse, Versetzung, Lehrer, Note, Fach, BKAbschluss, BKAbschlussFach, AbiAbschluss, AbiAbschlussFach,
FHRAbschluss, FHRAbschlussFach, Sprachenfolge, FachGliederung, Vermerk, Schuelerfoto, Schule, Nutzer
*/

export default class Schild {
  constructor () {
    this.options = null
    this.knex = null
  }

  connect (knexConfig, env = process.env.NODE_ENV) {
    this.knex = Knex(knexConfig[env])
    Model.knex(this.knex)
    return this.knex
  }

  disconnect () {
    if (this.knex) this.knex.destroy()
  }

  async testConnection () {
    try {
      await knex.raw('select 1+1 as result')
      console.log('Testverbindung konnte aufgebaut werden')
      return true
    }
    catch(err) {
      console.log(err)
      console.log('Testverbindung konnte nicht aufgebaut werden')
      return false
    }
  }

  async suche (pattern) {
    const schueler = await Models.Schueler.query()
    .where(function () { this.where('Geloescht', '-').andWhere('Gesperrt', '-') })
    .andWhere(function () { this.where('Vorname', 'like', pattern + '%').orWhere('Name', 'like', pattern + '%') })
    .select('Name', 'Vorname', 'Klasse', 'Status', 'AktSchuljahr', 'ID')
    .orderBy('AktSchuljahr', 'desc')
    .map(s => {
      return {
        value: `${s.Name}, ${s.Vorname} (${s.Klasse})`,
        status: s.Status,
        jahr: s.AktSchuljahr,
        id: s.ID
      }
    })
    const klasse = await Models.Versetzung.query()
    .where('Klasse', 'like', pattern + '%')
    .select('Klasse')
    .orderBy('Klasse', 'desc')
    .map(k => {
      return { value: k.Klasse, id: k.Klasse }
    })
    return schueler.concat(klasse)
  }

  getSchueler (id) {
    return Models.Schueler.query()
    .where('ID', id)
    .eager('[abschnitte.[noten.fach, lehrer], fachklasse.[fach_gliederungen], versetzung, bk_abschluss, bk_abschluss_faecher.fach, fhr_abschluss, fhr_abschluss_faecher.fach, abi_abschluss, abi_abschluss_faecher.fach, vermerke]')
    .modifyEager('abschnitte', builder => { builder.orderBy('ID') })
    .first()
  }

  getKlasse (klasse, jahr, abschnitt) {
    return Models.Versetzung.query()
    .where('Klasse', klasse)
    // 2 = aktiv, 8 = mit Abschluss entlassen
    // .where(function() {
    //     this.where('Status', 2).orWhere('Status', 8)
    //   })
    .eager('[schueler.[abschnitte.[noten.fach, lehrer], fachklasse.[fach_gliederungen], versetzung, bk_abschluss, bk_abschluss_faecher.fach, fhr_abschluss, fhr_abschluss_faecher.fach, abi_abschluss, abi_abschluss_faecher.fach, vermerke], fachklasse, jahrgang]')
    .modifyEager('schueler', builder => { builder.orderBy('Name') })
    .first()
  }

  getSchule () {
    return Models.Schule.query().first()
  }

  async getSchuelerfoto (id) {
    const data = await Models.Schuelerfoto.query()
    .where('Schueler_ID', id).first()
    return Buffer.from(data.Foto, 'binary').toString('base64')
  }

  getNutzer (username) {
    return Models.Nutzer.query().where('US_LoginName', username).first()
  }
}
