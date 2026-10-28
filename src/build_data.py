import json, math, re, datetime as dt

HU = (53.76, 10.00)  # Henstedt-Ulzburg (gerundet, ca. 1 km)

CAL = {
 "karlshoehe": "https://www.gut-karlshoehe.de/aktuelles/veranstaltung/",
 "loki": "https://loki-schmidt-stiftung.de/veranstaltungen",
 "herzapfel": "https://www.herzapfelhof.de/Veranstaltungen",
 "aumuehle": "https://dampfundschiene.de/verein/lokschuppen-aumuehle",
 "trappenkamp": "https://www.erlebniswald-trappenkamp.de/veranstaltungen/kategorie1",
 "wulfsdorf": "https://gutwulfsdorf.de/veranstaltungen.html",
 "kunsthalle": "https://d11.hamburger-kunsthalle.de/de/programm",
 "markk": "https://markk-hamburg.de/en/calendar/",
 "rickmer": "https://www.rickmer-rickmers.de/programm/",
 "imm": "https://www.imm-hamburg.de/category/veranstaltung/",
 "feuerwehr": "https://feuerwehr-museum.com/veranstaltungen",
 "hoeltigbaum": "https://www.hoeltigbaum.de/fileadmin/user_upload/Jahresprogramm_2026_final_online.pdf",
 "fundus": "https://www.wasgehtinhamburg.de/location.php?id=937",
 "kliemann": "https://www.kliemannsland.de/fynnder/veranstaltungskalender/",
 "pinneberg": "https://stadtmuseum-pinneberg.de/",
 "universum": "https://universum-bremen.de/category/veranstaltungen/",
 "klick": "https://www.kindermuseum-hamburg.de/",
 "ballin": "https://ballinstadt.de/ausstellung/veranstaltungen/",
 "xfel": "https://www.xfel.eu/besucherinnen/events/index_ger.html",
 "energieberg": "https://www.stadtreinigung.hamburg/umweltbildung/lernort-energieberg/veranstaltungs-programm/maustag/",
 "bund": "https://www.bund-hamburg.de/wildes-wilhelmsburg/",
 "waelderhaus": "https://www.waelderhaus.de/events/",
 "kloevensteen": "https://www.hamburg.de/politik-und-verwaltung/bezirke/altona/themen/umwelt-natur-klimaschutz/kloevensteen/wildgehege",
 "moeller": "https://www.xn--mller-hof-07a.de/Angebote-Aktuelles/",
 "almthof": "https://www.almthof.de/",
 "lienau": "https://www.obsthof-lienau.de/",
}

