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
const HREW=[
 ["r_schulter","💆","15 Min. Schultermassage",30,"erholung"],["r_eis","🍦","Eis essen gehen",30,"genuss"],["r_laenger","🌙","15 Min. länger aufbleiben",30,"kinder"],["r_nachtisch","🍮","Wunsch-Nachtisch",30,"kinder"],
 ["r_ausschlaf","😴","Ausschlafen (bis 9 Uhr)",60,"erholung"],["r_wanne","🛁","Badewanne in Ruhe",60,"erholung"],["r_mittag","💤","Ungestörter Mittagsschlaf",60,"erholung"],["r_stunde","⏳","Eine Stunde nur für mich",60,"freiraum"],["r_kuchen","🍰","Lieblingskuchen backen lassen",60,"genuss"],["r_spielzeit","🎲","Spielzeit mit Mama/Papa nach Wahl",60,"kinder"],
 ["r_massage","💆","30 Min. Massage",100,"erholung"],["r_sport","🏃","Sport allein, ohne schlechtes Gewissen",100,"freiraum"],["r_morgen","☕","Wochenend-Morgen frei",100,"freiraum"],["r_essen","🍝","Lieblingsessen gekocht bekommen",100,"genuss"],["r_fruehst","🥐","Frühstück ans Bett",100,"genuss"],
 ["r_abend","🌆","Abend frei",150,"freiraum"],["r_freunde","🍻","Treffen mit Freunden",150,"freiraum"],["r_kino","🎬","Kino mit den Kindern",150,"kinder"],["r_spielzeug","🧸","Kleines Spielzeug / Buch",150,"kinder"],
 ["r_konzert","🎤","Konzert oder Kino allein/zu zweit",250,"freiraum"],["r_wunschausflug","🗺️","Wunsch-Ausflug aussuchen",250,"kinder"],["r_uebernacht","🏕️","Übernachtungsparty",250,"kinder"],["r_restaurant","🍽️","Essen gehen zu zweit (Babysitter organisiert)",250,"genuss"],
 ["r_wellness","🧖","Wellness-Tag",400,"erholung"],["r_wochenende","🧳","Wochenende allein / zu zweit",600,"freiraum"]];
const HRWC={erholung:"💆 Erholung",freiraum:"🕊️ Freiraum",genuss:"😋 Genuss",kinder:"🧒 Für Kinder",eigen:"✍️ Eigene"};
const HGOAL=[[300,"🍕","Pizza- & Filmabend"],[600,"🗺️","Familien-Wunschausflug"],[1000,"🎢","Großer Ausflug (z. B. Heide-Park)"]];
const HLEV=[[0,"🌱","Anfänger"],[100,"🧹","Helfer"],[250,"⭐","Profi"],[500,"🦸","Haushalts-Held"],[1000,"🏆","Meister"],[2000,"👑","Legende"]];
const HCOL=["#2F6FB0","#C2410C","#7C3AED","#15803D","#BE185D","#0E7490","#A16207"];
const HEMO=["🧔","👩","🧑","👨","👱‍♀️","👧","👦","🧒","👶","🦸","🐻","🦊"];
const hrec=(min,unpop,kid)=>kid?Math.max(3,Math.round(min/2)):Math.max(2,Math.round(min/5*(unpop?1.5:1)));
const HK=k=>"settings/"+k;
/* --- Zustand: steckt in SETS (Supabase-Art „settings“), zusätzlich lokal gespiegelt --- */
const isHomeKey=k=>/^(hc|hd|hr):/.test(k)||k==="people"||k==="homeblock"||k==="hrw";
{const loc=LS.get("hwk-home",{});for(const k in loc)if(SETS[k]===undefined)SETS[k]=loc[k]}
function hMirror(){const o={};for(const k in SETS)if(isHomeKey(k))o[k]=SETS[k];LS.set("hwk-home",o)}
function hset(id,data){if(data==null)delete SETS[id];else SETS[id]=data;hMirror();if(SB)write(HK(id),data)}
let HFIRST=true;
window.homeApply=(s,full)=>{if(full){const srv=Object.keys(s).some(k=>/^(hc|hd|hr):/.test(k)||k==="people");
    if(HFIRST&&!srv){for(const k of Object.keys(SETS))if(isHomeKey(k))write(HK(k),SETS[k])}
    else for(const k of Object.keys(SETS))if(/^(hc|hd|hr):/.test(k)&&!(k in s))delete SETS[k];HFIRST=false}
  hMirror();if(M2==="zuhause"&&typeof renderHome==="function")renderHome()};
window.homeIsKey=isHomeKey;
/* Personen */
function hPeople(){let L=(SETS.people&&Array.isArray(SETS.people.list))?SETS.people.list.slice():null;
  if(!L){L=[];if(MYID)L.push({id:"p_"+hslug(MYID),n:MYID,e:"🧔",kid:false});(FAM.kids||[]).forEach((a,i)=>L.push({id:"k"+(i+1),n:"Kind "+(i+1)+" ("+a+" J.)",e:i?"👦":"👧",kid:true}))}
  return L.map((p,i)=>Object.assign({c:HCOL[i%HCOL.length]},p))}
function hslug(s){return String(s).toLowerCase().replace(/[^a-z0-9äöüß]+/g,"-").slice(0,20)}
function hEnsureMe(){if(!MYID)return;const L=(SETS.people&&SETS.people.list)||null;if(L&&L.some(p=>p.n.toLowerCase()===MYID.toLowerCase()))return;
  const base=L?L.slice():hPeople().map(({c,...p})=>p);if(!base.some(p=>p.n.toLowerCase()===MYID.toLowerCase()))base.unshift({id:"p_"+hslug(MYID),n:MYID,e:HEMO[base.length%3],kid:false});hset("people",{list:base})}
