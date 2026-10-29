# Was geht? – Ausflugsplaner für Henstedt-Rhen

Familien-Ausflugsplaner: Ziele aus zwei Google-Maps-Listen, Veranstaltungen der Umgebung, Wetter, gemeinsamer Plan.

- **Seite:** https://befuec.github.io/wasGeht/ (GitHub Pages, Branch `main`, Ordner `/`)
- **Gemeinsame Daten:** Supabase (`fam_entries`), Zugriff nur über die Funktionen `fam_check` / `fam_list` / `fam_put` mit Familien-Code. Der öffentliche Schlüssel steht in `src/plus.js` (`SB_URL`, `SB_KEY`) – er darf öffentlich sein.
- **Wetter:** live von Open-Meteo (im Browser).
- **Aktualisierung:** jeden Freitag 06:43 durch eine geplante Aufgabe in Claude (siehe unten).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | gebaute Seite (nicht von Hand bearbeiten) |
| `build.sh` | baut `index.html` aus `src/` |
| `src/template_plus.html` | Seitenvorlage (HTML, CSS, Haupt-Skript) |
| `src/plus.js` | Plan, Vielleicht, Supabase-Speicher, Heute, Kinderansicht-Zusätze; wird beim Bauen in die Vorlage eingebettet |
| `src/home.js` | Reiter „Zuhause“: Aufgaben-Katalog, Turnus, Fairness, Punkte, Belohnungen, Abzeichen; Daten als `settings`-Einträge (`hc:` Aufgabe, `hd:` erledigt, `ho:` Verschiebung/Übernahme je Termin, `hj:` Projekt, `hr:` eingelöst, `people`, `homeblock`, `hrwcfg`, `hgoals`) – kein Schema-Update nötig |
| `src/build_data.py` | erzeugt `places.json`/`ext.json` aus den Quelldateien |
| `src/assemble_plus.py`, `src/assemble_gh.py` | setzen Daten ein, erzeugen die vollständige Seite |
| `src/lists_full.json`, `src/newq.json` | Einträge der Google-Maps-Listen |
| `src/landing.html` | Weiterleitungsseite für die alten claude.ai-Links |

## Bauen

```
./build.sh
```
Braucht nur Python 3. Ergebnis: `index.html`. Danach committen und pushen; GitHub Pages veröffentlicht innerhalb von ca. 1 Minute.

## Datenquellen in `src/` (zum Pflegen)
| Datei | Inhalt |
|---|---|
| `events.py` | Grund-Termine je Ort `EV[Ort]=[(Datum, Uhrzeit, Titel, Hinweis)]`, Links `EVURL=[(Ort, Datumspräfix, Schlüssel, URL)]` |
| `extra_events.py` | Ergänzte Termine aus Programmseiten/Ticketshops: `ADD[Ort]=[(Datum, Beginn, Ende, Titel, Hinweis, URL)]`; `REPL` = Orte, deren Termine komplett ersetzt werden |
| `recurring.py` | Regelmäßige Termine |
| `exhibitions.py` | Ausstellungen `EXH[Ort]=[(Titel, von, bis, Beschreibung, URL, für Kinder)]` |
| `extern.py` | Termine an Orten, die nicht in den Listen stehen (erscheinen in den regulären Veranstaltungen mit Etikett „nicht in euren Listen“, planbar im Ausflugsplaner), Liste `X` von dicts: dt, to, t, te, ti, v, a, lat, lng, age, pr, u, q; nur ≤ 40 km ab Henstedt-Rhen |
| `build_data.py` | Orte, Planetarium-Block, Zusammenführung |

Hinweis-Text: Wörter wie „Anmeldung“, „Ticket“, „Warteliste“, „ausgebucht“ im Hinweis markieren Termine als „mit Anmeldung / Tickets“.

## Wichtige Programmseiten
- LIFE HAMBURG Campus: https://www.life.hamburg/programm?1315acc3_page=N (N = 1 … 12, je Seite ca. 3–7 Tage; Kinder/Familie in ADD, Angebote für Erwachsene über `adult("LIFE HAMBURG Campus", [...])` – erscheinen nur unter „Erwachsene“)
- Planetarium: Detailseiten https://www.planetarium-hamburg.de/de/veranstaltungen-tickets/details/<show> (je 7 Termine), Spielplan https://www.planetarium-hamburg.de/de/spielplan
- Kinderbuchhaus: https://kinderbuchhaus.de/veranstaltungen/ohne-anmeldung/
- Kindertheater (über kindaling.de-Detailseiten): Allee Theater, Wackelzahn/Hoftheater Ottensen, Schmidts Tivoli, Galli, Hamburger Puppentheater
- Museumsdorf Volksdorf: https://www.museumsdorf-volksdorf.de/Museumsdorf-erleben/Veranstaltungskalender/
- Weihnachtsmärkte: https://freizeitmonster.de/blog/weihnachtsmaerkte-henstedt-ulzburg
- Laternenumzüge: https://www.hamburg.de/freizeit/jahreszeiten/herbst/laternenumzug-hamburg-22840
- Portale für neue externe Termine: https://www.kindaling.de/veranstaltungen/hamburg?page=N

## Wochenbericht: „Diese Woche anmelden“
Im Bericht eine Tabelle mit Terminen der nächsten 14 Tage mit Anmeldung oder Tickets (Hinweis enthält Anmeldung/Ticket, nicht ausgebucht, nicht regelmäßig), passend zu Kindern von 4 und 8 Jahren, max. 10 Zeilen: Datum, Uhrzeit, Titel, Ort, Link. Termine mit „Anmeldung bis …“ zuerst.

## Testen