# name, address, lat, lng, cat, io, wx, seasons, description, calendar key
P = [
("urban apes Hamburg Ost","Wandsbeker Zollstraße 87-89, 22041 Hamburg",53.5773,10.0801,"aktiv","drinnen","egal","FSHW","Boulderhalle",None),
("Duan'na Café","Güntherstraße 73, 22087 Hamburg",53.5640,10.0326,"cafe","drinnen","egal","FSHW","Café in Hohenfelde",None),
("Möller-Hof","Schleuerweg 7, 25377 Kollmar",53.7635,9.4468,"hof","beides","trocken","FSHW","Bauernhof an der Elbe mit Hofcafé (samstags 12–18 Uhr), Ferienprogrammen und Kursen","moeller"),
("Lighthouse European XFEL","Holzkoppel 4, 22869 Schenefeld",53.5895,9.8290,"museum","drinnen","egal","FSHW","Besucherzentrum des Röntgenlasers mit Ausstellung und Führungen","xfel"),
("HT16 Kletterzentrum","Sievekingdamm 1, 20535 Hamburg",53.5564,10.0424,"aktiv","drinnen","egal","FSHW","Kletterhalle",None),
("Boberger Dünenhaus","Boberger Furt 50, 21033 Hamburg",53.5078,10.1617,"natur","beides","trocken","FSHW","Infohaus im Naturschutzgebiet Boberger Niederung mit Dünen; Programm der Loki Schmidt Stiftung","loki"),
("LIFE HAMBURG Campus","Werner-Otto-Straße 21-27, 22179 Hamburg",53.5982,10.0722,"sonst","drinnen","egal","FSHW","Campus in Bramfeld",None),
("Splashaus Hamburg","Seilerstraße 41, 20359 Hamburg",53.5503,9.9639,"spiel","drinnen","egal","FSHW","Angebot für Kinder auf St. Pauli",None),
("Lilleby Konzeptcafé","Leonore-Mau-Weg 1, 22763 Hamburg",53.5588,9.9160,"cafe","drinnen","egal","FSHW","Pädagogisches Konzeptcafé für Familien in Altona",None),
("Stadtmuseum Pinneberg","Dingstätte 25, 25421 Pinneberg",53.6610,9.7961,"museum","drinnen","egal","FSHW","Stadtmuseum; Mi, Fr–So 14–17 Uhr, Do 10–12 Uhr","pinneberg"),
("Hofladen & Café Hollenstedt","Kampweg 2b, 21279 Hollenstedt",53.3434,9.6910,"hof","beides","egal","FSHW","Hofladen mit Café",None),
("Bestes vom Elbdeich","Moorburger Elbdeich 447, 21079 Hamburg",53.4987,9.8895,"cafe","beides","trocken","FSH","Café am Moorburger Elbdeich",None),
("Villa Vanilla am Planschbecken","Südring, 22309 Hamburg (Stadtpark)",53.5966,10.0214,"cafe","draussen","warm","FS","Café am Planschbecken im Stadtpark",None),
("Töpferstube Große Wallanlagen","Glacischaussee, 20359 Hamburg",53.5531,9.9725,"kreativ","drinnen","egal","FSHW","Töpfern in Planten un Blomen",None),
("Sonnendeck St. Pauli","Bei den St. Pauli-Landungsbrücken 10, 20359 Hamburg",53.5460,9.9640,"cafe","draussen","warm","FS","Terrasse an den Landungsbrücken",None),
("BallinStadt Auswanderermuseum","Veddeler Bogen 2, 20539 Hamburg",53.5204,10.0169,"museum","drinnen","egal","FSHW","Auswanderermuseum; täglich 10–18 Uhr, Erw. 14,90 €, Kinder 5–13 J. 8,50 €","ballin"),
("ERNST (Stackmann)","Lange Str. 39, 21614 Buxtehude",53.4754,9.6994,"cafe","drinnen","egal","FSHW","Café im Kaufhaus Stackmann",None),
("BOOT e.V. – BOOTsWagen","Braune Brücke 18, 20537 Hamburg",53.5463,10.0595,"aktiv","draussen","warm","FS","Café mit SUP- und Kanuverleih am Kanal",None),
("Café Lüküs","Falkensteiner Ufer 101, 22587 Hamburg",53.5645,9.7672,"cafe","beides","trocken","FSH","Café am Elbstrand Falkenstein",None),
("Internationales Maritimes Museum","Koreastraße 1, 20457 Hamburg",53.5433,10.0000,"museum","drinnen","egal","FSHW","Schifffahrtsmuseum im Kaispeicher B; Playmobil-Sonderausstellung bis 08.11.","imm"),
("Waldhuuske","Rosengartenstraße 2, 21224 Rosengarten",53.4064,9.8559,"cafe","beides","trocken","FSHW","Ausflugslokal im Wald",None),
("RICKI BEACH","Hohendeicher See, 21037 Hamburg",53.4440,10.1025,"cafe","draussen","warm","S","Strandbar am See",None),
("Café Nimmerland","Möllner Landstraße 79, 21509 Glinde",53.5408,10.2109,"cafe","drinnen","egal","FSHW","Familiencafé",None),
("Bunker St. Pauli","Feldstraße 66, 20359 Hamburg",53.5565,9.9702,"ausflug","beides","trocken","FSHW","Grüner Bunker mit öffentlichem Dachgarten und Aussicht",None),
("Fundus Theater","Sievekingdamm 3, 20535 Hamburg",53.5565,10.0429,"kreativ","drinnen","egal","FSHW","Kindertheater und Forschungstheater","fundus"),
("NEST CoWork & Play","Hamburg",53.5744,10.0153,"spiel","drinnen","egal","FSHW","Coworking mit Spielbereich für Kinder",None),
("NaturRaum HafenCity","Versmannstraße 60, 20457 Hamburg",53.5388,10.0162,"natur","beides","egal","FSHW","Naturraum der Loki Schmidt Stiftung in der HafenCity","loki"),
("Zwergenaufstand","Lappenbergsallee 29, 20257 Hamburg",53.5766,9.9428,"laden","drinnen","egal","FSHW","Secondhand für Kinder",None),
("Lille Kinder","Lille Torv 3, 22765 Hamburg",53.5593,9.9375,"laden","drinnen","egal","FSHW","Kinderladen in Ottensen",None),
("KALLA Spielstadt","Peiner Hag 11-13, 25497 Prisdorf",53.6716,9.7713,"spiel","drinnen","egal","FSHW","Indoor-Spielstadt für Kinder",None),
("Knopf & Krümel","Eichenstraße 85, 20255 Hamburg",53.5773,9.9548,"laden","drinnen","egal","FSHW","Laden in Eimsbüttel",None),
("Boulderwelt Hamburg","Beim Strohhause 17, 20097 Hamburg",53.5539,10.0209,"aktiv","drinnen","egal","FSHW","Boulderhalle",None),
("MiniFinds","Kanalstraße 14, 22085 Hamburg",53.5730,10.0176,"laden","drinnen","egal","FSHW","Kinderladen",None),
("Universum Bremen","Wiener Straße 1a, 28359 Bremen",53.1067,8.8450,"museum","drinnen","egal","FSHW","Science Center zum Mitmachen; Erw. 18 €, ermäßigt 12 €, Familie 42 €","universum"),
("Klövensteen","Sandmoorweg 160, 22559 Hamburg",53.5959,9.7559,"natur","draussen","trocken","FSHW","Forst mit Wildgehege, Waldschule und Moor; Eintritt frei","kloevensteen"),
("Paradox Museum","Alter Wall 22, 20457 Hamburg",53.5505,9.9907,"museum","drinnen","egal","FSHW","Museum mit optischen Täuschungen",None),
("Rathauspassage","Rathausmarkt 3, 20095 Hamburg",53.5515,9.9930,"cafe","drinnen","egal","FSHW","Café und Buchladen unter dem Rathausmarkt",None),
("Emilia's Familiencafé","Barmbeker Str. 169, 22299 Hamburg",53.5923,10.0026,"cafe","drinnen","egal","FSHW","Familiencafé in Winterhude",None),
("Kinder Glück SpieleCafé","Brockdorffstraße 92-94, 22149 Hamburg",53.5950,10.1679,"spiel","drinnen","egal","FSHW","Spielecafé für Familien",None),
("Salzino Hamburg","Bramfelder Chaussee 220, 22177 Hamburg",53.6112,10.0744,"spiel","drinnen","egal","FSHW","Salzspielraum für Kinder",None),
("urban apes Hamburg West","Kieler Str. 565, 22525 Hamburg",53.5993,9.9164,"aktiv","drinnen","egal","FSHW","Boulderhalle",None),
("Junge Die Bäckerei (Rugenbarg)","Rugenbarg 14, 22549 Hamburg",53.5744,9.8471,"cafe","drinnen","egal","FSHW","Bäckerei-Café",None),
("Biohofladen Overmeyer","Emmelndorfer Str. 55, 21218 Seevetal",53.4020,9.9667,"hof","beides","egal","FSHW","Bio-Hofladen",None),
("Botschaft der Wildtiere","Lucy-Borchardt-Straße 2, 20457 Hamburg",53.5383,10.0177,"natur","drinnen","egal","FSHW","Ausstellung der Deutschen Wildtier Stiftung in der HafenCity",None),
("Kletterwald Hamburg","Meiendorfer Weg 122-128, 22359 Hamburg",53.6392,10.1599,"aktiv","draussen","trocken","FSH","Hochseilgarten im Wald",None),
("MARKK","Rothenbaumchaussee 64, 20148 Hamburg",53.5686,9.9890,"museum","drinnen","egal","FSHW","Museum am Rothenbaum, Kulturen und Künste der Welt; Ausstellung „CATS!“","markk"),
("Junge Die Bäckerei (Ahrensburg)","Hamburger Str. 163, 22926 Ahrensburg",53.6633,10.2206,"cafe","drinnen","egal","FSHW","Bäckerei-Café",None),
("Streichelzoo Ruschwedel","Ruschwedeler Str. 62, 21698 Harsefeld",53.4486,9.5592,"natur","draussen","trocken","FSH","Streichelzoo",None),
("Kliemannsland","Eichenstr. 14, 27404 Elsdorf",53.2730,9.3961,"ausflug","beides","trocken","FSHW","Erlebnishof; Sa+So 11–17 Uhr, Eintritt frei","kliemann"),
("Herzapfelhof Lühs","Osterjork 102, 21635 Jork",53.5287,9.6978,"hof","beides","trocken","FSH","Obsthof im Alten Land mit Hofcafé; Hofführungen April–Oktober um 16:30 Uhr","herzapfel"),
("ErlebnisWald Trappenkamp","Tannenhof, 24635 Daldorf",54.0261,10.2386,"natur","draussen","trocken","FSHW","Wildpark und Erlebniswald mit Spielbereichen","trappenkamp"),
("Hamburg Airport","Flughafenstr. 1-3, 22335 Hamburg",53.6319,9.9958,"ausflug","beides","egal","FSHW","Flughafen mit Besucherterrasse, Rundfahrten und Airport-Rallye",None),
("Zum Dorfkrug Landhof","Höftenberg 2, 21629 Neu Wulmstorf",53.4500,9.7891,"cafe","beides","egal","FSHW","Landgasthof",None),
("Gut Wulfsdorf","Bornkampsweg 39, 22926 Ahrensburg",53.6596,10.1903,"hof","beides","trocken","FSHW","Demeter-Hof mit Hofladen, Holzofenbäckerei und Veranstaltungen","wulfsdorf"),
("LyLy Restaurant","Rahlstedter Str. 61, 22149 Hamburg",53.5957,10.1497,"cafe","drinnen","egal","FSHW","Restaurant in Rahlstedt",None),
("GOKARTHOF","Neuengammer Hausdeich 101, 21039 Hamburg",53.4313,10.2414,"ausflug","draussen","trocken","FSH","Kartbahn in den Vierlanden",None),
("Hof Bullerbü","Fritz-Flinte-Ring 41B, 22309 Hamburg",53.6149,10.0528,"hof","draussen","trocken","FSHW","Hof in Barmbek-Nord",None),
("Energieberg Georgswerder","Fiskalische Str. 2, 21109 Hamburg",53.5138,10.0264,"natur","draussen","trocken","FSH","Ehemalige Deponie mit Horizontweg, Windrädern und Infozentrum","energieberg"),
("Cafe Yade","Rotenhäuser Str. 75, 21107 Hamburg",53.5060,9.9874,"cafe","drinnen","egal","FSHW","Café in Wilhelmsburg",None),
("TALA300","Tangstedter Landstraße 300, 22417 Hamburg",53.6710,10.0279,"sonst","beides","egal","FSHW","Ort in Langenhorn",None),
("Q21 Gasthaus","Fuhlsbüttler Str. 405, 22309 Hamburg",53.6035,10.0396,"cafe","drinnen","egal","FSHW","Gasthaus in Barmbek",None),
("Almthof Erlebnisbauernhof","Almtweg 37, 25482 Appen",53.6634,9.7237,"hof","draussen","trocken","FSH","Erlebnisbauernhof mit Hofcafé; Maislabyrinth im Sommer","almthof"),
("Verein Jordsand (Haus der Natur)","Bornkampsweg 35, 22926 Ahrensburg",53.6587,10.1933,"natur","beides","trocken","FSHW","Naturschutzverein mit Naturerlebnisgelände",None),
("Hamburger Kunsthalle","Glockengießerwall 5, 20095 Hamburg",53.5555,10.0025,"museum","drinnen","egal","FSHW","Kunstmuseum; samstags „Familienzeit“ für Kinder ab 5","kunsthalle"),
("Matthies Gartencafé","Gustav-Becker-Straße 2, 21218 Seevetal",53.4004,9.9758,"cafe","beides","trocken","FSH","Gartencafé",None),
("1407 Breakfast Club","Osterstraße 50, 20259 Hamburg",53.5752,9.9573,"cafe","drinnen","egal","FSHW","Frühstückscafé in Eimsbüttel",None),
("Hofbräu Wirtshaus Speersort","Speersort 1, 20095 Hamburg",53.5497,9.9985,"cafe","drinnen","egal","FSHW","Wirtshaus in der Altstadt",None),
("KL!CK Kindermuseum","Achtern Born 127, 22549 Hamburg",53.5827,9.8529,"museum","drinnen","egal","FSHW","Mitmachmuseum für Kinder; Mo–Fr 9–18, So 11–18 Uhr, Sa nur Kindergeburtstage","klick"),
("Obsthof Lienau","Bergstraße 2, 23843 Neritz",53.7877,10.2987,"hof","beides","trocken","FSH","Obsthof mit Hofladen","lienau"),
("Tüdelband Winsen","Marktstraße 1-3, 21423 Winsen (Luhe)",53.3641,10.2065,"laden","drinnen","egal","FSHW","Laden in der Winsener Innenstadt",None),
("Erntegarten Projekt Vielfalt","Allee 32, 22941 Jersbek",53.7476,10.2113,"natur","draussen","trocken","FSH","Gemeinschaftsgarten zum Selbsternten",None),
("PIERDREI Hotel HafenCity","Am Sandtorkai 46, 20457 Hamburg",53.5434,9.9960,"sonst","drinnen","egal","FSHW","Hotel in der HafenCity",None),
("Haus der Wilden Weiden","Eichberg 63, 22143 Hamburg",53.6158,10.1851,"natur","beides","trocken","FSHW","Infohaus im NSG Höltigbaum mit Weidetieren; Jahresprogramm mit Führungen","hoeltigbaum"),
("Elisa Konditorei & Café","Conventstraße 21+23, 22089 Hamburg",53.5626,10.0389,"cafe","drinnen","egal","FSHW","Konditorei und Café",None),
("Hof Bartels","Zur Heidekoppel 1, 21629 Neu Wulmstorf",53.3879,9.7964,"hof","beides","egal","FSHW","Hofladen und Café",None),
("Burgerlich Gänsemarkt","Gänsemarkt 43, 20354 Hamburg",53.5557,9.9880,"cafe","drinnen","egal","FSHW","Burger-Restaurant",None),
("Bienen-Lehr- und Schaugarten","Bagatelle 2, 22926 Ahrensburg",53.6798,10.2385,"natur","draussen","trocken","FS","Lehr- und Schaugarten rund um Bienen",None),
("Weingarten sechsundzwanzig","Spielbudenplatz 26, 20359 Hamburg",53.5492,9.9637,"cafe","draussen","warm","S","Außengastronomie am Spielbudenplatz",None),
("Food Lounge Bergedorf","Bergedorfer Str. 135, 21029 Hamburg",53.4866,10.2136,"cafe","drinnen","egal","FSHW","Burger und Pizza",None),
("[why not] Café","Daimlerstraße 38, 22763 Hamburg",53.5585,9.9210,"cafe","drinnen","egal","FSHW","Café in Bahrenfeld",None),
("Spielplatz Ritterburg","Weidwiese 8, 22359 Hamburg",53.6462,10.1476,"spiel","draussen","trocken","FSH","Spielplatz mit Ritterburg",None),
("LüttePlünn","Dithmarscher Str. 47, 22049 Hamburg",53.5802,10.0614,"laden","drinnen","egal","FSHW","DRK-Secondhandladen für Kinder",None),
("Gut Karlshöhe","Karlshöhe 60d, 22175 Hamburg",53.6305,10.1105,"natur","beides","trocken","FSHW","Umweltzentrum mit Tieren, Gärten, Kursen; Mitmach-Garten donnerstags ab 16 Uhr","karlshoehe"),
("Robin am See","Moorfleeter Deich 583, 21037 Hamburg",53.4851,10.1122,"cafe","draussen","warm","FS","Seecafé",None),
("BUND Naturerlebnisgarten","Wilhelmsburger Inselpark, 21109 Hamburg",53.4863,9.9978,"natur","draussen","trocken","FSH","Naturerlebnisgarten im Inselpark","bund"),
("Obsthof VIETS","Plantagenweg 2, 21629 Neu Wulmstorf",53.3738,9.8056,"hof","beides","trocken","FSH","Obsthof mit Café",None),
("Lokschuppen Aumühle","Am Mühlenteich, 21521 Aumühle",53.5305,10.3212,"museum","beides","trocken","FSHW","Eisenbahnmuseum; sonntags 11–17 Uhr, Aktionstage mit Draisinenfahrten","aumuehle"),
("Familiencafé Krümel","Straßburger Str. 19, 22049 Hamburg",53.5811,10.0613,"cafe","beides","egal","FSHW","Familiencafé im SOS-Kinderdorf Hamburg (Familienzentrum Dulsberg): Spiellandschaft für Kleinkinder, überdachter Außenspielplatz mit Kletterwand, Mittagstisch und Kuchen; nebenan Kinderkleiderladen „Klecks“",None),
("Hof Eggers in der Ohe","Kirchwerder Mühlendamm 5, 21037 Hamburg",53.4101,10.2194,"hof","beides","egal","FSHW","Hof in den Vierlanden",None),
("Uhlenkolk Mölln","Waldhallenweg, 23879 Mölln",53.6220,10.7036,"natur","draussen","trocken","FSHW","Wildpark am Waldrand",None),
("Café Zwei Herz","Loki-Schmidt-Platz 7, 22297 Hamburg",53.6044,10.0301,"cafe","drinnen","egal","FSHW","Café in Winterhude",None),
("Wodrich's Spielzeugspeicher","Hundtstraße 19, 22047 Hamburg",53.5836,10.0947,"laden","drinnen","egal","FSHW","Spielzeugladen",None),
("Feuerwehrmuseum Schleswig-Holstein","Friedrichsgaber Weg 290, 22846 Norderstedt",53.7026,9.9798,"museum","drinnen","egal","FSHW","Feuerwehrmuseum mit Kinderangeboten; Drohnen-Ausstellung bis 01.11.","feuerwehr"),
("Museum für Kunst und Gewerbe","Steintorplatz, 20099 Hamburg",53.5512,10.0098,"museum","drinnen","egal","FSHW","Museum für Kunst und Design",None),
("Märchenwanderweg „Der Trickser“","Lohof 1, 21266 Jesteburg",53.3234,9.9702,"natur","draussen","trocken","FSH","Märchenwanderweg im Wald",None),
("WIWA Baggerplatz","Ellerholzweg 16-18, 21107 Hamburg",53.5209,9.9724,"ausflug","draussen","trocken","FSH","Baggerpark: selbst Bagger fahren",None),
("U-Boot Museum","St. Pauli Fischmarkt 10, 20359 Hamburg",53.5452,9.9554,"museum","drinnen","egal","FSHW","Sowjetisches U-Boot zum Begehen",None),
("StrandPauli","St. Pauli Hafenstraße 89, 20359 Hamburg",53.5461,9.9616,"cafe","draussen","warm","S","Beachclub an der Elbe",None),
("Niendorfer Gehege","Niendorf, Hamburg",53.6138,9.9344,"natur","draussen","trocken","FSHW","Wald mit Wildgehege und Spielplätzen; Eintritt frei",None),
("The hall – Parkour","Stockmeyerstraße 43, 20457 Hamburg",53.5425,10.0086,"aktiv","drinnen","egal","FSHW","Parkourhalle im Oberhafen",None),
("Polizeimuseum Hamburg","Carl-Cohn-Straße 39, 22297 Hamburg",53.6032,10.0062,"museum","drinnen","egal","FSHW","Museum zur Hamburger Polizei",None),
("Fux Vintage","Wohlwillstraße 11, 20359 Hamburg",53.5533,9.9611,"laden","drinnen","egal","FSHW","Vintage-Laden",None),
("Porzellanfräulein","Preystraße, 22303 Hamburg",53.5821,10.0126,"kreativ","drinnen","egal","FSHW","Keramik selbst bemalen",None),
("Die Werkkiste","Schomburgstraße 87, 22767 Hamburg",53.5635,9.9365,"kreativ","drinnen","egal","FSHW","Werkstatt für Kinder",None),
("Spielhaus Eimsbüttel","Eimsbütteler Marktplatz 1, 20257 Hamburg",53.5727,9.9484,"spiel","beides","egal","FSHW","Spielhaus am Spielplatz",None),
("Rickmer Rickmers","Bei den St. Pauli-Landungsbrücken 1a, 20459 Hamburg",53.5444,9.9727,"museum","drinnen","egal","FSHW","Museumsschiff; Erw. 7 €","rickmer"),
("WÄLDERHAUS","Am Inselpark 19, 21109 Hamburg",53.4991,10.0050,"museum","drinnen","egal","FSHW","Ausstellungshaus zum Thema Wald (Koordinaten genähert)","waelderhaus"),
]

