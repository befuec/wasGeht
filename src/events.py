import datetime as dt
def ts(t): return dt.datetime.utcfromtimestamp(t).strftime("%Y-%m-%d")
# Termine Stand 23.10.2026 aus den Programmseiten der Orte: (Datum, Uhrzeit, Titel, Hinweis)
HF = [("2026-10-24","16:30","Hofführung","Erw. 7,50 €, Kinder bis 16 frei"),
      ("2026-10-25","10:30","Apfelexpress mit Hofführung","Erw. 9,50 €, 10–17 J. 4 €"),
      ("2026-10-25","16:30","Hofführung","Erw. 7,50 €"),("2026-10-26","16:30","Obsthofwanderung","Erw. 9,50 €"),
      ("2026-10-27","16:30","Hofführung","Erw. 7,50 €"),("2026-10-28","16:30","Hofführung","Erw. 7,50 €"),
      ("2026-10-29","16:30","Hofführung","Erw. 7,50 €"),("2026-10-30","16:30","Freitags-Führung","Erw. 9,50 €"),
      ("2026-10-31","16:30","Hofführung","Erw. 7,50 €")]
HF += [(d,"13:30","Hofführung (Winterprogramm)","Erw. 7,50 €, Kinder bis 16 frei") for d in
       ["2026-11-01","2026-11-07","2026-11-08","2026-11-14","2026-11-15","2026-11-21","2026-11-22","2026-11-28","2026-11-29","2026-12-05","2026-12-06"]]