const hPer=id=>hPeople().find(p=>p.id===id);
const hAdults=()=>hPeople().filter(p=>!p.kid);
function hMe(){const L=hPeople(),s=LS.get("hwk-hme",null);if(s&&L.some(p=>p.id===s))return s;const m=MYID&&L.find(p=>p.n.toLowerCase()===MYID.toLowerCase());return m?m.id:(L[0]||{}).id}
const hChip=(id,small)=>{const p=hPer(id);if(!p)return id==="rot"?`<span class="hchip">🔄 abwechselnd</span>`:`<span class="hchip">–</span>`;return `<span class="hchip" style="--pc:${p.c}">${p.e} ${small?"":esc(p.n)}</span>`};
/* Zuhause-Block */
function hBlock(){const b=SETS.homeblock||{};return {days:Array.isArray(b.days)?b.days:[6],from:b.from||"09:00",to:b.to||"12:00"}}
const toMin=t=>{const[h,m]=String(t||"0:0").split(":").map(Number);return h*60+(m||0)};
/* Aufgaben & Termine */
const hChores=()=>Object.keys(SETS).filter(k=>k.startsWith("hc:")).map(k=>Object.assign({cid:k.slice(3)},SETS[k])).filter(c=>c&&c.ti);
const hDone=(cid,d)=>SETS["hd:"+cid+":"+d];
const isoD=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const addD=(s,n)=>{const d=pdate(s);d.setDate(d.getDate()+n);return isoD(d)};
function hOcc(c,from,to){const out=[],st=c.start||c.date||from,f=c.f||"w1";
  if(f==="x"){if(c.date&&c.date>=from&&c.date<=to)out.push(c.date);return out}
  if(f==="y1"){const a=c.date||st;const lead=+c.lead||0;for(let y=+from.slice(0,4)-1;y<=+to.slice(0,4)+1;y++){const d=addD(y+a.slice(4),-lead);if(d>=from&&d<=to&&d>=addD(st,-lead))out.push(d)}return out}
  for(let s=from;s<=to;s=addD(s,1)){if(s<st)continue;const d=pdate(s),wd=d.getDay();
    if(f==="d"){out.push(s);continue}
    if(f==="wd"){if(wd>=1&&wd<=5)out.push(s);continue}
    const cw=c.wd!=null?+c.wd:6;if(wd!==cw)continue;
    if(f[0]==="w"){const n=+f.slice(1)||1;const wk=Math.floor((pdate(s)-pdate(st))/864e5/7);if(n===1||(wk%n+n)%n===0)out.push(s);continue}
    if(f[0]==="m"){const n=+f.slice(1)||1;if(d.getDate()>7)continue;const mi=(d.getFullYear()*12+d.getMonth())-(pdate(st).getFullYear()*12+pdate(st).getMonth());if(mi%n===0)out.push(s)}}
  return out}
function hWho(c,d){if(c.who!=="rot")return c.who;const A=hAdults();if(!A.length)return null;const i=Math.abs(Math.floor((pdate(d)-pdate(c.start||d))/864e5/7))+hOcc(c,c.start||d,d).length;return A[i%A.length].id}
const hDaily=c=>c.f==="d"||c.f==="wd";
/* Fällige Einträge (mit Überfälligen) */
function hItems(from,to){const L=[];hChores().forEach(c=>hOcc(c,from,to).forEach(d=>L.push({c,d,who:hWho(c,d),dn:hDone(c.cid,d)})));return L.sort((a,b)=>(a.d+(a.c.t||"99")).localeCompare(b.d+(b.c.t||"99")))}
function hOverdue(){const L=[];hChores().forEach(c=>{if(hDaily(c))return;const occ=hOcc(c,addD(T0,-21),addD(T0,-1));const last=occ.pop();const nx0=hOcc(c,T0,addD(T0,60))[0];if(last&&!hDone(c.cid,last)&&nx0!==T0){const nx=nx0;L.push({c,d:last,who:hWho(c,last),od:true,nx})}});return L}
/* Punkte & Statistik */
const hDoneAll=()=>Object.keys(SETS).filter(k=>k.startsWith("hd:")).map(k=>{const [,cid,d]=k.split(":");return Object.assign({cid,d},SETS[k])});
function hEarned(pid,from,to){return hDoneAll().filter(x=>x.by===pid&&(!from||x.d>=from)&&(!to||x.d<=to)).reduce((s,x)=>s+(+x.pts||0),0)}
const hReds=()=>Object.keys(SETS).filter(k=>k.startsWith("hr:")).map(k=>Object.assign({rid:k.slice(3)},SETS[k]));
const hBal=pid=>hEarned(pid)-hReds().filter(r=>r.by===pid).reduce((s,r)=>s+(+r.cost||0),0);
const hLev=pts=>{let L=HLEV[0],n=null;for(let i=0;i<HLEV.length;i++){if(pts>=HLEV[i][0]){L=HLEV[i];n=HLEV[i+1]||null}}return {L,n}};
const wkStart=s=>{const d=pdate(s);d.setDate(d.getDate()-((d.getDay()+6)%7));return isoD(d)};
function hStreak(pid){let n=0,w=wkStart(T0);const D=hDoneAll().filter(x=>x.by===pid);const has=a=>D.some(x=>x.d>=a&&x.d<=addD(a,6));if(!has(w))w=addD(w,-7);while(has(w)){n++;w=addD(w,-7)}return n}
const fmH=m=>m>=60?Math.floor(m/60)+" h"+(m%60?" "+(m%60)+" min":""):m+" min";
let HFW="w";
function hFair(){const A=hAdults(),from=HFW==="w"?wkStart(T0):addD(wkStart(T0),-21),to=addD(wkStart(T0),6);
  const D=hDoneAll().filter(x=>x.d>=from&&x.d<=to);const ch=Object.fromEntries(hChores().map(c=>[c.cid,c]));
  const st=A.map(p=>{const mine=D.filter(x=>x.by===p.id);const min=mine.reduce((s,x)=>s+(+x.min||((ch[x.cid]||{}).dur)||0),0);
    const ml=mine.filter(x=>MENTAL.has(x.cat||(ch[x.cid]||{}).cat)).reduce((s,x)=>s+(+x.min||((ch[x.cid]||{}).dur)||0),0);
    const plan=hItems(from,to).filter(i=>i.who===p.id).reduce((s,i)=>s+(+i.c.dur||0),0);
    return {p,min,ml,plan,pts:mine.reduce((s,x)=>s+(+x.pts||0),0),n:mine.length}});
  const tot=st.reduce((s,x)=>s+x.min,0),tml=st.reduce((s,x)=>s+x.ml,0),tpl=st.reduce((s,x)=>s+x.plan,0);
  st.forEach(x=>{x.sh=tot?Math.round(x.min/tot*100):0;x.shm=tml?Math.round(x.ml/tml*100):0;x.shp=tpl?Math.round(x.plan/tpl*100):0});
  const kids=hPeople().filter(p=>p.kid).map(p=>({p,pts:D.filter(x=>x.by===p.id).reduce((s,x)=>s+(+x.pts||0),0)}));
  return {st,tot,tml,tpl,kids,from,to}}