from hours import H, HN, expand
from prices import PR
from newplaces import NP, NH, NHN, NPR, BOTH
from travel import ST, STAY, STAY_CAT
H.update(NH); HN.update(NHN); PR.update(NPR)
NPN={x[0] for x in NP}
# Korrekturen nach Abgleich mit Google Maps (23.10.2026): name -> {feld: wert}
OVR = {
 "StrandPauli": dict(s="FSHW", d="Beachclub an der Elbe, im Winter mit Winterbetrieb (laut Website)"),
 "Lilleby Konzeptcafé": dict(n="Lykkeby Familiencafé", d="Familiencafé mit großem Spielbereich"),
 "Splashaus Hamburg": dict(c="kreativ", d="Splash-Painting-Atelier: Farbe frei auf Leinwand werfen"),
 "Bestes vom Elbdeich": dict(c="hof", io="drinnen", wx="egal", s="FSHW", d="Hofladen mit Selbstbedienung rund um die Uhr"),
 "BallinStadt Auswanderermuseum": dict(d="Auswanderermuseum; Erw. 14,90 €, Kinder 5–13 J. 8,50 €"),
 "NEST CoWork & Play": dict(a="Hofweg 70, 22085 Hamburg"),
 "Lille Kinder": dict(d="Kinderbuchladen mit Café und Spielecke"),
 "Knopf & Krümel": dict(c="cafe", d="Café mit Spielecke und Secondhand-Ecke"),
 "MiniFinds": dict(d="Secondhand für Kinder"),
 "KL!CK Kindermuseum": dict(a="Brandstücken 43, 22549 Hamburg", d="Mitmachmuseum für Kinder"),
 "Zum Dorfkrug Landhof": dict(c="hof", d="Landhof mit Restaurant und Erlebniswelt"),
 "GOKARTHOF": dict(c="laden", io="drinnen", wx="egal", s="FSHW", d="Fachhändler für Kinder-Gokarts"),
 "Hof Bullerbü": dict(d="Mini-Bauernhof mit Tieren, Spielbereich und Café"),
 "TALA300": dict(c="spiel", io="drinnen", wx="egal", d="Indoor-Spielplatz in einer Schule"),
 "LIFE HAMBURG Campus": dict(d="Bildungs- und Aktivitätszentrum in Bramfeld"),
 "Tüdelband Winsen": dict(d="Familien-Concept-Store mit Café und Spielecke"),
 "Die Werkkiste": dict(a="Stresemannstraße 268, 22769 Hamburg", d="Holzwerkstatt mit Werkkursen für Kinder und Eltern"),
 "Fux Vintage": dict(d="Vintage-Kinderkleidung und Spielzeug"),
 "WÄLDERHAUS": dict(lat=53.4959, lng=10.0034, d="Ausstellungshaus zum Thema Wald"),
 "Spielhaus Eimsbüttel": dict(d="Spielhaus mit Innenräumen und Außengelände"),
 "Verein Jordsand (Haus der Natur)": dict(d="Haus der Natur: Park, Teiche und freie Ausstellung zu Vögeln und Wattenmeer"),
 "Stadtmuseum Pinneberg": dict(d="Stadtmuseum; Ausstellung „Visionen für das Jetzt“ bis 22.11."),
 "Lokschuppen Aumühle": dict(d="Eisenbahnmuseum mit Aktionstagen und Draisinenfahrten"),
 "Kliemannsland": dict(d="DIY-Erlebnishof mit Werkstätten und Spielgelände; Eintritt frei"),
}
P = P + NP
KEYS=["n","a","lat","lng","c","io","wx","s","d","ck"]
P2=[]
for row in P:
    r=dict(zip(KEYS,row)); r.update(OVR.get(row[0],{})); P2.append(tuple(r[k] for k in KEYS))
