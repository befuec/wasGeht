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

# Ziele für Erwachsene (erwachsene.py) – Termine laut hamburg-tourism.de / hamburg-travel.com, Stand 28.10.2026
_HT = "https://www.hamburg-tourism.de/sehen-erleben/veranstaltungen/veranstaltungskalender/"
_VO = "https://www.hamburg-tourism.de/sehen-erleben/veranstaltungen/veranstaltungsorte/"
_TK = "Tickets online"
ADD["Kampnagel"] = [
 ("2026-10-31","20:00","","Jack Halberstam: Keynote „Anarchitecture After Everything“","Vortrag (engl.); "+_TK,_HT+"jack-halberstam-keynote-anarchitecture-after-everything/"),
 ("2026-11-05","20:00","","Marco da Silva Ferreira: F*cking Future","Tanz; "+_TK,_HT+"marco-da-silva-ferreira-fcking-future/"),
 ("2026-11-10","19:30","","Krimifestival: Kriminelle Eröffnung – Verriss oder Begeisterung?","Lesung; "+_TK,_HT+"kriminelle-eroeffnung-1/"),
 ("2026-11-11","17:30","","Krimifestival: Anette Hinrichs, Romy Fölck, Nora Luttmer","Norddeutscher Abend, Lesung; "+_TK,_HT+"anette-hinrichs-romy-foelck-nora-luttmer/"),
 ("2026-11-11","20:30","","Krimifestival: Nele Neuhaus – Mörder ohne Gnade","Lesung; "+_TK,_HT+"nele-neuhaus-moerder-ohne-gnade-angst-und-schrecken-im-taunus/"),
 ("2026-11-12","17:30","","Krimifestival: Emily Rudolf","Lesung; "+_TK,_HT+"emily-rudolf/"),
 ("2026-11-12","20:30","","Krimifestival: Marc Elsberg","Lesung; "+_TK,_HT+"marc-elsberg/"),
 ("2026-11-13","17:30","","Krimifestival: Josi Wismar & Linda Schipp","Lesung; "+_TK,_VO+"kampnagel-k6/"),
]
ADD["Elbphilharmonie Hamburg"] = [
 ("2026-11-01","15:00","","Step Into Dabke – gemeinsam tanzen auf der Plaza","Mitmach-Tanz auf der Plaza",_HT+"elbphilharmonie-plus-step-into-dabke-gemeinsam-tanzen-auf-der-plaza/"),
 ("2026-11-11","20:00","","Koninklijk Concertgebouworkest","Konzert im Großen Saal; "+_TK,_HT+"koninklijk-concertgebouworkest/"),
]
ADD["Pulverfass Cabaret"] = [
 ("2026-10-29","19:00","","Pulverlesque – Halloween Edition","Burlesque-Show; "+_TK,_HT+"pulverlesque-halloween-edition/"),
 ("2026-11-06","19:00","","Santa's Pink Secret – die Pulverfass-Weihnachtsshow","Show; "+_TK,_HT+"santas-pink-secret-die-pulverfass-weihnachtsshow/"),
 ("2026-12-31","19:00","","Die große Silvester-Gala","Show; "+_TK,_HT+"die-grosse-silvester-gala/"),
]
ADD["Centralkomitee"] = [
 ("2026-11-03","20:00","","Stand Up Komitee","Stand-up-Comedy; "+_TK,_HT+"stand-up-komitee-1-1/"),
 ("2026-11-07","20:00","","Christian Schulte-Loh: Import Export","Comedy; "+_TK,_HT+"christian-schulte-loh/"),
 ("2026-11-11","19:00","","Moritz Neumeier – Improvisiert.","Comedy; "+_TK,_HT+"moritz-neumeier-improvisiert-8/"),
 ("2026-11-13","20:00","","Christine Prayon – Abschiedstour","Kabarett; "+_TK,_VO+"centralkomitee/"),
 ("2026-11-18","20:00","","Dem Pöbel zur Freude","Kabarett; "+_TK,_HT+"dem-poebel-zur-freude-1/"),
 ("2026-12-05","20:00","","Julius Fischer & Christian Meyer","Lesebühne/Comedy; "+_TK,_HT+"julius-fischer-christian-meyer/"),
 ("2026-12-06","20:00","","hidden shakespeare und die Gorillas","Impro-Theater; "+_TK,_HT+"hidden-shakespeare-und-die-gorillas-1/"),
]
ADD["Mojo Club"] = [
 ("2026-10-29","20:00","","Florian Paul & die Kapelle der letzten Hoffnung","Konzert; "+_TK,_HT+"florian-paul-die-kapelle-der-letzten-hoffnung-6/"),
 ("2026-11-05","21:00","","Etran de L'Aïr","Konzert (Mojo Jazz Café); "+_TK,_VO+"jazz-cafe/"),
 ("2026-11-16","20:00","","Mic Donet – Memories Tour 2026","Konzert; "+_TK,_HT+"mic-donet-memories-tour-2026/"),
 ("2026-11-21","23:00","","Pink Inc @ Mojo Club","Party; "+_TK,_HT+"pink-inc-at-mojo-club/"),
]
ADD["Laeiszhalle"] = [
 ("2026-11-05","18:00","","Mareille Merck (Studio E)","Feierabendkonzert; "+_TK,_HT+"mareille-merck/"),
 ("2026-11-16","18:00","","Noé Tavelli Double Drums Quartet (Studio E)","Jazz; "+_TK,_HT+"noe-tavelli-double-drums-quartet/"),
 ("2026-12-03","18:00","","Tim Scherer Trio (Studio E)","Jazz; "+_TK,_HT+"tim-scherer-trio/"),
 ("2026-12-10","18:00","","Alexander Rueß Trio (Studio E)","Jazz; "+_TK,_HT+"alexander-ruess-trio/"),
]
ADD["Barclays Arena"] = [
 ("2026-12-11","20:00","","Night of the Proms 2026","u. a. Holly Johnson, Christopher Cross, The Hooters; "+_TK,_HT+"night-of-the-proms-2026-1/"),
 ("2026-12-12","20:00","","Night of the Proms 2026","u. a. Holly Johnson, Christopher Cross, The Hooters; "+_TK,_HT+"night-of-the-proms-2026-1/"),
]
ADD["Handball Club Hamburg"] = [
 ("2026-11-22","17:00","","Handball-Bundesliga: Handball Club Hamburg – SC Magdeburg","Heimspiel in der Barclays Arena; "+_TK,_HT+"handball-club-hamburg/"),
]
ADD["Reeperbahn Comedy Club"] = [
 ("2026-10-30","20:00","","Reeperbahn Comedy Club","Stand-up-Comedy; "+_TK,"https://www.hamburg-travel.com/see-explore/events/events-calendar/reeperbahn-comedy-club/"),
]

