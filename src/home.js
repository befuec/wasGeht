/* ===== Zuhause: Aufgaben, Fairness, Punkte, Belohnungen ===== */
const HCATS=[["kinder","👶","Kinder & Alltag"],["gesund","🩺","Gesundheit & Arzttermine"],["haushalt","🧹","Haushalt & Putzen"],["garten","🌳","Garten & Draußen"],["haus","🔧","Haus, Technik & Auto"],["projekt","🛠️","Projekte & Renovierung"],["orga","🗂️","Organisation (Kopf-Arbeit)"],["feste","🎁","Feste & Geschenke"],["sport","⚽","Sport & Freizeit"],["kuemmern","💛","Kümmern & Beziehungen"],["kids","🧒","Aufgaben für Kinder"]];
const HCAT=Object.fromEntries(HCATS.map(c=>[c[0],c]));
const MENTAL=new Set(["orga","feste","gesund","kuemmern"]);
/* [id, Kategorie, Icon, Titel, Turnus, Minuten, unbeliebt, Kinderaufgabe, Checkliste] */
const HT=[
["k_baden","kinder","🛁","Kinder baden","w1",30,0,0],["k_abholen","kinder","🚸","Kinder abholen","wd",30,0,0],["k_bringen","kinder","🎒","Kinder in Kita/Schule bringen","wd",25,0,0],
["k_hausaufg","kinder","✏️","Hausaufgaben begleiten","wd",30,0,0],["k_brotdose","kinder","🥪","Brotdosen packen","wd",10,0,0],["k_bett","kinder","🌙","Zubettbringen & Vorlesen","d",30,0,0],
["k_naegel","kinder","✂️","Fingernägel schneiden","w1",10,1,0],["k_kleidung","kinder","👕","Kinderkleidung aussortieren & neu kaufen","m6",90,0,0,["Zu Kleines aussortieren","Größen notieren","Neue Sachen kaufen","Aussortiertes spenden/verkaufen"]],
["k_elternabend","kinder","🏫","Elternabend / Entwicklungsgespräch","m6",90,0,0],["k_kita","kinder","📋","Kita-/Schulsachen & Formulare erledigen","w1",20,1,0],
["g_u","gesund","🩺","U-Untersuchung / Kinderarzt-Termin vereinbaren","y1",15,0,0,["Termin vereinbaren","Gelbes Heft & Impfpass einpacken","Fragen notieren"]],
["g_zahnk","gesund","🦷","Zahnarzt Kinder – Termin vereinbaren","m6",15,0,0],["g_zahne","gesund","🦷","Zahnarzt Erwachsene – Termin vereinbaren","m6",15,0,0],
["g_impf","gesund","💉","Impfpässe prüfen","y1",20,0,0],["g_apo","gesund","💊","Hausapotheke prüfen & auffüllen","m6",30,0,0],["g_auge","gesund","👓","Augenarzt-/Optiker-Termin","y1",15,0,0],
["g_arzt","gesund","🏥","Arzttermin","x",60,0,0],["g_rezept","gesund","📄","Rezepte & Medikamente besorgen","m1",30,1,0],
["h_einkauf","haushalt","🛒","Wocheneinkauf","w1",90,0,0],["h_frisch","haushalt","🥦","Frisches einkaufen (Bäcker, Obst)","w1",30,0,0],["h_essen","haushalt","🍽️","Essen für die Woche planen","w1",20,0,0],
["h_kochen","haushalt","🍳","Kochen","d",45,0,0],["h_spuel","haushalt","🍽️","Spülmaschine ein- & ausräumen","d",10,0,0],["h_waesche","haushalt","🧺","Wäsche waschen & aufhängen","w1",40,0,0],
["h_falten","haushalt","👚","Wäsche zusammenlegen & wegräumen","w1",30,1,0],["h_bad","haushalt","🚽","Bad putzen","w1",40,1,0],["h_kueche","haushalt","🧽","Küche gründlich putzen","w1",30,1,0],
["h_saugen","haushalt","🧹","Staubsaugen","w1",40,0,0],["h_wischen","haushalt","🪣","Böden wischen","w2",40,1,0],["h_betten","haushalt","🛏️","Betten beziehen","w2",30,0,0],
["h_muell","haushalt","🗑️","Müll rausbringen","w1",10,0,0],["h_kuehl","haushalt","🧊","Kühlschrank auswischen","m1",20,1,0],["h_fenster","haushalt","🪟","Fenster putzen","m3",120,1,0],
["h_grund","haushalt","✨","Grundreinigung","m3",240,1,0,["Küche (Schränke, Backofen)","Bäder entkalken","Fußleisten & Türen","Matratzen saugen","Lampen & Heizkörper"]],
["h_robo","haushalt","🤖","Saugroboter: Behälter leeren & Bürsten reinigen","w1",10,0,0],["h_robof","haushalt","🤖","Saugroboter: Filter & Seitenbürste tauschen","m3",15,0,0],
["h_entkalk","haushalt","☕","Kaffeemaschine & Wasserkocher entkalken","m1",15,0,0],["h_staub","haushalt","🪶","Staub wischen","w2",30,0,0],
["ga_maehen","garten","🌱","Rasen mähen","w1",45,0,0],["ga_fegen","garten","🧹","Draußen fegen (Einfahrt, Terrasse)","w1",20,0,0],["ga_unkraut","garten","🌿","Unkraut jäten","w2",45,1,0],
["ga_hecke","garten","✂️","Hecke schneiden","m6",120,1,0],["ga_laub","garten","🍂","Laub harken","w1",45,0,0],["ga_giessen","garten","💧","Pflanzen & Beete gießen","d",15,0,0],
["ga_beet","garten","🥕","Gemüsebeet & Gewächshaus pflegen","w1",45,0,0],["ga_terr","garten","🪑","Terrasse & Gartenmöbel reinigen","m6",90,0,0],["ga_rinne","garten","🏠","Dachrinne reinigen","y1",90,1,0],
["ga_winter","garten","❄️","Garten winterfest machen","y1",180,0,0,["Wasserhähne außen absperren","Kübelpflanzen rein","Gartenmöbel abdecken","Rasenmäher einwintern"]],["ga_tonnen","garten","♻️","Mülltonnen an die Straße stellen","w1",5,0,0],
["ha_rauch","haus","🚨","Rauchmelder testen","y1",20,0,0],["ha_heiz","haus","🌡️","Heizkörper entlüften","y1",30,0,0],["ha_dunst","haus","💨","Filter Dunstabzug reinigen","m3",15,0,0],
["ha_repar","haus","🔨","Kleinreparaturen erledigen","m1",60,0,0],["ha_zaehler","haus","📟","Zählerstände ablesen","m1",10,0,0],["ha_reifen","haus","🚗","Reifenwechsel (Werkstatt-Termin)","m6",60,0,0],
["ha_auto","haus","🚿","Auto waschen & aussaugen","m1",60,0,0],["ha_tuev","haus","🔧","Inspektion / TÜV","y1",30,0,0],["ha_it","haus","💻","Updates & Backups (Handys, Rechner)","m1",30,1,0],
["p_renov","projekt","🎨","Renovierungsprojekt","x",240,0,0,["Plan & Material-Liste","Material kaufen","Abkleben & vorbereiten","Arbeiten","Aufräumen"]],["p_bau","projekt","🪚","Etwas Neues bauen","x",240,0,0,["Idee & Maße","Material besorgen","Bauen","Aufräumen"]],
["p_handw","projekt","👷","Handwerker-Termin","x",60,0,0,["Angebote einholen","Termin vereinbaren","Anwesend sein","Rechnung prüfen"]],["p_angebot","projekt","📑","Angebote einholen","x",60,1,0],
["p_baumarkt","projekt","🏪","Baumarkt-Einkauf","x",90,0,0],["p_ausmist","projekt","📦","Ausmisten (Keller, Dachboden, Schränke)","m6",180,1,0],
["o_post","orga","📬","Post & Rechnungen erledigen","w1",30,1,0],["o_kal","orga","📅","Familienkalender pflegen & Woche besprechen","w1",20,0,0],["o_steuer","orga","🧾","Steuererklärung","y1",480,1,0,["Belege sammeln","Unterlagen sortieren","Erklärung ausfüllen","Abschicken"]],
["o_vers","orga","🛡️","Versicherungen & Verträge prüfen","y1",120,1,0],["o_abos","orga","💳","Abos & Kontoauszüge durchsehen","m1",30,1,0],["o_urlaub","orga","🏝️","Urlaub planen & buchen","m6",180,0,0],
["o_termine","orga","🗓️","Kita-/Schul-Termine & Ferien eintragen","m3",30,0,0],["o_sitter","orga","🧑‍🍼","Babysitter / Betreuung organisieren","m1",20,0,0],["o_ablage","orga","🗄️","Papierkram ablegen","m1",45,1,0],
["f_geburtstag","feste","🎂","Kindergeburtstag organisieren","y1",300,0,0,["Gäste & Datum festlegen","Einladungen verschicken","Programm / Spiele planen","Kuchen & Essen","Deko besorgen","Geschenk kaufen","Mitgebsel packen"]],
["f_geschenk","feste","🎁","Geschenk kaufen","x",60,0,0],["f_karten","feste","💌","Geburtstagsgrüße & Karten","m1",20,0,0],
["f_weihn","feste","🎄","Weihnachten vorbereiten","y1",360,0,0,["Wunschzettel sammeln","Geschenke kaufen","Geschenke einpacken","Baum & Deko","Plätzchen backen","Besuche & Essen planen"]],
["f_ostern","feste","🐣","Ostern vorbereiten","y1",120,0,0,["Eier färben","Nester & Kleinigkeiten","Osterfrühstück planen"]],["f_einlad","feste","🎈","Mitbringsel für Einladung besorgen","x",30,0,0],
["s_eigen","sport","🏃","Eigener Sport","w1",60,0,0],["s_kinder","sport","⚽","Kinder zum Sport fahren","w1",60,0,0],["s_schwimm","sport","🏊","Schwimmkurs begleiten","w1",75,0,0],
["s_tasche","sport","👟","Sporttaschen packen & Sportsachen waschen","w1",15,0,0],["s_playdate","sport","🤝","Freundesbesuch für die Kinder organisieren","w2",20,0,0],["s_freunde","sport","🍻","Treffen mit Freunden planen","m1",20,0,0],
["s_ausflug","sport","🗺️","Familienausflug planen","w2",20,0,0],
["ku_oma","kuemmern","👵","Großeltern anrufen oder besuchen","w1",45,0,0],["ku_date","kuemmern","💑","Paarzeit / Date planen","m1",20,0,0],["ku_tier","kuemmern","🐾","Haustier versorgen","d",20,0,0],
["ku_pflanz","kuemmern","🪴","Zimmerpflanzen gießen","w1",10,0,0],["ku_nachbar","kuemmern","🏘️","Nachbarn / Freunden helfen","m1",60,0,0],["ku_metime","kuemmern","🧘","Auszeit für den Partner organisieren","m1",15,0,0],
["ki_zimmer","kids","🧸","Zimmer aufräumen","w1",20,0,1],["ki_tisch","kids","🍴","Tisch decken","d",5,0,1],["ki_abr","kids","🍽️","Tisch abräumen","d",5,0,1],
["ki_spiel","kids","🧩","Spielzeug wegräumen","d",10,0,1],["ki_giessen","kids","🌻","Blumen gießen","w1",10,0,1],["ki_schuhe","kids","👟","Schuhe ordentlich hinstellen","d",3,0,1],
["ki_ranzen","kids","🎒","Schulranzen / Kita-Tasche packen","wd",5,0,1],["ki_zaehne","kids","🪥","Zähne putzen ohne Erinnerung","d",5,0,1],["ki_waesche","kids","🧦","Schmutzwäsche in den Korb","d",3,0,1],
["ki_tier","kids","🐟","Haustier füttern","d",5,0,1],["ki_muell","kids","🗑️","Müll mit rausbringen","w1",5,0,1],["ki_helfen","kids","🥄","Beim Kochen helfen","w1",20,0,1]];
const HFREQ=[["x","Einmalig / Termin"],["d","Täglich"],["wd","Mo–Fr"],["w1","Wöchentlich"],["w2","Alle 2 Wochen"],["w4","Alle 4 Wochen"],["m1","Monatlich"],["m3","Alle 3 Monate"],["m6","Alle 6 Monate"],["y1","Jährlich"]];
const HFL=Object.fromEntries(HFREQ);
/* Weitere Vorlagen */
const HT2=[
["k_ausmist","kinder","🧸","Kinderzimmer ausmisten","m3",60,0,0],
["k_groessen","kinder","👟","Schuh- & Kleidergrößen prüfen","m3",20,0,0],
["k_mails","kinder","📨","Kita-/Schul-Nachrichten lesen & beantworten","w1",15,1,0],
["g_checkup","gesund","🩺","Check-up beim Hausarzt (Erwachsene)","y1",15,0,0],
["g_haut","gesund","🔎","Hautkrebs-Screening","y1",15,0,0],
["g_impfk","gesund","💉","Impftermin Kinder","x",60,0,0],
["h_fronten","haushalt","🚪","Küchenfronten reinigen","m1",20,1,0],
["h_ofen","haushalt","🔥","Backofen & Mikrowelle reinigen","m1",30,1,0],
["h_spuelm","haushalt","🧽","Spülmaschine reinigen","m1",15,1,0],
["h_wm","haushalt","🌀","Waschmaschine reinigen","m1",15,1,0],
["h_abfluss","haushalt","🚿","Abflüsse reinigen","m1",15,1,0],
["h_altglas","haushalt","🍾","Altglas, Altpapier & Pfand wegbringen","w2",20,0,0],
["h_vorrat","haushalt","🥫","Vorräte prüfen & Einkaufsliste","w1",15,0,0],
["h_saison","haushalt","🧥","Kleiderschrank saisonal umräumen","m6",90,0,0],
["h_spiegel","haushalt","🪞","Spiegel & Glasflächen putzen","w2",15,0,0],
["h_aufr","haushalt","🧺","Abends 10 Minuten gemeinsam aufräumen","d",10,0,0],
["ga_duengen","garten","🌱","Rasen düngen & vertikutieren","m6",60,0,0],
["ga_kompost","garten","🪱","Kompost umsetzen","m3",45,1,0],
["ga_vogel","garten","🐦","Vogelhäuschen auffüllen","w1",5,0,0],
["ga_rad","garten","🚲","Fahrräder pflegen & Luft prüfen","m1",30,0,0],
["ga_schnee","garten","❄️","Schnee schippen & streuen","x",30,1,0],
["ha_feucht","haus","💧","Keller & Dachboden auf Feuchtigkeit prüfen","m3",15,0,0],
["ha_pv","haus","☀️","PV-Anlage & Speicher kontrollieren","m1",10,0,0],
["ha_heizung","haus","🔥","Heizungswartung beauftragen","y1",20,0,0],
["o_ausweis","orga","🪪","Ausweise & Reisepässe auf Ablauf prüfen","y1",15,0,0],
["o_geschliste","orga","📝","Geschenkeliste & Wunschzettel pflegen","m1",15,0,0],
["o_budget","orga","📊","Haushaltsbudget durchgehen","m1",45,1,0],
["o_garantie","orga","🧾","Garantien & Belege sortieren","m3",30,1,0],
["o_anbieter","orga","⚡","Strom-, Gas- & Handytarife vergleichen","y1",60,1,0],
["o_fotos","orga","🖼️","Fotos sichern & sortieren","m3",30,0,0],
["o_omakal","orga","📆","Termine mit Großeltern abstimmen","m1",15,0,0],
["f_advent","feste","📅","Adventskalender besorgen","y1",120,0,0],
["ku_einladen","kuemmern","🍲","Freunde zum Essen einladen","m1",120,0,0],
["ku_review","kuemmern","☕","Wochenrückblick zu zweit","w1",30,0,0],
["ku_duenger","kuemmern","🪴","Pflanzen düngen & umtopfen","m3",30,0,0],
["ki_bett","kids","🛏️","Bett machen","d",3,0,1],
["ki_hausaufg","kids","✏️","Hausaufgaben selbst erledigen","wd",20,0,1],
["ki_lesen","kids","📚","15 Minuten lesen üben","d",15,0,1],
["ki_instr","kids","🎵","Instrument üben","d",15,0,1],
["ki_spuel","kids","🍽️","Geschirr in die Spülmaschine","d",5,0,1],
["ki_sortieren","kids","🧦","Wäsche sortieren helfen","w1",10,0,1],
["ki_laub","kids","🍂","Beim Laubfegen helfen","w1",15,0,1],
["ki_turnbeutel","kids","🎽","Turnbeutel packen","w1",5,0,1]];
const hCcfg=()=>{const c=SETS.hcat||{};return {add:Array.isArray(c.add)?c.add:[],del:Array.isArray(c.del)?c.del:[],ov:c.ov&&typeof c.ov==="object"?c.ov:{}}};
const hTplObj=x=>({id:x[0],cat:x[1],ic:x[2],ti:x[3],f:x[4],dur:x[5],unpop:x[6],kid:x[7],ck:x[8]||[],bi:1});
function hTpls(){const C=hCcfg();return HT.concat(HT2).filter(x=>!C.del.includes(x[0])).map(x=>Object.assign(hTplObj(x),C.ov[x[0]]||{})).concat(C.add.filter(x=>x&&x.ti&&!C.del.includes(x.id)))}
/* Belohnungen: [id, Icon, Titel, Punkte, Gruppe, für: a=Erwachsene k=Kinder b=beide] */
const HREW=[
 ["r_schulter","💆","15 Min. Schultermassage",30,"erholung","a"],["r_eis","🍦","Eis essen gehen",30,"genuss","b"],["r_kaffee","☕","Kaffee in Ruhe trinken",30,"erholung","a"],
 ["r_ausschlaf","😴","Ausschlafen (bis 9 Uhr)",60,"erholung","a"],["r_wanne","🛁","Badewanne in Ruhe",60,"erholung","a"],["r_mittag","💤","Ungestörter Mittagsschlaf",60,"erholung","a"],["r_stunde","⏳","Eine Stunde nur für mich",60,"freiraum","a"],["r_kuchen","🍰","Lieblingskuchen backen lassen",60,"genuss","a"],
 ["r_massage","💆","30 Min. Massage",100,"erholung","a"],["r_sport","🏃","Sport allein, ohne schlechtes Gewissen",100,"freiraum","a"],["r_morgen","☕","Wochenend-Morgen frei",100,"freiraum","a"],["r_essen","🍝","Lieblingsessen gekocht bekommen",100,"genuss","a"],["r_fruehst","🥐","Frühstück ans Bett",100,"genuss","a"],
 ["r_abend","🌆","Abend frei",150,"freiraum","a"],["r_freunde","🍻","Treffen mit Freunden",150,"freiraum","a"],["r_serie","📺","Serienabend, Fernbedienung gehört mir",150,"freiraum","a"],
 ["r_konzert","🎤","Konzert oder Kino allein/zu zweit",250,"freiraum","a"],["r_restaurant","🍽️","Essen gehen zu zweit (Babysitter organisiert)",250,"genuss","a"],
 ["r_wellness","🧖","Wellness-Tag",400,"erholung","a"],["r_wochenende","🧳","Wochenende allein / zu zweit",600,"freiraum","a"],
 ["k_laenger","🌙","15 Min. länger aufbleiben",20,"kinder","k"],["k_nachtisch","🍮","Wunsch-Nachtisch",20,"kinder","k"],["k_sticker","⭐","Sticker oder Überraschungs-Ei",20,"kinder","k"],
 ["k_buch","📖","Extra Vorlese-Geschichte",30,"kinder","k"],["k_bildschirm","📱","30 Min. extra Tablet/TV",40,"kinder","k"],["k_spielzeit","🎲","Spielzeit mit Mama/Papa nach Wahl",50,"kinder","k"],["k_fruehst","🥞","Wunsch-Frühstück",50,"kinder","k"],
 ["k_freund","🤝","Freund/Freundin einladen",80,"kinder","k"],["k_taschengeld","🪙","1 € Taschengeld extra",80,"kinder","k"],["k_kino","🎬","Kino",150,"kinder","k"],["k_spielzeug","🧸","Kleines Spielzeug / Buch",150,"kinder","k"],
 ["k_ausflug","🗺️","Wunsch-Ausflug aussuchen",250,"kinder","k"],["k_uebernacht","🏕️","Übernachtungsparty",250,"kinder","k"]];