P=P2
def D(s): return s
def ts(t): return dt.datetime.utcfromtimestamp(t).strftime("%Y-%m-%d")

# Termine: date, time, title, note
EV = {
"Herzapfelhof Lühs": [("2026-10-23","16:30","Öffentliche Freitags-Führung","Erw. 9,50 €, 10–17 J. 4 €, bis 9 J. frei"),
                      ("2026-10-24","16:30","Hofführung","Erw. 7,50 €, Kinder bis 16 frei")],
"Hamburger Kunsthalle": [("2026-10-23","16:15","Führung: Kolonialgeschichte(n) in der Kunst",""),
                         ("2026-10-24","10:30","Modellierkurs „Was macht eine Skulptur aus?“",""),
                         ("2026-10-24","11:00","Familienzeit (ab 5 J.)","ausverkauft"),
                         ("2026-10-24","13:15","Familienzeit (ab 5 J.)","ausverkauft")],
"Haus der Wilden Weiden": [("2026-10-24","10:00","Freiwillige packen an – Naturschutz","kostenlos, Anmeldung"),
                           ("2026-10-24","11:00","Klimawanderung Stellmoor & Höltigbaum","20 €")],
"NaturRaum HafenCity": [("2026-10-24","16:30","Radtour „Auf des Bibers Spuren“ (Ziel)","Erwachsene, Anmeldung")],
"Lokschuppen Aumühle": [("2026-10-25","11:00","Öffnungstag",""),
                        ("2026-10-30","15:00","Dämmerstunde im Eisenbahnmuseum","Eintritt frei, Spende erbeten")],
"Fundus Theater": [("2026-10-25","16:00","BÄÄÄM (ab 3 J.)","")],
"ErlebnisWald Trappenkamp": [("2026-10-31","10:00","Internationales Zughunderennen","frei mit Parkeintritt"),
                             ("2026-11-01","10:00","Internationales Zughunderennen","frei mit Parkeintritt")],
"Gut Wulfsdorf": [("2026-11-01","13:00","Kürbisfest",""),
                  ("2026-11-06","16:00","Freitagsbacken wie die Profis","ausgebucht"),
                  ("2026-11-19","","Brot und Wein","ausgebucht"),
                  ("2026-12-04","16:00","Freitagsbacken wie die Profis","ausgebucht")],
"Internationales Maritimes Museum": [("2026-10-27","11:00","Buddelschiff-Workshop (ab 12 J.)","8 €, Anmeldung"),
                                     ("2026-10-28","11:00","Gemälde unter der Lupe (ab 8 J.)","5 €, Anmeldung"),
                                     ("2026-11-08","10:00","Letzter Tag Playmobil-Ausstellung","")],
"Feuerwehrmuseum Schleswig-Holstein": [("2026-10-25","14:00","Drohnen-Flugvorführung",""),
                                       ("2026-11-01","14:00","Drohnen-Flugvorführung, letzter Ausstellungstag","")],
"Stadtmuseum Pinneberg": [("2026-11-22","14:00","Letzter Tag Ausstellung „Visionen für das Jetzt“","")],
"Rickmer Rickmers": [("2026-12-06","","Letzter Tag Ausstellung ARTDUO GAGAT","")],
"Kliemannsland": [("2026-10-24","11:00","Öffnungstag (Sa+So 11–17 Uhr)","Eintritt frei"),
                  ("2026-10-25","11:00","Öffnungstag (Sa+So 11–17 Uhr)","Eintritt frei")],
"Gut Karlshöhe": [(ts(1793750400),"","Individuelle Energieberatung","kostenlos"),
                  (ts(1794009600),"","Frühstück für die Schafe","8,50 €"),
                  (ts(1794096000),"","Frühstück für die Schafe","8,50 €"),
                  (ts(1794528000),"","Kulinarischer Themenabend","29,90 €"),
                  (ts(1794614400),"","Dumpling-Kochkurs","99 €"),
                  (ts(1795219200),"","Dumpling-Kochkurs","99 €"),
                  (ts(1796169600),"","Individuelle Energieberatung","kostenlos"),
                  (ts(1796342400),"","Waldfondue Nikolaus-Special","68 €"),
                  (ts(1796428800),"","Frühstück für die Schafe","8,50 €"),
                  (ts(1796515200),"","Frühstück für die Schafe","8,50 €"),
                  (ts(1796515200),"","Waldfondue Nikolaus-Special","68 €")],
}