EV = {
"Herzapfelhof Lühs": HF,
"Hamburger Kunsthalle": [("2026-10-24","11:00","Familienzeit (ab 5 J.)","ausverkauft"),("2026-10-24","13:15","Familienzeit (ab 5 J.)","ausverkauft")],
"Haus der Wilden Weiden": [("2026-10-31","18:00","Halloween am Höltigbaum (ab 6 J.)","Erw. 10 €, Kinder 5 €"),
    ("2026-11-20","14:00","Wolle kardieren und spinnen","15 € p. P."),
    ("2026-12-06","11:00","Weihnachtliche Vogelführung","Erw. 7 €, Kinder frei")],
"NaturRaum HafenCity": [("2026-10-25","14:00","Herbst und Halloween (Kinder)","ohne Anmeldung"),
    ("2026-10-31","17:00","Gruseliger Ausstellungsbesuch und Fledermaus-Basteln","ohne Anmeldung")],
"Boberger Dünenhaus": [("2026-10-28","14:30","Freundschaft zwischen Bäumen und Pilzen (Familien)","Anmeldung"),
    ("2026-11-04","16:30","DünenDetektive (Kindergruppe)","Anmeldung"),
    ("2026-11-06","17:30","Laternelaufen in der Natur (Familien)","Anmeldung"),
    ("2026-11-11","15:00","Boberger ForscherZwerge (Familien)","Anmeldung"),
    ("2026-11-22","12:00","Adventsgestecke und -kränze basteln (Familien)","Anmeldung"),
    ("2026-11-25","15:00","Boberger ForscherZwerge (Familien)","Anmeldung"),
    ("2026-12-02","18:00","Lebendiger Adventskalender (Familien)","Anmeldung")],
"Niendorfer Gehege": [("2026-10-31","15:30","Halloween-Tour mit Grusel und Geistern (Loki Schmidt Stiftung)","Familien, Anmeldung")],
"Lokschuppen Aumühle": [("2026-10-25","11:00","Museum offen",""),("2026-10-30","15:00","Dämmerstunde im Eisenbahnmuseum","Eintritt frei")]
    + [(d,"11:00","Museum offen","") for d in ["2026-11-01","2026-11-08","2026-11-15","2026-11-22","2026-11-29","2026-12-06","2026-12-13","2026-12-20"]],
"ErlebnisWald Trappenkamp": [("2026-10-31","10:00","Internationales Zughunderennen","frei mit Parkeintritt"),
    ("2026-11-01","10:00","Internationales Zughunderennen","frei mit Parkeintritt"),
    ("2026-11-14","15:00","Die Magie der Anderswelt","frei mit Parkeintritt"),
    ("2026-11-15","13:00","Familienwanderung","frei mit Parkeintritt"),
    ("2026-11-23","12:00","Stiefel füllen für den Nikolaus (bis 3.12., Kinder bis 11)","frei mit Parkeintritt"),
    ("2026-12-05","11:00","Große Familien-Waldweihnacht","Erw. 15 €, Kinder 8 €, Familie 38 €"),
    ("2026-12-06","11:00","Große Familien-Waldweihnacht","Erw. 15 €, Kinder 8 €, Familie 38 €")],
"Gut Wulfsdorf": [("2026-11-01","13:00","Kürbisfest",""),("2026-11-05","15:00","Martinsbacken (auch 16:45)",""),
    ("2026-11-06","16:00","Freitagsbacken wie die Profis","ausgebucht"),("2026-11-07","10:00","Saft pressen",""),
    ("2026-11-21","10:00","Adventskranz binden",""),("2026-11-24","15:00","Plätzchenbacken (auch 16:45)",""),
    ("2026-11-28","10:00","Adventskranz binden",""),("2026-12-05","15:00","Hexenhauswerkstatt","")],
"Internationales Maritimes Museum": [("2026-10-27","11:00","Buddelschiff-Workshop (ab 12 J.)","8 €, Anmeldung"),
    ("2026-10-28","11:00","Gemälde unter der Lupe (ab 8 J.)","5 €, Anmeldung"),
    ("2026-10-29","11:00","Glitzern auf See – Mal-Workshop (6–12 J.)","5 €, Anmeldung"),
    ("2026-11-08","10:00","Letzter Tag Playmobil-Ausstellung","")],
"Feuerwehrmuseum Schleswig-Holstein": [("2026-10-25","14:00","Drohnen-Flugvorführung",""),
    ("2026-11-01","14:00","Drohnen-Flugvorführung, letzter Ausstellungstag",""),
    ("2026-11-13","18:30","St.-Martin-Laternenumzug",""),
    ("2026-12-11","16:00","Weihnachtsmarkt der Kunsthandwerker (bis 13.12.)","Museumseintritt frei")],
"Fundus Theater": [("2026-10-25","16:00","BÄÄÄM (ab 3 J.)",""),("2026-11-07","15:00","Verkehrsforschung (ab 5 J.)",""),
    ("2026-11-08","15:00","Verkehrsforschung (ab 5 J.)",""),("2026-11-14","16:00","Das Blaue vom Himmel (8–12 J.)",""),
    ("2026-11-15","16:00","Das Blaue vom Himmel (8–12 J.)",""),("2026-11-22","16:00","Der Wolfspelz (ab 5 J.)",""),
    ("2026-11-28","16:00","FRUSTLOOPS (6–10 J.)",""),("2026-12-05","16:00","Auf Zucker (4–12 J.)",""),
    ("2026-12-06","11:00","Auf Zucker (4–12 J., auch 16:00)",""),("2026-12-13","11:00","Auf Zucker (4–12 J., auch 16:00)","")],
"Rickmer Rickmers": [("2026-12-06","","Letzter Tag Ausstellung ARTDUO GAGAT","")],
"Stadtmuseum Pinneberg": [("2026-11-22","14:00","Letzter Tag Ausstellung „Visionen für das Jetzt“","")],
"Gut Karlshöhe": [(ts(1793232000),"16:00","Mitmach-Garten","kostenlos"),
    (ts(1794009600),"","Frühstück für die Schafe","8,50 €"),(ts(1794096000),"","Frühstück für die Schafe","8,50 €"),
    (ts(1795305600),"","Adventskranz mal anders","ausgebucht"),(ts(1795651200),"","Adventskranz mal anders","nur Warteliste"),
    (ts(1796342400),"","Waldfondue Nikolaus-Special","68 €"),(ts(1796428800),"","Frühstück für die Schafe","8,50 €"),
    (ts(1796515200),"","Frühstück für die Schafe","8,50 €"),(ts(1796515200),"","Waldfondue Nikolaus-Special","68 €")],
"Arche Warder": [("2026-10-31","12:00","Halloween-Gruselspaß",""),("2026-11-11","","Nachbarschaftstag und Laterne laufen","")],
"Zum Dorfkrug Landhof": [("2026-12-12","","Weihnachtsmarkt mit Weihnachtsmann-Hofführungen (auch 13.12.)","")]
    + [(d,"11:00","Öffentliche Hofführung (bis ca. 15 Uhr, Bastelbus 12–17 Uhr)","kostenlos, Bastelbus 10 €") for d in ["2026-10-24","2026-10-25","2026-10-31","2026-11-01"]],
}