const HRWC={erholung:"💆 Erholung",freiraum:"🕊️ Freiraum",genuss:"😋 Genuss",kinder:"🧒 Für Kinder",eigen:"✍️ Eigene"};
/* Familienziele (gemeinsamer Topf) und Wochen-Challenges */
const HGOALS=[["g_pizza","🍕","Pizza- & Filmabend",300],["g_kino","🎬","Familien-Kino",400],["g_spassbad","🏊","Spaßbad-Tag",450],["g_zoo","🦁","Zoo / Tierpark",500],["g_ausflug","🗺️","Familien-Wunschausflug",600],["g_park","🎢","Freizeitpark (z. B. Heide-Park)",1000],["g_kurzurlaub","🏡","Kurzurlaub / Ferienhaus",2000]];
const HGOAL_DEF=["g_pizza","g_ausflug","g_park"];
const HCH=[["ch_all","🏁","Alle Aufgaben der Woche erledigt",50],["ch_noover","⏰","Keine Aufgabe bleibt überfällig",30],["ch_kids","🧒","Kinder erledigen zusammen 10 Aufgaben",40],["ch_daily","📆","Jeden Tag mindestens eine Aufgabe erledigt",30],
 ["ch_fair","⚖️","Erwachsenen-Zeit fair verteilt (40–60 %, mind. 2 h)",40],["ch_proj","🛠️","Einen Projekt-Schritt schaffen",20],["ch_mental","🧠","Jeder Erwachsene übernimmt Kopf-Arbeit",20],["ch_points","💯","Zusammen 150 Punkte sammeln",40]];
const HCH_DEF=["ch_all","ch_kids","ch_fair"];
/* Projekt-Vorlagen für die Irgendwann-Liste */
const HPROJ=[["🗄️","Schrankwand aufbauen",["Möbel aussuchen & kaufen","Wand streichen","Schrank aufbauen","Dekorieren"]],["🎨","Zimmer streichen",["Farbe aussuchen & kaufen","Möbel abrücken & abkleben","Streichen","Aufräumen & einräumen"]],
 ["🧸","Kinderzimmer umgestalten",["Ideen mit den Kindern sammeln","Aussortieren","Möbel & Deko kaufen","Umbauen"]],["🥕","Hochbeet bauen",["Platz & Maße festlegen","Holz & Erde kaufen","Bauen","Bepflanzen"]],
 ["📦","Keller ausmisten",["Sortieren: behalten / spenden / weg","Spenden wegbringen","Sperrmüll anmelden","Regale ordnen"]],["📸","Fotobuch erstellen",["Fotos auswählen","Layout gestalten","Bestellen"]],
 ["🔩","Regal anbringen",["Regal kaufen","Dübel & Werkzeug bereitlegen","Anbringen"]],["🪵","Terrasse sanieren",["Angebote einholen","Material bestellen","Alte Beläge entfernen","Neu verlegen"]]];
const HLEV=[[0,"🌱","Anfänger"],[100,"🧹","Helfer"],[250,"⭐","Profi"],[500,"🦸","Haushalts-Held"],[1000,"🏆","Meister"],[2000,"👑","Legende"]];
const HCOL=["#2F6FB0","#C2410C","#7C3AED","#15803D","#BE185D","#0E7490","#A16207"];
const HEMO=["🧔","👩","🧑","👨","👱‍♀️","👧","👦","🧒","👶","🦸","🐻","🦊"];
const hrec=(min,unpop,kid)=>kid?Math.max(3,Math.round(min/2)):Math.max(2,Math.round(min/5*(unpop?1.5:1)));
const HK=k=>"settings/"+k;
const HBOCK=[[1,"👎","keine Lust"],[2,"😐","geht so"],[3,"😍","gern"]];
/* --- Zustand: steckt in SETS (Supabase-Art „settings“), zusätzlich lokal gespiegelt --- */
const HPRE=/^(hc|hd|hr|ho|hj):/;
const isHomeKey=k=>HPRE.test(k)||["people","homeblock","hrw","hrwcfg","hgoals"].includes(k);
{const loc=LS.get("hwk-home",{});for(const k in loc)if(SETS[k]===undefined)SETS[k]=loc[k]}
function hMirror(){const o={};for(const k in SETS)if(isHomeKey(k))o[k]=SETS[k];LS.set("hwk-home",o)}
function hset(id,data){if(data==null)delete SETS[id];else SETS[id]=data;hMirror();if(SB)write(HK(id),data)}
let HFIRST=true;
window.homeApply=(s,full)=>{if(full){const srv=Object.keys(s).some(k=>HPRE.test(k)||k==="people");
    if(HFIRST&&!srv){for(const k of Object.keys(SETS))if(isHomeKey(k))write(HK(k),SETS[k])}
    else for(const k of Object.keys(SETS))if(HPRE.test(k)&&!(k in s))delete SETS[k];HFIRST=false}
  hMirror();HCACHE=null;if(SETS.people&&Array.isArray(SETS.people.list))hSyncFam(SETS.people.list);if(typeof renderHomeSet==="function")renderHomeSet();if(M2==="zuhause"&&typeof renderHome==="function")renderHome();if(document.body.classList.contains("kidsmode"))renderKidTasks()};
window.homeIsKey=isHomeKey;
/* Personen */
function hPeople(){let L=(SETS.people&&Array.isArray(SETS.people.list))?SETS.people.list.slice():null;
  if(!L){L=[];const n=Math.max(1,FAM.ad||1);for(let i=0;i<n;i++)L.push(i===0&&MYID?{id:"p_"+hslug(MYID),n:MYID,e:"🧔",kid:false}:{id:"a"+(i+1),n:"Elternteil "+(i+1),e:i?"👩":"🧔",kid:false});(FAM.kids||[]).forEach((a,i)=>L.push({id:"k"+(i+1),n:"Kind "+(i+1),age:a,e:i?"👦":"👧",kid:true}))}
  return L.map((p,i)=>Object.assign({c:HCOL[i%HCOL.length]},p))}
function hslug(s){return String(s).toLowerCase().replace(/[^a-z0-9äöüß]+/g,"-").slice(0,20)}
function hEnsureMe(){if(!MYID)return;const L=(SETS.people&&SETS.people.list)||null;if(L&&L.some(p=>p.n.toLowerCase()===MYID.toLowerCase()))return;
  const base=L?L.map(p=>Object.assign({},p)):hPeople().map(({c,...p})=>p);if(base.some(p=>p.n.toLowerCase()===MYID.toLowerCase())){hset("people",{list:base});return}
  const ph=base.find(p=>!p.kid&&/^Elternteil \d$/.test(p.n));if(ph)ph.n=MYID;else base.push({id:"p_"+hslug(MYID),n:MYID,e:HEMO[base.length%3],kid:false});hset("people",{list:base});hSyncFam(base)}
function hSyncFam(L){const A=L.filter(p=>!p.kid),K=L.filter(p=>p.kid);const nf={ad:Math.max(1,A.length),kids:K.map(k=>k.age!==""&&k.age!=null&&Number.isFinite(+k.age)?Math.max(0,Math.min(17,Math.round(+k.age))):6)};
  if(nf.ad===FAM.ad&&JSON.stringify(nf.kids)===JSON.stringify(FAM.kids))return;FAM.ad=nf.ad;FAM.kids=nf.kids;saveFam();try{renderKids();render()}catch(_){}
  const sf=$("setFam");if(sf)sf.textContent=FAM.ad+" Erw. · "+(FAM.kids.length?FAM.kids.length+(FAM.kids.length===1?" Kind":" Kinder"):"keine Kinder")}
const hPer=id=>hPeople().find(p=>p.id===id);
const hAdults=()=>hPeople().filter(p=>!p.kid);
const hKids=()=>hPeople().filter(p=>p.kid);
function hMe(){const L=hPeople(),s=LS.get("hwk-hme",null);if(s&&L.some(p=>p.id===s))return s;const m=MYID&&L.find(p=>p.n.toLowerCase()===MYID.toLowerCase());return m?m.id:(L[0]||{}).id}
const hChip=(id,small)=>{const p=hPer(id);if(!p)return id==="rot"?`<span class="hchip">🔄 abwechselnd</span>`:`<span class="hchip hopen">🙋 offen</span>`;return `<span class="hchip" style="--pc:${p.c}">${p.e} ${small?"":esc(p.n)}</span>`};
/* Zuhause-Block */
function hBlock(){const b=SETS.homeblock||{};return {days:Array.isArray(b.days)?b.days:[6],from:b.from||"09:00",to:b.to||"12:00"}}
const toMin=t=>{const[h,m]=String(t||"0:0").split(":").map(Number);return h*60+(m||0)};
/* Aufgaben & Termine */
const hChores=()=>Object.keys(SETS).filter(k=>k.startsWith("hc:")).map(k=>Object.assign({cid:k.slice(3)},SETS[k])).filter(c=>c&&c.ti);
const hProjects=()=>Object.keys(SETS).filter(k=>k.startsWith("hj:")).map(k=>Object.assign({pid:k.slice(3)},SETS[k])).filter(p=>p&&p.ti).sort((a,b)=>(a.at||0)-(b.at||0));
const hWds=c=>Array.isArray(c.wds)&&c.wds.length?c.wds.map(Number):[c.wd!=null?+c.wd:6];
const WDS=["So","Mo","Di","Mi","Do","Fr","Sa"],hWdTxt=c=>[1,2,3,4,5,6,0].filter(i=>hWds(c).includes(i)).map(i=>WDS[i]).join(" + ");
const isoD=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const addD=(s,n)=>{const d=pdate(s);d.setDate(d.getDate()+n);return isoD(d)};
function hOcc(c,from,to){const out=[],st=c.start||c.date||from,f=c.f||"w1";
  if(f==="x"){if(c.date&&c.date>=from&&c.date<=to)out.push(c.date);return out}
  if(f==="y1"){const a=c.date||st;const lead=+c.lead||0;for(let y=+from.slice(0,4)-1;y<=+to.slice(0,4)+1;y++){const d=addD(y+a.slice(4),-lead);if(d>=from&&d<=to&&d>=addD(st,-lead))out.push(d)}return out}
  for(let s=from;s<=to;s=addD(s,1)){if(s<st)continue;const d=pdate(s),wd=d.getDay();
    if(f==="d"){out.push(s);continue}
    if(f==="wd"){if(wd>=1&&wd<=5)out.push(s);continue}
    if(!hWds(c).includes(wd))continue;
    if(f[0]==="w"){const n=+f.slice(1)||1;const wk=Math.floor((pdate(s)-pdate(st))/864e5/7);if(n===1||(wk%n+n)%n===0)out.push(s);continue}
    if(f[0]==="m"){const n=+f.slice(1)||1;if(d.getDate()>7)continue;const mi=(d.getFullYear()*12+d.getMonth())-(pdate(st).getFullYear()*12+pdate(st).getMonth());if(mi%n===0)out.push(s)}}
  return out}