# Schmetterball: jeden Mittwoch (laut Partyportalen; aktuelle Infos auf Instagram)
import datetime as _dtm
_d=_dtm.date(2026,10,28); ADD["Schmetterball Techno Tischtennis"]=[]
while _d<=_dtm.date(2026,12,16):
    ADD["Schmetterball Techno Tischtennis"].append((_d.isoformat(),"19:00","24:00","Schmetterball – Techno-Tischtennis","Abendkasse; ob es stattfindet, vorher auf Instagram prüfen","https://www.instagram.com/schmetter.ball/")); _d+=_dtm.timedelta(7)

# Heimspiele (Stand 28.10.2026): HSV, HSV-Frauen, Handball Club Hamburg (früher HSV Handball), FC St. Pauli, Hamburg Towers
_O="noch nicht genau terminiert – Anstoß vorher prüfen"
ADD["Volksparkstadion"] = [
 ("2026-11-06","20:30","","HSV – Borussia Mönchengladbach","Bundesliga, 9. Spieltag; Tickets bei hsv.de","https://www.hsv.de/"),
 ("2026-11-28","15:30","","HSV – FC Bayern München","Bundesliga, 11. Spieltag; Tickets bei hsv.de","https://www.hsv.de/"),
 ("2026-12-12","","","HSV – FC Schalke 04","Bundesliga, 13. Spieltag, Wochenende 11.–13.12.; "+_O,"https://www.hsv.de/"),
 ("2026-10-31","13:00","","HSV-Frauen – 1. FC Union Berlin","DFB-Pokal Achtelfinale; Spielort laut HSV-Spielplan prüfen; Tickets bei hsv.de","https://www.hsv.de/teams/frauen/spielplan"),
 ("2026-11-13","18:30","","HSV-Frauen – 1. FSV Mainz 05","Frauen-Bundesliga, 10. Spieltag; Spielort laut HSV-Spielplan prüfen","https://www.hsv.de/teams/frauen/spielplan"),
 ("2026-12-20","","","HSV-Frauen – FC Bayern München","Frauen-Bundesliga, 13. Spieltag; "+_O+"; Spielort prüfen","https://www.hsv.de/teams/frauen/spielplan"),
]
ADD["Millerntor-Stadion"] = [
 ("2026-10-31","","","FC St. Pauli – 1. FC Nürnberg","Bundesliga, 10. Spieltag (30.10.–1.11.); "+_O,"https://www.fcstpauli.com/news/spielplan-2627"),
 ("2026-11-21","","","FC St. Pauli – VfL Bochum","Bundesliga, 12. Spieltag (20.–22.11.); "+_O,"https://www.fcstpauli.com/news/spielplan-2627"),
 ("2026-12-05","","","FC St. Pauli – 1. FC Heidenheim","Bundesliga, 14. Spieltag (4.–6.12.); "+_O,"https://www.fcstpauli.com/news/spielplan-2627"),
 ("2026-12-19","","","FC St. Pauli – Hertha BSC","Bundesliga, 16. Spieltag (18.–20.12.); "+_O,"https://www.fcstpauli.com/news/spielplan-2627"),
]
ADD["Handball Club Hamburg"] = [
 ("2026-10-30","20:00","","Handball Club Hamburg – Rhein-Neckar Löwen","HBL-Heimspiel in der Sporthalle Hamburg (Krochmannstraße 55); Tickets online","https://hamburg-handball.de/spielplan/"),
 ("2026-11-22","17:00","","Handball Club Hamburg – SC Magdeburg","HBL-Heimspiel in der Barclays Arena; Tickets online","https://hamburg-handball.de/spielplan/"),
 ("2026-12-06","15:00","","Handball Club Hamburg – ThSV Eisenach","HBL-Heimspiel in der Sporthalle Hamburg (Krochmannstraße 55); Tickets online","https://hamburg-handball.de/spielplan/"),
 ("2026-12-19","20:00","","Handball Club Hamburg – VfL Gummersbach","HBL-Heimspiel in der Barclays Arena; Tickets online","https://hamburg-handball.de/spielplan/"),
 ("2026-12-22","19:00","","Handball Club Hamburg – TSV Hannover-Burgdorf","HBL-Heimspiel in der Barclays Arena; Tickets online","https://hamburg-handball.de/spielplan/"),
]
ADD["Hamburg Towers"] = [
 ("2026-11-01","16:30","","Hamburg Towers – Mitteldeutscher BC","Basketball-Bundesliga, Inselpark Arena; Tickets online","https://www.hamburgtowers.de/saison/"),
 ("2026-11-14","20:00","","Hamburg Towers – Würzburg Baskets","Basketball-Bundesliga, Inselpark Arena; Tickets online","https://www.hamburgtowers.de/saison/"),
 ("2026-11-22","16:30","","Hamburg Towers – Phoenix Hagen","Basketball-Bundesliga, Inselpark Arena; Tickets online","https://www.hamburgtowers.de/saison/"),
 ("2026-12-18","20:00","","Hamburg Towers – MHP Riesen Ludwigsburg","Basketball-Bundesliga; Tickets online","https://www.hamburgtowers.de/saison/"),
 ("2026-12-27","15:00","","Hamburg Towers – ALBA BERLIN","Basketball-Bundesliga in der Barclays Arena; Tickets online","https://www.hamburgtowers.de/news/das-wird-gross-spielplan-26-27-vorlaeufig-terminiert/"),
]

ADD["Amplifire Festival"] = [("2027-08-06","","","Amplifire Festival 2027 (Tag 1)","Punkrock, Post-Punk, Singer-Songwriter; Line-up noch offen; Tickets bei infield.live","https://www.openairguide.net/festivals/deutschland/amplifire-festival"),
 ("2027-08-07","","","Amplifire Festival 2027 (Tag 2)","Tickets bei infield.live","https://www.openairguide.net/festivals/deutschland/amplifire-festival")]
ADD["Habitat Festival"] = [("2027-07-31","","","Habitat Festival 2027 (Tag 1)","House & Techno Open Air; Line-up noch offen; Tickets online","https://www.technoairlines.com/festival/habitat-festival-hamburg-germany-2027"),
 ("2027-08-01","","","Habitat Festival 2027 (Tag 2)","Tickets online","https://www.technoairlines.com/festival/habitat-festival-hamburg-germany-2027")]