# Ergänzt am 23.10.2026 nach Prüfung der Websites der Orte
import datetime as _d
def _sundays(a,b):
    d=_d.date.fromisoformat(a); e=_d.date.fromisoformat(b); r=[]
    while d<=e:
        if d.weekday()==6: r.append(d.isoformat())
        d+=_d.timedelta(1)
    return r
EV.update({
"Botschaft der Wildtiere": [("2026-10-27","14:00","Offene Lernwerkstatt: Spuren, Federn, Mikroskop (Herbstferien)",""),
    ("2026-10-31","10:00","Unheimlich wild: Superkräfte-Rallye, Basteln, Naturfilmkino","Eintritt frei")],
"Gut Wulksfelde": [("2026-10-24","16:00","Halloweennachmittag mit Laternen-Nachtwanderung","bis 19 Uhr"),
    ("2026-11-07","10:30","Laternenbasteln (auch 12:30)",""),
    ("2026-11-11","18:00","St.-Martin-Laternenlauf mit der Feuerwehr",""),
    ("2026-11-14","11:00","Hoftour „Unsere Tiere“",""),
    ("2026-11-15","11:00","Mobile Mosterei",""),
    ("2026-12-12","","Tannenbaumverkauf und Adventszauber (3. Advent)","Datum auf der Website prüfen")]
    + [(d,"10:30","Backen mit Kindern in der Gutsbäckerei (5–10 J., auch 13:00)","") for d in ["2026-11-07","2026-11-14","2026-11-21","2026-11-28"]],
"Hof Eggers in der Ohe": [("2026-10-25","11:00","Kürbisschnitzen im Backhaus","bis 17 Uhr")],
"Arche Warder": [("2026-10-31","12:00","Halloween-Gruselspaß","bis 20 Uhr"),
    ("2026-11-11","15:00","Nachbarschaftstag, Laternenbasteln und Laterne laufen",""),
    ("2026-12-24","12:00","Heiligabend-Gottesdienst im Tierpark","Park 10–16 Uhr")],
"LIFE HAMBURG Campus": [("2026-10-24","10:30","Stromkreise bauen (5–10 J.)","Anmeldung"),
    ("2026-10-24","13:30","Trickfilm mit Stop-Motion-App (10–15 J.)","Anmeldung"),
    ("2026-10-26","09:30","Ferienprogramm: Tanz dich frei (8–12 J.)","kostenlos, Warteliste"),
    ("2026-10-26","15:00","SpielZeit mit Eltern (0–5 J.)","kostenlos, ohne Anmeldung"),
    ("2026-10-27","09:30","Ferienprogramm: Bunt, gesund und lecker (8–12 J.)","Warteliste"),
    ("2026-10-28","09:30","Ferienprogramm: Blatt auf Blatt (8–12 J.)","kostenlos, Warteliste"),
    ("2026-10-28","15:00","SpielZeit mit Eltern (0–5 J.)","kostenlos, ohne Anmeldung"),
    ("2026-11-06","16:00","Entdecke deine Superkräfte (5.–6. Klasse)","kostenlos, Anmeldung")],
"TALA300": [("2026-11-08","10:00","Kinderturn-Sonntag (1–7 J.)","kostenlos, Online-Anmeldung")],
"Die Werkkiste": [("2026-10-26","10:15","Katapulte bauen","49 €"),("2026-10-26","14:15","Kastanien-Tiere und Figuren basteln","45 €"),
    ("2026-10-28","10:15","Werkzeugkästen bauen","79 €"),("2026-10-29","10:15","Intensiv-Werkzeugführerschein (ab 6 J.)","ausgebucht"),
    ("2026-10-30","10:15","Katamarane bauen","ausgebucht")],
"HT16 Kletterzentrum": [("2026-12-20","","Klettercamp für Kinder in den Weihnachtsferien (bis 23.12.)","Anmeldung")],
"Sommerrodelbahn Ibbenbüren": [("2026-11-01","10:30","Letzter Saisontag, danach Winterpause","ab KW 44 bis 17 Uhr")],
"Fun Arena": [("2026-10-30","","Halloween „Adults Play“: nur ab 16 Jahren","für Kinder geschlossen")],
"Museum für Kunst und Gewerbe": [(d,"13:00","Offene Familienwerkstatt (bis 17 Uhr)","solange Vorrat reicht") for d in _sundays("2026-10-25","2026-12-20")],
})

