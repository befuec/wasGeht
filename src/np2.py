# Neue Orte aus den vollständigen Google-Listen (HTML-Export 23.10.2026)
import json, re
exec(open("np2_raw.py").read())
DN=["Mo","Di","Mi","Do","Fr","Sa","So"]
def spec(h):
    if h is None: return None
    def fx(r): return ",".join(f"{a.split('-')[0]}-{a.split('-')[1]}" for a in r.split(","))
    parts=[];i=0
    while i<7:
        if not h[i]: i+=1; continue
        j=i
        while j+1<7 and h[j+1]==h[i]: j+=1
        parts.append((DN[i]+("-"+DN[j] if j>i else ""))+" "+fx(h[i])); i=j+1
    return "; ".join(parts) if parts else None
F,U,V="frei","unbek","verzehr"
PS="Preise siehe Website"
# idx: (cat, io, wx, seasons, stay, pt, preistext, cons, beschreibung)
M={
0:("natur","beides","trocken","FSHW",2,F,"Eintritt frei","","Vogelbeobachtung in der Elbmarsch mit Ausstellung und Beobachtungsstand"),
1:("museum","drinnen","egal","FSHW",1,F,"Eintritt frei","","Mitmach-Ausstellung zu Umwelt und Klima in der HafenCity"),
2:("natur","draussen","trocken","FSHW",2,F,"Eintritt frei, Spende erbeten","","Kinderbauernhof mit Tieren zum Anfassen in Wilhelmsburg"),
3:("aktiv","drinnen","egal","FSHW",2,U,PS,"","Boulderhalle mit Kinderbereich"),
4:("laden","drinnen","egal","FSHW",1,F,"Kein Eintritt","","Gartencenter mit Zoo- und Aquarienabteilung zum Schauen"),
5:("kreativ","drinnen","egal","FSHW",1.5,U,PS,"","Kindertheater in Ottensen (Spielzeiten siehe Website)"),
6:("museum","drinnen","egal","FSHW",2,U,PS,"","Kulturgeschichte Norddeutschlands mit Kinderbuchhaus, Kinder unter 18 frei"),
7:("cafe","beides","trocken","FSH",1.5,V,"","kuchen","Café in einem Schiffsanleger an der Elbe mit Spielplatz nebenan"),
8:("museum","beides","trocken","FSHW",2.5,U,PS,"","Freilichtmuseum mit alten Bauernhäusern, Tieren und Aktionstagen"),
9:("museum","beides","trocken","FSHW",2,U,PS,"","Museum zur Wasserversorgung auf der Elbinsel mit Café und Außengelände"),
10:("natur","draussen","trocken","FSHW",2,F,"Eintritt frei","","Botanischer Garten mit Bauerngarten, Wasserlauf und Gewächshäusern"),
11:("aktiv","draussen","warm","FSH",3,U,PS,"","Barfußpfad durch Wald und Wiesen mit Spielstationen (Saison bis ca. Oktober)"),
12:("aktiv","draussen","trocken","FSH",1,F,"Öffentlicher Spielplatz","","Spielplatz in Altona"),
13:("aktiv","draussen","trocken","FSH",1,F,"Öffentlicher Spielplatz","","Spielplatz mit Bahn-Thema in Altona"),
14:("aktiv","draussen","trocken","FSH",1.5,F,"Öffentlicher Spielplatz","","Großer Spielplatz in Stellingen"),
15:("natur","draussen","trocken","FSHW",0.5,F,"Frei zugänglich","","Kleine Hühnergasse mitten in Ottensen"),
16:("natur","draussen","trocken","FSHW",1.5,F,"Frei zugänglich","","Neuer Park auf dem A7-Deckel mit Spielflächen"),
17:("natur","draussen","trocken","FSHW",1.5,U,PS,"","Kleiner Tierpark mit Streichelgehege"),
18:("hof","beides","egal","FSHW",1.5,V,"","hofcafe","Hofcafé mit Kuchen und Spielmöglichkeiten"),
19:("cafe","drinnen","egal","FSHW",1,V,"","kuchen","Rösterei-Café in Norderstedt"),
20:("kreativ","drinnen","egal","FSHW",1.5,U,PS,"","Architektur-Werkstatt und Kurse für Kinder und Jugendliche"),
21:("museum","drinnen","egal","FSHW",1.5,U,PS,"","Immersive Kunstausstellungen mit Projektionen in der HafenCity"),
22:("aktiv","draussen","trocken","FSHW",2,F,"Kostenlos","","Bauspielplatz mit Spielhaus, betreute Öffnungszeiten"),
23:("ausflug","draussen","trocken","FSH",3,U,PS,"","Erlebnisgarten mit Spiel- und Tierbereichen an der Ostsee"),
24:("aktiv","draussen","trocken","FSH",1,F,"Öffentlicher Spielplatz","","Spielplatz Arnoldstraße in Ottensen"),
25:("aktiv","draussen","warm","S",1.5,F,"Öffentlicher Spielplatz","","Wasserspielplatz im Inselpark Wilhelmsburg"),
26:("aktiv","draussen","trocken","FSH",1.5,F,"Öffentlicher Spielplatz","","Abenteuerspielplatz im Inselpark Wilhelmsburg"),
27:("cafe","beides","trocken","FSH",1,V,"","kuchen","Café im Inselpark"),
28:("aktiv","draussen","warm","S",1,F,"Frei zugänglich","","Wasserfontäne zum Spielen im Inselpark"),
29:("laden","drinnen","egal","FSHW",1,F,"Kein Eintritt","","Große Buchhandlung mit Kinderbuchabteilung"),
30:("cafe","drinnen","egal","FSHW",1.5,V,"","restaurant","Vietnamesisches Restaurant in Eppendorf"),
31:("spiel","drinnen","egal","FSHW",2.5,U,"Tickets online günstiger, Zeitfenster buchen","","LEGO-Indoor-Spielwelt mit Bauflächen, Fahrgeschäft und 4D-Kino (3–10 J.)"),
32:("spiel","drinnen","egal","FSHW",2.5,U,PS,"","Indoor-Rollenspielstadt für Kinder"),
33:("natur","draussen","trocken","FSHW",2,F,"Frei zugänglich","","Großer Park mit See, Spielplätzen und Wasserspielplatz"),
34:("cafe","draussen","trocken","FSH",1,V,"","imbiss","Waldkiosk im Falkensteiner Forst"),
35:("cafe","drinnen","egal","FSHW",1,V,"","restaurant","Pasta und Pizza am Gänsemarkt"),
36:("hof","draussen","trocken","FSH",4,U,PS,"","Erlebnishof mit Tieren, Spielscheune und Maislabyrinth in Dithmarschen"),
37:("cafe","beides","warm","FSH",0.5,V,"","eis","Eisdiele in Bramfeld"),
38:("cafe","beides","warm","FSH",0.5,V,"","eis","Eisladen in Ottensen"),
39:("cafe","beides","warm","FSH",0.5,V,"","eis","Vegane Eismanufaktur in Eimsbüttel"),
40:("cafe","drinnen","egal","FSHW",1,V,"","kuchen","Café in Seevetal"),
41:("cafe","beides","warm","FSH",0.5,V,"","eis","Eisladen in der HafenCity"),
42:("aktiv","drinnen","egal","FSHW",1.5,U,"Kurse und Mitgliedschaft","","Sportverein mit Kinderturnen und Kursen"),
43:("spiel","drinnen","egal","FSHW",1.5,U,PS,"","Salzspielplatz für Babys und Kleinkinder"),
44:("spiel","drinnen","egal","FSHW",1,U,PS,"","Salzraum mit Kinderspielbereich"),
45:("cafe","drinnen","egal","FSHW",1,V,"","baecker","Bäckerei-Café in Barmbek"),
46:("cafe","drinnen","egal","FSHW",1,V,"","kuchen","Café in Ottensen"),
47:("cafe","beides","warm","FSH",0.5,V,"","eis","Eis-Café direkt am Spielplatz Arnoldstraße"),
48:("museum","drinnen","egal","FSHW",1.5,U,PS,"","Kunstausstellungen mit Familienangeboten"),
49:("cafe","beides","egal","FSHW",1.5,V,"","restaurant","Restaurant am Anleger Finkenwerder"),
50:("cafe","draussen","trocken","FSHW",1.5,V,"","imbiss","Kultkiosk am Elbstrand Övelgönne"),
51:("kreativ","drinnen","egal","FSHW",1.5,U,PS,"","Malatelier mit Kinderkursen"),
52:("ausflug","draussen","warm","FSH",3,U,PS,"","Barfußpark mit Maislabyrinth im Sommer"),
53:("museum","drinnen","egal","FSHW",2,U,PS,"","Mitmach-Museum rund um Filz"),
54:("sonst","drinnen","egal","FSHW",0.75,U,PS,"","Friseursalon (Kinderhaarschnitt)"),
55:("cafe","drinnen","egal","FSHW",0.75,V,"","baecker","Bäckerei-Café in Rhen"),
56:("ausflug","draussen","warm","FS",1.5,U,PS,"","Bootsverleih am Stadtpark (laut Google vorübergehend geschlossen)"),
57:("museum","drinnen","egal","FSHW",1.5,F,"Eintritt frei","","Zoologische Sammlung mit großen Tierpräparaten"),
58:("aktiv","draussen","trocken","FSH",1.5,F,"Frei zugänglich","","Skatepark im Frederikspark"),
59:("hof","beides","egal","FSHW",1.5,V,"","hofcafe","Hofcafé auf dem Land"),
60:("baden","drinnen","egal","FSHW",3,U,PS,"","Hallenbad in Barmstedt"),
61:("spiel","drinnen","egal","FSHW",3,U,PS,"","Indoor-Spielplatz in Bönningstedt"),
62:("spiel","drinnen","egal","FSHW",2,U,PS,"","Spielcafé mit festen Spielzeitfenstern"),
63:("aktiv","drinnen","egal","FSHW",2,U,PS,"","Actionhalle mit Lasertag und Spielen"),
64:("kreativ","drinnen","egal","FSHW",2,U,PS,"","Kino mit Kinderfilmen"),
65:("aktiv","draussen","trocken","FSH",1.5,U,PS,"","Minigolfanlage"),
66:("cafe","beides","warm","FSH",0.5,V,"","eis","Eisdiele in Rhen"),
67:("natur","draussen","trocken","FSHW",2.5,U,PS,"","Großer Baumgarten mit Spielplatz und Café"),
68:("natur","draussen","trocken","FSHW",2,F,"Frei zugänglich","","Schlossinsel mit Park, Café und Tretbooten"),
69:("baden","draussen","warm","S",3,U,PS,"","Naturbad mit Nichtschwimmerbereich (nur Sommer)"),
70:("ausflug","draussen","trocken","FSH",2,U,PS,"","Fahrt mit der Torfbahn durchs Moor, sonntags (Saison)"),
71:("natur","draussen","trocken","FSHW",2,F,"Frei zugänglich","","Waldgebiet mit Bach und Grillplatz"),
72:("ausflug","draussen","warm","FS",2,U,PS,"","Kajak-Verleih per Automat an der Alster"),
73:("ausflug","draussen","warm","FS",1.5,U,PS,"","Kanu- und Tretbootverleih am Stadtpark"),
74:("ausflug","draussen","warm","FS",2,F,"Kostenlos für Familien und Jugendliche","","Städtischer Kanu-Verleih mit Freizeitangeboten (Saison bis September)"),
75:("ausflug","draussen","trocken","FSHW",3,U,"Eintritt frei, Fahrgeschäfte kostenpflichtig","","Volksfest auf dem Heiligengeistfeld, dreimal im Jahr (u. a. Winterdom)"),
76:("natur","draussen","trocken","FSHW",3.5,U,PS,"","Wildpark mit Fütterungen und Greifvogelschau"),
77:("museum","beides","trocken","FSHW",3,U,"Kinder unter 18 frei","","Freilichtmuseum mit Höfen, Tieren und Spielplätzen"),
78:("ausflug","draussen","trocken","S",3,U,"Tickets im Vorverkauf","","Open-Air-Theater mit Winnetou (nur Sommer)"),
79:("natur","draussen","trocken","FSHW",3,U,PS,"","Tierpark im Wald mit Streichelgehege"),
80:("museum","drinnen","egal","FSHW",1.5,U,PS,"","Museumsfrachter an der Überseebrücke"),
81:("aktiv","draussen","trocken","HW",2,U,PS,"","Große Eisbahn in Planten un Blomen (Wintersaison)"),
82:("ausflug","beides","egal","FSHW",1,F,"Für Fußgänger kostenlos","","Historischer Tunnel unter der Elbe mit Aussicht auf der anderen Seite"),
83:("ausflug","beides","egal","FSHW",2,"bis5","HVV-Fahrkarte, Kinder unter 6 Jahren frei","","Hafenrundfahrt mit der HVV-Fähre ab Landungsbrücken"),
84:("kreativ","drinnen","egal","FSHW",1.5,U,PS,"","Kinderoper und Musiktheater für Kinder"),
85:("spiel","drinnen","egal","FSHW",3,U,PS,"","Großer Indoor-Spielplatz"),
86:("kreativ","drinnen","egal","FSHW",1.5,F,"Kostenlos","","Zentrale Bücherhalle mit großer Kinderbibliothek"),
87:("kreativ","drinnen","egal","FSHW",1.5,U,PS,"","Mitmach-Ausstellungen zu Kinderbüchern im Altonaer Museum"),
88:("museum","drinnen","egal","FSHW",3,U,"Zeitfenster-Tickets online","","Größte Modelleisenbahn der Welt"),
89:("baden","draussen","trocken","FSHW",2,F,"Frei zugänglich","","Sandstrand an der Elbe mit Blick auf Containerschiffe"),
90:("natur","draussen","trocken","FSHW",2,F,"Frei zugänglich","","Innenstadtpark mit Spielplätzen und Wasserspielen"),
91:("natur","draussen","trocken","FSHW",2.5,F,"Frei zugänglich","","Großer Volkspark mit Spielplätzen und Planschbecken"),
92:("natur","beides","trocken","FSHW",2.5,F,"Eintritt frei","","Infohaus im Naturschutzgebiet mit Rundwegen"),
93:("baden","drinnen","egal","FSHW",3,U,PS,"","Erlebnisbad mit Rutschen und Außenbecken"),
94:("baden","draussen","warm","S",3,U,PS,"","Badesee mit Strandbad, Rutsche und Sprungturm (nur Sommer)"),
95:("natur","draussen","trocken","FSHW",4,U,PS,"","Wildpark mit Flugshow im Münsterland (weit entfernt)"),
96:("ausflug","draussen","warm","FS",4,U,PS,"","Familien-Campingplatz mit Badesee und Spielplatz"),
97:("spiel","drinnen","egal","FSHW",3,U,PS,"","Indoor-Spielplatz für kleine Kinder in den Niederlanden (weit entfernt)"),
98:("cafe","beides","egal","FSHW",1.5,V,"","fruehstueck","Café auf dem Energiebunker mit Rundum-Aussicht"),
99:("kreativ","drinnen","egal","FSHW",1.5,U,"Material plus 4 € für Kinder","","Druckwerkstatt mit offenen Zeiten"),
100:("aktiv","draussen","trocken","FSH",1.5,F,"Frei zugänglich","","Kleiner Skateplatz mit Halfpipe am Beckersberg"),
101:("sonst","drinnen","egal","FSHW",1.5,U,"Übernachtung; Spielbereiche für Hotelgäste und Restaurantbesucher","","Familienhotel mit großem Indoor-Spielbereich und Restaurant"),
102:("ausflug","draussen","trocken","S",2.5,F,"Veranstaltungen meist kostenlos","","Verein mit Familien-Veranstaltungen wie Open-Air-Kino im Sommer"),
103:("aktiv","drinnen","egal","FSHW",2,U,PS,"","Boulderhalle mit eigenem Kinderbereich"),
104:("natur","draussen","trocken","FSHW",1.5,F,"Frei zugänglich","","Park mit See, Teichen und Spielplatz (Zuordnung zum Listeneintrag „Bürgerpark“ angenommen)"),
}
HNT={5:"Spielzeiten siehe Website",11:"Saisonbetrieb, Zeiten siehe Website",27:"Zeiten siehe Website",34:"Zeiten siehe Website",36:"Saisonbetrieb, Zeiten siehe Website",
 38:"Zeiten siehe Website",47:"Zeiten siehe Website",56:"Laut Google vorübergehend geschlossen",64:"Vorstellungen siehe Programm",69:"Nur in der Badesaison",
 75:"Nur während der Dom-Zeiten (Frühlings-, Sommer- und Winterdom)",78:"Spielzeit im Sommer",84:"Vorstellungen siehe Spielplan",70:"Sonntags in der Saison (Mai–Oktober)",
 74:"Saison Ende Mai bis September",81:"Wintersaison",99:"Offene Zeiten Di und Fr 15–17 Uhr",102:"Termine siehe Website"}
