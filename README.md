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
| `src/home.js` | Reiter „Zuhause“: Aufgaben-Katalog, Turnus, Fairness, Punkte, Belohnungen, Abzeichen; Daten als `settings`-Einträge (`hc:` Aufgabe, `hd:` erledigt, `hr:` eingelöst, `people`, `homeblock`, `hrw`) – kein Schema-Update nötig |
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
- LIFE HAMBURG Campus: https://www.life.hamburg/programm?1315acc3_page=N (N = 1 … 12, je Seite ca. 3–7 Tage; nur Kinder/Familie)
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

Einmalige Einrichtung per SQL-Skript (Tabelle `fam_entries`, `fam_secret` mit gehashtem Familien-Code, Funktionen, gesperrter Direktzugriff). Arten (`kind`): `plans`, `maybe`, `busy`, `evwish`, `places`, `settings` (`family`, `freedays`).
Kostenlose Projekte pausieren nach 7 Tagen ohne Nutzung – dann im Supabase-Dashboard „Restore“.
Sicherung: in der Seite unter ⚙️ → „Daten sichern“ (JSON-Datei) / „Wiederherstellen“.
