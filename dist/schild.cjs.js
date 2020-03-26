'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Knex = _interopDefault(require('knex'));
var objection = require('objection');

class Schueler extends objection.Model {
  static get tableName() {
    return 'schueler';
  }

  static get virtualAttributes() {
    return ['anrede', 'akt_halbjahr', 'schueler_in', 'studierende_r', 'berufsbezeichnung_mw', 'volljaehrig'];
  } // get akt_halbjahr () {
  //   if (this.abschnitte) {
  //     return _.last(this.abschnitte)
  //   }
  // }


  get anrede() {
    return this.Geschlecht === 3 ? 'Herr' : 'Frau';
  }

  get schueler_in() {
    return this.Geschlecht === 3 ? 'Schüler' : 'Schülerin';
  }

  get studierende_r() {
    return this.Geschlecht === 3 ? 'Studierender' : 'Studierende';
  }

  get berufsbezeichnung_mw() {
    if (this.fachklasse) return this.Geschlecht === 3 ? this.fachklasse.Bezeichnung : this.fachklasse.Beschreibung_W;else return 'Keine Fachklasse zugeordnet';
  }

  get volljaehrig() {
    return this.Volljaehrig === '+';
  }

  volljaehrig_bei(datum) {
    if (!datum || !this.Geburtsdatum) return false;
    var g = new Date(this.Geburtsdatum);
    var d = new Date(datum);
    return d.getFullYear() - g.getFullYear() - (d.getMonth() > g.getMonth() || d.getMonth() === g.getMonth() && d.getDay() >= g.getDay() ? 0 : 1) >= 18;
  }

  static get relationMappings() {
    return {
      fachklasse: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Fachklasse,
        join: {
          from: 'schueler.Fachklasse_ID',
          to: 'eigeneschule_fachklassen.ID'
        }
      },
      abschnitte: {
        relation: objection.Model.HasManyRelation,
        modelClass: Abschnitt,
        join: {
          from: 'schueler.ID',
          to: 'schuelerlernabschnittsdaten.Schueler_ID'
        }
      },
      vermerke: {
        relation: objection.Model.HasManyRelation,
        modelClass: Vermerk,
        join: {
          from: 'schueler.ID',
          to: 'schuelervermerke.Schueler_ID'
        }
      },
      bk_abschluss: {
        relation: objection.Model.HasOneRelation,
        modelClass: BKAbschluss,
        join: {
          from: 'schueler.ID',
          to: 'schuelerbkabschluss.Schueler_ID'
        }
      },
      bk_abschluss_faecher: {
        relation: objection.Model.HasManyRelation,
        modelClass: BKAbschlussFach,
        join: {
          from: 'schueler.ID',
          to: 'schuelerbkfaecher.Schueler_ID'
        }
      },
      abi_abschluss: {
        relation: objection.Model.HasOneRelation,
        modelClass: AbiAbschluss,
        join: {
          from: 'schueler.ID',
          to: 'schuelerabitur.Schueler_ID'
        }
      },
      abi_abschluss_faecher: {
        relation: objection.Model.HasManyRelation,
        modelClass: AbiAbschlussFach,
        join: {
          from: 'schueler.ID',
          to: 'schuelerabifaecher.Schueler_ID'
        }
      },
      fhr_abschluss: {
        relation: objection.Model.HasOneRelation,
        modelClass: FHRAbschluss,
        join: {
          from: 'schueler.ID',
          to: 'schuelerfhr.Schueler_ID'
        }
      },
      fhr_abschluss_faecher: {
        relation: objection.Model.HasManyRelation,
        modelClass: FHRAbschlussFach,
        join: {
          from: 'schueler.ID',
          to: 'schuelerfhrfaecher.Schueler_ID'
        }
      },
      schuelerfoto: {
        relation: objection.Model.HasOneRelation,
        modelClass: Schuelerfoto,
        join: {
          from: 'schueler.ID',
          to: 'schuelerfotos.Schueler_ID'
        }
      },
      sprachenfolgen: {
        relation: objection.Model.HasManyRelation,
        modelClass: Sprachenfolge,
        join: {
          from: 'schueler.ID',
          to: 'schuelersprachenfolge.Schueler_ID'
        }
      },
      versetzung: {
        relation: objection.Model.HasOneRelation,
        modelClass: Versetzung,
        join: {
          from: 'schueler.Klasse',
          to: 'versetzung.Klasse'
        }
      }
    };
  }

}