function hWho(c,d){if(c.who==="rot"){const A=hAdults();if(!A.length)return null;const i=Math.abs(Math.floor((pdate(d)-pdate(c.start||d))/864e5/7))+hOcc(c,c.start||d,d).length;return A[i%A.length].id}return c.who||null}
const hDaily=c=>c.f==="d"||c.f==="wd";
const hMiss=c=>c.miss||(hDaily(c)?"lapse":"over");
const hPts=c=>+c.pts||hrec(+c.dur||10,c.unpop,c.kid);
/* Projekt-Schritte mit Datum verhalten sich wie einmalige Aufgaben */
function hStepChores(){const L=[];hProjects().forEach(p=>(p.steps||[]).forEach(s=>{if(s.date)L.push({cid:"j:"+p.pid+":"+s.id,ti:p.ti+": "+s.t,ic:p.ic||"🛠️",cat:p.cat||"projekt",f:"x",date:s.date,dur:+s.dur||60,who:s.who||"",pts:+s.pts||hrec(+s.dur||60,0,0),miss:"over",proj:{pid:p.pid,sid:s.id},dn:s.dn||null})}));return L}
const hDone=(cid,d)=>{if(cid.startsWith("j:")){const [,pid,sid]=cid.split(":");const p=SETS["hj:"+pid];const s=p&&(p.steps||[]).find(x=>x.id===sid);return s&&s.dn||null}return SETS["hd:"+cid+":"+d]};
/* Fällige Einträge (Verschiebungen und Übernahmen je Termin berücksichtigt) */
function hItems(from,to){const L=[];hChores().concat(hStepChores()).forEach(c=>hOcc(c,addD(from,-14),addD(to,14)).forEach(d=>{const ov=SETS["ho:"+c.cid+":"+d]||null,disp=(ov&&ov.to)||d;
    if(disp<from||disp>to)return;L.push({c,d,disp,who:(ov&&ov.who)||hWho(c,d),dn:hDone(c.cid,d),mv:!!(ov&&ov.to)})}));
  return L.sort((a,b)=>(a.disp+(a.c.t||"99")).localeCompare(b.disp+(b.c.t||"99")))}
function hOverdue(){const now=new Set(hItems(T0,T0).map(i=>i.c.cid)),seen={};
  hItems(addD(T0,-28),addD(T0,-1)).forEach(i=>{if(hMiss(i.c)!=="over"||now.has(i.c.cid))return;seen[i.c.cid]=i});return Object.values(seen).filter(i=>!i.dn).map(i=>Object.assign({},i,{od:true}))}
/* Punkte & Statistik */
function hDoneAll(){const L=Object.keys(SETS).filter(k=>k.startsWith("hd:")).map(k=>{const [,cid,d]=k.split(":");return Object.assign({cid,d},SETS[k])});
  hProjects().forEach(p=>{(p.steps||[]).forEach(s=>{if(s.dn)L.push(Object.assign({cid:"j:"+p.pid+":"+s.id,d:s.dn.d,cat:p.cat||"projekt",proj:1},s.dn))});if(p.dn)L.push(Object.assign({cid:"j:"+p.pid,d:p.dn.d,cat:p.cat||"projekt",proj:1},p.dn))});return L}
function hEarned(pid,from,to){return hDoneAll().filter(x=>x.by===pid&&(!from||x.d>=from)&&(!to||x.d<=to)).reduce((s,x)=>s+(+x.pts||0),0)}
const hReds=()=>Object.keys(SETS).filter(k=>k.startsWith("hr:")).map(k=>Object.assign({rid:k.slice(3)},SETS[k]));
const hBal=pid=>hEarned(pid)-hReds().filter(r=>r.by===pid&&!r.fam).reduce((s,r)=>s+(+r.cost||0),0);
const hLev=pts=>{let L=HLEV[0],n=null;for(let i=0;i<HLEV.length;i++){if(pts>=HLEV[i][0]){L=HLEV[i];n=HLEV[i+1]||null}}return {L,n}};
const wkStart=s=>{const d=pdate(s);d.setDate(d.getDate()-((d.getDay()+6)%7));return isoD(d)};
function hStreak(pid){let n=0,w=wkStart(T0);const D=hDoneAll().filter(x=>x.by===pid);const has=a=>D.some(x=>x.d>=a&&x.d<=addD(a,6));if(!has(w))w=addD(w,-7);while(has(w)){n++;w=addD(w,-7)}return n}
const fmH=m=>m>=60?Math.floor(m/60)+" h"+(m%60?" "+(m%60)+" min":""):m+" min";
const hMinOf=x=>+x.min||0;
function hWeekMin(pid,from,to){return hDoneAll().filter(x=>x.by===pid&&x.d>=from&&x.d<=to).reduce((s,x)=>s+hMinOf(x),0)}
let HFW="w";
function hFair(){const A=hAdults(),from=HFW==="w"?wkStart(T0):addD(wkStart(T0),-21),to=addD(wkStart(T0),6);
  const D=hDoneAll().filter(x=>x.d>=from&&x.d<=to);
  const st=A.map(p=>{const mine=D.filter(x=>x.by===p.id);const min=mine.reduce((s,x)=>s+hMinOf(x),0);
    const ml=mine.filter(x=>MENTAL.has(x.cat)).reduce((s,x)=>s+hMinOf(x),0);
    const plan=hItems(from,to).filter(i=>i.who===p.id).reduce((s,i)=>s+(+i.c.dur||0),0);
    return {p,min,ml,plan,pts:mine.reduce((s,x)=>s+(+x.pts||0),0),n:mine.length}});
  const tot=st.reduce((s,x)=>s+x.min,0),tml=st.reduce((s,x)=>s+x.ml,0),tpl=st.reduce((s,x)=>s+x.plan,0);
  st.forEach(x=>{x.sh=tot?Math.round(x.min/tot*100):0;x.shm=tml?Math.round(x.ml/tml*100):0;x.shp=tpl?Math.round(x.plan/tpl*100):0});
  const kids=hKids().map(p=>({p,pts:D.filter(x=>x.by===p.id).reduce((s,x)=>s+(+x.pts||0),0),n:D.filter(x=>x.by===p.id).length}));
  return {st,tot,tml,tpl,kids,from,to}}
function hTend(A,k,what){const tot=A.reduce((s,x)=>s+x[k],0);if(!tot)return {pos:50,txt:`${what}: noch nichts`,lvl:-1,top:null,low:null};
  const srt=A.slice().sort((a,b)=>b[k]-a[k]),top=srt[0],low=srt[srt.length-1],sh=top[k]/tot,eq=1/A.length,d=sh-eq;
  const lvl=d<.08?0:d<.2?1:2;const pos=A.length===2?Math.round(A[1][k]/tot*100):50;
  return {pos,lvl,top:top.p,low:low.p,txt:lvl===0?`${what}: ⚖️ ausgeglichen`:`${what}: <b>${esc(top.p.n)}</b> trägt ${lvl===1?"etwas":"deutlich"} mehr`}}
function hScale(A,T){if(A.length===2)return `<div class="hfscale" style="--c1:${A[0].p.c};--c2:${A[1].p.c}" role="img" aria-label="${esc(T.txt.replace(/<[^>]+>/g,""))}"><i style="left:${T.pos}%"></i></div>`;
  return `<div class="hfb" role="img">${A.map(x=>`<span style="flex:${x.min||x.plan||.0001};background:${x.p.c}"></span>`).join("")}</div>`}
function hFairHtml(compact){const F=hFair(),A=F.st;if(!A.length)return "";
  const Td=hTend(A,"min","Erledigt"),Tm=hTend(A,"ml","Kopf-Arbeit"),Tp=hTend(A,"plan","Geplant");
  const ends=A.length===2?`<div class="hfends"><span>${A[0].p.e} ${esc(A[0].p.n)}</span><span>${esc(A[1].p.n)} ${A[1].p.e}</span></div>`:`<div class="hfends">${A.map(x=>`<span><i style="display:inline-block;width:9px;height:9px;border-radius:3px;background:${x.p.c}"></i> ${x.p.e} ${esc(x.p.n)}</span>`).join("")}</div>`;
  const hint=A.length>1&&Td.lvl>=1?`<p class="hfwarn">⏱️ Zum Ausgleich ist <b>${esc(Td.low.n)}</b> bei offenen Aufgaben zuerst dran.</p>`:A.length>1&&Td.lvl===0?`<p class="hfok">✅ Die Zeit ist gerade gut verteilt.</p>`:"";
  if(compact&&A.length<2)return `<button type="button" class="hfmini" data-m2="zuhause">⚖️ <b>Fairness</b><span>Zweite erwachsene Person unter ⚙️ eintragen</span></button>`;
  if(compact)return `<button type="button" class="hfmini" data-m2="zuhause" aria-label="Zur Fairness-Übersicht">⚖️ ${Td.lvl<0?"<span>Diese Woche noch nichts erledigt</span>":hScale(A,Td)+`<span>${Td.txt.replace("Erledigt: ","")}</span>`}</button>`;
  const row=(T,k)=>`<div class="hfgrid"><div class="hftxt">${T.txt}</div>${T.lvl<0?`<div class="hfb hfe"></div>`:hScale(A.map(x=>Object.assign({},x,{min:x[k]})),T)}</div>`;
  return `<section class="hfair" aria-labelledby="hfH"><div class="hfhead"><h3 id="hfH">⚖️ Fairness – wer trägt gerade mehr?</h3><span class="hseg" role="group" aria-label="Zeitraum"><button type="button" data-hfw="w" aria-pressed="${HFW==="w"}">Diese Woche</button><button type="button" data-hfw="m" aria-pressed="${HFW==="m"}">4 Wochen</button></span></div>
    ${ends}${row(Td,"min")}${hint}${row(Tm,"ml")}<span class="hfnote">(Termine, Geschenke, Organisation, Kümmern – die unsichtbare Arbeit)</span>${row(Tp,"plan")}</section>`}
/* Familienziele & Challenges */
const hGcfg=()=>{const g=SETS.hgoals||{},o=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{},a=v=>Array.isArray(v)?v:[];return {on:Array.isArray(g.on)?g.on:HGOAL_DEF,ch:Array.isArray(g.ch)?g.ch:HCH_DEF,custom:a(g.custom),gdel:a(g.gdel),gov:o(g.gov),cdel:a(g.cdel),cov:o(g.cov)}};
const hGoalList=()=>{const c=hGcfg();return HGOALS.filter(g=>!c.gdel.includes(g[0])).map(g=>{const v=c.gov[g[0]]||{};return [g[0],v.ic||g[1],v.ti||g[2],+v.pts||g[3]]}).concat(c.custom.map(x=>[x.id,x.ic||"🎯",x.ti,+x.pts||300]))};
const hChList=()=>{const c=hGcfg();return HCH.filter(x=>!c.cdel.includes(x[0])).map(x=>{const v=c.cov[x[0]]||{};return [x[0],v.ic||x[1],v.ti||x[2],+v.bon||x[3]]})};
function hChEval(id,w){const a=w,b=addD(w,6),I=hItems(a,b),D=hDoneAll().filter(x=>x.d>=a&&x.d<=b),A=hAdults(),K=new Set(hKids().map(p=>p.id));
  switch(id){case "ch_all":{const L=I.filter(i=>!hDaily(i.c));return [L.filter(i=>i.dn).length,L.length]}
    case "ch_noover":{const L=I.filter(i=>hMiss(i.c)==="over");return [L.filter(i=>i.dn).length,L.length]}
    case "ch_kids":return [Math.min(10,D.filter(x=>K.has(x.by)).length),10];
    case "ch_daily":{let n=0;for(let i=0;i<7;i++){const s=addD(a,i);if(D.some(x=>x.d===s))n++}return [n,7]}
    case "ch_fair":{if(A.length<2)return [0,1];const m=A.map(p=>D.filter(x=>x.by===p.id).reduce((s,x)=>s+hMinOf(x),0)),t=m.reduce((s,x)=>s+x,0);return [t>=120&&m.every(x=>x/t>=.4&&x/t<=.6)?1:0,1]}
    case "ch_proj":return [Math.min(1,D.filter(x=>x.proj).length),1];
    case "ch_mental":return [A.filter(p=>D.some(x=>x.by===p.id&&MENTAL.has(x.cat))).length,A.length];
    case "ch_points":return [Math.min(150,D.reduce((s,x)=>s+(+x.pts||0),0)),150]}return [0,1]}
let HCACHE=null;
function hFam(){if(HCACHE&&HCACHE.t>Date.now()-1500)return HCACHE.v;const cfg=hGcfg(),all=hDoneAll();let earned=all.reduce((s,x)=>s+(+x.pts||0),0),bonus=0;const first=all.map(x=>x.d).sort()[0];
  if(first){let w=wkStart(first>addD(T0,-182)?first:addD(T0,-182));while(w<=T0){const CHL=hChList();cfg.ch.forEach(id=>{const ch=CHL.find(c=>c[0]===id);if(!ch)return;const [n,t]=hChEval(id,w);if(t>0&&n>=t&&(addD(w,6)<T0||w===wkStart(T0)))bonus+=ch[3]});w=addD(w,7)}}
  const spent=hReds().filter(r=>r.fam).reduce((s,r)=>s+(+r.cost||0),0);const v={earned,bonus,spent,bal:earned+bonus-spent};HCACHE={t:Date.now(),v};return v}
/* Abzeichen */
function hBadges(pid){const D=hDoneAll().filter(x=>x.by===pid);
  return [["🎉","Erster Haken",D.length>=1],["🔟","10 erledigt",D.length>=10],["💯","100 erledigt",D.length>=100],["🛟","Retter (3× übernommen)",D.filter(x=>x.tk).length>=3],
   ["🔥","4 Wochen am Stück",hStreak(pid)>=4],["🧠","Kopf-Arbeiter (10× Organisation)",D.filter(x=>MENTAL.has(x.cat)).length>=10],["🌳","Gärtner (10× Garten)",D.filter(x=>x.cat==="garten").length>=10],
   ["🧽","Putzteufel (20× Haushalt)",D.filter(x=>x.cat==="haushalt").length>=20],["⏰","Pünktlich (20× rechtzeitig)",D.filter(x=>!x.late).length>=20],["🛠️","Projekt-Macher (5 Schritte)",D.filter(x=>x.proj).length>=5],["🙋","Freiwillig (5 offene Aufgaben)",D.filter(x=>x.vol).length>=5],["🧒","Kinder-Profi (10× Kinderaufgaben)",D.filter(x=>x.cat==="kids").length>=10]]}