WEBS={88:"https://www.miniatur-wunderland.de/",76:"https://www.wildpark-schwarze-berge.de/",77:"https://www.kiekeberg-museum.de/",
 78:"https://www.karl-may-spiele.de/",80:"https://www.capsandiego.de/",75:"https://www.hamburger-dom.de/",86:"https://www.buecherhallen.de/",
 31:"https://www.legodiscoverycentre.com/hamburg/",48:"https://www.buceriuskunstforum.de/",93:"https://www.arriba-erlebnisbad.de/"}
q=json.load(open("newq.json")); L=json.load(open("lists_full.json"))
HW={x["n"] for x in L["hwk"]}; KA={x["n"] for x in L["ka"]}
skip={0,1,47}
qi=[i for i in range(len(q)) if i not in skip]
NP2=[];NH2={};NHN2={};NPR2={};CONS2={};STAY2={};WEB2={};SRC2={}
for k,r in enumerate(R):
    n,a,la,ln,gt,h,src=r
    c,io,wx,s,st,pt,ptx,cons,de=M[k]
    NP2.append((n,a,la,ln,c,io,wx,s,de,None))
    NH2[n]=spec(h); 
    if k in HNT: NHN2[n]=HNT[k]
    NPR2[n]=(pt,False,ptx if pt!=V else "Kein Eintritt, nur Verzehr")
    if cons: CONS2[n]=cons
    STAY2[n]=st
    if k in WEBS: WEB2[n]=WEBS[k]