function hFairHtml(compact){const F=hFair(),A=F.st;if(!A.length)return "";
  const bar=(k,lab)=>`<div class="hfb" role="img" aria-label="${esc(lab)}">${A.map(x=>`<span style="flex:${Math.max(x[k],A.length===1?100:0)||.0001};background:${x.p.c}" title="${esc(x.p.n)}: ${x[k]} %"></span>`).join("")}</div>`;
  const maxSh=Math.max(...A.map(x=>x.sh));const low=A.slice().sort((a,b)=>a.sh-b.sh)[0];
  const warn=A.length>1&&F.tot>=60&&maxSh>=65?`<p class="hfwarn">⚖️ Ungleich verteilt – vielleicht übernimmt ${esc(low.p.n)} ${HFW==="w"?"diese Woche":"in nächster Zeit"} etwas mehr?</p>`:A.length>1&&F.tot>=60?`<p class="hfok">✅ Gut verteilt</p>`:"";
  if(compact&&(!F.tot||A.length<2))return `<button type="button" class="hfmini" data-m2="zuhause">⚖️ <b>Fairness</b><span>${A.length<2?"Zweite erwachsene Person unter ⚙️ eintragen":"Diese Woche noch nichts erledigt – zu „Zuhause“ →"}</span></button>`;
  if(compact)return `<button type="button" class="hfmini" data-m2="zuhause" aria-label="Zur Fairness-Übersicht">⚖️ <b>Diese Woche</b>${bar("sh","Anteil erledigter Zeit")}<span>${A.map(x=>`${x.p.e} ${x.sh} %`).join(" · ")}</span></button>`;
  return `<section class="hfair" aria-labelledby="hfH"><div class="hfhead"><h3 id="hfH">⚖️ Fairness</h3><span class="hseg" role="group" aria-label="Zeitraum"><button type="button" data-hfw="w" aria-pressed="${HFW==="w"}">Diese Woche</button><button type="button" data-hfw="m" aria-pressed="${HFW==="m"}">4 Wochen</button></span></div>
    <div class="hfrow"><span class="hfl">Erledigt</span>${bar("sh","Erledigte Zeit")}</div>
    <div class="hfleg">${A.map(x=>`<span><i style="background:${x.p.c}"></i>${x.p.e} <b>${esc(x.p.n)}</b> ${x.sh} % · ${fmH(x.min)} · ${x.pts} Pkt.</span>`).join("")}</div>
    <div class="hfrow"><span class="hfl">Kopf-Arbeit</span>${F.tml?bar("shm","Kopf-Arbeit"):`<div class="hfb empty"></div>`}</div>
    <div class="hfleg sm">${F.tml?A.map(x=>`<span>${x.p.e} ${x.shm} %</span>`).join(""):"<span>Noch keine Organisation, Termine oder Geschenke erledigt.</span>"} <span class="hfnote">Termine, Geschenke, Organisation, Kümmern – die unsichtbare Arbeit</span></div>
    <div class="hfrow"><span class="hfl">Geplant</span>${F.tpl?bar("shp","Geplante Zeit"):`<div class="hfb empty"></div>`}</div>
    <div class="hfleg sm">${F.tpl?A.map(x=>`<span>${x.p.e} ${x.shp} % · ${fmH(x.plan)}</span>`).join(""):"<span>Noch keine Aufgaben verteilt.</span>"}</div>
    ${warn}${F.kids.length?`<div class="hfkids">${F.kids.map(k=>`<span>${k.p.e} ${esc(k.p.n)}: <b>${k.pts} Pkt.</b></span>`).join("")}</div>`:""}</section>`}
/* Wochen-Challenge & Familienziel */
function hChallenge(){const a=wkStart(T0),b=addD(a,6);const L=hItems(a,b).filter(i=>!hDaily(i.c));const n=L.filter(i=>i.dn).length;return {n,t:L.length,ok:L.length>0&&n===L.length}}
function hFamily(){const m=T0.slice(0,7);let pts=hDoneAll().filter(x=>x.d.startsWith(m)).reduce((s,x)=>s+(+x.pts||0),0);
  let w=wkStart(m+"-01");const end=addD(T0,0);while(w<=end){const L=hItems(w,addD(w,6)).filter(i=>!hDaily(i.c));if(addD(w,6)<T0&&L.length&&L.every(i=>i.dn))pts+=50;w=addD(w,7)}const c=hChallenge();if(c.ok)pts+=50;return pts}
/* Abzeichen */
function hBadges(pid){const D=hDoneAll().filter(x=>x.by===pid),ch=Object.fromEntries(hChores().map(c=>[c.cid,c])),cat=x=>x.cat||(ch[x.cid]||{}).cat;
  return [["🎉","Erster Haken",D.length>=1],["🔟","10 erledigt",D.length>=10],["💯","100 erledigt",D.length>=100],["🛟","Retter (3× übernommen)",D.filter(x=>x.tk).length>=3],
   ["🔥","4 Wochen am Stück",hStreak(pid)>=4],["🧠","Kopf-Arbeiter (10× Organisation)",D.filter(x=>MENTAL.has(cat(x))).length>=10],["🌳","Gärtner (10× Garten)",D.filter(x=>cat(x)==="garten").length>=10],
   ["🧽","Putzteufel (20× Haushalt)",D.filter(x=>cat(x)==="haushalt").length>=20],["⏰","Pünktlich (20× rechtzeitig)",D.filter(x=>!x.late).length>=20],["🧒","Kinder-Profi (10× Kinderaufgaben)",D.filter(x=>cat(x)==="kids").length>=10]]}