from events import EV, EVURL
from recurring import REC, REPLACED, expand_rec
def evurl(n,x):
    for pl,d,k,u in EVURL:
        if pl==n and x[0].startswith(d) and (k in x[2] or k==x[1]): return u
    return None
from websites import WEB, CLOSE
import urllib.parse as _u
from pricing import PM, PMN, CONS, CONS_T, CONS_L, AGE, AGE_CAT
PLAYG = {"Spielplatz Ritterburg","Waldspielplatz Grabau","Inklusionsspielplatz Henstedt-Ulzburg"}
def money(n,c,pt,px):
    if n in PM:
        m=dict(PM[n]); note=PMN.get(n)
        return dict(pk="entry",pm=m,px=px+("; "+note if note else ""),pest=bool(m.get("est")))
    if CONS.get(n):
        a,k=CONS_T[CONS[n]]
        extra = "; Erlebniswelt und Hofführungen kostenlos, Bastelbus 10 € p. P." if n=="Zum Dorfkrug Landhof" else ""
        return dict(pk="cons",cons=[a,k],px=f"Kein Eintritt. Schätzung Verzehr ({CONS_L[CONS[n]]}): ca. {a} € pro Erwachsenem, {k} € pro Kind"+extra,pest=True)
    if pt=="frei" or c=="laden" or (pt=="verzehr" and n not in CONS):
        return dict(pk="free",px=px if pt=="frei" else ("Kein Eintritt" + ("; Einkauf nach Bedarf" if c=="laden" else "")),pest=False)
    return dict(pk="unknown",px=px,pest=False)
def hav(a,b,c,d):
    R=6371; p1,p2=math.radians(a),math.radians(c); dp=p2-p1; dl=math.radians(d-b)
    h=math.sin(dp/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(h))