class Fachklasse extends objection.Model {
  static get tableName() {
    return 'eigeneschule_fachklassen';
  }

  static get relationMappings() {
    return {
      fach_gliederungen: {
        relation: objection.Model.HasManyRelation,
        modelClass: FachGliederung,
        join: {
          from: 'eigeneschule_fachklassen.ID',
          to: 'fach_gliederungen.Fachklasse_ID'
        }
      }
    };
  }

}

class Abschnitt extends objection.Model {
  static get tableName() {
    return 'schuelerlernabschnittsdaten';
  }

  static get virtualAttributes() {
    return ['v_name_klassenlehrer', 'klassenlehrer_in', 'schuljahr'];
  }

  get v_name_klassenlehrer() {
    if (this.lehrer) return `${this.lehrer.Vorname[0]}. ${this.lehrer.Nachname}`;
  }

  get klassenlehrer_in() {
    if (this.lehrer) return this.lehrer.Geschlecht === '3' ? 'Klassenlehrer' : 'Klassenlehrerin';
  }

  get schuljahr() {
    return `${this.Jahr}/${this.Jahr - 1999}`;
  }

  static get relationMappings() {
    return {
      lehrer: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Lehrer,
        join: {
          from: 'schuelerlernabschnittsdaten.KlassenLehrer',
          to: 'k_lehrer.Kuerzel'
        }
      },
      fachklasse: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Fachklasse,
        join: {
          from: 'schuelerlernabschnittsdaten.Fachklasse_ID',
          to: 'eigeneschule_fachklassen.ID'
        }
      },
      noten: {
        relation: objection.Model.HasManyRelation,
        modelClass: Note,
        join: {
          from: 'schuelerlernabschnittsdaten.ID',
          to: 'schuelerleistungsdaten.Abschnitt_ID'
        }
      }
    };
  }

}

class Jahrgang extends objection.Model {
  static get tableName() {
    return 'eigeneschule_jahrgaenge';
  }

}

class Versetzung extends objection.Model {
  static get tableName() {
    return 'versetzung';
  }

  static get relationMappings() {
    return {
      jahrgang: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Jahrgang,
        join: {
          from: 'versetzung.Jahrgang_ID',
          to: 'eigeneschule_jahrgaenge.ID'
        }
      },
      fachklasse: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Fachklasse,
        join: {
          from: 'versetzung.Fachklasse_ID',
          to: 'eigeneschule_fachklassen.ID'
        }
      },
      schueler: {
        relation: objection.Model.HasManyRelation,
        modelClass: Schueler,
        join: {
          from: 'versetzung.Klasse',
          to: 'schueler.Klasse'
        }
      }
    };
  }

}

class Lehrer extends objection.Model {
  static get tableName() {
    return 'k_lehrer';
  }

}

class Note extends objection.Model {
  static get tableName() {
    return 'schuelerleistungsdaten';
  }

  static get relationMappings() {
    return {
      fach: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Fach,
        join: {
          from: 'schuelerleistungsdaten.Fach_ID',
          to: 'eigeneschule_faecher.ID'
        }
      }
    };
  }

}

class Fach extends objection.Model {
  static get tableName() {
    return 'eigeneschule_faecher';
  }

  static get relationMappings() {
    return {
      fach_gliederungen: {
        relation: objection.Model.HasManyRelation,
        modelClass: FachGliederung,
        join: {
          from: 'eigeneschule_faecher.ID',
          to: 'fach_gliederungen.Fach_ID'
        }
      }
    };
  }

}