/* Abhaken */
function hCheck(cid,d,undo){const c=SETS["hc:"+cid];if(!c)return;const k="hd:"+cid+":"+d;
  if(SETS[k]){const old=SETS[k];hset(k,null);renderHomeAll();if(!undo)undoToast("Haken entfernt",()=>{hset(k,old);renderHomeAll()});return}
  const me=hMe(),who=hWho(c,d),late=d<T0,tk=!!(who&&who!==me&&late&&who!=="rot");const base=+c.pts||hrec(+c.dur||10,c.unpop,c.kid);const pts=Math.round(base*(tk?1.5:1));
  const lvBefore=hLev(hEarned(me)).L;hset(k,{by:me,pts,min:+c.dur||0,cat:c.cat,at:Date.now(),late:late?1:0,tk:tk?1:0});
  hBurst(pts,tk);const lv=hLev(hEarned(me)).L;
  renderHomeAll();undoToast(`✓ ${c.ti} – +${pts} Punkte für ${hPer(me)?hPer(me).n:"dich"}${tk?" (Übernahme-Bonus +50 %)":""}${lv!==lvBefore?` · 🎉 Neues Level: ${lv[1]} ${lv[2]}`:""}`,()=>{hset(k,null);renderHomeAll()})}
function hBurst(pts,big){const host=document.body,n=big?26:16,em=["🎉","⭐","✨","🎊","💪","🏅"];
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  for(let i=0;i<n;i++){const s=document.createElement("span");s.className="hconf";s.textContent=em[i%em.length];s.style.left=(40+Math.random()*20)+"%";s.style.setProperty("--dx",(Math.random()*2-1)*45+"vw");s.style.setProperty("--dy",-(30+Math.random()*45)+"vh");s.style.animationDelay=(Math.random()*.15)+"s";host.appendChild(s);setTimeout(()=>s.remove(),1500)}
  const p=document.createElement("div");p.className="hplus";p.textContent="+"+pts;host.appendChild(p);setTimeout(()=>p.remove(),1300)}
function renderHomeAll(){if(M2==="zuhause")renderHome();if(M2==="plan"&&typeof renderPlan==="function")renderPlan()}
/* Zeile einer Aufgabe */
function hRow(i,ctx){const {c,d,who,dn,od}=i,me=hMe(),pts=+c.pts||hrec(+c.dur||10,c.unpop,c.kid);const cat=HCAT[c.cat]||["","📌",""];
  const ck=Array.isArray(c.ck)&&c.ck.length?(()=>{const dd=c.ckd===d?c.ckx||[]:[];return {n:dd.length,t:c.ck.length,dd}})():null;const op=HOPEN.has(c.cid+d);
  const tk=od&&who&&who!==me;
  return `<div class="htrow${dn?" dn":""}${od?" od":""}"><button type="button" class="hck" data-hck="${esc(c.cid)}" data-d="${d}" aria-pressed="${!!dn}" aria-label="${dn?"Erledigt – antippen zum Zurücknehmen":"Als erledigt abhaken"}">${dn?"✓":""}</button>
    <div class="hrb"><b>${c.ic||cat[1]} ${esc(c.ti)}</b><small>${od?`<span class="hod">⚠️ überfällig seit ${esc(fmtDate(d))}</span> · `:ctx==="week"?esc(fmtDate(d))+" · ":""}${c.t?esc(c.t)+" Uhr · ":""}${fmH(+c.dur||0)} · ${hChip(who)}${dn&&dn.by!==who?` · erledigt von ${hChip(dn.by)}`:""}${c.f!=="x"?" · "+esc(HFL[c.f]||""):""}${ck?` · <button type="button" class="mbdet" data-hck2="${esc(c.cid)}" data-d="${d}">☑️ ${ck.n}/${ck.t} ${op?"▴":"▾"}</button>`:""}</small>
      ${ck&&op?`<div class="hcl">${c.ck.map((t,j)=>`<label><input type="checkbox" data-hcl="${esc(c.cid)}" data-d="${d}" data-j="${j}"${ck.dd.includes(j)?" checked":""}> ${esc(t)}</label>`).join("")}</div>`:""}${tk&&!dn?`<button type="button" class="pmini htk" data-hck="${esc(c.cid)}" data-d="${d}">🛟 Übernehmen +50 %</button>`:""}</div>
    <div class="hrr"><span class="hpts">${tk?`<s>${pts}</s> ${Math.round(pts*1.5)}`:dn?dn.pts:pts} P.</span></div></div>`}