/* Abhaken */
function hCheck(cid,d,opt){opt=opt||{};const me=opt.by||hMe();
  if(cid.startsWith("j:")){const [,pid,sid]=cid.split(":"),k="hj:"+pid,p=SETS[k];if(!p)return;const P=JSON.parse(JSON.stringify(p));const s=sid?(P.steps||[]).find(x=>x.id===sid):P;if(!s)return;
    if(s.dn){const old=p;s.dn=null;hset(k,P);renderHomeAll();undoToast("Haken entfernt",()=>{hset(k,old);renderHomeAll()});return}
    const pts=+s.pts||hrec(+s.dur||60,0,0);s.dn={by:me,pts,min:+s.dur||60,at:Date.now(),d:T0};hset(k,P);hBurst(pts,false);renderHomeAll();
    const left=(P.steps||[]).filter(x=>!x.dn).length;undoToast(`✓ ${sid?s.t:P.ti} – +${pts} Punkte${sid&&!left&&(P.steps||[]).length?" · 🎉 Projekt geschafft!":""}`,()=>{hset(k,p);renderHomeAll()});return}
  const c=SETS["hc:"+cid];if(!c)return;const k="hd:"+cid+":"+d;
  if(SETS[k]){const old=SETS[k];hset(k,null);renderHomeAll();undoToast("Haken entfernt",()=>{hset(k,old);renderHomeAll()});return}
  const ov=SETS["ho:"+cid+":"+d]||{},disp=ov.to||d,who=ov.who||hWho(c,d),late=disp<T0,tk=!!(who&&who!==me&&late),vol=!who;const base=hPts(c);const pts=Math.round(base*(tk?1.5:1));
  const lvBefore=hLev(hEarned(me)).L;hset(k,{by:me,pts,min:+c.dur||0,cat:c.cat,at:Date.now(),late:late?1:0,tk:tk?1:0,vol:vol?1:0});
  hBurst(pts,tk);const lv=hLev(hEarned(me)).L;
  renderHomeAll();undoToast(`✓ ${c.ti} – +${pts} Punkte für ${hPer(me)?hPer(me).n:"dich"}${tk?" (Übernahme-Bonus +50 %)":""}${lv!==lvBefore?` · 🎉 Neues Level: ${lv[1]} ${lv[2]}`:""}`,()=>{hset(k,null);renderHomeAll()})}
function hBurst(pts,big){const host=document.body,n=big?26:16,em=["🎉","⭐","✨","🎊","💪","🏅"];
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  for(let i=0;i<n;i++){const s=document.createElement("span");s.className="hconf";s.textContent=em[i%em.length];s.style.left=(40+Math.random()*20)+"%";s.style.setProperty("--dx",(Math.random()*2-1)*45+"vw");s.style.setProperty("--dy",-(30+Math.random()*45)+"vh");s.style.animationDelay=(Math.random()*.15)+"s";host.appendChild(s);setTimeout(()=>s.remove(),1500)}
  const p=document.createElement("div");p.className="hplus";p.textContent="+"+pts;host.appendChild(p);setTimeout(()=>p.remove(),1300)}
function renderHomeAll(){HCACHE=null;if(M2==="zuhause")renderHome();if(M2==="plan"&&typeof renderPlan==="function")renderPlan();if(document.body.classList.contains("kidsmode"))renderKidTasks()}
/* Zeile einer Aufgabe */
let HCQ="",HMGR={},HOPEN=new Set(),HACT=new Set(),HCATOPEN=null,HSEC=LS.get("hwk-hsec",{}),HF=Object.assign({who:"all",done:false},LS.get("hwk-hf",{})),HJOPEN=new Set();
function hBockBtns(c,pid){const b=(c.bock||{})[pid]||0;return `<span class="hbock" role="group" aria-label="Wie gern machst du das?">${HBOCK.map(([v,e,l])=>`<button type="button" data-hbock="${esc(c.cid)}" data-v="${v}" aria-pressed="${b===v}" title="${l}">${e}</button>`).join("")}</span>`}
function hAssign(c,d,lab,cur){return `<div class="hassign"><span>${lab}</span>${(c.kid||c.cat==="kids"?hKids().concat(hAdults()):hPeople()).filter(p=>p.id!==cur).map(p=>`<button type="button" data-hwho2="${esc(c.cid)}" data-d="${d}" data-p="${p.id}" style="--pc:${p.c}">${p.e} ${esc(p.n)}</button>`).join("")}</div>`}
function hDailyChip(i){const {c,d,who,dn}=i,p=hPer(who),op=HDPICK===c.cid+"|"+d,by=dn&&hPer(dn.by);return `<button type="button" class="hdc${op?" pick":""}" data-hdpick="${esc(c.cid)}" data-d="${d}" aria-pressed="${!!dn}" aria-expanded="${op}" title="${esc(c.ti)} – antippen: wer hat's gemacht?"><i>${dn?"✓":""}</i>${c.ic||""} ${esc(c.ti)} <small>${dn?(by?by.e:""):p?p.e:"🙋"}</small></button>`}
function hPickHtml(i){if(!i)return "";const {c,d,who,dn}=i,P=c.kid||c.cat==="kids"?hKids().concat(hAdults()):hPeople();const by=dn&&hPer(dn.by);
  return `<div class="hpick"><b>${c.ic||""} ${esc(c.ti)}</b> – ${dn?`erledigt von ${by?by.e+" "+esc(by.n):"?"}. Doch jemand anderes?`:"wer hat's gemacht? Die Person bekommt die Punkte."}
    <div class="hassign">${P.filter(p=>!dn||p.id!==dn.by).map(p=>`<button type="button" ${dn?`data-hredo="${esc(c.cid)}"`:`data-hck="${esc(c.cid)}" data-by="${p.id}"`} data-d="${d}" data-p="${p.id}" style="--pc:${p.c}">${p.e} ${esc(p.n)}${!dn&&p.id===who?" ★":""}</button>`).join("")}</div>
    <div class="hpickf">${dn?`<button type="button" class="pmini" data-hck="${esc(c.cid)}" data-d="${d}" data-undo="1">↺ Haken entfernen</button>`:""}<button type="button" class="pmini" data-hedit="${esc(c.cid)}">✏️ Aufgabe ändern (fest zuständig: ${who&&hPer(who)?hPer(who).e+" "+esc(hPer(who).n):"niemand"})</button><button type="button" class="pmini" data-hdpick="${esc(c.cid)}" data-d="${d}">Schließen</button></div></div>`}
let HDPICK=null;
function hRow(i,ctx){const {c,d,disp,who,dn,od,mv}=i,me=hMe(),pts=hPts(c);const cat=HCAT[c.cat]||["","📌",""];
  const ck=Array.isArray(c.ck)&&c.ck.length?(()=>{const dd=c.ckd===d?c.ckx||[]:[];return {n:dd.length,t:c.ck.length,dd}})():null;const op=HOPEN.has(c.cid+d),ac=HACT.has(c.cid+d);
  const tk=od&&who&&who!==me,open=!who&&!dn;
  return `<div class="htrow${dn?" dn":""}${od?" od":""}"><button type="button" class="hck" data-hck="${esc(c.cid)}" data-d="${d}" aria-pressed="${!!dn}" aria-label="${dn?"Erledigt – antippen zum Zurücknehmen":"Als erledigt abhaken"}">${dn?"✓":""}</button>
    <div class="hrb"><b>${c.ic||cat[1]} ${esc(c.ti)}</b><small>${od?`<span class="hod">⚠️ überfällig seit ${esc(fmtDate(disp))}</span> · `:ctx==="week"?esc(fmtDate(disp))+" · ":""}${mv?"↷ verschoben · ":""}${fmH(+c.dur||0)} · ${hChip(who)}${dn&&dn.by!==who?` · erledigt von ${hChip(dn.by)}`:""}${c.f!=="x"?" · "+esc(HFL[c.f]||""):""}${ck?` · <button type="button" class="mbdet" data-hck2="${esc(c.cid)}" data-d="${d}">☑️ ${ck.n}/${ck.t} ${op?"▴":"▾"}</button>`:""}</small>
      ${open&&c.proj?hAssign(c,d,"Wer macht's?"):""}
      ${ck&&op?`<div class="hcl">${c.ck.map((t,j)=>`<label><input type="checkbox" data-hcl="${esc(c.cid)}" data-d="${d}" data-j="${j}"${ck.dd.includes(j)?" checked":""}> ${esc(t)}</label>`).join("")}</div>`:""}
      ${tk&&!dn?`<button type="button" class="pmini htk" data-hck="${esc(c.cid)}" data-d="${d}">🛟 Übernehmen +50 %</button>`:""}
      ${ac&&!dn?`<div class="hacts">${hAssign(c,d,"Diesmal macht's:",who)}<label class="hmv">📅 Verschieben auf <input type="date" data-hmv="${esc(c.cid)}" data-d="${d}" value="${disp}" min="${T0}"></label>${c.proj?`<button type="button" class="pmini" data-hjopen="${esc(c.proj.pid)}">🛠️ Projekt öffnen</button>`:`<button type="button" class="pmini" data-hedit="${esc(c.cid)}">✏️ Aufgabe ändern</button>`}${mv?`<button type="button" class="pmini" data-hmvx="${esc(c.cid)}" data-d="${d}">↺ Zurück auf ${esc(fmtDate(d))}</button>`:""}</div>`:""}</div>
    <div class="hrr"><span class="hpts">${tk?`<s>${pts}</s> ${Math.round(pts*1.5)}`:dn?dn.pts:pts} P.</span>${dn?"":`<button type="button" class="hmore" data-hact="${esc(c.cid)}" data-d="${d}" aria-expanded="${ac}" aria-label="Mehr: übernehmen, verschieben, ändern">⋯</button>`}</div>${hDaily(c)&&HDPICK===c.cid+"|"+d?hPickHtml(i):""}</div>`}