# Anmeldung/Buchung kenntlich machen, wo die Website das verlangt
def _tag(place, pred, txt):
    EV[place] = [(d,t,ti,(no+", " if no else "")+txt) if pred(ti,no) and not any(k in no for k in ("Anmeld","ausgebucht","Warteliste","Buchung")) else (d,t,ti,no) for d,t,ti,no in EV[place]]
_tag("Die Werkkiste", lambda ti,no: True, "Buchung nötig")
_tag("Gut Karlshöhe", lambda ti,no: "Mitmach" not in ti, "Buchung nötig")
_tag("Gut Wulfsdorf", lambda ti,no: "Kürbisfest" not in ti, "Anmeldung")
_tag("HT16 Kletterzentrum", lambda ti,no: True, "Anmeldung")

# Ergänzungen 23.10.2026 (zweiter Abgleich)
EV["Gut Wulfsdorf"].append(("2026-12-04","15:00","Freitagsbacken wie die Profis","ausgebucht"))
EV["ErlebnisWald Trappenkamp"].append(("2026-12-13","","Märchenerzählung in der Köhlerhütte","frei mit Parkeintritt"))
_L="https://www.life.hamburg/veranstaltungen/life-hamburg-"
_K="https://loki-schmidt-stiftung.de/mitmachen-und-erleben/termin-info.html?id="
_W="https://www.die-werkkiste.de/en/holiday-courses/factory/holiday-courses/herbstferien-2026/kurs.ed."
_G="https://gutwulfsdorf.de/veranstaltungsdetails/"
_C="https://www.gut-karlshoehe.de/aktuelles/news/veranstaltung/"
# (Ort, Datum, Titel-Stichwort, direkte URL zur Veranstaltung)
EVURL = [
("LIFE HAMBURG Campus","2026-10-24","Stromkreise",_L+"viertel-leuchttuerme-stromkreise-bauen-und-zum-leuchten-2026-10-24"),
("LIFE HAMBURG Campus","2026-10-24","Trickfilm",_L+"filmworkshop-fuer-jugendliche-2026-10-24"),
("LIFE HAMBURG Campus","2026-10-26","Tanz",_L+"ferienprogramm-tanz-dich-frei-bewegungsworkshop-fuer-kinder-2026-10-26"),
("LIFE HAMBURG Campus","2026-10-26","SpielZeit",_L+"f527-s019-t1019"),
("LIFE HAMBURG Campus","2026-10-27","Bunt",_L+"ferienprogramm-bunt-gesund-und-lecker-2026-10-27"),
("LIFE HAMBURG Campus","2026-10-28","Blatt",_L+"ferienprogramm-blatt-auf-blatt-kunst-naturworkshop-fuer-2026-10-28"),
("LIFE HAMBURG Campus","2026-10-28","SpielZeit",_L+"f527-s020-t1022"),
("LIFE HAMBURG Campus","2026-11-06","Superkräfte",_L+"entdecke-deine-superkraefte-staerken-erkennen-und-mutig-2026-11-06"),
("Die Werkkiste","2026-10-26","Katapulte",_W+"b71da5b19842_5448489840.katapulte-bauen?edref=werk&edlanguage=de"),
("Die Werkkiste","2026-10-26","Kastanien",_W+"615158111e6f_5443963140.kastanien-tiere-und-figuren-basteln?edref=werk&edlanguage=de"),
("Die Werkkiste","2026-10-28","Werkzeugkästen",_W+"0dad8654d6d2_5443905840.werkzeugkasten-bauen?edref=werk&edlanguage=de"),
("Die Werkkiste","2026-10-29","Werkzeugführerschein",_W+"37e973d91cf8_5443877190.werkzeugfuhrerschein-intensiv?edref=werk&edlanguage=de"),
("Die Werkkiste","2026-10-30","Katamarane",_W+"a3f1abb9325e_5448499390.katamarane-bauen?edref=werk&edlanguage=de"),
("Internationales Maritimes Museum","2026-10-2","Workshop","https://imm-hamburg.de/kinderprogramm-fuer-die-herbstferien/"),
("Internationales Maritimes Museum","2026-10-28","Lupe","https://imm-hamburg.de/kinderprogramm-fuer-die-herbstferien/"),
("Internationales Maritimes Museum","2026-11-08","Playmobil","https://imm-hamburg.de/eroeffnung-der-sonderausstellung-maritime-geschichte-erleben-mit-playmobil/"),
("NaturRaum HafenCity","2026-10-25","Halloween",_K+"10606"),
("NaturRaum HafenCity","2026-10-31","Fledermaus",_K+"10607"),
("Niendorfer Gehege","2026-10-31","Halloween",_K+"6766"),
("Boberger Dünenhaus","2026-10-28","Pilzen",_K+"6080"),
("Boberger Dünenhaus","2026-11-04","DünenDetektive",_K+"8525"),
("Boberger Dünenhaus","2026-11-06","Laterne",_K+"10131"),
("Boberger Dünenhaus","2026-11-11","ForscherZwerge",_K+"10126"),
("Boberger Dünenhaus","2026-11-22","Advent",_K+"8909"),
("Boberger Dünenhaus","2026-11-25","ForscherZwerge",_K+"10136"),
("Boberger Dünenhaus","2026-12-02","Adventskalender",_K+"6787"),
("Gut Wulfsdorf","2026-11-01","Kürbis",_G+"kuerbisfest-auf-dem-gut-wulfsdorf.html?day=20261101"),
("Gut Wulfsdorf","2026-11-05","Martin",_G+"martinsbacken-4.html?day=20261105"),
("Gut Wulfsdorf","2026-11-06","Freitags",_G+"freitagsbacken-wie-die-profis-4.html?day=20261106"),
("Gut Wulfsdorf","2026-11-07","Saft",_G+"saft-pressen-7.html?day=20261107"),
("Gut Wulfsdorf","2026-11-21","Adventskranz",_G+"adventskranz-binden-5.html?day=20261121"),
("Gut Wulfsdorf","2026-11-24","Plätzchen",_G+"plaetzchenbacken-5.html?day=20261124"),
("Gut Wulfsdorf","2026-11-28","Adventskranz",_G+"adventskranz-binden-6.html?day=20261128"),
("Gut Wulfsdorf","2026-12-04","Freitags",_G+"freitagsbacken-wie-die-profis-4.html?day=20261204"),
("Gut Wulfsdorf","2026-12-05","Hexenhaus",_G+"hexenhauswerkstatt-4.html?day=20261205"),
("Gut Karlshöhe","2026-10-29","Mitmach",_C+"mitmach-garten-4/"),
("Gut Karlshöhe","2026-11-07","Frühstück",_C+"fruehstueck-fuer-die-schafe/"),
("Gut Karlshöhe","2026-11-08","Frühstück",_C+"fruehstueck-fuer-die-schafe-2/"),
("Gut Karlshöhe","2026-11-22","Adventskranz",_C+"adventskranz-mal-anders-natuerlich-nachhaltig-entschleunigt/"),
("Gut Karlshöhe","2026-11-26","Adventskranz",_C+"adventskranz-mal-anders-natuerlich-nachhaltig-entschleunigt-2/"),
("Gut Karlshöhe","2026-12-04","Waldfondue",_C+"waldfondue-nikolaus-weihnachts-special-kaesefondue-unter-freiem-himmel/"),
("Gut Karlshöhe","2026-12-05","Frühstück",_C+"fruehstueck-fuer-die-schafe-3/"),
("Gut Karlshöhe","2026-12-06","Frühstück",_C+"fruehstueck-fuer-die-schafe-9/"),
("Gut Karlshöhe","2026-12-06","Waldfondue",_C+"waldfondue-nikolaus-weihnachts-special-kaesefondue-unter-freiem-himmel-2/"),
("Hamburger Kunsthalle","2026-10-24","11:00","https://d11.hamburger-kunsthalle.de/de/termin/ausverkauft-familienzeit-0"),
("Hamburger Kunsthalle","2026-10-24","13:15","https://d11.hamburger-kunsthalle.de/de/termin/ausverkauft-familienzeit-1"),
("Botschaft der Wildtiere","2026-10-27","Lernwerkstatt","https://www.botschaftderwildtiere.de/lernwerkstatt#Herbstferienangebot"),
("Botschaft der Wildtiere","2026-10-31","Unheimlich","https://seeforfree.media-harbour.de/museen/botschaft-der-wildtiere"),
("HT16 Kletterzentrum","2026-12-20","Klettercamp","https://www.ht16.de/klettercamp-in-den-weihnachtsferien/"),
("TALA300","2026-11-08","Kinderturn","https://www.tala300.de/"),
("ErlebnisWald Trappenkamp","2026-12-0","Waldweihnacht","https://erlebniswald-trappenkamp-daldorf.regiondo.de/kategorien"),
("Fun Arena","2026-10-30","Adults","https://www.funarena.info/"),
("Arche Warder","2026-1","","https://www.arche-warder.de/veranstaltungen/"),
]

