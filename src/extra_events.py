# Ergänzte Termine an Zielen aus den Listen (Stand 24.10.2026)
# ADD[Ort] = [(Datum, Beginn, Ende, Titel, Hinweis, URL)]; REPL = Orte, deren alte Termine ersetzt werden
L = "https://www.life.hamburg/veranstaltungen/life-hamburg-"
SZ = "SpielZeit mit Eltern (0–5 J.)"
SZN = "kostenlos, ohne Anmeldung"
def sz(d, code): return (d, "15:00", "18:00", SZ, SZN, L + code)
REPL = {"LIFE HAMBURG Campus"}
ADD = {
"LIFE HAMBURG Campus": [
 ("2026-10-24","10:30","13:00","Stromkreise bauen und zum Leuchten bringen (5–10 J.)","Anmeldung, Warteliste",L+"viertel-leuchttuerme-stromkreise-bauen-und-zum-leuchten-2026-10-24"),
 ("2026-10-24","13:30","16:00","Trickfilm mit Stop-Motion-App (10–15 J.)","Anmeldung",L+"filmworkshop-fuer-jugendliche-2026-10-24"),
 ("2026-10-26","09:30","13:30","Ferienprogramm: Tanz dich frei (8–12 J.)","kostenlos, Anmeldung, Warteliste",L+"ferienprogramm-tanz-dich-frei-bewegungsworkshop-fuer-kinder-2026-10-26"),
 sz("2026-10-26","f527-s019-t1019"),
 ("2026-10-27","09:30","13:30","Ferienprogramm: Bunt, gesund und lecker (8–12 J.)","kostenlos, Anmeldung, Warteliste",L+"ferienprogramm-bunt-gesund-und-lecker-2026-10-27"),
 ("2026-10-28","09:30","13:30","Ferienprogramm: Blatt auf Blatt – Kunst & Natur (8–12 J.)","kostenlos, Anmeldung, Warteliste",L+"ferienprogramm-blatt-auf-blatt-kunst-naturworkshop-fuer-2026-10-28"),
 sz("2026-10-28","f527-s020-t1022"),
 ("2026-10-29","09:30","13:30","Ferienprogramm: Rund um den Apfel (8–12 J.)","Anmeldung, Warteliste",L+"ferienprogramm-rund-um-den-apfel-2026-10-29"),
 ("2026-10-30","09:30","12:00","Ferienprogramm: Du bist stark (Grundschulalter)","kostenlos, Anmeldung, Warteliste",L+"ferienprogramm-du-bist-stark-staerken-entdecken-und-stress-2026-10-30"),
 ("2026-11-02","11:15","12:00","Yoga für Eltern mit Baby","Anmeldung",L+"yoga-fuer-eltern-mit-baby-mit-stapelstein-2026-11-02"),
 sz("2026-11-02","f527-s021-t1025"),
 sz("2026-11-05","f527-s022-t1027"),
 ("2026-11-05","15:30","17:30","Codierung und Verschlüsselung – von Wikingern bis Robotern (8–12 J.)","kostenlos, Anmeldung, Warteliste",L+"codierung-und-verschluesselung-von-den-wikingern-bis-zu-den-2026-11-05"),
 ("2026-11-06","15:30","17:00","Live-Podcast „Hamburg, was willst du wissen?“ für die ganze Familie","kostenlos, Anmeldung",L+"live-podcast-hamburg-was-willst-du-wissen-2026-11-06"),
 ("2026-11-06","16:00","18:30","Entdecke deine Superkräfte (5.–6. Klasse)","kostenlos, Anmeldung",L+"entdecke-deine-superkraefte-staerken-erkennen-und-mutig-2026-11-06"),
 ("2026-11-07","10:30","13:00","Robotics & 3D-Druck Workshop für Kinder","Anmeldung",L+"robotics-3d-druck-workshop-fuer-kinder-2026-11-07"),
 ("2026-11-07","13:30","16:00","3D-Druck & Textilplotten (10–15 J.)","Anmeldung",L+"3d-druck-textilplotten-fuer-jugendliche-10-15-jahre-2026-11-07"),
 ("2026-11-09","11:15","12:00","Yoga für Eltern mit Baby","Anmeldung",L+"yoga-fuer-eltern-mit-baby-mit-stapelstein-2026-11-09"),
 sz("2026-11-09","f527-s023-t1031"),
 ("2026-11-09","17:00","19:00","Ringelblumensalbe selbst herstellen (Familie)","Anmeldung",L+"apotheke-am-wegesrand-welche-pflanzen-naehren-uns-und-2026-10-17"),
 ("2026-11-11","15:30","18:30","Hexenküche & Zaubertopf – Kochkurs (6–14 J.)","Anmeldung",L+"hexenkueche-zaubertopf-magischer-november-kochkurs-fuer-2026-11-11"),
 sz("2026-11-12","f527-s024-t1034"),
 ("2026-11-13","17:00","19:00","Nisthilfen für Vögel bauen mit dem BUND","Anmeldung",L+"tierische-vielfalt-staerken-nisthilfen-fuer-voegel-bauen-2026-11-13"),
 ("2026-11-16","11:15","12:00","Yoga für Eltern mit Baby","Anmeldung",L+"yoga-fuer-eltern-mit-baby-mit-stapelstein-2026-11-16"),
 sz("2026-11-16","f527-s025-t1037"),
 ("2026-11-16","16:30","19:30","CookAttack – gemeinsam kochen (ab 11 J.)","Anmeldung",L+"cookattack-simple-gerichte-gemeinsam-kochen-mit-2026-11-16"),
 sz("2026-11-19","f527-s026-t1040"),
 ("2026-11-20","09:30","11:30","Basteln mit Josefin (Kita-Alter)","kostenlos, Anmeldung",L+"basteln-mit-josefin-2026-11-20"),
 ("2026-11-23","11:15","12:00","Yoga für Eltern mit Baby","Anmeldung",L+"yoga-fuer-eltern-mit-baby-mit-stapelstein-2026-11-23"),
 sz("2026-11-23","f527-s027-t1043"),
 ("2026-11-23","16:30","19:00","Oma Liebe Backstube – Omas backen mit Kindern (6–12 J.)","Anmeldung",L+"oma-liebe-backstube-omas-backen-mit-kindern-2026-11-23"),
 ("2026-11-24","16:00","18:00","Schnibbeldisko – Kinderkochkurs","Anmeldung",L+"schnibbeldisko-kinderkochkurs-mit-thomas-von-hobenkoeoek-2026-11-24"),
 ("2026-11-25","16:00","18:00","Heimisches Wildobst – Kochworkshop (Familie)","Anmeldung",L+"heimisches-wildobst-lade-die-farben-in-deine-ernaehrung-ein-2026-11-25"),
 sz("2026-11-26","f527-s028-t1046"),
 ("2026-11-28","10:30","13:00","Stromkreise bauen und zum Leuchten bringen (5–10 J.)","Anmeldung",L+"viertel-leuchttuerme-stromkreise-bauen-und-zum-leuchten-2026-11-28"),
 ("2026-11-28","13:30","16:00","Trickfilm mit Stop-Motion-App (10–15 J.)","Anmeldung",L+"trickfilm-mit-stop-motion-app-entwickeln-10-15-jahre-2026-11-28"),
 ("2026-11-30","11:15","12:00","Yoga für Eltern mit Baby","Anmeldung",L+"yoga-fuer-eltern-mit-baby-mit-stapelstein-2026-11-30"),
 ("2026-12-01","15:30","18:00","Oma Liebe Backstube – Omas backen mit Kindern (6–12 J.)","Anmeldung",L+"oma-liebe-backstube-omas-backen-mit-kindern-2026-12-01"),
 sz("2026-12-03","f527-s030-t1052"),
 ("2026-12-05","10:30","13:00","Robotics & 3D-Druck Workshop für Kinder","Anmeldung",L+"robotics-3d-druck-workshop-fuer-kinder-2026-12-05"),
 ("2026-12-05","11:00","14:00","X-Mas Kitchen Club – Adventskochkurs (6–14 J.)","Anmeldung",L+"x-mas-kitchen-club-adventskochkurs-fuer-kids-2026-12-05"),
 ("2026-12-05","13:30","16:00","Textilplotten und 3D-Druck (10–15 J.)","Anmeldung",L+"textilplotten-und-3d-druck-fuer-jugendliche-10-15-jahre-2026-12-05"),
 ("2026-12-07","11:15","12:00","Yoga für Eltern mit Baby","Anmeldung",L+"yoga-fuer-eltern-mit-baby-mit-stapelstein-2026-12-07"),
 sz("2026-12-07","f527-s031-t1055"),
 ("2026-12-10","15:30","17:30","LED-Leuchtkarten basteln (8–12 J.)","kostenlos, Anmeldung, Warteliste",L+"led-leuchtkarten-basteln-2026-12-10"),
 ("2026-12-12","10:30","13:00","Programmieren mit Ozobots (5–10 J.)","Anmeldung",L+"spielerischer-einstieg-ins-programmieren-fuer-kinder-mit-2026-12-12"),
 ("2026-12-12","13:30","16:00","Einstieg in die Spieleentwicklung (10–15 J.)","Anmeldung",L+"einstieg-in-die-spieleentwicklung-workshop-fuer-jugendliche-2026-12-12"),
 ("2026-12-14","11:15","12:00","Yoga für Eltern mit Baby","Anmeldung",L+"yoga-fuer-eltern-mit-baby-mit-stapelstein-2026-12-14"),
 ("2026-12-14","16:30","19:30","CookAttack – gemeinsam kochen (ab 11 J.)","Anmeldung",L+"cookattack-simple-gerichte-gemeinsam-kochen-mit-2026-12-14"),
 ("2026-12-18","09:30","11:30","Basteln mit Josefin (Kita-Alter)","kostenlos, Anmeldung",L+"basteln-mit-josefin-2026-12-18"),
 ("2027-01-09","10:00","12:30","Schnibbeldisko – Kinderkochkurs","Anmeldung",L+"schnibbeldisko-kinderkochkurs-mit-thomas-von-hobenkoeoek-2027-01-09"),
 ("2027-01-14","15:00","17:30","Vogelfutterzapfen basteln (Familie, ab 3 J.)","Anmeldung",L+"vogelfutterzapfen-fuer-unsere-wintervoegel-bastelaktion-2026-10-09"),
 ("2027-01-22","16:00","18:00","Lass uns würzen! Gewürze entdecken (ab 8 J.)","Anmeldung",L+"lass-uns-wuerzen-gewuerz-workshop-fuer-kids-ab-8-jahren-2026-10-16"),
 ("2027-01-23","11:00","15:30","Familien-Schauspielworkshop „Gemeinsam Bühne erleben“ (8–88 J.)","Anmeldung",L+"familien-schauspielworkshop-gemeinsam-buehne-erleben-mit-2027-01-23"),
],
"Kinderbuchhaus im Altonaer Museum": [
 (d,t,e,ti,"Eintritt frei, ohne Anmeldung","https://kinderbuchhaus.de/veranstaltungen/ohne-anmeldung/") for d,t,e,ti in [
 ("2026-10-25","15:00","16:00","Die Waldapotheke – Das Hexensäckchen (ab 4 J.)"),
 ("2026-11-01","15:00","16:00","Der Wald lebt! – Collagieren mit Papier (ab 5 J.)"),
 ("2026-11-08","15:00","16:00","Der Baum in mir (ab 5 J.)"),
 ("2026-11-13","16:00","17:00","Lesung „Der letzte Zauberspruch“ mit Ole Könnecke (ab 5 J.)"),
 ("2026-11-15","15:00","16:00","Papier schöpfen aus Milchkartons (ab 5 J.)"),
 ("2026-11-29","15:00","16:00","Kamishibai: Der kleine Weihnachtsmann am 1. Advent"),
 ("2026-12-06","15:00","16:00","Kamishibai: WinterWald-Geschichten"),
 ("2026-12-11","16:00","17:00","Lesung „Der (wahrscheinlich) magische Höhlenstein“ mit Antje von Stemm (ab 6 J.)"),
 ("2026-12-13","15:00","16:00","Winterzauber zum Aufklappen – Pop-up-Werkstatt (ab 4 J.)")]],
"Kindertheater Wackelzahn": [
 (d,t,e,"Der gestiefelte Kater (3–99 J.)","Tickets 9 €, Reservierung 040 29812139","https://www.kindaling.de/kindertheater-shows/der-gestiefelte-kater-hoftheater-ottensen/hamburg-altona")
 for d,t,e in [("2026-10-24","13:30","14:30"),("2026-10-24","15:30","16:30"),("2026-10-25","13:30","14:30"),("2026-10-25","15:30","16:30"),
               ("2026-10-30","16:00","17:00"),("2026-10-31","13:30","14:30"),("2026-10-31","15:30","16:30"),("2026-11-01","13:30","14:30"),("2026-11-01","15:30","16:30")]],
"Allee Theater – Theater für Kinder": [
 (d,t,e,"Die Entführung aus dem Serail (Kinderoper, ab 5 J.)","Tickets Kinder 19,90 €, Erw. bis 34,90 €","https://www.kindaling.de/kindertheater-shows/die-entfuehrung-aus-dem-serail-allee-theater-theater-fuer-kinder/hamburg-altona")
 for d,t,e in [("2026-10-24","14:30","16:00"),("2026-10-25","14:00","15:30"),("2026-10-31","14:30","16:00"),("2026-11-07","14:30","16:00"),("2026-11-08","14:00","15:30")]],
"Museumsdorf Volksdorf": [
 ("2026-11-07","14:30","","Brotverkauf im Krämerladen","","https://www.museumsdorf-volksdorf.de/Museumsdorf-erleben/Veranstaltungskalender/"),
 ("2026-11-14","15:00","","Laternenumzug ab Museumsdorf","kostenlos","https://www.kulturmeile-volksdorf.de/"),
 ("2026-11-15","","","Hubertustag","","https://www.museumsdorf-volksdorf.de/Museumsdorf-erleben/Veranstaltungskalender/"),
 ("2026-12-05","","","Advent im Dorf: Basteln, Märchen im Stall, historisches Karussell, Tierweihnacht","","https://www.museumsdorf-volksdorf.de/Museumsdorf-erleben/Veranstaltungskalender/"),
 ("2026-12-06","","","Advent im Dorf: Basteln, Märchen im Stall, historisches Karussell, Tierweihnacht","","https://www.museumsdorf-volksdorf.de/Museumsdorf-erleben/Veranstaltungskalender/")],
"Stadtpark Norderstedt": [
 ("2026-11-27","14:00","21:00","Advents-Markt im Stadtpark mit Kinderkarussell","Eintritt frei","https://www.festivalsindeutschland.de/festival/advents-markt-stadtpark-norderstedt"),
 ("2026-11-28","11:00","18:00","Advents-Markt im Stadtpark mit Kinderkarussell","Eintritt frei","https://www.festivalsindeutschland.de/festival/advents-markt-stadtpark-norderstedt"),
 ("2026-11-29","11:00","18:00","Advents-Markt im Stadtpark mit Kinderkarussell","Eintritt frei","https://www.festivalsindeutschland.de/festival/advents-markt-stadtpark-norderstedt")],
"Arboretum Ellerhoop": [
 ("2026-10-24","10:00","20:00","Herbstfest mit Illumination und Kinderaktionen","Erw. 10 €, Kinder bis 16 frei","https://www.kindaling.de/feste/herbstfest-mit-illumination/ellerhoop"),
 ("2026-10-25","10:00","20:00","Herbstfest mit Illumination und Kinderaktionen","Erw. 10 €, Kinder bis 16 frei","https://www.kindaling.de/feste/herbstfest-mit-illumination/ellerhoop")],
}