/* Hauptansicht */
function renderHome(){const v=$("homeView");if(!v)return;hEnsureMe();HCACHE=null;const me=hMe(),P=hPeople(),meP=hPer(me);
  const od=hOverdue(),today=hItems(T0,T0),week=hItems(addD(T0,1),addD(T0,6)).filter(i=>!hDaily(i.c));
  const ch=hChores(),bal=hBal(me),fam=hFam(),cfg=hGcfg();
  const B=hBlock(),nb=(()=>{for(let i=0;i<14;i++){const s=plus(i);if(B.days.includes(pdate(s).getDay()))return s}return null})();
  const sec=(id,title,body,open)=>`<details class="hsec2" data-hsec="${id}"${(HSEC[id]!=null?HSEC[id]:open)?" open":""}><summary><h3>${title}</h3></summary>${body}</details>`;
  const meSel=`<div class="hme" role="group" aria-label="Wer hakt ab?"><span>Ich bin</span>${P.map(p=>`<button type="button" data-hme="${p.id}" aria-pressed="${p.id===me}" style="--pc:${p.c}">${p.e} ${esc(p.n)}</button>`).join("")}</div>`;
  const fOk=i=>HF.who==="me"?i.who===me:HF.who==="open"?!i.who:true;
  const all=od.concat(today,week).filter(fOk),nDone=all.filter(i=>i.dn).length,vis=i=>HF.done||!i.dn;
  const td=today.filter(fOk).filter(vis).filter(i=>!hDaily(i.c)),dly=today.filter(fOk).filter(vis).filter(i=>hDaily(i.c)),wk=week.filter(fOk).filter(vis),odv=od.filter(fOk);
  const filt=`<div class="hfilt" role="group" aria-label="Filter"><span class="hseg">${[["all","Alle"],["me","Nur meine"],["open","🙋 Offen"]].map(([k,l])=>`<button type="button" data-hfwho="${k}" aria-pressed="${HF.who===k}">${l}</button>`).join("")}</span><label class="hdtog"><input type="checkbox" data-hfdone${HF.done?" checked":""}> ✓ Erledigte zeigen${nDone?` (${nDone})`:""}</label></div>`;
  const nxo=HSEC.next!=null?HSEC.next:true;
  const now=(odv.length||td.length||dly.length||wk.length)?`${odv.map(i=>hRow(i,"od")).join("")}${td.length?`<h4 class="hday">Heute dran</h4>`+td.map(i=>hRow(i,"today")).join(""):""}${dly.length?`<h4 class="hday">Jeden Tag <small class="hhint">– antippen und auswählen, wer es gemacht hat</small></h4><div class="hdaily">${dly.map(hDailyChip).join("")}</div>${hPickHtml(dly.find(i=>HDPICK===i.c.cid+"|"+i.d))}`:""}${wk.length?`<details class="hsubsec" data-hsec="next"${nxo?" open":""}><summary><h4 class="hday">Die nächsten Tage (${wk.length})</h4></summary>${wk.map(i=>hRow(i,"week")).join("")}</details>`:""}`
    :`<p class="pvsub">${ch.length?(nDone&&!HF.done?`Alles erledigt 🎉 – ${nDone} erledigte ${nDone===1?"Aufgabe ist":"Aufgaben sind"} ausgeblendet.`:"Gerade nichts fällig. 🎉"):"Noch keine Aufgaben. Unten im Katalog auswählen – mit Turnus, Tag und wer zuständig ist."}</p>`;
  const meCard=P.map(p=>{const e=hEarned(p.id),b=hBal(p.id),L=hLev(e),st=hStreak(p.id);const prog=L.n?Math.round((e-L.L[0])/(L.n[0]-L.L[0])*100):100;
    return `<div class="hpcard${p.id===me?" me":""}" style="--pc:${p.c}"><div class="hpav">${p.e}</div><div style="min-width:0"><b>${esc(p.n)}</b><small>${L.L[1]} ${L.L[2]}${st?` · 🔥 ${st} ${st===1?"Woche":"Wochen"}`:""}</small><div class="hprog"><i style="width:${prog}%"></i></div><small>${L.n?`noch ${L.n[0]-e} Punkte bis ${L.n[1]} ${L.n[2]}`:"Höchstes Level erreicht"}</small></div><div class="hpbal"><b>${b}</b><small>Punkte</small></div></div>`}).join("");
  /* offene Aufgaben ohne Person: Bock-Abfrage */
  const opn=ch.filter(c=>!c.who&&!hDaily(c));
  const UP=hItems(T0,addD(T0,60)),ODL=hOverdue();
  const bockHtml=opn.map(c=>{const pool=c.kid||c.cat==="kids"?hKids().concat(hAdults()):hPeople(),nx=ODL.find(i=>i.c.cid===c.cid)||UP.find(i=>i.c.cid===c.cid&&!i.dn),nw=nx&&nx.who;
      const chips=(attr,cur)=>pool.map(p=>`<button type="button" ${attr} data-p="${p.id}" data-who="${p.id}" aria-pressed="${cur===p.id}" style="--pc:${p.c}">${p.e} ${esc(p.n)}</button>`).join("");
      return `<div class="hbrow"><div style="min-width:0"><b>${c.ic||""} ${esc(c.ti)}</b><small>${esc(HFL[c.f]||"")}${["w1","w2","w4","m1","m3","m6"].includes(c.f)?" · "+hWdTxt(c):""} · ${fmH(+c.dur||0)} · Bock: ${hPeople().map(p=>`${p.e} ${["–","👎","😐","😍"][+(c.bock||{})[p.id]||0]}`).join(" ")}</small>
        ${nx?`<div class="hassign"><span>${nx.od?"⚠️ ":""}${esc(fmtDate(nx.disp))}:</span>${chips(`data-hwho2="${esc(c.cid)}" data-d="${nx.d}"`,nw)}</div>`:""}
        <div class="hassign"><span>Immer:</span>${chips(`data-hassign="${esc(c.cid)}"`,null)}</div></div><div class="hassign"><span>Mein Bock:</span>${hBockBtns(c,me)}</div></div></div>`}).join("");
  /* Belohnungen */
  const isKid=meP&&meP.kid,RW=hRewards(isKid?"k":"a"),tiers=[...new Set(RW.map(r=>r[3]))].sort((a,b)=>a-b);
  const rew=`<p class="hsub">Punkte von <b>${meP?esc(meP.n):"–"}</b>: <b>${bal}</b> · ${isKid?"Belohnungen für Kinder":"Belohnungen für Erwachsene"}. Stufen schalten sich frei, sobald genug Punkte da sind.</p>`+(tiers.length?tiers.map(t=>{const L=RW.filter(r=>r[3]===t);const ok=bal>=t;
      return `<div class="htier${ok?" ok":""}"><div class="htl"><b>${ok?"🔓":"🔒"} ${t} Punkte</b>${ok?"":`<small>noch ${t-bal}</small>`}</div><div class="hrw">${L.map(r=>`<button type="button" class="hrwb" data-hred="${esc(r[0])}" data-cost="${r[3]}" data-ti="${esc(r[2])}" data-ic="${esc(r[1])}"${ok?"":" disabled"}><span>${r[1]}</span>${esc(r[2])}</button>`).join("")}</div></div>`}).join(""):`<p class="pvsub">Keine Belohnungen ausgewählt – unten unter „Belohnungen auswählen“ einschalten.</p>`)
    +hRewMgr();
  const openR=hReds().filter(r=>!r.done).sort((a,b)=>a.at-b.at);
  const redOpen=openR.length?`<div class="hredl"><h4>Eingelöst – noch offen</h4>${openR.map(r=>`<div class="hred">${r.fam?`<span class="hchip">👨‍👩‍👧 Familie</span>`:hChip(r.by)} <span>${esc(r.ic||"🎁")} ${esc(r.ti)}</span><small>${r.cost} P.</small><button type="button" class="pmini" data-hreddone="${esc(r.rid)}">✓ Eingelöst</button></div>`).join("")}</div>`:"";
  /* Familienziele & Challenges */
  const GL=hGoalList().filter(g=>cfg.on.includes(g[0])).sort((a,b)=>a[3]-b[3]);
  const goals=`<div class="hpot"><b>${fam.bal}</b><span>Familienpunkte im Topf<small>${fam.earned} gesammelt${fam.bonus?` + ${fam.bonus} Challenge-Bonus`:""}${fam.spent?` − ${fam.spent} eingelöst`:""}</small></span></div>`
    +(GL.length?GL.map(g=>{const ok=fam.bal>=g[3];return `<div class="hgl${ok?" ok":""}"><span class="hgi">${g[1]}</span><div style="min-width:0"><b>${esc(g[2])}</b><div class="hprog"><i style="width:${Math.min(100,fam.bal/g[3]*100)}%"></i></div><small>${ok?"🎉 Erreicht!":`${fam.bal} / ${g[3]} · noch ${g[3]-fam.bal}`}</small></div>${ok?`<button type="button" class="pmini" data-hgred="${esc(g[0])}">🎉 Einlösen</button>`:""}</div>`}).join(""):`<p class="pvsub">Kein Familienziel ausgewählt.</p>`);
  const w0=wkStart(T0),CL=hChList().filter(c=>cfg.ch.includes(c[0]));
  const chal=`<h4 class="hday">🏁 Challenges dieser Woche</h4>`+(CL.length?CL.map(c=>{const [n,t]=hChEval(c[0],w0),ok=t>0&&n>=t;return `<div class="hchal${ok?" ok":""}"><b>${c[1]} ${esc(c[2])}</b> <span class="hbon">+${c[3]}</span><div class="hprog"><i style="width:${t?Math.min(100,n/t*100):0}%"></i></div><small>${t?(c[0]==="ch_fair"?(ok?"geschafft 🎉":"noch nicht ausgeglichen"):`${n} von ${t}${ok?" – geschafft! 🎉":""}`):"Diese Woche nichts dazu geplant."}</small></div>`}).join(""):`<p class="pvsub">Keine Challenge ausgewählt.</p>`);
  const mrow=(kind,id,label,on,data)=>`<div class="hmr"><label><input type="checkbox" ${data}="${esc(id)}"${on?" checked":""}> ${label}</label><button type="button" class="hed" data-hmini="${kind}" data-id="${esc(id)}" aria-label="Bearbeiten" title="Bearbeiten">✏️</button><button type="button" class="hed" data-hmdel="${kind}" data-id="${esc(id)}" aria-label="Löschen" title="Löschen">🗑️</button></div>`;
  const gmgr=`<details class="hown"${HMGR.g?" open":""} data-hmgr="g"><summary>⚙️ Ziele & Challenges auswählen, bearbeiten, löschen</summary><div class="hmgr"><h5>Familienziele</h5>${hGoalList().map(g=>mrow("goal",g[0],`${g[1]} ${esc(g[2])} · ${g[3]} P.`,cfg.on.includes(g[0]),"data-hgon")).join("")}
      ${cfg.gdel.length?`<p class="hrest">${cfg.gdel.length} gelöscht · <button type="button" data-hrestore="goal">wiederherstellen</button></p>`:""}
      <button type="button" class="pmini" data-hmini="goal" data-id="">➕ Eigenes Ziel</button>
      <h5>Wochen-Challenges</h5>${hChList().map(c=>mrow("ch",c[0],`${c[1]} ${esc(c[2])} · +${c[3]}`,cfg.ch.includes(c[0]),"data-hchon")).join("")}
      ${cfg.cdel.length?`<p class="hrest">${cfg.cdel.length} gelöscht · <button type="button" data-hrestore="ch">wiederherstellen</button></p>`:""}</div></details>`;
  const badges=`<div class="hbdg">${hBadges(me).map(b=>`<span class="${b[2]?"on":""}" title="${esc(b[1])}"><i>${b[0]}</i>${esc(b[1])}</span>`).join("")}</div>`;
  const act=ch.length?`<div class="hact">${HCATS.map(cc=>{const L=ch.filter(c=>c.cat===cc[0]);return L.length?`<h4 class="hday">${cc[1]} ${cc[2]}</h4>`+L.map(c=>`<div class="hcrow"><div style="min-width:0"><b>${c.ic||cc[1]} ${esc(c.ti)}</b><small>${esc(c.f==="x"?(c.date?fmtDate(c.date)+(c.t?", "+c.t+" Uhr":""):"ohne Datum"):HFL[c.f]+(["w1","w2","w4","m1","m3","m6"].includes(c.f)?" · "+hWdTxt(c):"")+(c.f==="y1"&&c.date?" · "+fmtDate(c.date):""))} · ${fmH(+c.dur||0)} · ${hPts(c)} P. · ${hChip(c.who)} · ${hMiss(c)==="lapse"?"💨 verfällt":"⏰ wird überfällig"}</small></div><button type="button" class="pmini" data-hedit="${esc(c.cid)}">✏️ Ändern</button></div>`).join(""):""}).join("")}</div>`:`<p class="pvsub">Noch nichts ausgewählt.</p>`;
  const TP=hTpls(),used=new Set(ch.map(c=>c.tpl)),cc0=hCcfg();
  const cat=`<input type="search" class="hcsearch" id="hcQ" placeholder="🔍 Im Katalog suchen, z. B. Fenster, Geburtstag, Kinder …" value="${esc(HCQ)}" aria-label="Im Aufgaben-Katalog suchen">
      <p class="hsub">Antippen übernimmt die Aufgabe in eure Liste. Mit ✏️ ändert ihr die Vorlage selbst, mit 🗑️ fliegt sie aus dem Katalog.</p>${HCATS.map(cc=>{const L=TP.filter(x=>x.cat===cc[0]);
      return `<details class="hcat"${HCATOPEN===cc[0]?" open":""} data-hcat="${cc[0]}"><summary>${cc[1]} ${cc[2]} <small>${L.length}</small></summary><div class="htpl">${L.map(x=>`<div class="htbw" data-q="${esc((x.ti+" "+cc[2]+" "+(x.ck||[]).join(" ")).toLowerCase())}"><button type="button" class="htb${used.has(x.id)?" on":""}" data-hadd="${esc(x.id)}"><span>${x.ic||cc[1]}</span><b>${esc(x.ti)}</b><small>${esc(HFL[x.f]||"")} · ${fmH(+x.dur||0)} · ${+x.pts||hrec(+x.dur||10,x.unpop,x.kid)} P.${used.has(x.id)?" · ✓ aktiv":""}</small></button><span class="htbx"><button type="button" data-htpe="${esc(x.id)}" aria-label="Vorlage bearbeiten" title="Vorlage bearbeiten">✏️</button><button type="button" data-htpx="${esc(x.id)}" aria-label="Aus dem Katalog löschen" title="Aus dem Katalog löschen">🗑️</button></span></div>`).join("")}</div></details>`}).join("")}
      <p class="hsub" id="hcNone" hidden>Nichts gefunden – mit „Neue Vorlage“ selbst anlegen.</p>
      ${cc0.del.length?`<p class="hrest">${cc0.del.length} Vorlagen gelöscht · <button type="button" data-hrestore="tpl">wiederherstellen</button></p>`:""}
      <div class="hownbtns"><button type="button" class="pbtn" data-htpnew>➕ Neue Vorlage im Katalog</button><button type="button" class="pbtn" data-hadd="_own">➕ Eigene Aufgabe direkt</button><button type="button" class="pbtn" data-hadd="_apt">📅 Termin eintragen</button></div>`;
  const nProj=hProjects().filter(p=>!hProjDone(p)).length;
  v.innerHTML=`<h2 class="mtitle">🏠 Zuhause</h2>${hFairHtml()}${meSel}
    <section class="pvsec hnow"><h3>✅ Jetzt dran</h3>${nb?`<p class="hsub">🏠 Nächster Zuhause-Block: <b>${esc(fmtDate(nb))}, ${esc(B.from)}–${esc(B.to)} Uhr</b></p>`:""}${filt}
      ${opn.length?`<details class="hsubsec hbock2" data-hsec="bock"${HSEC.bock!=null?(HSEC.bock?" open":""):" open"}><summary><h4 class="hday">🙋 Offen – wer hat Bock? <span class="pvn">${opn.length}</span></h4></summary><p class="hsub">Sagt mit 👎 😐 😍, wie gern ihr das macht. Dann wählt, wer es beim nächsten Mal übernimmt – oder legt fest, wer es immer macht.</p>${bockHtml}</details>`:""}${now}</section>
    <section class="pvsec">${sec("proj","🛠️ Projekte & Vorhaben"+(nProj?` <span class="pvn" title="offene Projekte">${nProj}</span>`:""),hProjHtml(),true)}</section>
    <section class="pvsec">${sec("lvl","🏆 Punkte & Level",`<div class="hpcards">${meCard}</div>`,true)}</section>
    <section class="pvsec">${sec("rew","🎁 Belohnungen"+(openR.length?` <span class="pvn" title="eingelöst, noch nicht genossen">${openR.length}</span>`:""),redOpen+rew,true)}</section>
    <section class="pvsec">${sec("fam","👨‍👩‍👧 Familienziele & Challenges",goals+chal+gmgr,true)}</section>
    <section class="pvsec">${sec("bdg","🏅 Abzeichen von "+(meP?esc(meP.n):"dir"),badges,false)}</section>
    <section class="pvsec">${sec("act","📋 Unsere Aufgaben"+(ch.length?` <span class="pvn">${ch.length}</span>`:""),act,true)}</section>
    <section class="pvsec">${sec("cat","➕ Aufgaben-Katalog",cat,!ch.length)}</section>`;if(HCQ)hCatFilter()}
function hCatFilter(){const q=HCQ.trim().toLowerCase(),v=$("homeView");if(!v)return;let any=false;v.querySelectorAll(".hcat").forEach(d=>{let n=0;d.querySelectorAll(".htbw").forEach(w=>{const ok=!q||q.split(/\s+/).every(x=>w.dataset.q.includes(x));w.hidden=!ok;if(ok)n++});d.hidden=!!q&&!n;if(q)d.open=n>0;if(n)any=true});const nn=$("hcNone");if(nn)nn.hidden=!q||any}
/* Belohnungen auswählen */
const hRcfg=()=>{const r=SETS.hrwcfg||{},old=((SETS.hrw||{}).list||[]).map(x=>Object.assign({t:"a"},x)),a=v=>Array.isArray(v)?v:[];return {off:a(r.off),del:a(r.del),ov:r.ov&&typeof r.ov==="object"?r.ov:{},custom:a(r.custom).concat(old.filter(o=>!a(r.custom).some(c=>c.id===o.id)))}};
function hRewAll(){const c=hRcfg();return HREW.filter(r=>!c.del.includes(r[0])).map(r=>{const v=c.ov[r[0]]||{};return [r[0],v.ic||r[1],v.ti||r[2],+v.cost||r[3],r[4],v.t||r[5]]}).concat(c.custom.map(x=>[x.id,x.ic||"🎁",x.ti,+x.cost||50,"eigen",x.t||"a"]))}
function hRewards(t){const c=hRcfg();return hRewAll().filter(r=>(r[5]===t||r[5]==="b")&&!c.off.includes(r[0]))}
function hRewMgr(){const c=hRcfg(),A=hRewAll();
  const list=(t,lab)=>{const L=A.filter(r=>r[5]===t||(t==="a"&&r[5]==="b"));return `<h5>${lab} <button type="button" class="pmini" data-hrwall="${t}" data-on="1">Alle an</button> <button type="button" class="pmini" data-hrwall="${t}" data-on="0">Alle aus</button></h5>${L.map(r=>`<div class="hmr"><label><input type="checkbox" data-hrwon="${esc(r[0])}"${c.off.includes(r[0])?"":" checked"}> ${r[1]} ${esc(r[2])} · ${r[3]} P.${r[5]==="b"?" · alle":""}</label><button type="button" class="hed" data-hmini="rew" data-id="${esc(r[0])}" aria-label="Bearbeiten" title="Bearbeiten">✏️</button><button type="button" class="hed" data-hmdel="rew" data-id="${esc(r[0])}" aria-label="Löschen" title="Löschen">🗑️</button></div>`).join("")}`};
  return `<details class="hown"${HMGR.r?" open":""} data-hmgr="r"><summary>⚙️ Belohnungen auswählen, bearbeiten, löschen</summary><div class="hmgr">${list("a","🧑 Für Erwachsene")}${list("k","🧒 Für Kinder")}
    ${c.del.length?`<p class="hrest">${c.del.length} gelöscht · <button type="button" data-hrestore="rew">wiederherstellen</button></p>`:""}
    <button type="button" class="pmini" data-hmini="rew" data-id="">➕ Eigene Belohnung</button></div></details>`}