let HOPEN=new Set(),HCATOPEN=null,HSEC=LS.get("hwk-hsec",{});
/* Hauptansicht */
function renderHome(){const v=$("homeView");if(!v)return;hEnsureMe();const me=hMe(),P=hPeople(),meP=hPer(me);
  const od=hOverdue(),today=hItems(T0,T0),week=hItems(addD(T0,1),addD(T0,6)).filter(i=>!hDaily(i.c));
  const ch=hChores(),bal=hBal(me),earned=hEarned(me),lv=hLev(earned),fam=hFamily(),chal=hChallenge();
  const B=hBlock(),nb=(()=>{for(let i=0;i<14;i++){const s=plus(i);if(B.days.includes(pdate(s).getDay()))return s}return null})();
  const sec=(id,title,body,open)=>`<details class="hsec2" data-hsec="${id}"${(HSEC[id]!=null?HSEC[id]:open)?" open":""}><summary><h3>${title}</h3></summary>${body}</details>`;
  const meSel=`<div class="hme" role="group" aria-label="Wer hakt ab?"><span>Ich bin</span>${P.map(p=>`<button type="button" data-hme="${p.id}" aria-pressed="${p.id===me}" style="--pc:${p.c}">${p.e} ${esc(p.n)}</button>`).join("")}</div>`;
  const now=(od.length||today.length||week.length)?`${od.map(i=>hRow(i,"od")).join("")}${today.length?`<h4 class="hday">Heute</h4>`+today.map(i=>hRow(i,"today")).join(""):""}${week.length?`<h4 class="hday">Die nächsten Tage</h4>`+week.map(i=>hRow(i,"week")).join(""):""}`
    :`<p class="pvsub">${ch.length?"Gerade nichts fällig. 🎉":"Noch keine Aufgaben. Unten im Katalog auswählen – mit Turnus, Tag und wer zuständig ist."}</p>`;
  const meCard=P.map(p=>{const e=hEarned(p.id),b=hBal(p.id),L=hLev(e),st=hStreak(p.id);const prog=L.n?Math.round((e-L.L[0])/(L.n[0]-L.L[0])*100):100;
    return `<div class="hpcard${p.id===me?" me":""}" style="--pc:${p.c}"><div class="hpav">${p.e}</div><div style="min-width:0"><b>${esc(p.n)}</b><small>${L.L[1]} ${L.L[2]}${st?` · 🔥 ${st} ${st===1?"Woche":"Wochen"}`:""}</small><div class="hprog"><i style="width:${prog}%"></i></div><small>${L.n?`noch ${L.n[0]-e} Punkte bis ${L.n[1]} ${L.n[2]}`:"Höchstes Level erreicht"}</small></div><div class="hpbal"><b>${b}</b><small>Punkte</small></div></div>`}).join("");
  const RW=HREW.concat(((SETS.hrw||{}).list||[]).map(r=>[r.id,r.ic||"🎁",r.ti,+r.cost||50,"eigen"]));const tiers=[...new Set(RW.map(r=>r[3]))].sort((a,b)=>a-b);
  const forKid=meP&&meP.kid;const RWf=RW.filter(r=>forKid?(r[4]==="kinder"||r[4]==="genuss"||r[4]==="eigen"):r[4]!=="kinder"||true);
  const rew=`<p class="hsub">Punkte von <b>${meP?esc(meP.n):"–"}</b>: <b>${bal}</b>. Stufen schalten sich frei, sobald genug Punkte da sind.</p>`+tiers.map(t=>{const L=RWf.filter(r=>r[3]===t);if(!L.length)return "";const ok=bal>=t;
      return `<div class="htier${ok?" ok":""}"><div class="htl"><b>${ok?"🔓":"🔒"} ${t} Punkte</b>${ok?"":`<small>noch ${t-bal}</small>`}</div><div class="hrw">${L.map(r=>`<button type="button" class="hrwb" data-hred="${esc(r[0])}" data-cost="${r[3]}" data-ti="${esc(r[2])}" data-ic="${esc(r[1])}"${ok?"":" disabled"} title="${esc(HRWC[r[4]]||"")}"><span>${r[1]}</span>${esc(r[2])}</button>`).join("")}</div></div>`}).join("")
    +`<details class="hown"><summary>✍️ Eigene Belohnung anlegen</summary><div class="hownf"><input type="text" id="hrwT" maxlength="40" placeholder="z. B. Kaffee im Lieblingscafé"><input type="number" id="hrwC" min="5" max="2000" step="5" value="60" aria-label="Punkte"><button type="button" class="pmini" id="hrwAdd">Hinzufügen</button></div>${((SETS.hrw||{}).list||[]).length?`<div class="hownl">${SETS.hrw.list.map(r=>`<span>${esc(r.ic||"🎁")} ${esc(r.ti)} · ${r.cost} P. <button type="button" class="mbx" data-hrwrm="${esc(r.id)}" aria-label="Entfernen">✕</button></span>`).join("")}</div>`:""}</details>`;
  const open=hReds().filter(r=>!r.done).sort((a,b)=>a.at-b.at);
  const redOpen=open.length?`<div class="hredl"><h4>Eingelöst – noch offen</h4>${open.map(r=>`<div class="hred">${hChip(r.by)} <span>${esc(r.ic||"🎁")} ${esc(r.ti)}</span><small>${r.cost} P.</small><button type="button" class="pmini" data-hreddone="${esc(r.rid)}">✓ Eingelöst</button></div>`).join("")}</div>`:"";
  const goal=(()=>{const nx=HGOAL.find(g=>fam<g[0]),max=HGOAL[HGOAL.length-1][0];return `<div class="hgoal"><div class="hgbar"><i style="width:${Math.min(100,fam/max*100)}%"></i>${HGOAL.map(g=>`<span class="hgm${fam>=g[0]?" ok":""}" style="left:${g[0]/max*100}%" title="${g[0]} Punkte: ${esc(g[2])}">${g[1]}</span>`).join("")}</div>
    <p class="hsub"><b>${fam}</b> Familienpunkte im ${MONL[TODAY.getMonth()]}${nx?` · noch ${nx[0]-fam} bis ${nx[1]} ${esc(nx[2])}`:" · 🎉 alle Ziele erreicht!"}</p>${HGOAL.filter(g=>fam>=g[0]).map(g=>`<p class="hunl">🎉 Freigeschaltet: ${g[1]} ${esc(g[2])}</p>`).join("")}
    <div class="hchal${chal.ok?" ok":""}"><b>🏁 Wochen-Challenge:</b> alle Aufgaben dieser Woche erledigen → +50 Familienpunkte<div class="hprog"><i style="width:${chal.t?chal.n/chal.t*100:0}%"></i></div><small>${chal.t?`${chal.n} von ${chal.t} erledigt${chal.ok?" – geschafft! 🎉":""}`:"Diese Woche ist nichts Wöchentliches geplant."}</small></div></div>`})();
  const badges=`<div class="hbdg">${hBadges(me).map(b=>`<span class="${b[2]?"on":""}" title="${esc(b[1])}"><i>${b[0]}</i>${esc(b[1])}</span>`).join("")}</div>`;
  const act=ch.length?`<div class="hact">${HCATS.map(cc=>{const L=ch.filter(c=>c.cat===cc[0]);return L.length?`<h4 class="hday">${cc[1]} ${cc[2]}</h4>`+L.map(c=>`<div class="hcrow"><div style="min-width:0"><b>${c.ic||cc[1]} ${esc(c.ti)}</b><small>${esc(c.f==="x"?(c.date?fmtDate(c.date)+(c.t?", "+c.t+" Uhr":""):"ohne Datum"):HFL[c.f]+(["w1","w2","w4","m1","m3","m6"].includes(c.f)?" · "+WDL[c.wd!=null?+c.wd:6]:"")+(c.f==="y1"&&c.date?" · "+fmtDate(c.date):""))} · ${fmH(+c.dur||0)} · ${+c.pts||hrec(+c.dur||10,c.unpop,c.kid)} P. · ${hChip(c.who)}</small></div><button type="button" class="pmini" data-hedit="${esc(c.cid)}">✏️ Ändern</button></div>`).join(""):""}).join("")}</div>`:`<p class="pvsub">Noch nichts ausgewählt.</p>`;
  const cat=`<p class="hsub">Antippen zum Hinzufügen – Turnus, Tag, Dauer, Person und Punkte lassen sich danach anpassen.</p>${HCATS.map(cc=>{const L=HT.filter(t=>t[1]===cc[0]);const used=new Set(ch.map(c=>c.tpl));
      return `<details class="hcat"${HCATOPEN===cc[0]?" open":""} data-hcat="${cc[0]}"><summary>${cc[1]} ${cc[2]} <small>${L.length}</small></summary><div class="htpl">${L.map(t=>`<button type="button" class="htb${used.has(t[0])?" on":""}" data-hadd="${t[0]}"><span>${t[2]}</span><b>${esc(t[3])}</b><small>${esc(HFL[t[4]])} · ${fmH(t[5])} · ${hrec(t[5],t[6],t[7])} P.${used.has(t[0])?" · ✓ aktiv":""}</small></button>`).join("")}</div></details>`}).join("")}
      <div class="hownbtns"><button type="button" class="pbtn" data-hadd="_own">➕ Eigene Aufgabe</button><button type="button" class="pbtn" data-hadd="_apt">📅 Termin eintragen</button></div>`;
  v.innerHTML=`<h2 class="mtitle">🏠 Zuhause</h2>${hFairHtml()}${meSel}
    <section class="pvsec hnow"><h3>✅ Jetzt dran</h3>${nb?`<p class="hsub">🏠 Nächster Zuhause-Block: <b>${esc(fmtDate(nb))}, ${esc(B.from)}–${esc(B.to)} Uhr</b></p>`:""}${now}</section>
    <section class="pvsec"><h3>🏆 Punkte & Level</h3><div class="hpcards">${meCard}</div></section>
    <section class="pvsec">${sec("rew","🎁 Belohnungen",redOpen+rew,true)}</section>
    <section class="pvsec">${sec("fam","👨‍👩‍👧 Familienziel & Challenge",goal,true)}</section>
    <section class="pvsec">${sec("bdg","🏅 Abzeichen von "+(meP?esc(meP.n):"dir"),badges,false)}</section>
    <section class="pvsec">${sec("act","📋 Unsere Aufgaben ("+ch.length+")",act,true)}</section>
    <section class="pvsec">${sec("cat","➕ Aufgaben-Katalog",cat,!ch.length)}</section>`}
