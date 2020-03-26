# schild.js

schild.js bietet eine praktische Schnittstelle für Schild-Datenbanken, der offiziellen Schulverwaltungssoftware für NRW. Es sollte im Browser und unter node.js laufen.

## Anwendung
schild.js ist ein Modul, das mehrere Funktionen für Anfragen an die Schild-Datenbank zur Verfügung stellt:

```javascript
import { Schild } from 'schild'
const schild = new Schild
schild.connect({
  development: {
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
}, 'development')
```

Zwei Parameter sind vorgesehen, das Konfigurationsobjekt und, wenn man die Konfiguration aus einer komplexeren Datei einliest, der optionale Parameter zur Property-Auswahl. Im oberen Beispiel `development`. Wird kein zweiter Parameter angegeben, wählt schild.js als Standardeinstellung `NODE_ENV`.

Momentan stellt schild.js ein paar Funktionen zur Verfügung, die zur Suche und Auswahl von einzelnen Schülern, bzw. Schülergruppen hilfreich sind. Als Rückgabewert, wird ein Promise geliefert:

```javascript
import { Schild } from 'schild'

(async () => {
  const schild = new Schild
  const konfigurationsobjekt = {
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

  schild.connect(konfigurationsobjekt)
  // -> verbindet schild.js mit der Datenbank

  const test = await schild.testConnection()
  console.log(test)
  // -> prüft, ob die Datenbankverbindung funktioniert. Gibt _true_ bzw _false_ zurück

  const res = await schild.suche('Muster')
  console.log(res)
  // -> gibt ein Array mit Klassen- und Schülertreffern zurück. Jeweils als JSON

  const schueler = await schild.getSchueler(id)
  console.log(schueler)
  // -> gibt einen Schüler als JSON-Objekt zurück mit der ID <id>

  const klasse = await schild.getKlasse(klasse, jahr, abschnitt)
  console.log(klasse)
  // -> sucht alle Schüler, die im Jahr <jahr>, im Abschnitt <abschnitt> in Klasse <klasse> waren/sind

  onst schule = await schild.getSchule()
  console.log(schule)
  // -> gibt ein JSON-Objekt mit allen in der Schultabelle abgelegten Daten zurück

  const foto = await schild.getSchuelerfoto(id).then( res => console.log(res))
  console.log(foto)
  // -> gibt als base64-String ein Schülerfoto des Schülers mit der ID <id> zurück

  schild.disconnect()
  // -> trennt die Verbindung zur Datenbank
})()
```

Die Tests funktionieren leider nur mit einer privaten Schild-Datenbank.

Bei Interesse an schild.js hinterlasse bitte eine Nachricht an dev@hmt.im

## Lizenz
schild.js von HMT ist lizenziert unter der ISC-Lizenz.