Mit Playwright: `index.html` bei 390 px und 1300 px laden, keine `pageerror`. Supabase und Open-Meteo im Test per `page.route` nachbilden (Funktionen `fam_check`, `fam_list`, `fam_put`).
- `#veranstaltungen`: Termine vorhanden, Zeilen mit `.xtag`, `#awBox`, `#buildD` zeigt das Baudatum.
- `#heute`: Fragen (`.hwiz`) bzw. nach „Fragen überspringen“ Karten `.hcard`.
- `#plan`: Kalender `.pcalg`.
- Bei 390 px kein horizontales Scrollen.

## Supabase

Einrichtung per SQL-Skripten: `schema.sql`, dann `mehrere-familien.sql`, dann `sicherheit.sql` (Tabellen, Funktionen, gesperrter Direktzugriff). Arten (`kind`): `plans`, `maybe`, `busy`, `evwish`, `places`, `settings` (`family`, `freedays`).
Kostenlose Projekte pausieren nach 7 Tagen ohne Nutzung – der Wachhalter (GitHub Actions) verhindert das; sonst im Supabase-Dashboard „Restore“.
Sicherung: in der Seite unter ⚙️ → „Daten sichern“ (JSON-Datei) / „Wiederherstellen“.

## Familien & Codes

Jede Familie legt in der App („✨ Neue Familie anlegen“) einen eigenen Code an und sieht nur ihre eigenen Einträge. Einrichtung in Supabase: einmal `supabase/mehrere-familien.sql` im SQL-Editor ausführen. Codes werden nur als HMAC-Schlüssel gespeichert; ändern lässt sich der Code in der App unter ⚙️ → Gemeinsamer Plan.

## Sicherheit & Datenschutz

Einrichtung: nach `mehrere-familien.sql` einmal `supabase/sicherheit.sql` im SQL-Editor ausführen.

- **Ende-zu-Ende-Verschlüsselung:** Aus dem Familien-Code leitet der Browser per PBKDF2 (210 000 Runden) drei Schlüssel ab: `a` (Anmeldung, geht an den Server), `e` (AES-GCM für die Daten), `m` (HMAC für verschleierte Kennungen). In `fam_entries` stehen nur `{v:2,iv,ct}` und Kennungen wie `e3f…`. Der Code selbst wird weder gespeichert noch gesendet; auf dem Gerät liegen nur die abgeleiteten Schlüssel (`hwk-fam-sb` = `{k:{a,e,m},name}`), bei „nicht angemeldet bleiben“ nur in `sessionStorage`. Alte Geräte (`{code}`) und Klartext-Einträge werden beim ersten Öffnen automatisch umgestellt (`fam_setcode` → `fam_replace_all`).
- **Server (`sicherheit.sql`):** Code-Schlüssel als HMAC + bcrypt; Sperre bei ≥ 10 Fehlversuchen pro IP und Stunde bzw. 300 insgesamt (`PT429`); höchstens 5 neue Familien pro IP und Tag (50 insgesamt); Eintrag ≤ 40 kB, ≤ 5000 Einträge je Familie. Gelöschtes 30 Tage in `fam_trash`, wöchentliche Sicherung in `fam_snapshots` (letzte 4). `fam_delete` löscht eine Familie vollständig.
- **Code ändern** (⚙️ → Gemeinsamer Plan) verschlüsselt alles neu und meldet alle anderen Geräte ab.
- **Aufbewahrung:** Erledigt-Haken (`hd:`) älter als ~13 Monate werden zu Monatssummen `hsum:JJJJ-MM` (`{p:{person:punkte},n:{person:anzahl}}`) zusammengefasst.
- **Seite:** Content-Security-Policy (nur Supabase und Open-Meteo erreichbar), keine Referrer, Schriften lokal in `fonts/` (OFL), nur http(s)-Links in den Daten, gefährliche Link-Adressen werden beim Klicken blockiert. Startpunkt auf ~1 km gerundet.
- **Wachhalten:** `.github/workflows/keepalive.yml` ruft alle 3 Tage `fam_ping` auf, damit das kostenlose Projekt nicht pausiert.

## Ziele & Termine für Erwachsene

- `src/erwachsene.py`: Orte aus der Google-Maps-Liste „Erwachsenenveranstaltungen“ (`aud:"e"`); `AUDB` = Orte aus den Familienlisten, die auch für Erwachsene passen (`aud:"b"`). In der App „Für wen? Familie / Erwachsene / Alle“ (Heute und Entdecken).
- Termine dazu in `src/extra_events.py` (Abschnitt „Ziele für Erwachsene“): Quellen sind die Veranstaltungsort-Seiten auf hamburg-tourism.de (Kampnagel K6, Centralkomitee, Pulverfass, Mojo Jazz Café, Laeiszhalle Studio E, Elbphilharmonie), die Spielpläne von HSV, HSV-Frauen, Handball Club Hamburg, FC St. Pauli und Hamburg Towers, Schmetterball (jeden Mittwoch) sowie die Festivals SPEKTRUM, Amplifire und Habitat.

## Installierbare Web-App (PWA)

- `manifest.json` (Name, Farben, Symbole), `icons/` (App-Symbole, `qr.svg` = QR-Code zur App-Adresse; neu erzeugen mit `python3 tools/make_icons.py <pfad-zu-python-qrcode>`).
- `sw.js` wird beim Bauen aus `src/sw_template.js` erzeugt (Versionskennung je Build): Seite immer zuerst aus dem Netz (max. 4 s), sonst gespeicherte Fassung; Schriften/Symbole aus dem Speicher. Supabase und Wetter laufen nie über den Speicher.
- In den Einstellungen „📲 Als App installieren“ (Android/PC: Installationsknopf, iPhone: Anleitung, Link teilen, QR-Code); ab dem 2. Besuch im Handy-Browser ein Hinweis (höchstens alle 30 Tage).