/* Editor */
let HED=null;
function hEdit(c,isNew){HED={c:Object.assign({},c),isNew};const d=$("hdlg");const P=hPeople(),x=HED.c,rec=hrec(+x.dur||10,x.unpop,x.kid);
  const durs=[5,10,15,20,30,45,60,75,90,120,180,240,300,360,480];if(!durs.includes(+x.dur))durs.push(+x.dur);durs.sort((a,b)=>a-b);
  d.innerHTML=`<form method="dialog" class="hform"><div class="dlghead"><h3>${isNew?"Aufgabe hinzufügen":"Aufgabe ändern"}</h3><button type="button" class="mbx" data-hclose aria-label="Schließen">✕</button></div>
   <label>Titel<input type="text" id="heTi" maxlength="60" value="${esc(x.ti||"")}" required></label>
   <div class="hf2"><label>Kategorie<select id="heCat">${HCATS.map(c=>`<option value="${c[0]}"${c[0]===x.cat?" selected":""}>${c[1]} ${c[2]}</option>`).join("")}</select></label><label>Icon<input type="text" id="heIc" maxlength="4" value="${esc(x.ic||"")}"></label></div>
   <label>Turnus<select id="heF">${HFREQ.map(f=>`<option value="${f[0]}"${f[0]===x.f?" selected":""}>${f[1]}</option>`).join("")}</select></label>
   <div id="heWdW"><span class="hlab">Tag</span><div class="dquick" id="heWd">${[1,2,3,4,5,6,0].map(i=>`<button type="button" data-wd="${i}" aria-pressed="${(x.wd!=null?+x.wd:6)===i}">${["So","Mo","Di","Mi","Do","Fr","Sa"][i]}</button>`).join("")}</div><small class="hhint" id="heWdH"></small></div>
   <div class="hf2" id="heDateW"><label><span id="heDateL">Datum</span><input type="date" id="heDate" value="${esc(x.date||"")}"></label><label>Uhrzeit (optional)<input type="time" id="heT" value="${esc(x.t||"")}"></label></div>
   <label id="heLeadW">Wie viele Tage vorher anfangen?<input type="number" id="heLead" min="0" max="90" value="${+x.lead||0}"></label>
   <div class="hf2"><label>Dauer<select id="heDur">${durs.map(m=>`<option value="${m}"${m===+x.dur?" selected":""}>${fmH(m)}</option>`).join("")}</select></label><label>Punkte <small>(Empfehlung: <span id="heRec">${rec}</span>)</small><input type="number" id="hePts" min="1" max="999" value="${+x.pts||rec}"></label></div>
   <span class="hlab">Wer ist zuständig?</span><div class="dquick hwho" id="heWho">${P.map(p=>`<button type="button" data-who="${p.id}" aria-pressed="${x.who===p.id}" style="--pc:${p.c}">${p.e} ${esc(p.n)}</button>`).join("")}<button type="button" data-who="rot" aria-pressed="${x.who==="rot"}">🔄 Abwechselnd</button></div>
   <label>Checkliste <small>(eine Zeile pro Punkt, optional)</small><textarea id="heCk" rows="4">${esc((x.ck||[]).join("\n"))}</textarea></label>
   <div class="hfbtn">${isNew?"":`<button type="button" class="pmini hdel" data-hdel>🗑️ Löschen</button>`}<button type="button" class="pbtn" data-hclose>Abbrechen</button><button type="button" class="pbtn hsave" data-hsave>${isNew?"➕ Hinzufügen":"💾 Speichern"}</button></div></form>`;
  hEdUpd();d.showModal?d.showModal():d.setAttribute("open","")}
function hEdUpd(){const f=$("heF").value,x=HED.c;$("heWdW").hidden=!["w1","w2","w4","m1","m3","m6"].includes(f);$("heWdH").textContent=f[0]==="m"?"jeweils am ersten dieses Wochentags im Monat":"";
  $("heDateW").hidden=!(f==="x"||f==="y1");$("heDateL").textContent=f==="y1"?"Datum (z. B. Geburtstag)":"Datum";$("heLeadW").hidden=f!=="y1";
  const rec=hrec(+$("heDur").value,x.unpop,($("heCat").value==="kids"));$("heRec").textContent=rec}