function hRsave(c){hset("hrwcfg",{off:c.off,del:c.del,ov:c.ov,custom:c.custom});if(SETS.hrw)hset("hrw",null);renderHomeAll()}
/* Kleiner Dialog: Belohnung, Ziel, Challenge */
function hMini(kind,id){const isNew=!id;let v={ti:"",ic:"",n:kind==="rew"?60:kind==="goal"?500:30,t:"a"};
  if(kind==="rew"&&id){const r=hRewAll().find(x=>x[0]===id);if(r)v={ti:r[2],ic:r[1],n:r[3],t:r[5]}}
  if(kind==="goal"&&id){const g=hGoalList().find(x=>x[0]===id);if(g)v={ti:g[2],ic:g[1],n:g[3]}}
  if(kind==="ch"&&id){const c=hChList().find(x=>x[0]===id);if(c)v={ti:c[2],ic:c[1],n:c[3]}}
  const lab={rew:["Belohnung","Punkte"],goal:["Familienziel","Familienpunkte"],ch:["Challenge","Bonus-Punkte"]}[kind];
  const d=$("hdlg");HED={mini:kind,id};d.innerHTML=`<form method="dialog" class="hform"><div class="dlghead"><h3>${lab[0]} ${isNew?"anlegen":"bearbeiten"}</h3><button type="button" class="mbx" data-hclose aria-label="Schließen">✕</button></div>
    <div class="hf2"><label>Titel<input type="text" id="hmT" maxlength="60" value="${esc(v.ti)}"></label><label>Icon<input type="text" id="hmI" maxlength="4" value="${esc(v.ic)}"></label></div>
    <label>${lab[1]}<input type="number" id="hmN" min="5" max="9999" step="5" value="${v.n}"></label>
    ${kind==="rew"?`<label>Für wen?<select id="hmF"><option value="a"${v.t==="a"?" selected":""}>Erwachsene</option><option value="k"${v.t==="k"?" selected":""}>Kinder</option><option value="b"${v.t==="b"?" selected":""}>Alle</option></select></label>`:""}
    ${kind==="ch"?`<p class="hsub">Wann eine Challenge als geschafft gilt, ist fest eingebaut – Titel, Icon und Bonus könnt ihr anpassen.</p>`:""}
    <div class="hfbtn">${isNew?"":`<button type="button" class="pmini hdel" data-hmdel="${kind}" data-id="${esc(id)}">🗑️ Löschen</button>`}<button type="button" class="pbtn" data-hclose>Abbrechen</button><button type="button" class="pbtn hsave" data-hminisave>💾 Speichern</button></div></form>`;
  d.showModal?d.showModal():d.setAttribute("open","");setTimeout(()=>$("hmT").focus(),30)}
function hMiniSave(){const {mini:kind,id}=HED,ti=$("hmT").value.trim(),ic=$("hmI").value.trim(),n=Math.max(5,+$("hmN").value||0);if(!ti){$("hmT").focus();return}
  if(kind==="rew"){const c=hRcfg(),t=$("hmF").value;if(!id)c.custom=c.custom.concat({id:"u"+Date.now().toString(36),ti,ic:ic||"🎁",cost:n,t});else if(c.custom.some(x=>x.id===id))c.custom=c.custom.map(x=>x.id===id?Object.assign({},x,{ti,ic,cost:n,t}):x);else c.ov=Object.assign({},c.ov,{[id]:{ti,ic,cost:n,t}});hRsave(c)}
  if(kind==="goal"){const c=hGcfg();if(!id){const nid="u"+Date.now().toString(36);c.custom=c.custom.concat({id:nid,ti,ic:ic||"🎯",pts:n});c.on=c.on.concat(nid)}else if(c.custom.some(x=>x.id===id))c.custom=c.custom.map(x=>x.id===id?Object.assign({},x,{ti,ic,pts:n}):x);else c.gov=Object.assign({},c.gov,{[id]:{ti,ic,pts:n}});hset("hgoals",c)}
  if(kind==="ch"){const c=hGcfg();c.cov=Object.assign({},c.cov,{[id]:{ti,ic,bon:n}});hset("hgoals",c)}
  $("hdlg").close();HED=null;toast("💾 Gespeichert");renderHomeAll()}
function hMiniDel(kind,id){if(kind==="rew"){const c=hRcfg();if(c.custom.some(x=>x.id===id))c.custom=c.custom.filter(x=>x.id!==id);else c.del=c.del.concat(id);hRsave(c)}
  if(kind==="goal"){const c=hGcfg();if(c.custom.some(x=>x.id===id))c.custom=c.custom.filter(x=>x.id!==id);else c.gdel=c.gdel.concat(id);c.on=c.on.filter(x=>x!==id);hset("hgoals",c)}
  if(kind==="ch"){const c=hGcfg();c.cdel=c.cdel.concat(id);c.ch=c.ch.filter(x=>x!==id);hset("hgoals",c)}
  const d=$("hdlg");if(d.open&&HED&&HED.mini)d.close();HED=null;toast("🗑️ Gelöscht");renderHomeAll()}
/* Irgendwann & Projekte */
function hProjHtml(){const L=hProjects(),openP=L.filter(p=>!hProjDone(p)),doneP=L.filter(hProjDone),P=hPeople(),durs=[15,30,45,60,90,120,180,240,360,480];
  const card=p=>{const S=p.steps||[],n=S.filter(s=>s.dn).length,op=HJOPEN.has(p.pid),nx=S.find(s=>!s.dn),min=S.filter(s=>!s.dn).reduce((a,s)=>a+(+s.dur||60),0);
    return `<div class="hproj${hProjDone(p)?" dn":""}"><button type="button" class="hpjh" data-hjopen="${esc(p.pid)}" aria-expanded="${op}"><span class="hpji">${p.ic||"🛠️"}</span><span class="hpjt"><b>${esc(p.ti)}</b><small>${S.length?`${n}/${S.length} Schritte${min?` · noch ca. ${fmH(min)}`:""}${nx&&!op?` · nächster: ${esc(nx.t)}`:""}`:"Irgendwann – noch ohne Schritte"}</small>${S.length?`<span class="hprog"><i style="width:${n/S.length*100}%"></i></span>`:""}</span><span aria-hidden="true">${op?"▴":"▾"}</span></button>
      ${op?`<div class="hpjb">${S.map(s=>`<div class="hstep${s.dn?" dn":""}"><button type="button" class="hck" data-hck="j:${esc(p.pid)}:${esc(s.id)}" data-d="${s.date||T0}" aria-pressed="${!!s.dn}" aria-label="Schritt abhaken">${s.dn?"✓":""}</button>
          <input type="text" class="hstt" data-hjt="${esc(p.pid)}" data-s="${esc(s.id)}" value="${esc(s.t)}" maxlength="60" aria-label="Schritt">
          <div class="hstm"><select data-hjw="${esc(p.pid)}" data-s="${esc(s.id)}" aria-label="Wer"><option value="">🙋 offen</option>${P.map(x=>`<option value="${x.id}"${s.who===x.id?" selected":""}>${x.e} ${esc(x.n)}</option>`).join("")}</select>
          <select data-hjm="${esc(p.pid)}" data-s="${esc(s.id)}" aria-label="Dauer">${durs.concat(durs.includes(+s.dur||60)?[]:[+s.dur]).map(m=>`<option value="${m}"${m===(+s.dur||60)?" selected":""}>${fmH(m)}</option>`).join("")}</select>
          <input type="date" data-hjd="${esc(p.pid)}" data-s="${esc(s.id)}" value="${esc(s.date||"")}" aria-label="Termin (optional)" title="Termin – dann steht der Schritt in „Jetzt dran“ und im Kalender">
          <span class="hpts">${+s.pts||hrec(+s.dur||60,0,0)} P.</span><button type="button" class="mbx" data-hjsx="${esc(p.pid)}" data-s="${esc(s.id)}" aria-label="Schritt löschen">✕</button></div></div>`).join("")}
        <div class="hownf"><input type="text" data-hjnew="${esc(p.pid)}" maxlength="60" placeholder="Neuer Schritt, z. B. Möbel kaufen"><button type="button" class="pmini" data-hjadd="${esc(p.pid)}">➕ Schritt</button></div>
        <div class="hpjf">${!S.length?`<button type="button" class="pmini" data-hck="j:${esc(p.pid)}" data-d="${T0}">${p.dn?"↺ Wieder offen":"✓ Erledigt"}</button>`:""}<button type="button" class="pmini hdel" data-hjx="${esc(p.pid)}">🗑️ Projekt löschen</button></div></div>`:""}</div>`};
  return `<p class="hsub">Größere Vorhaben, gern auch für irgendwann – ohne festen Termin. Schritte mit Datum erscheinen in „Jetzt dran“ und im Kalender; jeder erledigte Schritt bringt Punkte.</p>
    ${openP.map(card).join("")||`<p class="pvsub">Noch keine Projekte.</p>`}
    ${doneP.length?(HF.done?`<h4 class="hday">Erledigt</h4>`+doneP.map(card).join(""):`<p class="hsub">✓ ${doneP.length} erledigte ${doneP.length===1?"Projekt":"Projekte"} ausgeblendet – oben „Erledigte zeigen“ einschalten.</p>`):""}
    <div class="hpjnew"><input type="text" id="hjT" maxlength="50" placeholder="Neues Projekt oder Vorhaben"><button type="button" class="pmini" id="hjAdd">➕ Anlegen</button></div>
    <div class="hpjtpl"><span>Vorlagen:</span>${HPROJ.map((t,i)=>`<button type="button" class="pmini" data-hjtpl="${i}">${t[0]} ${esc(t[1])}</button>`).join("")}</div>`}
const hProjDone=p=>(p.steps||[]).length?(p.steps||[]).every(s=>s.dn):!!p.dn;
function hProjEdit(pid,fn){const k="hj:"+pid,p=SETS[k];if(!p)return;const P=JSON.parse(JSON.stringify(p));fn(P);hset(k,P);renderHomeAll()}
const hsid=()=>"s"+Date.now().toString(36)+Math.floor(Math.random()*99);
/* Editor */
let HED=null;
function hEdit(c,isNew,mode){HED={c:Object.assign({},c),isNew,mode:mode||"task"};const TPL=HED.mode==="tpl";const d=$("hdlg");const P=hPeople(),x=HED.c,rec=hrec(+x.dur||10,x.unpop,x.kid);
  const durs=[5,10,15,20,30,45,60,75,90,120,180,240,300,360,480];if(!durs.includes(+x.dur))durs.push(+x.dur);durs.sort((a,b)=>a-b);const miss=hMiss(Object.assign({f:x.f},x));
  d.innerHTML=`<form method="dialog" class="hform"><div class="dlghead"><h3>${TPL?(isNew?"Neue Vorlage im Katalog":"Vorlage bearbeiten"):isNew?"Aufgabe hinzufügen":"Aufgabe ändern"}</h3><button type="button" class="mbx" data-hclose aria-label="Schließen">✕</button></div>
   <label>Titel<input type="text" id="heTi" maxlength="60" value="${esc(x.ti||"")}" required></label>
   <div class="hf2"><label>Kategorie<select id="heCat">${HCATS.map(c=>`<option value="${c[0]}"${c[0]===x.cat?" selected":""}>${c[1]} ${c[2]}</option>`).join("")}</select></label><label>Icon<input type="text" id="heIc" maxlength="4" value="${esc(x.ic||"")}"></label></div>
   <label>Art & Turnus<select id="heF">${HFREQ.map(f=>`<option value="${f[0]}"${f[0]===x.f?" selected":""}>${f[1]}</option>`).join("")}</select></label>
   <div id="heWdW"><span class="hlab">Tag(e) <small class="hhint">– mehrere möglich, z. B. Di + Sa</small></span><div class="dquick" id="heWd">${[1,2,3,4,5,6,0].map(i=>`<button type="button" data-wd="${i}" aria-pressed="${hWds(x).includes(i)}">${["So","Mo","Di","Mi","Do","Fr","Sa"][i]}</button>`).join("")}</div><small class="hhint" id="heWdH"></small></div>
   <div class="hf2" id="heDateW"><label><span id="heDateL">Datum</span><input type="date" id="heDate" value="${esc(x.date||"")}"></label></div>
   <label id="heLeadW">Wie viele Tage vorher anfangen?<input type="number" id="heLead" min="0" max="90" value="${+x.lead||0}"></label>
   ${TPL?`<p class="hsub">Die Vorlage bestimmt, wie die Aufgabe beim Antippen im Katalog vorausgefüllt wird. Bereits übernommene Aufgaben ändern sich nicht.</p>`:""}<div id="heMissW"${TPL?" hidden":""}><span class="hlab">Wenn sie nicht erledigt wird …</span><div class="dquick" id="heMiss"><button type="button" data-miss="over" aria-pressed="${miss==="over"}">⏰ wird rot & überfällig</button><button type="button" data-miss="lapse" aria-pressed="${miss==="lapse"}">💨 verfällt nach dem Termin</button></div></div>
   <div class="hf2"><label>Dauer<select id="heDur">${durs.map(m=>`<option value="${m}"${m===+x.dur?" selected":""}>${fmH(m)}</option>`).join("")}</select></label><label>Punkte <small>(Empfehlung: <span id="heRec">${rec}</span>)</small><input type="number" id="hePts" min="1" max="999" value="${+x.pts||rec}"></label></div>
   <div id="heWhoW"${TPL?" hidden":""}><span class="hlab">Wer ist zuständig?</span><div class="dquick hwho" id="heWho">${P.map(p=>`<button type="button" data-who="${p.id}" aria-pressed="${x.who===p.id}" style="--pc:${p.c}">${p.e} ${esc(p.n)}</button>`).join("")}<button type="button" data-who="rot" aria-pressed="${x.who==="rot"}">🔄 Abwechselnd</button><button type="button" data-who="" aria-pressed="${!x.who}">🙋 Offen – spontan / nach Bock</button></div></div>
   <label>Checkliste <small>(eine Zeile pro Punkt, optional)</small><textarea id="heCk" rows="4">${esc((x.ck||[]).join("\n"))}</textarea></label>
   <div class="hfbtn">${isNew?"":TPL?`<button type="button" class="pmini hdel" data-htpx="${esc(x.id)}">🗑️ Aus Katalog löschen</button>`:`<button type="button" class="pmini hdel" data-hdel>🗑️ Löschen</button>`}<button type="button" class="pbtn" data-hclose>Abbrechen</button><button type="button" class="pbtn hsave" data-hsave>${isNew?"➕ Hinzufügen":"💾 Speichern"}</button></div></form>`;
  hEdUpd();d.showModal?d.showModal():d.setAttribute("open","")}