# Listenzugehörigkeit per Namensabgleich mit den Original-Listennamen
import difflib
def _n(x): return re.sub(r"[^a-z0-9äöüß ]"," ",x.lower())
def best(n,cands):
    sc=[(difflib.SequenceMatcher(None,_n(n),_n(c)).ratio()+0.2*len([w for w in set(_n(n).split())&set(_n(c).split()) if len(w)>3]),c) for c in cands]
    return max(sc)
MAN={"Frau Meis Eis • Café (Spielplatz Arnoldstraße)":"Frau Meis Eis • Café","Frau Meis Eisladen (Ottensen)":"Frau Meis Eisladen","Kanuverleih Liebesinsel (Stadtpark)":"Kanuverleih Hamburg",
     "Hafenfähre 62 nach Finkenwerder":"Hamburg-Finkenwerder Landungsbrücke","Allee Theater – Theater für Kinder":"Allee Theater Hamburg","Deckelpark Stellingen (A7-Deckel)":"A7 Deckel Stellingen",
     "Stadtpark Norderstedt":"Norderstedt Park","Wasserkunst Elbinsel Kaltehofe":"Kaltehofe","Tobolino Spielcafé Kaltenkirchen":"Tobolino Kaki UG","Kids & Play Bönningstedt":"Kids & Play","Spielplatz Arni":"Playground Arni","Vapiano Gänsemarkt":"Vapiano","Minigolf-Oase Henstedt-Ulzburg":"Minigolf-Oase","EisArena Hamburg (Planten un Blomen)":"EisArena Hamburg","Stadtpark Hamburg":"Stadtpark",
 "Hofladen & Café Hollenstedt":"Hofcafé Wilkenshoff","Bunker St. Pauli":"Hamburg BUNKER","Gut Karlshöhe":"Hamburger Klimaschutzstiftung","U-Boot Museum":"U-Bootmuseum Hamburg GmbH","Sommerrodelbahn Ibbenbüren":"Freizeitpark Sommerrodelbahn","SOS-Kinderdorf Harksheide – Haus 75 Familientreff":"SOS-Kinderdorf Harksheide","LüttePlünn":"LüttePlünn Secondhandshop für Kinder - DRK Kreisverband Hamburg - Nordost e.V.","Hamburg Airport":"Flughafen Hamburg","Gemeindebücherei Henstedt-Ulzburg":"Gemeindebücherei und -mediothek","Bürgerpark Henstedt-Ulzburg":"Bürgerpark","Bürgerpark Ellerau":"Bürgerpark","Inklusionsspielplatz Henstedt-Ulzburg":"Inklusionsspielplatz","urban apes Norderstedt":"urban apes Norderstedt"}
ALLN=list(HW|KA); names=[r[0] for r in R]
for n in names:
    o=MAN.get(n) or best(n,ALLN)[1]
    SRC2[n]="beide" if (o in HW and o in KA) else "hwk" if o in HW else "ka"
    MATCH=globals().setdefault("MATCH",{}); MATCH[n]=o
SRC2["ETV Sportzentrum Hoheluft"]="beide"; SRC2["Museum der Natur Hamburg – Zoologie"]="beide"

def SRCF(n):
    if n in SRC2: return SRC2[n]
    o=MAN.get(n) or best(n,ALLN)[1]
    if o.startswith("LüttePlünn"): pass
    return "beide" if (o in HW and o in KA) else "hwk" if o in HW else "ka"
def MATCHF(n): return MAN.get(n) or (MATCH.get(n) if n in MATCH else best(n,ALLN)[1])
