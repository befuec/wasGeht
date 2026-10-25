# Weitere Veranstaltungen in der Umgebung (Orte NICHT in den Google-Listen), Stand 24.10.2026
# Felder: dt, to (letzter Tag bei mehrtägigen Terminen), t, te, ti, v (Ort), a (Adresse), lat, lng, age, pr, u (Link), q (Quelle)
TIV = dict(v="Schmidts Tivoli", a="Spielbudenplatz 27-28, 20359 Hamburg", lat=53.5497, lng=9.9632)
def tiv(ti, age, pr, u, dates):
    out = []
    for d, ts in dates:
        for t in ts: out.append(dict(dt=d, t=t, ti=ti, age=age, pr=pr, u=u, q="kindaling.de", **TIV))
    return out
X = []
X += tiv("Der Räuber Hotzenplotz", "ab 5 J.", "Kinder ab 23,90 €", "https://www.tivoli.de/programm-tickets/der-raeuber-hotzenplotz", [
 ("2026-10-24",["10:00","15:00"]),("2026-11-13",["15:00"]),("2026-11-14",["10:00","15:00"]),("2026-11-15",["10:00"]),("2026-11-20",["15:00"]),
 ("2026-11-21",["10:00","15:00"]),("2026-11-27",["15:00"]),("2026-11-28",["10:00"]),("2026-11-29",["10:00"]),("2026-12-04",["15:00"]),("2026-12-05",["10:00"]),
 ("2026-12-06",["10:00","14:30"]),("2026-12-11",["15:00"]),("2026-12-12",["10:00"]),("2026-12-18",["15:00"]),("2026-12-19",["10:00"]),("2026-12-20",["10:00","14:30"]),
 ("2026-12-21",["10:00"]),("2026-12-25",["14:30"]),("2026-12-26",["10:00"]),("2026-12-27",["10:00","14:30"]),("2026-12-28",["10:00","14:30"]),("2026-12-29",["10:00","14:30"]),("2026-12-30",["14:00"])])
X += tiv("Der achtsame Tiger – Familienmusical", "ab 4 J.", "Kinder ab 21,90 €, Erw. ab 29,90 €", "https://www.tivoli.de/programm-tickets/der-achtsame-tiger", [
 ("2026-10-24",["11:00"]),("2026-10-25",["11:00"]),("2026-10-30",["15:00"]),("2026-10-31",["11:00"]),("2026-11-01",["11:00"]),("2026-11-06",["15:00"]),
 ("2026-11-07",["11:00"]),("2026-11-29",["11:00","15:00"]),("2026-11-30",["11:00","15:00"])])