class BKAbschluss extends objection.Model {
  static get tableName() {
    return 'schuelerbkabschluss';
  }

}

class BKAbschlussFach extends objection.Model {
  static get tableName() {
    return 'schuelerbkfaecher';
  }

  static get relationMappings() {
    return {
      fach: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Fach,
        join: {
          from: 'schuelerbkfaecher.Fach_ID',
          to: 'eigeneschule_faecher.ID'
        }
      }
    };
  }

}

class AbiAbschluss extends objection.Model {
  static get tableName() {
    return 'schuelerabitur';
  }

}

class AbiAbschlussFach extends objection.Model {
  static get tableName() {
    return 'schuelerabifaecher';
  }

  static get relationMappings() {
    return {
      fach: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Fach,
        join: {
          from: 'schuelerabifaecher.Fach_ID',
          to: 'eigeneschule_faecher.ID'
        }
      }
    };
  }

}

class FHRAbschluss extends objection.Model {
  static get tableName() {
    return 'schuelerfhr';
  }

}

class FHRAbschlussFach extends objection.Model {
  static get tableName() {
    return 'schuelerfhrfaecher';
  }

  static get relationMappings() {
    return {
      fach: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Fach,
        join: {
          from: 'schuelerfhrfaecher.Fach_ID',
          to: 'eigeneschule_faecher.ID'
        }
      }
    };
  }

}

class Sprachenfolge extends objection.Model {
  static get tableName() {
    return 'schuelersprachenfolge';
  }

  static get relationMappings() {
    return {
      fach: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Fach,
        join: {
          from: 'schuelersprachenfolge.Fach_ID',
          to: 'eigeneschule_faecher.ID'
        }
      }
    };
  }

}

class FachGliederung extends objection.Model {
  static get tableName() {
    return 'fach_gliederungen';
  }

  static get relationMappings() {
    return {
      fachklasse: {
        relation: objection.Model.BelongsToOneRelation,
        modelClass: Fachklasse,
        join: {
          from: 'fach_gliederungen.Fachklasse_ID',
          to: 'eigeneschule_fachklassen.ID'
        }
      }
    };
  }

}

class Vermerk extends objection.Model {
  static get tableName() {
    return 'schuelervermerke';
  }

}

class Schuelerfoto extends objection.Model {
  static get tableName() {
    return 'schuelerfotos';
  }

}

class Schule extends objection.Model {
  static get tableName() {
    return 'eigeneschule';
  }

  static get virtualAttributes() {
    return ['schulleiter_in'];
  }

  get schulleiter_in() {
    return this.SchulleiterGeschlecht === 3 ? 'Schulleiter' : 'Schulleiterin';
  }

}

class Nutzer extends objection.Model {
  static get tableName() {
    return 'users';
  }

}

class Schild {
  constructor() {
    this.options = null;
    this.knex = null;
  }

  async connect(knexConfig) {
    try {
      this.knex = await Knex(knexConfig);
      objection.Model.knex(this.knex);
    } catch (e) {
      throw e;
    }
  }

  disconnect() {
    if (this.knex) this.knex.destroy();
  }

  async testConnection() {
    try {
      await this.knex.raw('select 1+1 as result');
      console.log('Testverbindung konnte aufgebaut werden');
      return true;
    } catch (err) {
      console.log(err);
      console.log('Testverbindung konnte nicht aufgebaut werden');
      throw err;
    }
  }