# Dritter Abgleich 23.10.2026 nachmittags
EV["Herzapfelhof Lühs"] += [(d,"13:30","Hofführung (Winterprogramm)","Erw. 7,50 €, Kinder bis 16 frei") for d in ["2026-12-12","2026-12-13","2026-12-19","2026-12-20","2026-12-26","2026-12-27"]]
_FW="https://www.wasgehtinhamburg.de/termin_details.php?id="
EV["Fundus Theater"] = [("2026-10-25","16:00","BÄÄÄM (ab 3 J.)","Tickets",_FW+"47047500&date=2026-10-25"),
 ("2026-11-07","15:00","Verkehrsforschung (ab 5 J.)","Tickets",_FW+"46690399&date=2026-11-07"),
 ("2026-11-08","15:00","Verkehrsforschung (ab 5 J.)","Tickets",_FW+"46690422&date=2026-11-08"),
 ("2026-11-14","16:00","Das Blaue vom Himmel (8–12 J.)","Tickets",_FW+"46690472&date=2026-11-14"),
 ("2026-11-15","16:00","Das Blaue vom Himmel (8–12 J.)","Tickets",_FW+"46690501&date=2026-11-15"),
 ("2026-11-22","16:00","Der Wolfspelz (ab 5 J.)","Tickets",_FW+"46690579&date=2026-11-22"),
 ("2026-11-28","16:00","FRUSTLOOPS (6–10 J.)","Tickets",_FW+"46690628&date=2026-11-28"),
 ("2026-12-05","16:00","Auf Zucker (4–12 J.)","Tickets",_FW+"46690698&date=2026-12-05"),
 ("2026-12-06","11:00","Auf Zucker (4–12 J.)","Tickets",_FW+"46690716&date=2026-12-06"),
 ("2026-12-06","16:00","Auf Zucker (4–12 J.)","Tickets",_FW+"46690725&date=2026-12-06"),
 ("2026-12-13","11:00","Auf Zucker (4–12 J.)","Tickets",_FW+"46690784&date=2026-12-13"),
 ("2026-12-13","16:00","Auf Zucker (4–12 J.)","Tickets",_FW+"46690790&date=2026-12-13")]