function hEdUpd(){const f=$("heF").value,x=HED.c;$("heWdW").hidden=!["w1","w2","w4","m1","m3","m6"].includes(f);$("heWdH").textContent=f[0]==="m"?"jeweils am ersten dieser Wochentage im Monat":f==="w2"||f==="w4"?"in jeder fälligen Woche an allen gewählten Tagen":"";
  $("heDateW").hidden=!(f==="x"||f==="y1")||HED.mode==="tpl";$("heDateL").textContent=f==="y1"?"Datum (z. B. Geburtstag)":"Datum / Deadline";$("heLeadW").hidden=f!=="y1";
  const rec=hrec(+$("heDur").value,x.unpop,($("heCat").value==="kids"));$("heRec").textContent=rec}
function hEdSave(){if(HED.mode==="tpl")return hTplSave();const x=HED.c;x.ti=$("heTi").value.trim();if(!x.ti){$("heTi").focus();return}x.cat=$("heCat").value;x.ic=$("heIc").value.trim();x.f=$("heF").value;
  const ws=[...$("heWd").querySelectorAll('[aria-pressed="true"]')].map(b=>+b.dataset.wd);x.wds=ws.length?ws:[6];x.wd=x.wds[0];x.date=$("heDate").value||null;delete x.t;x.lead=+$("heLead").value||0;
  const mb=$("heMiss").querySelector('[aria-pressed="true"]');x.miss=mb?mb.dataset.miss:null;
  x.dur=+$("heDur").value;x.pts=+$("hePts").value||hrec(x.dur,x.unpop,x.kid);x.kid=x.cat==="kids"?1:0;const wh=$("heWho").querySelector('[aria-pressed="true"]');x.who=wh?wh.dataset.who:hMe();
  x.ck=$("heCk").value.split("\n").map(s=>s.trim()).filter(Boolean).slice(0,20);if(!x.start)x.start=T0;
  if((x.f==="x")&&!x.date){$("heDate").focus();toast("Bitte ein Datum wählen");return}if(x.f==="y1"&&!x.date){$("heDate").focus();toast("Bitte das Datum wählen");return}
  const cid=x.cid||("c"+Date.now().toString(36));delete x.cid;hset("hc:"+cid,x);$("hdlg").close();toast(HED.isNew?(x.who?"➕ Hinzugefügt – erscheint jetzt in „Jetzt dran“ und in „Unser Plan“":"➕ Hinzugefügt – unter „Wer hat Bock?“ könnt ihr sie verteilen"):"💾 Gespeichert");HED=null;renderHomeAll()}
function hTplSave(){const x=HED.c,ti=$("heTi").value.trim();if(!ti){$("heTi").focus();return}const ws=[...$("heWd").querySelectorAll('[aria-pressed="true"]')].map(b=>+b.dataset.wd);
  const o={ti,cat:$("heCat").value,ic:$("heIc").value.trim(),f:$("heF").value,wd:ws.length?ws[0]:null,wds:ws.length?ws:null,dur:+$("heDur").value,pts:+$("hePts").value||null,kid:$("heCat").value==="kids"?1:0,ck:$("heCk").value.split("\n").map(s=>s.trim()).filter(Boolean).slice(0,20)};
  const C=hCcfg();if(x.id&&x.bi){C.ov=Object.assign({},C.ov,{[x.id]:o})}else if(x.id){C.add=C.add.map(a=>a.id===x.id?Object.assign({id:x.id},o):a)}else{C.add=C.add.concat(Object.assign({id:"t"+Date.now().toString(36)},o))}
  hset("hcat",C);$("hdlg").close();HED=null;toast(x.id?"💾 Vorlage gespeichert":"➕ Neue Vorlage im Katalog");renderHomeAll()}
/* Tagesansicht in „Unser Plan“ */
window.homeDay=(dt,L)=>{if(!dt)return "";const B=hBlock(),blk=B.days.includes(pdate(dt).getDay());const I=hItems(dt,dt).filter(i=>(!hDaily(i.c)||blk)&&(HF.done||!i.dn));const O=dt===T0?hOverdue():[];
  if(!blk&&!I.length&&!O.length)return "";
  const clash=blk?(L||[]).filter(o=>o.t&&toMin(o.t)<toMin(B.to)&&toMin(o.t)+60>toMin(B.from)):[];
  return `<div class="hpday"><div class="hpdh">🏠 <b>Zuhause</b>${blk?` · ${esc(B.from)}–${esc(B.to)} Uhr reserviert`:""}<button type="button" class="pall" data-m2="zuhause">Alle Aufgaben →</button></div>
    ${clash.length?`<p class="hfwarn">⚠️ ${clash.map(o=>esc(o.ti.replace(/^Ausflug: /,""))+" um "+esc(o.t)).join(", ")} liegt im Zuhause-Block – Aufgaben ggf. auf den Nachmittag schieben.</p>`:""}
    ${O.map(i=>hRow(i,"od")).join("")}${I.map(i=>hRow(i,"today")).join("")}${!I.length&&!O.length?`<p class="pvsub" style="margin:4px 0">Für diesen Block ist noch nichts offen.</p>`:""}</div>`};