def r5(x): return int(5*round(x/5)) or 5
def travel(n,c,km):
    road=km*1.3
    v=35 if km<10 else 40 if km<30 else 55 if km<80 else 75
    car=r5(road/v*60+5)
    bike=r5(road/15*60) if km<10 else None
    stay=STAY.get(n,STAY_CAT[c])
    dur=round((stay+2*car/60)*2)/2
    db="d2" if dur<=2 else "d4" if dur<=4 else "d6" if dur<=6 else "d8"
    return dict(st=ST.get(n),bike=bike,car=car,stay=stay,dur=dur,db=db)
out=[]
P=[tuple(("aktiv" if (i==4 and r[0] in PLAYG) else v) for i,v in enumerate(r)) for r in P]
# Abgleich Google-Listen 23.10.2026, 15:40 Uhr: entfernt bzw. neu in „Hamburg with Kids"
REMOVE=set()  # Abgleich 23.10.: die vier Orte stehen weiter in der Liste (nur durch Lesekürzung nicht sichtbar)
P=[r for r in P if r[0] not in REMOVE]
for _d in (EV,WEB,CLOSE,ST,STAY,HN,PM,PMN,CONS,AGE,H,PR):
    for _k in list(_d):
        if _k in REMOVE: del _d[_k]
EVURL[:]=[x for x in EVURL if x[0] not in REMOVE]
P+=[("WORLD OF BRICKS","Halle 7, Waidmannstraße 26, 22769 Hamburg",53.5692,9.9396,"museum","drinnen","egal","H","LEGO-Ausstellung mit bewegten Modellen, nur bis 1.11.2026",None),
    ("Pilzspielplatz","Teutonenweg 32F, 22453 Hamburg",53.6315,9.9703,"aktiv","draussen","trocken","FSH","Waldspielplatz mit Pilzhäusern, Kletter- und Bewegungsangeboten",None),
    ("Junge Die Bäckerei (Borsteler Chaussee)","Borsteler Chaussee 119, 22453 Hamburg",53.6070,9.9785,"cafe","drinnen","egal","FSHW","Bäckerei-Café mit Frühstück",None)]
H.update({"WORLD OF BRICKS":None,"Pilzspielplatz":"Mo-So 0-24","Junge Die Bäckerei (Borsteler Chaussee)":"Mo-Fr 6:30-18; Sa-So 7-16"})
HN.update({"WORLD OF BRICKS":"Täglich ab 9:30 Uhr, 17.10.–1.11.2026 (Ende nicht angegeben)"})
PR.update({"WORLD OF BRICKS":("unbek",False,"Preise nicht veröffentlicht, Tickets online"),"Pilzspielplatz":("frei",False,"Öffentlicher Spielplatz"),"Junge Die Bäckerei (Borsteler Chaussee)":("verzehr",False,"")})
CONS["Junge Die Bäckerei (Borsteler Chaussee)"]="baecker"
AGE.update({"WORLD OF BRICKS":(4,16),"Pilzspielplatz":(1,10)})
STAY.update({"WORLD OF BRICKS":1.5,"Pilzspielplatz":1.5})
WEB.pop("NEST CoWork & Play",None)
WEB.update({"WORLD OF BRICKS":"https://www.hamburg-tourism.de/sehen-erleben/veranstaltungen/veranstaltungskalender/world-of-bricks-ausstellung/"})
WEB["Familiencafé Krümel"]="https://www.sos-kinderdorf.de/kinderdorf-hamburg/angebote/familienzentrum-dulsberg/familiencafe-kruemel"
AGE["Familiencafé Krümel"]=(0,8)
EV["Familiencafé Krümel"]=[("2026-11-03","11:00","Kinderkleiderladen „Klecks“ wieder geöffnet, mit Wintersachen","bis 30.10. geschlossen")]
_N="SOS-Kinderdorf Harksheide – Haus 75 Familientreff"
P.append((_N,"Henstedter Weg 55, 22844 Norderstedt",53.7470,9.9949,"cafe","beides","egal","FSHW","Familientreff im SOS-Kinderdorf mit Elterncafé, Elternfrühstück, Kinder-Secondhand-Laden, Eltern-Kind-Kursen und Spielplatz auf dem Gelände",None))
H[_N]="Di 12-17; Mi 10-14:30; Do 9-17"
HN[_N]="Elterncafé Di 12–17 Uhr, Elternfrühstück Do 9–12 Uhr, Mohltied (gemeinsam kochen) Mi 10–14:30 Uhr mit Anmeldung bis Di 12 Uhr"
PR[_N]=("verzehr",False,"")
CONS_T["familientreff"]=(4,2); CONS_L["familientreff"]="Kaffee und Kuchen im Elterncafé (ab 2 € je Stück), Elternfrühstück 5 €"
CONS[_N]="familientreff"
AGE[_N]=(0,6); STAY[_N]=1.5
WEB[_N]="https://www.sos-kinderdorf.de/kinderdorf-harksheide/angebote/cafe-familientreff-secondhandladen"
_PG="https://www.sos-kinderdorf.de/service/download/Programm%20und%20Veranstaltungen%20Haus%2075%20Familientreff%3A%202.%20Halbjahr%202026?id=14566"
EV[_N]=[("2026-10-24","10:00","Väter-Gruppe (Kinder Jahrgang 2022–2024)","Kontakt über das Programm"),("2026-10-24","11:00","Kinder-Secondhand-Laden: Extra-Öffnung",""),
 ("2026-11-28","10:00","Väter-Gruppe (Kinder Jahrgang 2022–2024)","Kontakt über das Programm"),("2026-11-28","11:00","Kinder-Secondhand-Laden: Extra-Öffnung",""),
 ("2026-12-12","10:00","Weihnachtstreff (bis 14 Uhr)","ohne Anmeldung"),("2026-12-12","10:00","Väter-Gruppe (Kinder Jahrgang 2022–2024)","Kontakt über das Programm"),("2026-12-12","11:00","Kinder-Secondhand-Laden: Extra-Öffnung","")]
EVURL.append((_N,"2026-","",_PG))
CLOSE["WORLD OF BRICKS"]=("2026-11-02","Ausstellung beendet (lief bis 1.11.2026)")
EV["WORLD OF BRICKS"]=[("2026-11-01","09:30","Letzter Tag der LEGO-Ausstellung","Tickets online")]
from np2 import NP2,NH2,NHN2,NPR2,CONS2,STAY2,WEB2,SRCF,MATCHF
import np2 as _np2; _np2.SRC2["Planetarium Hamburg"]="beide"
P+=NP2; H.update(NH2); HN.update(NHN2); PR.update(NPR2); CONS.update(CONS2); STAY.update(STAY2); WEB.update(WEB2)
# Ziele für Erwachsene (erwachsene.py)
from erwachsene import ERW, ERWN, AUDB, CONS_E, ERW_CLOSE
for _k,(_v,_l) in CONS_E.items(): CONS_T[_k]=_v; CONS_L[_k]=_l
for (_n,_a,_la,_ln,_c,_io,_wx,_s,_de,_h,_pt,_ptx,_cons,_st,_w) in ERW:
    P.append((_n,_a,_la,_ln,_c,_io,_wx,_s,_de,None)); H[_n]=_h; PR[_n]=(_pt,False,_ptx if _pt!="verzehr" else "Kein Eintritt, nur Verzehr")
    if _cons: CONS[_n]=_cons
    STAY[_n]=_st; WEB[_n]=_w