function hEdSave(){const x=HED.c;x.ti=$("heTi").value.trim();if(!x.ti){$("heTi").focus();return}x.cat=$("heCat").value;x.ic=$("heIc").value.trim();x.f=$("heF").value;
  const wb=$("heWd").querySelector('[aria-pressed="true"]');x.wd=wb?+wb.dataset.wd:6;x.date=$("heDate").value||null;x.t=$("heT").value||null;x.lead=+$("heLead").value||0;
  x.dur=+$("heDur").value;x.pts=+$("hePts").value||hrec(x.dur,x.unpop,x.kid);x.kid=x.cat==="kids"?1:0;const wh=$("heWho").querySelector('[aria-pressed="true"]');x.who=wh?wh.dataset.who:hMe();
  x.ck=$("heCk").value.split("\n").map(s=>s.trim()).filter(Boolean).slice(0,20);if(!x.start)x.start=x.f==="y1"?T0:T0;
  if((x.f==="x")&&!x.date){$("heDate").focus();toast("Bitte ein Datum wählen");return}if(x.f==="y1"&&!x.date){$("heDate").focus();toast("Bitte das Datum wählen");return}
  const cid=x.cid||("c"+Date.now().toString(36));delete x.cid;hset("hc:"+cid,x);$("hdlg").close();toast(HED.isNew?"➕ Hinzugefügt – erscheint jetzt in „Jetzt dran“ und in „Unser Plan“":"💾 Gespeichert");HED=null;renderHomeAll()}
/* Tagesansicht in „Unser Plan“ */
window.homeDay=(dt,L)=>{if(!dt)return "";const B=hBlock(),blk=B.days.includes(pdate(dt).getDay());const I=hItems(dt,dt).filter(i=>!hDaily(i.c)||blk);const O=dt===T0?hOverdue():[];
  if(!blk&&!I.length&&!O.length)return "";
  const clash=blk?(L||[]).filter(o=>o.t&&toMin(o.t)<toMin(B.to)&&toMin(o.t)+60>toMin(B.from)):[];
  return `<div class="hpday"><div class="hpdh">🏠 <b>Zuhause</b>${blk?` · ${esc(B.from)}–${esc(B.to)} Uhr reserviert`:""}<button type="button" class="pall" data-m2="zuhause">Alle Aufgaben →</button></div>
    ${clash.length?`<p class="hfwarn">⚠️ ${clash.map(o=>esc(o.ti.replace(/^Ausflug: /,""))+" um "+esc(o.t)).join(", ")} liegt im Zuhause-Block – Aufgaben ggf. auf den Nachmittag schieben.</p>`:""}
    ${O.map(i=>hRow(i,"od")).join("")}${I.map(i=>hRow(i,"today")).join("")}${!I.length&&!O.length?`<p class="pvsub" style="margin:4px 0">Für diesen Block ist noch nichts geplant.</p>`:""}</div>`};
window.homeDots=s=>hItems(s,s).filter(i=>!hDaily(i.c)).length;
window.homeBlockDay=s=>hBlock().days.includes(pdate(s).getDay());
window.homeFairMini=()=>hFairHtml(true);
/* Einstellungen: Personen & Zuhause-Block */
function renderHomeSet(){const el=$("homeSet");if(!el)return;const P=hPeople(),B=hBlock();
  el.innerHTML=`<div class="hppl">${P.map((p,i)=>`<div class="hpr"><select data-hpe="${i}" aria-label="Symbol">${HEMO.concat(HEMO.includes(p.e)?[]:[p.e]).map(e=>`<option${e===p.e?" selected":""}>${e}</option>`).join("")}</select><input type="text" data-hpn="${i}" value="${esc(p.n)}" maxlength="20" aria-label="Name"><label class="hkid"><input type="checkbox" data-hpk="${i}"${p.kid?" checked":""}> Kind</label><button type="button" class="mbx" data-hpx="${i}" aria-label="Entfernen">✕</button></div>`).join("")}</div>
   <button type="button" class="pmini" data-hpadd>➕ Person</button>
   <h4 class="seth2">🏠 Zuhause-Block</h4><p class="famnote">In dieser Zeit stehen Haushalt, Garten & Co. in „Unser Plan“. Ausflüge sind trotzdem möglich – es gibt dann einen Hinweis.</p>
   <div class="dquick freed" id="hbDays">${[1,2,3,4,5,6,0].map(i=>`<button type="button" data-hbd="${i}" aria-pressed="${B.days.includes(i)}">${["So","Mo","Di","Mi","Do","Fr","Sa"][i]}</button>`).join("")}</div>
   <div class="hbt"><label>von <input type="time" id="hbFrom" value="${esc(B.from)}"></label><label>bis <input type="time" id="hbTo" value="${esc(B.to)}"></label></div>`}
function hSavePeople(L){hset("people",{list:L.map(({c,...p})=>p)});renderHomeSet();renderHomeAll()}
document.addEventListener("click",e=>{const t=e.target;
  const pa=t.closest("[data-hpadd]");if(pa){const L=hPeople();L.push({id:"p"+Date.now().toString(36),n:"Neue Person",e:HEMO[L.length%HEMO.length],kid:false});hSavePeople(L);return}
  const px=t.closest("[data-hpx]");if(px){const L=hPeople();L.splice(+px.dataset.hpx,1);hSavePeople(L);return}
  const bd=t.closest("[data-hbd]");if(bd){const B=hBlock(),i=+bd.dataset.hbd;B.days=B.days.includes(i)?B.days.filter(x=>x!==i):B.days.concat(i);hset("homeblock",B);renderHomeSet();renderHomeAll();return}});