window.homeDots=s=>hItems(s,s).filter(i=>!hDaily(i.c)&&!i.dn).length;
window.homeBlockDay=s=>hBlock().days.includes(pdate(s).getDay());
window.homeFairMini=()=>hFairHtml(true);
/* Kinderansicht: eigene Aufgaben, Punkte, Vorlesen */
function hSay(t){if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="de-DE";u.rate=.92;const v=speechSynthesis.getVoices().find(v=>/^de/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}
function hKidId(){const K=hKids(),s=LS.get("hwk-kidme",null);return K.some(k=>k.id===s)?s:(K[0]||{}).id}
function hKidItems(kid){const mine=i=>i.who===kid||(!i.who&&(i.c.kid||i.c.cat==="kids"));return hOverdue().filter(mine).concat(hItems(T0,T0).filter(mine))}
function renderKidTasks(){const el=$("kTasks");if(!el)return;const K=hKids();if(!K.length){el.innerHTML="";el.hidden=true;return}el.hidden=false;
  const kid=hKidId(),kp=hPer(kid),L=hKidItems(kid),open=L.filter(i=>!i.dn),bal=hBal(kid),RW=hRewards("k").sort((a,b)=>a[3]-b[3]),nx=RW.find(r=>r[3]>bal);
  el.innerHTML=`<div class="kth"><h3>⭐ Meine Aufgaben</h3>${window.speechSynthesis?`<button type="button" class="kspeak2" data-ksayall aria-label="Alles vorlesen">🔊 Vorlesen</button>`:""}</div>
    ${K.length>1?`<div class="kwho" role="group" aria-label="Wer bist du?">${K.map(k=>`<button type="button" data-kme="${k.id}" aria-pressed="${k.id===kid}"><span>${k.e}</span>${esc(k.n)}</button>`).join("")}</div>`:""}
    <div class="kpts"><span class="kstar">⭐</span><b>${bal}</b><span>Punkte${nx?` · noch <b>${nx[3]-bal}</b> bis ${nx[1]} ${esc(nx[2])}`:""}</span></div>${nx?`<div class="hprog kprog"><i style="width:${Math.min(100,bal/nx[3]*100)}%"></i></div>`:""}
    <div class="ktl">${L.length?L.map(i=>`<div class="ktask${i.dn?" dn":""}${i.od?" od":""}"><span class="kti">${i.c.ic||"⭐"}</span><b>${esc(i.c.ti)}</b><small>${i.od?"Noch von früher · ":""}${i.dn?"Geschafft! 🎉":`${hPts(i.c)} Punkte`}</small>${window.speechSynthesis?`<button type="button" class="kspeak2 sm" data-ksay="${esc(i.c.ti)}" data-p="${hPts(i.c)}" aria-label="Vorlesen">🔊</button>`:""}<button type="button" class="kck" data-hck="${esc(i.c.cid)}" data-d="${i.d}" data-by="${kid}" aria-pressed="${!!i.dn}" aria-label="${i.dn?"Erledigt":"Geschafft!"}">${i.dn?"✓":"✔︎"}</button></div>`).join(""):`<p class="kempty">Heute keine Aufgaben – frag Mama oder Papa, ob du helfen kannst! 💪</p>`}</div>
    ${RW.length?`<details class="krew"><summary>🎁 Das kannst du dir verdienen</summary><div class="hrw">${RW.map(r=>`<button type="button" class="hrwb" data-hred="${esc(r[0])}" data-cost="${r[3]}" data-ti="${esc(r[2])}" data-ic="${esc(r[1])}" data-by="${kid}"${bal>=r[3]?"":" disabled"}><span>${r[1]}</span>${esc(r[2])} · ${r[3]} ⭐</button>`).join("")}</div></details>`:""}`;
  el._say=`${kp?kp.n+", ":""}${open.length?`heute hast du ${open.length===1?"eine Aufgabe":open.length+" Aufgaben"}: ${open.map(i=>i.c.ti).join(", ")}.`:"heute ist alles geschafft. Super!"} Du hast ${bal} Punkte.${nx?` Noch ${nx[3]-bal} Punkte bis ${nx[2]}.`:""}`}
new MutationObserver(()=>{if(document.body.classList.contains("kidsmode"))renderKidTasks()}).observe(document.body,{attributes:true,attributeFilter:["class"]});
/* Einstellungen: Personen & Zuhause-Block */
function renderHomeSet(){const fp=$("famPeople"),el=$("homeSet");const P=hPeople(),B=hBlock();
  if(fp)fp.innerHTML=`<div class="hfp">${P.map((p,i)=>`<div class="hfpr"><select data-hpe="${i}" aria-label="Symbol">${HEMO.concat(HEMO.includes(p.e)?[]:[p.e]).map(e=>`<option${e===p.e?" selected":""}>${e}</option>`).join("")}</select><input type="text" data-hpn="${i}" value="${esc(p.n)}" maxlength="20" aria-label="Name"><select class="hrole" data-hpr="${i}" aria-label="Rolle"><option value="a"${p.kid?"":" selected"}>Erwachsen</option><option value="k"${p.kid?" selected":""}>Kind</option></select>${p.kid?`<input type="number" class="hage" data-hpa="${i}" min="0" max="17" inputmode="numeric" value="${p.age!=null?p.age:""}" placeholder="Alter" aria-label="Alter">`:"<span></span>"}<button type="button" class="mbx" data-hpx="${i}" aria-label="Entfernen">✕</button></div>`).join("")}</div>
   <div class="hfpadd"><button type="button" class="pmini" data-hpadd="a">➕ Erwachsene Person</button><button type="button" class="pmini" data-hpadd="k">➕ Kind</button></div>`;
  if(el)el.innerHTML=`<p class="famnote">In dieser Zeit stehen Haushalt, Garten & Co. in „Unser Plan“. Ausflüge sind trotzdem möglich – es gibt dann einen Hinweis.</p>
   <div class="dquick freed" id="hbDays">${[1,2,3,4,5,6,0].map(i=>`<button type="button" data-hbd="${i}" aria-pressed="${B.days.includes(i)}">${["So","Mo","Di","Mi","Do","Fr","Sa"][i]}</button>`).join("")}</div>
   <div class="hbt"><label>von <input type="time" id="hbFrom" value="${esc(B.from)}"></label><label>bis <input type="time" id="hbTo" value="${esc(B.to)}"></label></div>`}
function hSavePeople(L){const C=L.map(({c,...p})=>p);hset("people",{list:C});hSyncFam(C);renderHomeSet();renderHomeAll()}
document.addEventListener("click",e=>{const t=e.target;
  const pa=t.closest("[data-hpadd]");if(pa){const L=hPeople(),k=pa.dataset.hpadd==="k";L.push(k?{id:"k"+Date.now().toString(36),n:"Kind "+(hKids().length+1),e:"🧒",kid:true,age:6}:{id:"p"+Date.now().toString(36),n:"Erwachsene Person",e:HEMO[L.length%4],kid:false});hSavePeople(L);return}
  const px=t.closest("[data-hpx]");if(px){const L=hPeople();L.splice(+px.dataset.hpx,1);hSavePeople(L);return}
  const bd=t.closest("[data-hbd]");if(bd){const B=hBlock(),i=+bd.dataset.hbd;B.days=B.days.includes(i)?B.days.filter(x=>x!==i):B.days.concat(i);hset("homeblock",B);renderHomeSet();renderHomeAll();return}});
document.addEventListener("change",e=>{const t=e.target,ds=t.dataset||{};
  if(ds.hpn!=null||ds.hpe!=null||ds.hpr!=null||ds.hpa!=null){const L=hPeople(),i=+(ds.hpn??ds.hpe??ds.hpr??ds.hpa);if(!L[i])return;if(ds.hpn!=null)L[i].n=t.value.trim()||L[i].n;if(ds.hpe!=null)L[i].e=t.value;if(ds.hpr!=null){L[i].kid=t.value==="k";if(L[i].kid&&L[i].age==null)L[i].age=6}if(ds.hpa!=null){let v=Math.round(+t.value);L[i].age=Number.isFinite(v)?Math.max(0,Math.min(17,v)):6}hSavePeople(L);return}
  if(t.id==="hbFrom"||t.id==="hbTo"){const B=hBlock();B.from=$("hbFrom").value||"09:00";B.to=$("hbTo").value||"12:00";hset("homeblock",B);renderHomeAll();return}
  if(ds.hcl!=null){const c=SETS["hc:"+ds.hcl];if(!c)return;const d=ds.d,j=+ds.j;const x=Object.assign({},c);let dd=x.ckd===d?(x.ckx||[]).slice():[];dd=t.checked?dd.concat(j):dd.filter(k=>k!==j);x.ckd=d;x.ckx=[...new Set(dd)];hset("hc:"+ds.hcl,x);
    if(x.ckx.length===x.ck.length&&!hDone(ds.hcl,d)){hCheck(ds.hcl,d)}else renderHomeAll();return}
  if(ds.hmv!=null){const cid=ds.hmv,d=ds.d,to=t.value;if(!to)return;const k="ho:"+cid+":"+d,ov=Object.assign({},SETS[k]||{});if(to===d)delete ov.to;else ov.to=to;hset(k,Object.keys(ov).length?ov:null);HACT.delete(cid+d);toast("📅 Verschoben auf "+fmtDate(to));renderHomeAll();return}
  if(ds.hfdone!=null){HF.done=t.checked;LS.set("hwk-hf",HF);renderHomeAll();return}
  if(ds.hgon!=null||ds.hchon!=null){const c=hGcfg();if(ds.hgon!=null)c.on=t.checked?c.on.concat(ds.hgon):c.on.filter(x=>x!==ds.hgon);else c.ch=t.checked?c.ch.concat(ds.hchon):c.ch.filter(x=>x!==ds.hchon);hset("hgoals",c);renderHome();return}
  if(ds.hrwon!=null){const c=hRcfg();c.off=t.checked?c.off.filter(x=>x!==ds.hrwon):c.off.concat(ds.hrwon);hRsave(c);return}
  if(ds.hjt!=null){hProjEdit(ds.hjt,P=>{const s=(P.steps||[]).find(x=>x.id===ds.s);if(s)s.t=t.value.trim()||s.t});return}
  if(ds.hjw!=null){hProjEdit(ds.hjw,P=>{const s=(P.steps||[]).find(x=>x.id===ds.s);if(s)s.who=t.value});return}
  if(ds.hjm!=null){hProjEdit(ds.hjm,P=>{const s=(P.steps||[]).find(x=>x.id===ds.s);if(s){s.dur=+t.value;delete s.pts}});return}
  if(ds.hjd!=null){hProjEdit(ds.hjd,P=>{const s=(P.steps||[]).find(x=>x.id===ds.s);if(s)s.date=t.value||null});if(t.value)toast("📅 Schritt eingeplant am "+fmtDate(t.value));return}
  if(HED&&["heF","heDur","heCat"].includes(t.id))hEdUpd()});
document.addEventListener("input",e=>{if(e.target.id==="hcQ"){HCQ=e.target.value;hCatFilter()}});
document.addEventListener("keydown",e=>{if(e.key!=="Enter")return;const t=e.target;if(t.dataset&&t.dataset.hjnew!=null){e.preventDefault();const b=document.querySelector(`[data-hjadd="${t.dataset.hjnew}"]`);b&&b.click()}if(t.id==="hjT"){e.preventDefault();$("hjAdd").click()}});
/* Klicks im Zuhause-Bereich, in „Unser Plan“ und in der Kinderansicht */
document.addEventListener("click",e=>{const t=e.target;
  const dp=t.closest("[data-hdpick]");if(dp){const k=dp.dataset.hdpick+"|"+dp.dataset.d;HDPICK=HDPICK===k?null:k;renderHomeAll();return}
  const rdo=t.closest("[data-hredo]");if(rdo){const k="hd:"+rdo.dataset.hredo+":"+rdo.dataset.d,old=SETS[k];if(old){hset(k,Object.assign({},old,{by:rdo.dataset.p,tk:0}));HDPICK=null;const p=hPer(rdo.dataset.p);toast(`✓ Punkte gehen jetzt an ${p?p.n:""}`);renderHomeAll()}return}
  const ck=t.closest("[data-hck]");if(ck){e.preventDefault();const cid=ck.dataset.hck,c=SETS["hc:"+cid];
    if(c&&hDaily(c)&&!ck.dataset.by&&!ck.dataset.undo){HDPICK=HDPICK===cid+"|"+ck.dataset.d?null:cid+"|"+ck.dataset.d;renderHomeAll();return}
    HDPICK=null;hCheck(cid,ck.dataset.d,{by:ck.dataset.by});return}
  const c2=t.closest("[data-hck2]");if(c2){const k=c2.dataset.hck2+c2.dataset.d;HOPEN.has(k)?HOPEN.delete(k):HOPEN.add(k);renderHomeAll();return}
  const ha=t.closest("[data-hact]");if(ha){const k=ha.dataset.hact+ha.dataset.d;HACT.has(k)?HACT.delete(k):HACT.add(k);renderHomeAll();return}
  const hw2=t.closest("[data-hwho2]");if(hw2){const cid=hw2.dataset.hwho2,d=hw2.dataset.d;if(cid.startsWith("j:")){const [,pid,sid]=cid.split(":");hProjEdit(pid,P=>{const s=(P.steps||[]).find(x=>x.id===sid);if(s)s.who=hw2.dataset.p});}else{const k="ho:"+cid+":"+d,ov=Object.assign({},SETS[k]||{},{who:hw2.dataset.p});hset(k,ov)}HACT.delete(cid+d);const p=hPer(hw2.dataset.p);toast(`🙋 ${p?p.n:""} übernimmt – danke!`);renderHomeAll();return}
  const mx=t.closest("[data-hmvx]");if(mx){const k="ho:"+mx.dataset.hmvx+":"+mx.dataset.d,ov=Object.assign({},SETS[k]||{});delete ov.to;hset(k,Object.keys(ov).length?ov:null);renderHomeAll();return}
  const bk=t.closest("[data-hbock]");if(bk){const k="hc:"+bk.dataset.hbock,c=SETS[k];if(!c)return;const me=hMe(),v=+bk.dataset.v,b=Object.assign({},c.bock||{});if(b[me]===v)delete b[me];else b[me]=v;hset(k,Object.assign({},c,{bock:b}));renderHomeAll();return}
  const as=t.closest("[data-hassign]");if(as){const k="hc:"+as.dataset.hassign,c=SETS[k];if(!c)return;hset(k,Object.assign({},c,{who:as.dataset.who}));toast("✓ Fest zugeteilt");renderHomeAll();return}
  const ed0=t.closest("[data-hedit]");if(ed0){const c=SETS["hc:"+ed0.dataset.hedit];if(c)hEdit(Object.assign({cid:ed0.dataset.hedit},c),false);return}
  const jo=t.closest("[data-hjopen]");if(jo){const id=jo.dataset.hjopen;HJOPEN.has(id)?HJOPEN.delete(id):HJOPEN.add(id);if(M2!=="zuhause"){HJOPEN.add(id);HSEC.proj=true;setM2("zuhause")}else renderHome();return}
  const nv=t.closest(".hfmini[data-m2],.hpday [data-m2]");if(nv){setM2("zuhause");return}
  const km=t.closest("[data-kme]");if(km){LS.set("hwk-kidme",km.dataset.kme);renderKidTasks();return}
  const ks=t.closest("[data-ksay]");if(ks){hSay(`${ks.dataset.ksay}. Dafür bekommst du ${ks.dataset.p} Punkte.`);return}
  if(t.closest("[data-ksayall]")){const el=$("kTasks");hSay(el&&el._say||"");return}
  const rd=t.closest("[data-hred]");if(rd&&!rd.disabled){const by=rd.dataset.by||hMe(),cost=+rd.dataset.cost;if(hBal(by)<cost)return;const rid="r"+Date.now().toString(36);hset("hr:"+rid,{by,rw:rd.dataset.hred,ti:rd.dataset.ti,ic:rd.dataset.ic,cost,at:Date.now()});hBurst(cost,true);renderHomeAll();
    undoToast(`🎁 ${rd.dataset.ti} eingelöst (−${cost} Punkte)`,()=>{hset("hr:"+rid,null);renderHomeAll()});return}
  if(!t.closest("#homeView")&&!t.closest("#hdlg"))return;
  const tpe=t.closest("[data-htpe]");if(tpe){const x=hTpls().find(y=>y.id===tpe.dataset.htpe);if(x)hEdit(Object.assign({},x,{pts:+x.pts||hrec(+x.dur||10,x.unpop,x.kid)}),false,"tpl");return}
  const tpx=t.closest("[data-htpx]");if(tpx){const id=tpx.dataset.htpx,C=hCcfg(),x=hTpls().find(y=>y.id===id);if(C.add.some(a=>a.id===id))C.add=C.add.filter(a=>a.id!==id);else C.del=C.del.concat(id);const old=SETS.hcat;hset("hcat",C);if($("hdlg").open)$("hdlg").close();HED=null;renderHome();undoToast(`„${x?x.ti:"Vorlage"}“ aus dem Katalog gelöscht`,()=>{hset("hcat",old);renderHome()});return}
  if(t.closest("[data-htpnew]")){hEdit({ti:"",cat:"haushalt",f:"w1",wd:6,dur:30,ck:[]},true,"tpl");return}
  const rs=t.closest("[data-hrestore]");if(rs){const k=rs.dataset.hrestore;if(k==="tpl"){const C=hCcfg();C.del=C.del.filter(id=>C.add.some(a=>a.id===id));hset("hcat",C)}if(k==="rew"){const c=hRcfg();c.del=[];hRsave(c)}if(k==="goal"||k==="ch"){const c=hGcfg();if(k==="goal")c.gdel=[];else c.cdel=[];hset("hgoals",c)}toast("↩️ Wiederhergestellt");renderHome();return}
  const mi=t.closest("[data-hmini]");if(mi){hMini(mi.dataset.hmini,mi.dataset.id);return}
  const md=t.closest("[data-hmdel]");if(md){hMiniDel(md.dataset.hmdel,md.dataset.id);return}
  if(t.closest("[data-hminisave]")){hMiniSave();return}
  const fw=t.closest("[data-hfw]");if(fw){HFW=fw.dataset.hfw;renderHome();return}
  const fwho=t.closest("[data-hfwho]");if(fwho){HF.who=fwho.dataset.hfwho;LS.set("hwk-hf",HF);renderHome();return}
  const hm=t.closest("[data-hme]");if(hm){LS.set("hwk-hme",hm.dataset.hme);renderHome();return}
  const ad=t.closest("[data-hadd]");if(ad){const id=ad.dataset.hadd;const me=hMe();
    if(id==="_own"){hEdit({ti:"",cat:"haushalt",f:"w1",wd:hBlock().days[0]??6,dur:30,who:me},true);return}
    if(id==="_apt"){hEdit({ti:"",cat:"gesund",ic:"📅",f:"x",date:plus(7),t:"10:00",dur:60,who:me},true);return}
    const T=hTpls().find(x=>x.id===id);if(!T)return;const kid=!!T.kid;const P=hPeople();const who=kid?((P.find(p=>p.kid)||{}).id||me):me;
    hEdit({tpl:T.id,cat:T.cat,ic:T.ic,ti:T.ti,f:T.f,wd:T.wd!=null?T.wd:(hBlock().days[0]??6),wds:Array.isArray(T.wds)&&T.wds.length?T.wds.slice():null,dur:T.dur,unpop:T.unpop,kid:T.kid,pts:+T.pts||hrec(T.dur,T.unpop,T.kid),who,ck:(T.ck||[]).slice(),date:T.f==="x"?plus(7):null,lead:T.id==="f_geburtstag"?21:T.id==="f_weihn"?30:0},true);return}
  if(t.closest("[data-hclose]")){$("hdlg").close();HED=null;return}
  if(t.closest("[data-hmini],[data-hmdel]"))return;
  if(t.closest("[data-hsave]")){hEdSave();return}
  if(t.closest("[data-hdel]")&&HED&&HED.c.cid){const cid=HED.c.cid,old=SETS["hc:"+cid];hset("hc:"+cid,null);$("hdlg").close();HED=null;renderHomeAll();undoToast(`„${old.ti}“ gelöscht`,()=>{hset("hc:"+cid,old);renderHomeAll()});return}
  const wd=t.closest("#heWd [data-wd]");if(wd){const on=wd.getAttribute("aria-pressed")==="true",n=$("heWd").querySelectorAll('[aria-pressed="true"]').length;if(on&&n<=1)return;wd.setAttribute("aria-pressed",String(!on));return}
  const ms=t.closest("#heMiss [data-miss]");if(ms){$("heMiss").querySelectorAll("[data-miss]").forEach(b=>b.setAttribute("aria-pressed",String(b===ms)));return}
  const wh=t.closest("#heWho [data-who]");if(wh){$("heWho").querySelectorAll("[data-who]").forEach(b=>b.setAttribute("aria-pressed",String(b===wh)));return}
  const rdd=t.closest("[data-hreddone]");if(rdd){const k="hr:"+rdd.dataset.hreddone,r=SETS[k];if(r){hset(k,Object.assign({},r,{done:Date.now()}));toast("✓ Schön genossen!");renderHome()}return}
  const gr=t.closest("[data-hgred]");if(gr){const g=hGoalList().find(x=>x[0]===gr.dataset.hgred);if(!g||hFam().bal<g[3])return;const rid="f"+Date.now().toString(36);hset("hr:"+rid,{fam:1,by:hMe(),rw:g[0],ti:g[2],ic:g[1],cost:g[3],at:Date.now()});hBurst(g[3],true);renderHome();undoToast(`🎉 ${g[2]} eingelöst (−${g[3]} Familienpunkte)`,()=>{hset("hr:"+rid,null);renderHome()});return}
  const ra=t.closest("[data-hrwall]");if(ra){const c=hRcfg(),tg=ra.dataset.hrwall,ids=hRewAll().filter(r=>r[5]===tg||(tg==="a"&&r[5]==="b")).map(r=>r[0]);c.off=ra.dataset.on==="1"?c.off.filter(x=>!ids.includes(x)):[...new Set(c.off.concat(ids))];hRsave(c);return}
  if(t.id==="hjAdd"){const ti=$("hjT").value.trim();if(!ti){$("hjT").focus();return}const pid="j"+Date.now().toString(36);hset("hj:"+pid,{ti,ic:"💡",cat:"projekt",at:Date.now(),steps:[]});HJOPEN.add(pid);renderHome();return}
  const tp=t.closest("[data-hjtpl]");if(tp){const T=HPROJ[+tp.dataset.hjtpl];const pid="j"+Date.now().toString(36);hset("hj:"+pid,{ti:T[1],ic:T[0],cat:"projekt",at:Date.now(),steps:T[2].map((s,i)=>({id:"s"+i,t:s,who:"",dur:60}))});HJOPEN.add(pid);toast("💡 Projekt angelegt – Schritte anpassen, Personen und Termine eintragen");renderHome();return}
  const ja=t.closest("[data-hjadd]");if(ja){const inp=document.querySelector(`[data-hjnew="${ja.dataset.hjadd}"]`),v=inp&&inp.value.trim();if(!v){inp&&inp.focus();return}hProjEdit(ja.dataset.hjadd,P=>{P.steps=(P.steps||[]).concat({id:hsid(),t:v,who:"",dur:60})});setTimeout(()=>{const n=document.querySelector(`[data-hjnew="${ja.dataset.hjadd}"]`);n&&n.focus()},0);return}
  const js=t.closest("[data-hjsx]");if(js){hProjEdit(js.dataset.hjsx,P=>{P.steps=(P.steps||[]).filter(x=>x.id!==js.dataset.s)});return}
  const jx=t.closest("[data-hjx]");if(jx){const k="hj:"+jx.dataset.hjx,old=SETS[k];hset(k,null);renderHome();undoToast(`„${old.ti}“ gelöscht`,()=>{hset(k,old);renderHome()});return}});
document.addEventListener("toggle",e=>{const d=e.target;if(!d.closest||!d.closest("#homeView"))return;if(d.dataset&&d.dataset.hsec){HSEC[d.dataset.hsec]=d.open;LS.set("hwk-hsec",HSEC)}if(d.dataset&&d.dataset.hcat&&d.open&&!HCQ)HCATOPEN=d.dataset.hcat;if(d.dataset&&d.dataset.hmgr)HMGR[d.dataset.hmgr]=d.open},true);
window.renderHomeNow=renderHome;window.renderHomeSetNow=renderHomeSet;
renderHomeSet();if(M2==="zuhause")renderHome();if(M2==="plan"&&typeof renderPlan==="function")renderPlan();
window.__home={SETS,hBal:id=>hBal(id),hMe:()=>hMe(),hFam:()=>hFam()};