  async suche(pattern) {
    const pattern_w = pattern + '%';

    try {
      const sres = await Schueler.query().whereRaw(`
        Geloescht='-'
          AND Gesperrt='-'
          AND (CONCAT(Vorname,' ',Name) LIKE ?
            OR CONCAT(Name,', ',Vorname) LIKE ?)
          `, [pattern_w, pattern_w]).select('Name', 'Vorname', 'Klasse', 'Status', 'AktSchuljahr', 'ID').orderBy('AktSchuljahr', 'desc');
      const schueler = sres.map(s => {
        return {
          value: `${s.Name}, ${s.Vorname} (${s.Klasse})`,
          status: s.Status,
          jahr: s.AktSchuljahr,
          id: s.ID
        };
      });
      const kres = await Versetzung.query().where('Klasse', 'like', pattern + '%').select('Klasse').orderBy('Klasse', 'desc');
      const klassen = kres.map(k => {
        return {
          value: k.Klasse,
          id: k.Klasse
        };
      });
      return schueler.concat(klassen);
    } catch (e) {
      throw e;
    }
  }

  async getSchueler(id) {
    try {
      const res = await Schueler.query().where(function () {
        this.where('Geloescht', '-').andWhere('Gesperrt', '-').andWhere('ID', id);
      }).withGraphFetched(`
          [abschnitte.[noten.fach, lehrer],
          fachklasse.[fach_gliederungen], versetzung, bk_abschluss,
          bk_abschluss_faecher.fach, fhr_abschluss, fhr_abschluss_faecher.fach,
          abi_abschluss, abi_abschluss_faecher.fach, vermerke, sprachenfolgen.fach]
        `).modifyGraph('abschnitte', builder => {
        builder.orderBy('ID');
      }).first();
      return res.toJSON();
    } catch (e) {
      throw e;
    }
  }

  async getKlasse(klasse) {
    try {
      const res = await Versetzung.query().where('Klasse', klasse).withGraphFetched(`
          [schueler.[abschnitte.[noten.fach, lehrer],
          fachklasse.[fach_gliederungen], versetzung, bk_abschluss,
          bk_abschluss_faecher.fach, fhr_abschluss, fhr_abschluss_faecher.fach,
          abi_abschluss, abi_abschluss_faecher.fach, vermerke, sprachenfolgen.fach], fachklasse,
          jahrgang]
        `).modifyGraph('schueler', builder => {
        builder.where(function () {
          this.where('Geloescht', '-').andWhere('Gesperrt', '-');
        }).orderBy('Name');
      }).first();
      return res.toJSON();
    } catch (e) {
      throw e;
    }
  }

  async getSchule() {
    try {
      const res = await Schule.query().first();
      delete res.SchulLogo;
      delete res.Einstellungen;
      delete res.Einstellungen2;
      return res.toJSON();
    } catch (e) {
      throw e;
    }
  }

  async getSchuelerfoto(id) {
    try {
      const data = await Schuelerfoto.query().where('Schueler_ID', id).first();
      return Buffer.from(data.Foto, 'binary').toString('base64');
    } catch (e) {
      throw e;
    }
  }

  async getNutzer(username) {
    try {
      const res = await Nutzer.query().where('US_LoginName', username).first();
      return res.toJSON();
    } catch (e) {
      throw e;
    }
  }

}

exports.AbiAbschluss = AbiAbschluss;
exports.AbiAbschlussFach = AbiAbschlussFach;
exports.Abschnitt = Abschnitt;
exports.BKAbschluss = BKAbschluss;
exports.BKAbschlussFach = BKAbschlussFach;
exports.FHRAbschluss = FHRAbschluss;
exports.FHRAbschlussFach = FHRAbschlussFach;
exports.Fach = Fach;
exports.FachGliederung = FachGliederung;
exports.Fachklasse = Fachklasse;
exports.Jahrgang = Jahrgang;
exports.Lehrer = Lehrer;
exports.Note = Note;
exports.Nutzer = Nutzer;
exports.Schild = Schild;
exports.Schueler = Schueler;
exports.Schuelerfoto = Schuelerfoto;
exports.Schule = Schule;
exports.Sprachenfolge = Sprachenfolge;
exports.Vermerk = Vermerk;
exports.Versetzung = Versetzung;