CLOSE.update(ERW_CLOSE)
PM["urban apes Norderstedt"]=dict(PM["urban apes Hamburg Ost"]); PR["urban apes Norderstedt"]=("ueber15",False,"wie urban apes Ost: Erw. 16,90 €, Kinder 9,90 €, Familie 34,90 € (vor Ort prüfen)")
# Planetarium Hamburg (neu in beiden Listen, 24.10.2026)
_N="Planetarium Hamburg"
P.append((_N,"Linnering 1, 22299 Hamburg",53.59734,10.00907,"museum","drinnen","egal","FSHW","Sternenshows unter der riesigen Kuppel im alten Wasserturm im Stadtpark, mit eigenen Kindershows und Aussichtsplattform",None))
H[_N]="Di 9-19; Mi 9-18; Do-Fr 9-21; Sa 11-22:30; So 10-19"
HN[_N]="Kasse und Aussichtsplattform; Mo geschlossen (in den Ferien teils Vorstellungen). 20 Min. vor Showbeginn da sein, kein Einlass nach Beginn"
PR[_N]=("bis15",False,"Erw. 12,30 €, Kinder bis 17 J. 7,70 €, 3D-Shows +1,60 €; Aussichtsplattform mit Ticket frei")
PM[_N]=dict(a=12.3,c=7.7,cf=0,ct=17)
AGE[_N]=(3,16); STAY[_N]=1.5
WEB[_N]="https://www.planetarium-hamburg.de/de/spielplan"
_B="https://www.planetarium-hamburg.de/de/veranstaltungen-tickets/details/"
_S={"Der kleine Tag":("der-kleine-tag","Sternenmusical, ab 6 J., ca. 70 Min."),
 "Kleiner Stern im großen All":("kleiner-stern-im-grossen-all","ab 5 J., ca. 45 Min."),
 "Das Geheimnis der Papierrakete":("das-geheimnis-der-papierrakete","ab 6 J., ca. 45 Min."),
 "Eddie will ins All":("eddie-will-ins-all-ein-hamster-hebt-ab","ab 6 J., ca. 45 Min."),
 "Polaris und das Rätsel der Polarnacht":("polaris-und-die-raetsel-der-polarnacht","ab 8 J., ca. 40 Min."),
 "Wasser überall":("wasser-ueberall-versteckt-im-universum","ab 6 J., ca. 45 Min."),
 "Meine Heimat – Unser blauer Planet":("meine-heimat","mit Liedern von Rolf Zuckowski, ab 5 J., ca. 50 Min."),
 "Sterntaler":("sterntaler-vom-universum-belohnt","Märchen-Musical, ab 4 J., ca. 40 Min."),
 "Mit Juri durchs Sonnensystem":("mit-juri-durchs-sonnensystem","ab 5 J., ca. 45 Min."),
 "Die Himmelskinder-Weihnacht":("himmelskinder-weihnacht","Weihnachtsmusical, ab 5 J., ca. 55 Min."),
 "Die Sternenfee und der Mondritter":("die-sternenfee-und-der-mondritter","Mitmach-Show, ab 3 J., ca. 40 Min.")}
_T={"Der kleine Tag":["10-25 13:45","10-29 11:00","11-08 11:00","11-26 09:30","12-11 09:30","12-28 11:00"],
 "Kleiner Stern im großen All":["10-29 15:00","10-31 13:15","11-05 16:00","11-08 12:45","11-20 10:45","11-21 16:00","12-02 09:30"],
 "Das Geheimnis der Papierrakete":["10-25 12:30","10-30 12:15","11-27 15:00","12-04 15:00","12-28 12:30"],
 "Eddie will ins All":["10-28 11:00","10-30 16:15","11-05 15:00"],
 "Polaris und das Rätsel der Polarnacht":["10-29 16:15","10-30 15:00","11-04 15:00","11-10 10:45"],
 "Wasser überall":["10-26 12:00","10-31 11:00","11-01 14:00"],
 "Meine Heimat – Unser blauer Planet":["10-24 12:00","10-31 12:00","11-05 09:30","11-20 09:30","11-29 11:00","12-04 09:30","12-30 11:00"],
 "Sterntaler":["10-26 11:00","11-04 09:30","11-24 09:30","12-05 12:00","12-17 09:30","12-24 11:45"],
 "Mit Juri durchs Sonnensystem":["11-03 09:30","11-06 09:30","11-13 09:30","11-17 09:30"],
 "Die Himmelskinder-Weihnacht":["11-27 09:30","11-28 15:00","11-29 15:15","12-01 09:30","12-01 16:00","12-02 10:45","12-03 09:30"],
 "Die Sternenfee und der Mondritter":["12-08 10:00","12-08 11:00","12-13 11:00","12-13 12:00","12-15 10:00","12-15 11:00"]}
EV[_N]=[]
for _k,_ds in _T.items():
    for _d in _ds:
        _dt,_tm=_d.split(); EV[_N].append(("2026-"+_dt,_tm,_k,_S[_k][1]+"; Tickets online"))
        EVURL.append((_N,"2026-"+_dt,_tm,_B+_S[_k][0]))
for _tm in ["13:00","15:00","17:00"]:
    EV[_N].append(("2026-12-20",_tm,"Die Himmelskinder-Weihnacht – live","Live-Aufführung, ab 5 J.; Tickets Erw. 19 €, ermäßigt 14 €"))
    EVURL.append((_N,"2026-12-20",_tm,_B+"himmelskinder-weihnacht"))
EV[_N].sort()
# Ergänzte Termine aus Programmseiten (extra_events.py)
from extra_events import ADD as _ADD, REPL as _REPL
_TE={}
for _n in _REPL:
    EV[_n]=[]; EVURL[:]=[x for x in EVURL if x[0]!=_n]
for _n,_l in _ADD.items():
    _have={(x[0],x[1],x[2]) for x in EV.get(_n,[])}
    _lst=EV.setdefault(_n,[])
    for _d,_t,_e,_ti,_no,_uu in _l:
        if (_d,_t,_ti) in _have: continue
        _lst.append((_d,_t,_ti,_no))
        if _uu: EVURL.insert(0,(_n,_d,_t or _ti,_uu))
        if _e: _TE[(_n,_d,_t,_ti)]=_e
    _lst.sort()