document.addEventListener("change",e=>{const t=e.target;
  if(t.dataset.hpn!=null||t.dataset.hpe!=null||t.dataset.hpk!=null){const L=hPeople(),i=+(t.dataset.hpn??t.dataset.hpe??t.dataset.hpk);if(!L[i])return;if(t.dataset.hpn!=null)L[i].n=t.value.trim()||L[i].n;if(t.dataset.hpe!=null)L[i].e=t.value;if(t.dataset.hpk!=null)L[i].kid=t.checked;hSavePeople(L);return}
  if(t.id==="hbFrom"||t.id==="hbTo"){const B=hBlock();B.from=$("hbFrom").value||"09:00";B.to=$("hbTo").value||"12:00";hset("homeblock",B);renderHomeAll();return}
  if(t.dataset.hcl!=null){const c=SETS["hc:"+t.dataset.hcl];if(!c)return;const d=t.dataset.d,j=+t.dataset.j;const x=Object.assign({},c);let dd=x.ckd===d?(x.ckx||[]).slice():[];dd=t.checked?dd.concat(j):dd.filter(k=>k!==j);x.ckd=d;x.ckx=[...new Set(dd)];hset("hc:"+t.dataset.hcl,x);
    if(x.ckx.length===x.ck.length&&!hDone(t.dataset.hcl,d)){hCheck(t.dataset.hcl,d)}else renderHomeAll();return}
  if(HED&&["heF","heDur","heCat"].includes(t.id))hEdUpd()});
/* Klicks im Zuhause-Bereich und in „Unser Plan“ */
document.addEventListener("click",e=>{const t=e.target;
  const ck=t.closest("[data-hck]");if(ck){e.preventDefault();hCheck(ck.dataset.hck,ck.dataset.d);return}
  const c2=t.closest("[data-hck2]");if(c2){const k=c2.dataset.hck2+c2.dataset.d;HOPEN.has(k)?HOPEN.delete(k):HOPEN.add(k);renderHomeAll();return}
  const nv=t.closest(".hfmini[data-m2],.hpday [data-m2]");if(nv){setM2("zuhause");return}
  if(!t.closest("#homeView")&&!t.closest("#hdlg"))return;
  const fw=t.closest("[data-hfw]");if(fw){HFW=fw.dataset.hfw;renderHome();return}
  const hm=t.closest("[data-hme]");if(hm){LS.set("hwk-hme",hm.dataset.hme);renderHome();return}
  const ad=t.closest("[data-hadd]");if(ad){const id=ad.dataset.hadd;const me=hMe();
    if(id==="_own"){hEdit({ti:"",cat:"haushalt",f:"w1",wd:hBlock().days[0]??6,dur:30,who:me},true);return}
    if(id==="_apt"){hEdit({ti:"",cat:"gesund",ic:"📅",f:"x",date:plus(7),t:"10:00",dur:60,who:me},true);return}
    const T=HT.find(x=>x[0]===id);if(!T)return;const kid=!!T[7];const P=hPeople();const who=kid?((P.find(p=>p.kid)||{}).id||me):me;
    hEdit({tpl:T[0],cat:T[1],ic:T[2],ti:T[3],f:T[4],wd:hBlock().days[0]??6,dur:T[5],unpop:T[6],kid:T[7],pts:hrec(T[5],T[6],T[7]),who,ck:T[8]||[],date:T[4]==="x"?plus(7):T[4]==="y1"?null:null,lead:T[0]==="f_geburtstag"?21:T[0]==="f_weihn"?30:0},true);return}
  const ed=t.closest("[data-hedit]");if(ed){const c=SETS["hc:"+ed.dataset.hedit];if(c)hEdit(Object.assign({cid:ed.dataset.hedit},c),false);return}
  if(t.closest("[data-hclose]")){$("hdlg").close();HED=null;return}
  if(t.closest("[data-hsave]")){hEdSave();return}
  if(t.closest("[data-hdel]")&&HED&&HED.c.cid){const cid=HED.c.cid,old=SETS["hc:"+cid];hset("hc:"+cid,null);$("hdlg").close();HED=null;renderHomeAll();undoToast(`„${old.ti}“ gelöscht`,()=>{hset("hc:"+cid,old);renderHomeAll()});return}
  const wd=t.closest("#heWd [data-wd]");if(wd){$("heWd").querySelectorAll("[data-wd]").forEach(b=>b.setAttribute("aria-pressed",String(b===wd)));return}
  const wh=t.closest("#heWho [data-who]");if(wh){$("heWho").querySelectorAll("[data-who]").forEach(b=>b.setAttribute("aria-pressed",String(b===wh)));return}
  const rd=t.closest("[data-hred]");if(rd&&!rd.disabled){const me=hMe(),cost=+rd.dataset.cost;if(hBal(me)<cost)return;const rid="r"+Date.now().toString(36);hset("hr:"+rid,{by:me,rw:rd.dataset.hred,ti:rd.dataset.ti,ic:rd.dataset.ic,cost,at:Date.now()});hBurst(cost,true);renderHome();
    undoToast(`🎁 ${rd.dataset.ti} eingelöst (−${cost} Punkte)`,()=>{hset("hr:"+rid,null);renderHome()});return}
  const rdd=t.closest("[data-hreddone]");if(rdd){const k="hr:"+rdd.dataset.hreddone,r=SETS[k];if(r){hset(k,Object.assign({},r,{done:Date.now()}));toast("✓ Schön genossen!");renderHome()}return}
  if(t.id==="hrwAdd"){const ti=$("hrwT").value.trim(),cost=Math.max(5,+$("hrwC").value||60);if(!ti){$("hrwT").focus();return}const L=((SETS.hrw||{}).list||[]).concat({id:"u"+Date.now().toString(36),ti,cost,ic:"🎁"});hset("hrw",{list:L});renderHome();return}
  const rr=t.closest("[data-hrwrm]");if(rr){const L=((SETS.hrw||{}).list||[]).filter(r=>r.id!==rr.dataset.hrwrm);hset("hrw",{list:L});renderHome();return}});
document.addEventListener("toggle",e=>{const d=e.target;if(!d.closest||!d.closest("#homeView"))return;if(d.dataset&&d.dataset.hsec){HSEC[d.dataset.hsec]=d.open;LS.set("hwk-hsec",HSEC)}if(d.dataset&&d.dataset.hcat&&d.open)HCATOPEN=d.dataset.hcat},true);
window.renderHomeNow=renderHome;window.renderHomeSetNow=renderHomeSet;
renderHomeSet();if(M2==="zuhause")renderHome();if(M2==="plan"&&typeof renderPlan==="function")renderPlan();
window.__home={SETS,hBal:id=>hBal(id),hMe:()=>hMe()};
