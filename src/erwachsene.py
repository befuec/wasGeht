# Ziele für Erwachsene (ohne Kinder). In der App unter „Für wen? → Erwachsene“.
# Startauswahl (28.10.2026) – wird durch die Google-Maps-Liste „Erwachsene“ ersetzt/ergänzt, sobald die Namen vorliegen.
# Felder: Name, Adresse, lat, lng, Kategorie, drinnen/draussen/beides, Wetter, Saisons, Beschreibung,
#         Öffnungszeiten (wie hours.py) oder None, Preisstufe, Preistext, Verzehr-Typ (CONS) oder "", Aufenthalt (h), Website
F, U, V = "frei", "unbek", "verzehr"
PS = "Preise siehe Website"
ERW = [
 ("Elbphilharmonie Plaza","Platz der Deutschen Einheit 4, 20457 Hamburg",53.5413,9.9841,"ausflug","beides","egal","FSHW",
  "Öffentliche Aussichtsplattform in 37 m Höhe mit Rundumblick über Hafen und Stadt; abends Konzerte im Großen und Kleinen Saal",
  "Mo-So 10-24",F,"Plaza-Ticket vor Ort kostenlos (online 3 € Gebühr); Konzerte extra","",1,"https://www.elbphilharmonie.de/de/plaza"),
 ("Deichtorhallen","Deichtorstraße 1-2, 20095 Hamburg",53.5482,10.0055,"museum","drinnen","egal","FSHW",
  "Große Hallen für zeitgenössische Kunst und Fotografie mit wechselnden Ausstellungen",
  "Di-So 11-18",U,PS,"",2,"https://www.deichtorhallen.de/"),
 ("Thalia Theater","Alstertor 1, 20095 Hamburg",53.5520,9.9963,"kreativ","drinnen","egal","FSHW",
  "Renommiertes Schauspielhaus an der Alster – Klassiker und zeitgenössisches Theater",
  None,U,"Karten je nach Vorstellung, Spielplan siehe Website","",3,"https://www.thalia-theater.de/"),
 ("Kampnagel","Jarrestraße 20, 22303 Hamburg",53.5815,10.0216,"kreativ","drinnen","egal","FSHW",
  "Internationale Bühne für Tanz, Performance und Konzerte in alten Fabrikhallen in Winterhude",
  None,U,"Karten je nach Veranstaltung, Programm siehe Website","",3,"https://www.kampnagel.de/"),
 ("Abaton Kino","Allende-Platz 3, 20146 Hamburg",53.5676,9.9827,"kreativ","drinnen","egal","FSHW",
  "Traditionsreiches Programmkino im Grindelviertel mit Arthouse-Filmen, oft im Original",
  None,"bis15","Kinokarte ca. 10–12 € p. P.","",2.5,"https://www.abaton.de/"),
 ("Alsterrundfahrt ab Jungfernstieg","Jungfernstieg 7, 20354 Hamburg",53.5527,9.9930,"ausflug","beides","trocken","FSH",
  "Mit dem Alsterdampfer über Binnen- und Außenalster, vorbei an Villen und Gärten",
  None,U,PS,"",1.5,"https://www.alsterschifffahrt.de/"),
 ("Hamburger Fischmarkt","Große Elbstraße 9, 22767 Hamburg",53.5446,9.9461,"ausflug","beides","trocken","FSHW",
  "Sonntagmorgens Marktschreier, Fischbrötchen und Livemusik in der Fischauktionshalle",
  "So 5-9:30",V,"","imbiss",2,"https://www.hamburg.de/fischmarkt/"),
 ("Speicherstadt & Kontorhausviertel","Am Sandtorkai 1, 20457 Hamburg",53.5440,9.9930,"ausflug","draussen","trocken","FSHW",
  "UNESCO-Welterbe: Spaziergang durch die Backstein-Speicher, über Brücken und Fleete bis zum Chilehaus",
  None,F,"Frei zugänglich","",2,"https://www.hamburg.de/speicherstadt/"),
 ("Bullerei","Lagerstraße 34b, 20357 Hamburg",53.5634,9.9677,"cafe","drinnen","egal","FSHW",
  "Restaurant und Deli in den alten Viehhallen im Schanzenviertel",
  None,V,"","restaurant",2,"https://www.bullerei.com/"),
 ("Clouds – Heaven's Bar & Kitchen","Reeperbahn 1, 20359 Hamburg",53.5497,9.9690,"cafe","drinnen","egal","FSHW",
  "Bar und Restaurant im 23. Stock der Tanzenden Türme mit Blick über Hafen und St. Pauli",
  None,V,"","bar",2,"https://www.clouds-hamburg.de/"),
 ("Le Lion – Bar de Paris","Rathausstraße 3, 20095 Hamburg",53.5505,9.9937,"cafe","drinnen","egal","FSHW",
  "Vielfach ausgezeichnete Cocktailbar nahe dem Rathaus (Gin Basil Smash wurde hier erfunden)",
  None,V,"","bar",1.5,"https://www.lelion.net/"),
 ("Holthusenbad","Goernestraße 21, 20249 Hamburg",53.5893,9.9905,"baden","drinnen","egal","FSHW",
  "Jugendstil-Bad in Eppendorf mit Wellenbecken, Außenbecken und großer Saunalandschaft",
  None,U,PS,"",3,"https://www.baederland.de/"),
 ("Kanuverleih Bootshaus Silwar","Eppendorfer Landstraße 148b, 20251 Hamburg",53.5937,9.9858,"aktiv","draussen","warm","FS",
  "Kanu oder SUP leihen und über Alsterkanäle und Außenalster paddeln",
  None,U,PS,"",2.5,"https://www.bootshaus-silwar.com/"),
 ("Wittmoor – Moorwanderung","Wittmoor, 22851 Norderstedt",53.7055,10.0730,"natur","draussen","trocken","FSH",
  "Ruhige Runde auf Bohlenwegen durch das Hochmoor zwischen Norderstedt und Hamburg",
  None,F,"Frei zugänglich","",2,"https://www.norderstedt.de/"),
]
ERWN = {e[0] for e in ERW}
# Ziele aus den Familienlisten, die auch für Erwachsene allein passen
AUDB = {"Hamburger Kunsthalle","HolstenTherme Kaltenkirchen","Duvenstedter BrookHus (NABU)"}