names=set()
for i,(n,a,la,ln,c,io,wx,s,de,ck) in enumerate(P):
    assert n not in names, n; names.add(n)
    out.append(dict(id=i+1,n=n,a=a,lat=la,lng=ln,c=c,io=io,wx=wx,s=s,d=de,
        cal=CAL.get(ck) if ck else None,
        km=round(hav(HU[0],HU[1],la,ln),1),
        ev=[dict(dt=x[0],t=x[1],ti=x[2],no=x[3],u=evurl(n,x),an=bool(re.search(r"Anmeld|anmeld|Warteliste|ausgebucht|ausverkauft|Buchung|Ticket",x[3].replace("ohne Anmeldung","")))) for x in EV.get(n,[]) if not any(x[2].startswith(k) for k in REPLACED.get(n,[]))]+expand_rec(n),
        h=expand(H[n]), hn=HN.get(n), pt=PR[n][0], kf=PR[n][1], src=("erw" if n in ERWN else SRCF(n)), aud=("e" if n in ERWN else "b" if n in AUDB else "f"), **travel(n,c,hav(HU[0],HU[1],la,ln)), **money(n,c,PR[n][0],PR[n][2]), amin=AGE.get(n,AGE_CAT[c])[0], amax=AGE.get(n,AGE_CAT[c])[1],
        web=WEB.get(n) or ('https://www.google.com/search?q='+_u.quote(n+' '+a.split(',')[-1].strip())), ws=n not in WEB,
        cl=(dict(fr=CLOSE[n][0],no=CLOSE[n][1]) if n in CLOSE else None)))
for k in AUDB: assert k in names, k
for k in EV: assert k in names, k
for k in REC: assert k[0] in names, k
for k in EVURL: assert k[0] in names, k
for k in list(WEB)+list(CLOSE): assert k in names, k
print('ohne Website:',sorted(n for n in names if n not in WEB))
for k in list(PM)+list(CONS)+list(AGE): assert k in names, k
assert set(H)==names, (set(H)^names)
assert set(PR)==names, (set(PR)^names)
assert all(k in names for k in ST), [k for k in ST if k not in names]
assert all(k in names for k in STAY), [k for k in STAY if k not in names]
assert all(k in names for k in HN)
print(len(out), "Orte")
print(sorted((o["km"],o["n"]) for o in out)[:5], sorted((o["km"],o["n"]) for o in out)[-3:])
print(EV["Gut Karlshöhe"])
from exhibitions import EXH
_T0="2026-10-24"; _END="2026-12-31"
for k in EXH: assert k in names, k
NEX=0
for o in out:
    xs=EXH.get(o["n"])
    if not xs: continue
    o["ex"]=[dict(ti=t,fr=f,to=e,no=d,u=u,k=kk) for (t,f,e,d,u,kk) in xs if not e or e>=_T0]
    for (t,f,e,d,u,kk) in xs:
        if e and _T0<=e<=_END and not any(x["dt"]==e and re.search(r"[Ll]etzt",x["ti"]) for x in o["ev"]):
            o["ev"].append(dict(dt=e,t="",ti=f"Letzter Tag der Ausstellung „{t}“",no=d,u=u,an=False,xp=True)); NEX+=1
        if f and _T0<=f<=_END:
            o["ev"].append(dict(dt=f,t="",ti=f"Eröffnung der Ausstellung „{t}“",no=d,u=u,an=False,xp=True)); NEX+=1
print("Ausstellungen:",sum(len(v) for v in EXH.values()),"· erzeugte Termine:",NEX)
for _o in out:
    for _e in _o["ev"]:
        _k=(_o["n"],_e["dt"],_e["t"],_e["ti"])
        if _k in _TE: _e["te"]=_TE[_k]
DISPLAY={}
for _o in out:
    if _o["n"] in DISPLAY: _o["n"]=DISPLAY[_o["n"]]
# Kalenderdateien (.ics) je Termin bzw. je regelmäßiger Reihe
import os, re as _re, shutil, hashlib
shutil.rmtree("ics",ignore_errors=True); os.makedirs("ics")
def _esc(x): return str(x).replace("\\","\\\\").replace(";","\;").replace(",","\\,").replace("\n","\\n")
def _end(e):
    if e.get("te"): return e["te"]
    m=_re.search(r"bis (\d{1,2})(?::(\d\d))? Uhr",e["ti"]+" "+(e.get("no") or ""))
    if m: return f"{int(m.group(1)):02d}:{m.group(2) or '00'}"
    h,mi=map(int,e["t"].split(":")); h=min(h+2,23); return f"{h:02d}:{mi:02d}"
def _fold(line):
    b=line.encode(); out=[]
    while len(b)>73:
        k=73
        while (b[k]&0xC0)==0x80: k-=1
        out.append(b[:k].decode()); b=b[k:]
    out.append(b.decode()); return "\r\n ".join(out)
NICS=0
for o_ in out:
    seen=set()
    for e in o_["ev"]:
        key=e.get("sid") or (e["dt"]+e["t"]+e["ti"])
        h=hashlib.md5((o_["n"]+key).encode()).hexdigest()[:10]
        e["ic"]=f"ics/{h}.ics"
        if h in seen: continue
        seen.add(h)
        d=e["dt"].replace("-","")
        L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Ausfluege Rhener Umland//DE","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VTIMEZONE","TZID:Europe/Berlin","BEGIN:DAYLIGHT","TZOFFSETFROM:+0100","TZOFFSETTO:+0200","TZNAME:CEST","DTSTART:19700329T020000","RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU","END:DAYLIGHT","BEGIN:STANDARD","TZOFFSETFROM:+0200","TZOFFSETTO:+0100","TZNAME:CET","DTSTART:19701025T030000","RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU","END:STANDARD","END:VTIMEZONE","BEGIN:VEVENT",
           f"UID:{h}@ausfluege-rhen","DTSTAMP:20261023T150000Z"]
        if e["t"]:
            L+= [f"DTSTART;TZID=Europe/Berlin:{d}T{e['t'].replace(':','')}00", f"DTEND;TZID=Europe/Berlin:{d}T{_end(e).replace(':','')}00"]
        else:
            import datetime as _dt
            n=( _dt.date.fromisoformat(e["dt"])+_dt.timedelta(1)).isoformat().replace("-","")
            L+= [f"DTSTART;VALUE=DATE:{d}", f"DTEND;VALUE=DATE:{n}"]
        if e.get("rr"):
            L.append(f"RRULE:FREQ=WEEKLY;BYDAY={','.join(e['rr']['by'])};UNTIL={e['rr']['until'].replace('-','')}T235959Z")
        L+= [f"SUMMARY:{_esc(e['ti']+' – '+o_['n'])}", f"LOCATION:{_esc(o_['n']+', '+o_['a'])}",
             f"DESCRIPTION:{_esc(' · '.join(x for x in [e.get('rg',''),e.get('no',''),('Infos: '+e['u']) if e.get('u') else ''] if x))}"]
        if e.get("u"): L.append(f"URL:{e['u']}")
        L+= ["END:VEVENT","END:VCALENDAR"]
        open(e["ic"],"w",newline="").write("\r\n".join(_fold(x) for x in L)+"\r\n"); NICS+=1
        e["te2"]=_end(e) if e["t"] else ""
print("ics",NICS)
json.dump(out, open("places.json","w"), ensure_ascii=False, separators=(",",":"))

# Weitere Veranstaltungen in der Umgebung (extern.py)
from extern import X as _X
_ext=[]
for _x in _X:
    _x=dict(_x); _x["km"]=round(hav(HU[0],HU[1],_x["lat"],_x["lng"]),1)
    if _x["km"]<=40: _ext.append(_x)
_ext.sort(key=lambda x:(x["dt"],x.get("t") or "99"))
json.dump(_ext, open("ext.json","w"), ensure_ascii=False, separators=(",",":"))
print("extern",len(_ext))
