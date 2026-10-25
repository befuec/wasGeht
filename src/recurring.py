# Regelmäßige Angebote (Stand Websites/Programme 23.10.2026)
# (Ort, Wochentage 0=Mo..6=So, Beginn, Ende, Titel, Hinweis, ab, bis, URL oder None, Anmeldung nötig)
import datetime as _d
SOS = "SOS-Kinderdorf Harksheide – Haus 75 Familientreff"
_SOSP = "https://www.sos-kinderdorf.de/service/download/Programm%20und%20Veranstaltungen%20Haus%2075%20Familientreff%3A%202.%20Halbjahr%202026?id=14566"
START, END = "2026-10-23", "2026-12-31"
SKIP = {"2026-12-24","2026-12-25","2026-12-26","2026-12-31","2027-01-01"}
REC = [
 (SOS,[3],"09:00","12:00","Elternfrühstück","Offener Treff für Eltern mit Babys und Kleinkindern, 5 € p. P.",START,"2026-12-17",_SOSP,False),
 (SOS,[1,3],"12:00","17:00","Elterncafé","Offener Treff für Eltern mit Babys und Kleinkindern, Kaffee und Kuchen je ab 2 €",START,"2026-12-17",_SOSP,False),
 (SOS,[1],"14:00","17:00","Speeltied: Karten- und Brettspieltreff (9–99 J.)","offen",START,"2026-12-15",_SOSP,False),
 (SOS,[1],"14:30","17:00","Fahrrad-Selbsthilfe-Werkstatt","Hilfe zur Selbsthilfe",START,"2026-12-15",_SOSP,False),
 (SOS,[2],"09:00","12:00","Nähstübchen „Flinke Nadeln“ im Dorfhaus","Reparaturen und Änderungen, ehrenamtlich",START,"2026-12-16",_SOSP,False),
 (SOS,[2],"10:00","14:30","Mohltied: gemeinsam kochen und essen","Spende für Material, Anmeldung bis Di 12 Uhr",START,"2026-12-16",_SOSP,True),
 (SOS,[0,1],"15:30","17:40","Eltern-Kind-Kurs (1–3 J.)","20 € für 5 Termine, Anmeldung",START,"2026-12-15",_SOSP,True),
 (SOS,[0],"11:00","12:30","PEKiP (Kurs 1, 6 Wochen)","90 €, Anmeldung, mind. 6 Teilnehmende",START,"2026-12-14",_SOSP,True),
 (SOS,[2],"09:00","10:30","PEKiP (Kurs 2, 6 Wochen)","90 €, Anmeldung, mind. 6 Teilnehmende",START,"2026-12-16",_SOSP,True),
 (SOS,[2],"19:00","20:30","Chor4All in der Turnhalle","für alle, keine Vorkenntnisse nötig",START,"2026-12-16",_SOSP,False),
 ("Die Werkkiste",[2],"16:00","17:30","Offene Werkstatt","10 € plus Material, ohne Anmeldung, unter 16 J. mit Begleitung",START,END,"https://www.die-werkkiste.de/en/open-workshop/",False),
 ("Museum für Kunst und Gewerbe",[6],"13:00","17:00","Offene Familienwerkstatt","solange Vorrat reicht",START,END,"https://www.mkg-hamburg.de/en/happy-holidays",False),
 ("Lokschuppen Aumühle",[6],"11:00","","Museum geöffnet","Eisenbahnmuseum mit Fahrzeugen zum Anfassen",START,"2026-12-20",None,False),
 ("Herzapfelhof Lühs",[5,6],"13:30","","Hofführung (Winterprogramm)","Erw. 7,50 €, Kinder bis 16 frei, ohne Anmeldung","2026-11-01","2026-12-27",None,False),
 ("NORDIC Bowling",[6],"16:00","","Family-Sunday mit Kids-Club","Bahn 27 € pro Stunde, Bumper-Bahnen bei Buchung angeben",START,END,"https://nordic-bowling.de/bowling/",False),
 ("Gut Wulksfelde",[5],"10:30","14:30","Backen mit Kindern in der Gutsbäckerei (5–10 J.)","zwei Durchgänge, 10:30 und 13:00 Uhr","2026-11-07","2026-11-28","https://www.gut-wulksfelde.de/wulksfelde-erleben/",False),
]
WD = ["Mo","Di","Mi","Do","Fr","Sa","So"]
# Titel, die durch REC ersetzt werden (vorher einzeln datiert)
REPLACED = {"Museum für Kunst und Gewerbe":["Offene Familienwerkstatt"],"Lokschuppen Aumühle":["Museum offen"],
            "Herzapfelhof Lühs":["Hofführung (Winterprogramm)"],"Gut Wulksfelde":["Backen mit Kindern"]}
def expand_rec(place):
    out=[]
    for i,(pl,days,t0,t1,ti,no,a,b,u,an) in enumerate(REC):
        if pl!=place: continue
        d=_d.date.fromisoformat(max(a,START)); e=_d.date.fromisoformat(min(b,END))
        pat="jeden "+" und ".join(WD[x] for x in days)+(f", {t0}–{t1} Uhr" if t1 else f", {t0} Uhr")
        while d<=e:
            if d.weekday() in days and d.isoformat() not in SKIP:
                out.append(dict(dt=d.isoformat(),t=t0,te=t1,ti=ti,no=no,u=u,an=an,rg=pat,sid=f"r{i}",rr=dict(by=[["MO","TU","WE","TH","FR","SA","SU"][x] for x in days],until=min(b,END))))
            d+=_d.timedelta(1)
    return out
