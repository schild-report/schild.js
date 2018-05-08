# schild.js

Bitte beachte, schild.js ist definitiv **beta**.

schild.js bietet eine praktische Schnittstelle für Schild-Datenbanken, der offiziellen Schulverwaltungssoftware für NRW. Es sollte im Browser und unter node.js laufen.

## Anwendung
schild.js ist ein Modul, das mehrere Funktionen für Anfragen an die Schild-Datenbank zur Verfügung stellt:

```javascript
const schild = require('schild')
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
schild.connect(konfigurationsobjekt, [property-auswahl])
// -> verbindet schild.js mit der Datenbank

schild.disconnect()
// -> trennt die Verbindung zur Datenbank

schild.testConnection()
// -> prüft, ob die Datenbankverbindung funktioniert. Gibt _true_ bzw _false_ zurück

schild.suche('Muster').then( res => console.log(res))
// -> gibt ein Array mit Klassen- und Schülertreffern zurück. Jeweils als JSON

schild.getSchueler(id).then( res => console.log(res))
// -> gibt einen Schüler als JSON-Objekt zurück mit der ID <id>

schild.getKlasse(klasse, jahr, abschnitt).then( res => console.log(res))
// -> sucht alle Schüler, die im Jahr <jahr>, im Abschnitt <abschnitt> in Klasse <klasse> waren/sind

schild.getSchule().then( res => console.log(res))
// -> gibt ein JSON-Objekt mit allen in der Schultabelle abgelegten Daten zurück

schild.getSchuelerfoto(id).then( res => console.log(res))
// -> gibt als base64-String ein Schülerfoto des Schülers mit der ID <id> zurück
```

Die Tests funktionieren leider nur mit einer privaten Schild-Datenbank.

Bei Interesse an schild.js hinterlasse bitte eine Nachricht an dev@hmt.im

schild.js wird derzeit in einem weiteren Reporting-Tool getestet, das auf electron basiert und damit die zwar serverbasierte, aber hervorragend funktionierende [Lösung](https://github.com/hmt/sahib) mit Ruby ([Demo](https://sahib.hmt.im/)) als Desktop-Client ersetzen kann. Bei weiterem Interesse bitte ebenfalls melden.

## Lizenz
schild.js von HMT ist lizenziert unter der ISC-Lizenz.