for _r in EV["Fundus Theater"]: EVURL.append(("Fundus Theater",_r[0],_r[1],_r[4]))
EV["Fundus Theater"]=[r[:4] for r in EV["Fundus Theater"]]
EV["Universum Bremen"]=EV.get("Universum Bremen",[])+[("2026-10-24","","Podcast-Festival mit Familienbühne","")]
EV["BallinStadt Auswanderermuseum"]=EV.get("BallinStadt Auswanderermuseum",[])+[("2026-11-09","","125 Jahre Auswandererstadt: freier Eintritt","Eintritt frei")]
EV["MARKK"]=EV.get("MARKK",[])+[("2026-10-31","10:00","See for free: offene Werkstätten für Kinder und Familien","Eintritt frei")]
EV["Möller-Hof"]=EV.get("Möller-Hof",[])+[("2026-10-31","12:00","Hofcafé letzter Samstag vor der Winterpause","bis 18 Uhr")]
EVURL += [
("Herzapfelhof Lühs","2026-10","Freitags","https://www.herzapfelhof.de/onlinebuchung-freitagsfuehrung"),
("Herzapfelhof Lühs","2026-10","Apfelexpress","https://www.herzapfelhof.de/onlinebuchung-apfelexpressfahrt"),
("Herzapfelhof Lühs","2026-10","Obsthof","https://www.herzapfelhof.de/onlinebuchung-obsthofwanderung"),
("Herzapfelhof Lühs","2026-10","Hofführung","https://www.herzapfelhof.de/onlinebuchung-hoffuehrung"),
("Feuerwehrmuseum Schleswig-Holstein","2026-1","Drohnen","https://feuerwehr-museum.com/veranstaltungen/drohnen-helfer-aus-der-luft"),
("Feuerwehrmuseum Schleswig-Holstein","2026-11-13","Laterne","https://feuerwehr-museum.com/veranstaltungen/2026/laternenumzug-auf-dem-museumshof"),
("Feuerwehrmuseum Schleswig-Holstein","2026-12-11","Weihnachtsmarkt","https://feuerwehr-museum.com/veranstaltungen/weihnachtsmarkt-der-kunsthandwerker-2026"),
("Universum Bremen","2026-10-24","Podcast","https://universum-bremen.de/podcast-festival/"),
("BallinStadt Auswanderermuseum","2026-11-09","125","https://ballinstadt.de/2026/10/22/9-november-2026-tag-der-125-jahre-auswandererstadt-hapag-lloyd-ermoeglicht-freien-eintritt-in-die-ballinstadt-tuer/"),
("MARKK","2026-10-31","See for free","https://markk-hamburg.de/en/date/see-for-free-tag-mit-freiem-eintritt-2026-10-31-1000-2/"),
("WORLD OF BRICKS","2026-11-01","LEGO","https://www.hamburg-tourism.de/sehen-erleben/veranstaltungen/veranstaltungskalender/world-of-bricks-ausstellung/"),
]