GAL = dict(v="Galli Theater (Kunstklinik Eppendorf)", a="Martinistraße 44a, 20251 Hamburg", lat=53.5893, lng=9.9765, age="ab 3 J.", pr="Kinder 8 €, Erw. 10 €", u="https://galli-hamburg.de/events/aschenputtel-7/", q="galli-hamburg.de")
X += [dict(dt="2026-10-24", t="12:00", te="13:00", ti="Märchen-Musical „Aschenputtel“", **GAL), dict(dt="2026-10-25", t="15:00", te="16:00", ti="Märchen-Musical „Aschenputtel“", **GAL)]
PUP = dict(v="Hamburger Puppentheater", a="Bramfelder Straße 92, 22305 Hamburg", lat=53.5874, lng=10.0479, age="5–7 J.", pr="9 €", u="https://hamburgerpuppentheater.de/home/programm/stueckinfo.html?stueck=3280", q="hamburgerpuppentheater.de")
X += [dict(dt=d, t=t, te=e, ti="Puppentheater „Aus heiterem Himmel“", **PUP) for d, t, e in [("2026-10-24","15:00","15:45"),("2026-10-25","15:00","15:45"),("2026-10-27","10:00","10:45")]]
# Laternenumzüge (Hamburg Nord/Nordost)
LT = "https://www.hamburg.de/freizeit/jahreszeiten/herbst/laternenumzug-hamburg-22840"
X += [
 dict(dt="2026-10-24", t="18:00", ti="Laternenumzug der FF Wellingsbüttel (Treffen ab 16 Uhr)", v="Freiwillige Feuerwehr Wellingsbüttel", a="Schulteßdamm 18, 22391 Hamburg", lat=53.6402, lng=10.0817, age="alle", pr="kostenlos", u="https://www.feuerwehr-hamburg.de/veranstaltung/laternenumzug-der-ff-wellingsbuettel-3/", q="hamburg.de"),
 dict(dt="2026-11-03", t="17:30", ti="Laternenumzug Gartenstadt Wandsbek mit Spielmannszug", v="Gartenstadt Wandsbek", a="Gartenstadtweg 81, 22049 Hamburg", lat=53.5865, lng=10.0882, age="alle", pr="kostenlos", u="https://www.gartenstadt-wandsbek.de/la/", q="hamburg.de"),
 dict(dt="2026-11-29", t="16:30", ti="Laternenumzug der FF Alsterdorf (Abmarsch 17:45)", v="Freiwillige Feuerwehr Alsterdorf", a="Maienweg 119, 22297 Hamburg", lat=53.6098, lng=10.0177, age="alle", pr="kostenlos", u="https://www.feuerwehr-hamburg.de/veranstaltung/laternenumzug-der-ff-alsterdorf/", q="hamburg.de"),
]
# Weihnachtsmärkte mit Kinderangeboten (bis ca. 30 km)
FM = "freizeitmonster.de"
X += [
 dict(dt="2026-11-18", to="2026-12-23", t="14:00", ti="Wintervergnügen Norderstedt: Kinderkarussell, Weihnachtsmann, Eiskönigin-Figuren, Basteln", v="Rathausallee (Vorplatz)", a="Rathausallee 33, 22846 Norderstedt", lat=53.7066, lng=9.9926, age="alle", pr="Eintritt frei", u="https://bergmanngruppe.de/events/wintervergnuegen-norderstedt/", q="festivalsindeutschland.de"),
 dict(dt="2026-11-29", t="11:00", te="18:00", ti="Henstedter Weihnachtsmarkt mit Kinderland (Spielen, Basteln)", v="Gemeindehaus Henstedt", a="Kisdorfer Str. 12, 24558 Henstedt-Ulzburg", lat=53.7905, lng=10.0003, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/henstedter-weihnachtsmarkt-2026-323521", q=FM),
 dict(dt="2026-11-25", to="2026-12-22", t="", ti="Adventsmarkt Kaltenkirchen (Weihnachtsrondell) mit Mitmachaktionen", v="Grüner Markt", a="Grüner Markt, 24568 Kaltenkirchen", lat=53.8357, lng=9.9604, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/adventsmarkt-kaltenkirchen-2026-477286", q=FM),
 dict(dt="2026-11-20", to="2026-11-21", t="", ti="Kittendorfer Weihnachtsbummel", v="Gemeindehaus Oersdorf", a="24568 Oersdorf", lat=53.8546, lng=9.9902, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/kittendorfer-weihnachtsmarkt-2026-477016", q=FM),
 dict(dt="2026-11-18", to="2026-12-20", t="", ti="Treudelberger Weihnachtsmarkt: Kinderkarussell, betreute Bastelhütte", v="Steigenberger Treudelberg", a="Lemsahler Landstraße 45, 22397 Hamburg", lat=53.6741, lng=10.0868, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/treudelberger-weihnachtsmarkt-im-alstertal-2026-477226", q=FM),
 dict(dt="2026-11-26", to="2026-12-24", t="", ti="Nordische Weihnachten auf dem Tibarg: Bastelhütte, Kinderprogramm", v="Tibarg (Niendorf)", a="Tibarg, 22459 Hamburg", lat=53.6226, lng=9.9530, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/nordische-weihnachten-auf-dem-tibarg-in-hamburg-niendorf-2026-328087", q=FM),
 dict(dt="2026-12-04", to="2026-12-06", t="", ti="Romantischer Weihnachtsmarkt: Weihnachtsmann, Märchenerzähler, Zauberer", v="Bad Bramstedt", a="Am Badesteig 5, 24576 Bad Bramstedt", lat=53.9180, lng=9.8840, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/romantischer-weihnachtsmarkt-bad-bramstedt-2026-323522", q=FM),
 dict(dt="2026-11-27", to="2026-11-29", t="", ti="Barmstedter Weihnachtsmarkt mit Weihnachtsmann", v="Marktplatz Barmstedt", a="Marktplatz, 25355 Barmstedt", lat=53.7907, lng=9.7704, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/barmstedter-weihnachtsmarkt-2026-323535", q=FM),
 dict(dt="2026-12-12", to="2026-12-13", t="11:00", ti="Adventsmarkt auf der Schlossinsel", v="Schlossinsel Barmstedt", a="Schlossinsel, 25355 Barmstedt", lat=53.7932, lng=9.7688, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/adventsmarkt-auf-der-schlossinsel-2026-323536", q=FM),
 dict(dt="2026-11-25", to="2026-12-30", t="", ti="Adventsmarkt auf dem Rondeel mit historischem Kinderkarussell", v="Rondeel Ahrensburg", a="Rondeel, 22926 Ahrensburg", lat=53.6759, lng=10.2414, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/adventsmarkt-auf-dem-rondeel-2026-323481", q=FM),
 dict(dt="2026-11-19", to="2026-12-30", t="", ti="Weihnachtsbummel Eppendorf: Kinderkarussell, Nikolaus", v="Marie-Jonas-Platz", a="Marie-Jonas-Platz, 20249 Hamburg", lat=53.5895, lng=9.9840, age="alle", pr="Eintritt frei", u="https://freizeitmonster.de/aktivitaeten/veranstaltungen/weihnachtsbummel-eppendorf-2026-446949", q=FM),
]
