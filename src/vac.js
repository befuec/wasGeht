/* =====================================================================
   Urlaubsmodus: Reisen mit Titel, Ziel, Zeitraum und eigener Ziele-Liste
   (z. B. aus einer Google-Maps-Liste). Während des Urlaubs:
   - andere Farben + Kopfzeile mit Reisetitel
   - Heute/Entdecken zeigen nur die Urlaubsziele
   - Zuhause-Aufgaben pausieren (werden nicht überfällig), Kinder- und
     Urlaubsaufgaben (Kategorie „Urlaub“) bleiben
   Gespeichert verschlüsselt wie alles andere unter "hurl:<id>".
   ===================================================================== */
const VCAT={strand:["🏖️","Strand & Baden"],natur:["🌿","Natur & Wandern"],sehens:["🏰","Sehenswürdigkeit"],museum:["🏛️","Museum & Kultur"],essen:["🍽️","Essen & Trinken"],aktiv:["🎢","Aktiv & Spaß"],kinder:["🛝","Spielplatz & Kinder"],einkauf:["🛍️","Einkaufen & Märkte"],sonst:["📍","Sonstiges"]};
const HTV=[
 ["v01","urlaub","🧴","Sonnencreme für alle","d",5,0,0],
 ["v02","urlaub","🎒","Strand- bzw. Tagestasche packen","d",10,0,0,["Handtücher","Wasser","Snacks","Sonnenhüte","Badesachen"]],
 ["v03","urlaub","🗺️","Ausflug für morgen planen","d",15,0,0],
 ["v04","urlaub","🍳","Frühstück machen","d",20,0,0],
 ["v05","urlaub","🛒","Einkaufen (Frühstück, Snacks)","d",30,0,0],
 ["v06","urlaub","🧽","Unterkunft kurz aufräumen","d",15,1,0],
 ["v07","urlaub","🧺","Wäsche waschen & aufhängen","w1",30,1,0],
 ["v08","urlaub","📸","Fotos des Tages sichern","d",5,0,0],
 ["v09","urlaub","✉️","Postkarten schreiben","x",30,0,0],
 ["v10","urlaub","💶","Urlaubskasse abrechnen","x",20,0,0],
 ["v11","urlaub","🧳","Koffer für die Rückreise packen","x",60,1,0,["Kleidung","Ladekabel","Ausweise & Tickets","Medikamente","Spielzeug"]],
 ["v12","urlaub","🔑","Unterkunft übergeben (Müll, Kühlschrank, Schlüssel)","x",45,1,0],
 ["v13","urlaub","⛽","Mietwagen tanken & zurückgeben","x",30,0,0],
 ["v14","urlaub","🐚","Muscheln & Steine sammeln","d",15,0,1],
 ["v15","urlaub","📓","Urlaubstagebuch malen","d",10,0,1],
 ["v16","urlaub","🧢","Mütze & Sonnencreme selbst holen","d",5,0,1]
];
const vTrips=()=>Object.keys(SETS).filter(k=>k.startsWith("hurl:")).map(k=>Object.assign({id:k.slice(5)},SETS[k])).filter(t=>t&&t.ti&&t.from&&t.to).sort((a,b)=>a.from.localeCompare(b.from));
const vTripAt=d=>vTrips().find(t=>d>=t.from&&d<=t.to)||null;
const vPrevId=()=>LS.get("hwk-vacprev",null);
function vActive(){const pv=vPrevId();if(pv){const t=vTrips().find(x=>x.id===pv);if(t)return t}return vTripAt(T0)}
window.vacActive=vActive;
/* Für Aufgaben zählt nur der echte Urlaubszeitraum – der Planungsmodus ändert an den Aufgaben nichts */
function vTripForTasks(d){return vTripAt(d)}
const vPlanning=t=>!!t&&!vTripAt(T0)&&vPrevId()===t.id;
const vUntil=t=>Math.round((pdate(t.from)-pdate(T0))/864e5);
function vKidRel(c){if(c.kid||c.cat==="kids"||c.cat==="kinder")return true;const p=hPer(c.who);return !!(p&&p.kid)}
/* wird von hItems je Termin gefragt */
/* Planungsmodus (nur Anzeige, nicht für Erinnerungen): wie im Urlaub nur Urlaubs- und Kinderaufgaben */
let VREAL=false;
function vPlanNow(){if(VREAL)return false;const pv=vPrevId();return !!pv&&!vTripAt(T0)&&vTrips().some(x=>x.id===pv)}
function vTaskOk(c,d){if(vPlanNow())return c.cat==="urlaub"||vKidRel(c);const tr=vTripForTasks(d);if(c.cat==="urlaub")return !!tr||c.f==="x";if(!tr)return true;return vKidRel(c)}
const vSave=t=>{const o=Object.assign({},t);delete o.id;hset("hurl:"+t.id,o)};
const vBase=t=>t.acc&&t.acc.lat!=null?t.acc:t.dest&&t.dest.lat!=null?t.dest:null;
function vKm(t,p){const b=vBase(t);if(!b||p.lat==null)return null;const R=6371,r=x=>x*Math.PI/180,dl=r(p.lat-b.lat),dn=r(p.lng-b.lng),a=Math.sin(dl/2)**2+Math.cos(r(b.lat))*Math.cos(r(p.lat))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(a))}
const vCar=km=>Math.max(3,Math.round(km*1.3/(km<10?30:km<40?50:70)*60));
const vDays=t=>{const L=[];for(let d=t.from;d<=t.to;d=addD(d,1))L.push(d);return L};
const vDayNo=t=>{const D=vDays(t),i=D.indexOf(T0);return i<0?null:[i+1,D.length]};

/* ---------- Kategorie raten (Name + OpenStreetMap-Typ) ---------- */
function vGuess(n,osm){const s=(n+" "+(osm||"")).toLowerCase();
  const R=[["strand",/strand|beach|playa|platja|cala|bucht|badestelle|lido|spiaggia|plage|natural\/beach|leisure\/beach/],["kinder",/spielplatz|playground|parque infantil|kinder|zoo|aquarium|aqualand|wasserpark|water[ _]?park|hidropark|aquapark|leisure\/playground|tourism\/zoo|tourism\/theme_park|freizeitpark/],
   ["museum",/museum|museu|galerie|gallery|ausstellung|tourism\/museum|tourism\/gallery|theater|teatro/],["essen",/restaurant|café|cafe|\bbar\b|bistro|pizzeria|tapas|\beis\b|eiscaf|eisdiele|gelat|helad|bäckerei|panader|amenity\/(restaurant|cafe|bar|fast_food|ice_cream|pub)/],
   ["einkauf",/markt|market|mercado|mercat|shop|laden|outlet|supermarkt|shop\//],["natur",/park|wander|trail|berg|mont|monte|puig|serra|wasserfall|cascada|see\b|lake|höhle|cueva|cova|aussicht|mirador|leuchtturm|faro|natural\/|leisure\/park|leisure\/nature_reserve/],
   ["aktiv",/kletter|surf|kajak|kayak|boot|boat|tauch|diving|golf|minigolf|reiten|bike|rad|segway|schnorchel|leisure\/(sports_centre|water_park|golf_course|miniature_golf)/],
   ["sehens",/kathedrale|cathedral|catedral|kirche|church|iglesia|església|burg|castle|castell|castillo|schloss|palast|palau|palacio|altstadt|old town|kloster|monaster|tower|torre|historic\/|tourism\/(attraction|viewpoint)/]];
  for(const [k,re] of R)if(re.test(s))return k;return "sonst"}

/* ---------- Import: Takeout-CSV, GeoJSON, HTML-Export, Text, Links ---------- */
function vCsv(text){const rows=[];let row=[],f="",q=false;for(let i=0;i<text.length;i++){const ch=text[i];if(q){if(ch==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}else if(ch==='"')q=true;else if(ch===","){row.push(f);f=""}else if(ch==="\n"||ch==="\r"){if(ch==="\r"&&text[i+1]==="\n")i++;row.push(f);rows.push(row);row=[];f=""}else f+=ch}if(f||row.length){row.push(f);rows.push(row)}return rows}
function vFromUrl(u){const o={};let m=u.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)||u.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)||u.match(/[?&](?:q|query|ll)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/);if(m){o.lat=+m[1];o.lng=+m[2]}
  m=u.match(/\/maps\/place\/([^/@?]+)/);if(m){try{o.n=decodeURIComponent(m[1].replace(/\+/g," "))}catch(_){o.n=m[1].replace(/\+/g," ")}}return o}
function vParse(text){text=String(text||"").replace(/^﻿/,"");const out=[];const add=o=>{if(o&&o.n&&o.n.trim()&&!/^(title|titel|name)$/i.test(o.n.trim()))out.push({n:o.n.trim().slice(0,90),note:(o.note||"").trim().slice(0,200),lat:o.lat!=null&&isFinite(o.lat)?+o.lat:null,lng:o.lng!=null&&isFinite(o.lng)?+o.lng:null,url:o.url||""})};
  if(/^\s*[\[{]/.test(text)){try{const j=JSON.parse(text),F=Array.isArray(j)?j:(j.features||[]);F.forEach(f=>{const pr=f.properties||f,loc=pr.location||{},co=(f.geometry||{}).coordinates||[];add({n:loc.name||pr.Title||pr.title||pr.name,note:pr.Comment||pr.note||loc.address||"",lat:co[1]??loc.lat,lng:co[0]??loc.lng,url:pr.google_maps_url||pr.url||""})});if(out.length)return out}catch(_){}}
  if(/<(html|div|body)/i.test(text)){const doc=new DOMParser().parseFromString(text,"text/html");let N=[...doc.querySelectorAll(".fontHeadlineSmall,.fontTitleSmall,[role='heading']")].map(e=>e.textContent.trim());
    if(!N.length)N=[...doc.querySelectorAll("a[href*='/maps/place/']")].map(a=>vFromUrl(a.getAttribute("href")).n||a.textContent.trim());
    const seen=new Set();N.filter(n=>n&&n.length<90&&!seen.has(n)&&seen.add(n)).forEach(n=>add({n}));
    doc.querySelectorAll("a[href*='/maps/place/']").forEach(a=>{const u=vFromUrl(a.getAttribute("href"));const x=out.find(o=>o.n===u.n);if(x&&u.lat!=null){x.lat=u.lat;x.lng=u.lng}});return out}
  const lines=text.split(/\r?\n/);
  if(/(^|,)\s*"?(title|titel|name)"?\s*(,|$)/i.test(lines[0]||"")){const R=vCsv(text),H=R[0].map(h=>h.trim().toLowerCase()),it=H.findIndex(h=>/^(title|titel|name)$/.test(h)),io=H.findIndex(h=>/^(note|notiz|comment|kommentar)$/.test(h)),iu=H.findIndex(h=>/^url$/.test(h));
    R.slice(1).forEach(r=>{if(!r||!r[it])return;const u=iu>=0?vFromUrl(r[iu]||""):{};add({n:r[it],note:io>=0?r[io]:"",lat:u.lat,lng:u.lng,url:iu>=0?r[iu]:""})});return out}
  lines.forEach(l=>{l=l.trim().replace(/^[-•*\d.)\s]+/,"");if(!l)return;const um=l.match(/https?:\/\/\S+/);if(um){const u=vFromUrl(um[0]),rest=l.replace(um[0],"").replace(/[–—-]\s*$/,"").trim();add({n:rest||u.n||"",lat:u.lat,lng:u.lng,url:um[0]});return}add({n:l})});return out}

/* ---------- Geocoding über OpenStreetMap (max. 1 Anfrage/Sekunde) ---------- */
let VGEO_T=0;
async function vGeo(q,near){const w=Math.max(0,VGEO_T+1100-Date.now());if(w)await new Promise(r=>setTimeout(r,w));VGEO_T=Date.now();
  const base="https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=de&q="+encodeURIComponent(q);
  const vb=near&&near.lat!=null?`&viewbox=${near.lng-0.7},${near.lat+0.5},${near.lng+0.7},${near.lat-0.5}&bounded=1`:"";
  try{const r=await fetch(base+vb);const j=await r.json();if(j&&j[0])return {lat:+j[0].lat,lng:+j[0].lon,osm:(j[0].category||"")+"/"+(j[0].type||""),label:j[0].display_name||""}}catch(_){}
  return null}

/* ---------- Kopfzeile, Farben, Ansicht ---------- */
let VSIG="";
function vSync(){const t=vActive(),on=!!t;document.body.classList.toggle("vac",on);const bar=$("vacBar");
  if(bar){if(!on){bar.hidden=true;bar.innerHTML=""}else{const dn=vDayNo(t),pv=vPlanning(t),u=vUntil(t);
    bar.innerHTML=`<span class="vbt">🏝️ <b>${esc(t.ti)}</b></span><span class="vbs">${pv?(u>0?`Planung · noch ${u} ${u===1?"Tag":"Tage"}`:"Rückblick"):dn?`Tag ${dn[0]} von ${dn[1]}`:""}${t.dest&&t.dest.n?" · "+esc(t.dest.n):""}</span><span class="vbb"><button type="button" class="pmini" data-vedit="${esc(t.id)}">Bearbeiten</button>${pv?`<button type="button" class="pmini vhome" data-vprevoff>🏠 Zurück nach Hause</button>`:""}</span>`;bar.hidden=false}}
  const nx=$("vacNext");if(nx){const U=on?null:vTrips().find(x=>x.from>T0)||null;if(!U){nx.hidden=true;nx.innerHTML=""}else{const u=vUntil(U),more=vTrips().filter(x=>x.from>T0).length-1;
    nx.innerHTML=`<button type="button" class="vnext" data-vprev="${esc(U.id)}"><span>🏝️ <b>${esc(U.ti)}</b><small>in ${u} ${u===1?"Tag":"Tagen"}${more>0?` · +${more} weitere unter ⚙️`:""}</small></span><span class="vgo">Urlaub planen ›</span></button>`;nx.hidden=false}}
  const v=$("vacView");if(v){const show=on&&!document.body.classList.contains("kidsmode")&&(M2==="heute"||M2==="entdecken");v.hidden=!show;if(show){const sig=JSON.stringify([M2,t,VF,LS.get("hwk-vacprev",null)]);if(sig!==VSIG||!v.innerHTML){VSIG=sig;vRender(t)}}}
  renderVacSet()}
window.vSync=vSync;

/* ---------- Heute + Entdecken im Urlaub ---------- */
let VF={cat:"",q:"",only:""};const VWX={};
async function vWx(t){const b=vBase(t);if(!b)return null;const k=t.id+T0;if(VWX[k])return VWX[k];
  try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${b.lat.toFixed(2)}&longitude=${b.lng.toFixed(2)}&daily=weathercode,temperature_2m_max,precipitation_probability_max&timezone=auto&forecast_days=3`);const j=await r.json();VWX[k]=j.daily||null}catch(_){VWX[k]=null}return VWX[k]}
const vWxI=c=>c==null?"":c===0?"☀️":c<=2?"🌤️":c===3?"☁️":c<=48?"🌫️":c<=67?"🌧️":c<=77?"❄️":c<=82?"🌦️":"⛈️";
function vCard(t,p){const km=vKm(t,p),cc=VCAT[p.cat]||VCAT.sonst,dest=t.dest&&t.dest.n?t.dest.n:"";
  const maps="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(p.lat!=null?`${p.lat},${p.lng}`:p.n+(dest?", "+dest:""))+(p.lat!=null?"":"");
  const named="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(p.n+(dest?", "+dest:""));
  const route=p.lat!=null?`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`:named;
  return `<article class="vcard${p.vis?" vis":""}" data-vp="${esc(p.id)}"><div class="vch"><span class="vci" aria-hidden="true">${cc[0]}</span><div class="vcn"><b>${esc(p.n)}</b><small>${esc(cc[1])}${km!=null?` · ${km<10?km.toFixed(1).replace(".",","):Math.round(km)} km · 🚗 ${vCar(km)}′`:p.lat==null?" · Ort nicht gefunden":""}${p.pl?` · 📅 ${esc(fmtDate(p.pl))}`:""}</small></div>
    <button type="button" class="vfav" data-vfav="${esc(p.id)}" aria-pressed="${!!p.fav}" aria-label="Favorit">${p.fav?"⭐":"☆"}</button></div>
    ${p.note?`<p class="vnote">${esc(p.note)}</p>`:""}
    <div class="vact"><button type="button" class="pmini" data-vvis="${esc(p.id)}" aria-pressed="${!!p.vis}">${p.vis?"✓ Besucht":"Besucht?"}</button>
      <label class="vpl"><span class="sr">Einplanen</span><select data-vpl="${esc(p.id)}"><option value="">📅 Einplanen …</option>${vDays(t).map(d=>`<option value="${d}"${p.pl===d?" selected":""}>${esc(fmtDate(d))}${d===T0?" (heute)":""}</option>`).join("")}</select></label>
      <a href="${named}" target="_blank" rel="noopener">Google Maps</a><a href="${route}" target="_blank" rel="noopener">Route</a></div></article>`}
function vRender(t){const v=$("vacView");if(!v)return;const P=(t.places||[]).slice();
  const plan=vPlanning(t);
  const head=`<div class="vhead"><h2>${M2==="heute"?(plan?"Urlaub planen":"Heute im Urlaub"):"Urlaubsziele"}</h2><button type="button" class="pmini" data-vedit="${esc(t.id)}">${P.length?"Ziele bearbeiten":"Ziele hinzufügen"}</button></div>`;
  if(!P.length){v.innerHTML=head+`<div class="vempty"><p>Für <b>${esc(t.ti)}</b> sind noch keine Ziele eingetragen.</p><p>Füge deine Google-Maps-Liste ein (Export aus Google Takeout, gespeicherte Seite oder einfach die Namen, einer pro Zeile) – die App sucht die Orte selbst.</p><button type="button" class="pbtn" data-vedit="${esc(t.id)}">🗺️ Ziele-Liste einfügen</button></div>`;return}
  const withKm=P.map(p=>Object.assign({},p,{km:vKm(t,p)}));
  if(M2==="heute"&&plan){const u=vUntil(t),fav=withKm.filter(p=>p.fav),D=vDays(t),nPl=withKm.filter(p=>p.pl).length;
    v.innerHTML=head+`<div class="vcount"><b>${u>0?`Noch ${u} ${u===1?"Tag":"Tage"}`:"Urlaub ist vorbei"}</b><span>${esc(fmtDate(t.from))} – ${esc(fmtDate(t.to))} · ${D.length} Tage · ${P.length} Ziele · ${nPl} eingeplant</span></div>
      <div class="vwx" id="vWx">Wetter in ${esc((t.dest&&t.dest.n)||"")} wird geladen …</div>
      <h3 class="vh3">Reiseplan</h3><div class="vdays">${D.map(d=>{const L=withKm.filter(p=>p.pl===d);return `<div class="vday"><b>${esc(fmtDate(d))}</b><span>${L.length?L.map(p=>`<span class="vdc">${(VCAT[p.cat]||VCAT.sonst)[0]} ${esc(p.n)}</span>`).join(""):`<i>noch frei</i>`}</span></div>`}).join("")}</div>
      <h3 class="vh3">⭐ Favoriten ${fav.length?`(${fav.length})`:""}</h3>${fav.length?`<div class="vlist">${fav.map(p=>vCard(t,p)).join("")}</div>`:`<p class="pvsub">Noch keine Favoriten – unter „Alle Ziele“ mit ☆ markieren.</p>`}
      <button type="button" class="pbtn vall" data-m2="entdecken">Alle ${P.length} Ziele ansehen & einplanen</button>`;
    vWx(t).then(Dw=>{const e=$("vWx");if(!e)return;if(!Dw){e.textContent="Wetter gerade nicht verfügbar.";return}
      e.innerHTML=`<small class="vwxh">${u>0&&u<=14?"Vorhersage":"Aktuelles Wetter"} in ${esc((t.dest&&t.dest.n)||"")}</small>`+Dw.time.map((d,i)=>`<span><b>${i===0?"Heute":i===1?"Morgen":esc(fmtDate(d).split(" ")[0])}</b> ${vWxI(Dw.weathercode[i])} ${Math.round(Dw.temperature_2m_max[i])}° · 💧${Dw.precipitation_probability_max[i]??"–"} %</span>`).join("")});return}
  if(M2==="heute"){const today=withKm.filter(p=>p.pl===T0),pool=withKm.filter(p=>!p.vis&&p.pl!==T0);
    let seed=+T0.replace(/-/g,"");const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
    const pick=pool.slice().sort((a,b)=>((b.fav?2:0)-(a.fav?2:0))||((a.km??99)-(b.km??99))*0.02+(rnd()-0.5)).slice(0,3);
    v.innerHTML=head+`<div class="vwx" id="vWx">Wetter in ${esc((t.dest&&t.dest.n)||"")} wird geladen …</div>
      ${today.length?`<h3 class="vh3">Heute geplant</h3><div class="vlist">${today.map(p=>vCard(t,p)).join("")}</div>`:""}
      <h3 class="vh3">Ideen für heute</h3>${pick.length?`<div class="vlist">${pick.map(p=>vCard(t,p)).join("")}</div>`:`<p class="pvsub">Alles besucht – wie wär's mit einem Lieblingsort ein zweites Mal? 😊</p>`}
      <button type="button" class="pbtn vall" data-m2="entdecken">Alle ${P.length} Ziele ansehen</button>`;
    vWx(t).then(D=>{const e=$("vWx");if(!e)return;if(!D){e.textContent="Wetter gerade nicht verfügbar.";return}
      e.innerHTML=D.time.map((d,i)=>`<span><b>${i===0?"Heute":i===1?"Morgen":esc(fmtDate(d).split(" ")[0])}</b> ${vWxI(D.weathercode[i])} ${Math.round(D.temperature_2m_max[i])}° · 💧${D.precipitation_probability_max[i]??"–"} %</span>`).join("")});return}
  const cats=[...new Set(withKm.map(p=>p.cat||"sonst"))].sort((a,b)=>Object.keys(VCAT).indexOf(a)-Object.keys(VCAT).indexOf(b));
  const q=hNorm(VF.q.trim());let L=withKm.filter(p=>(!VF.cat||p.cat===VF.cat)&&(!q||hNorm(p.n+" "+(p.note||"")).includes(q))&&(VF.only!=="fav"||p.fav)&&(VF.only!=="open"||!p.vis));
  L.sort((a,b)=>(a.km??1e9)-(b.km??1e9));
  v.innerHTML=head+`<div class="vtools"><input type="search" id="vQ" value="${esc(VF.q)}" placeholder="🔍 Ziel suchen" autocomplete="off" aria-label="Urlaubsziele durchsuchen">
    <div class="vchips" role="group" aria-label="Kategorie"><button type="button" data-vcat="" aria-pressed="${!VF.cat}">Alle ${P.length}</button>${cats.map(k=>`<button type="button" data-vcat="${k}" aria-pressed="${VF.cat===k}">${VCAT[k][0]} ${esc(VCAT[k][1])} ${withKm.filter(p=>p.cat===k).length}</button>`).join("")}</div>
    <div class="vchips" role="group" aria-label="Auswahl"><button type="button" data-vonly="" aria-pressed="${!VF.only}">Alle</button><button type="button" data-vonly="fav" aria-pressed="${VF.only==="fav"}">⭐ Favoriten</button><button type="button" data-vonly="open" aria-pressed="${VF.only==="open"}">Noch nicht besucht</button></div></div>
    <p class="pvsub">${L.length} ${L.length===1?"Ziel":"Ziele"} · sortiert nach Entfernung ${t.acc&&t.acc.lat!=null?"von der Unterkunft":"vom Urlaubsort"}</p>
    <div class="vlist">${L.map(p=>vCard(t,p)).join("")||`<p class="pvsub">Nichts gefunden.</p>`}</div>`}
function vUpd(id,ch){const t=vActive();if(!t)return;const P=(t.places||[]).map(p=>p.id===id?Object.assign({},p,ch(p)):p);vSave(Object.assign({},t,{places:P}));VSIG="";vSync()}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;
  if(t.closest("[data-vprevoff]")){LS.set("hwk-vacprev",null);VSIG="";renderHomeAll();vSync();toast("🏠 Zurück im Alltag");scrollTo(0,0);return}
  const ve=t.closest("[data-vedit]");if(ve){vDlg(ve.dataset.vedit);return}
  if(t.closest("[data-vnew]")){vDlg(null);return}
  const vp=t.closest("[data-vprev]");if(vp){const id=vp.dataset.vprev,on=vPrevId()===id;LS.set("hwk-vacprev",on?null:id);VSIG="";renderHomeAll();vSync();toast(on?"🏠 Zurück im Alltag":"🏝️ Planungsmodus – Zuhause-Aufgaben laufen normal weiter");if(!on){scrollTo(0,0);if(typeof setM2==="function"&&M2!=="heute"&&M2!=="entdecken")setM2("heute")}return}
  const vc=t.closest("[data-vcat]");if(vc){VF.cat=vc.dataset.vcat;VSIG="";vSync();return}
  const vo=t.closest("[data-vonly]");if(vo){VF.only=vo.dataset.vonly;VSIG="";vSync();return}
  const vf=t.closest("[data-vfav]");if(vf){vUpd(vf.dataset.vfav,p=>({fav:!p.fav}));return}
  const vv=t.closest("[data-vvis]");if(vv){vUpd(vv.dataset.vvis,p=>({vis:!p.vis}));return}
  if(t.closest(".vall[data-m2]")&&typeof setM2==="function"){setM2("entdecken");scrollTo(0,0)}});
document.addEventListener("change",e=>{const s=e.target;if(s.dataset&&s.dataset.vpl!=null){vUpd(s.dataset.vpl,()=>({pl:s.value||null}));if(s.value)toast("📅 Eingeplant für "+fmtDate(s.value))}});
document.addEventListener("input",e=>{if(e.target.id==="vQ"){VF.q=e.target.value;const pos=e.target.selectionStart;VSIG="";vSync();const n=$("vQ");if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(_){}}}});
new MutationObserver(()=>vSync()).observe(document.body,{attributes:true,attributeFilter:["data-m2","class"]});
setInterval(()=>{if(!document.hidden)vSync()},60000);

/* ---------- Einstellungen: Liste der Reisen ---------- */
function renderVacSet(){const el=$("vacSet");if(!el)return;const L=vTrips(),pv=vPrevId(),sig=JSON.stringify([L.map(t=>[t.id,t.ti,t.from,t.to,(t.places||[]).length]),pv,T0]);if(el.dataset.sig===sig)return;el.dataset.sig=sig;
  el.innerHTML=`<p class="famnote">Im Urlaub wechselt die App ihre Farben, zeigt nur die Ziele aus eurer Urlaubsliste und pausiert die Zuhause-Aufgaben. Kinder- und Urlaubsaufgaben bleiben.</p>
   ${L.length?`<div class="vtrips">${L.map(t=>{const st=T0<t.from?"geplant":T0>t.to?"vorbei":"läuft";return `<div class="vtrip"><div><b>🏝️ ${esc(t.ti)}</b><small>${esc(fmtDate(t.from))} – ${esc(fmtDate(t.to))} · ${(t.places||[]).length} Ziele · ${st}</small></div><div class="vtb"><button type="button" class="pmini" data-vedit="${esc(t.id)}">Bearbeiten</button>${st!=="läuft"?`<button type="button" class="pmini" data-vprev="${esc(t.id)}" aria-pressed="${pv===t.id}">${pv===t.id?"Planung beenden":"🏝️ Planen"}</button>`:""}</div></div>`}).join("")}</div>`:""}
   <button type="button" class="pkok" data-vnew>➕ Urlaub anlegen</button>`}

/* ---------- Dialog: Urlaub anlegen / bearbeiten, Ziele importieren ---------- */
let VED=null;
function vDlg(id){let d=$("vacdlg");if(!d){d=document.createElement("dialog");d.id="vacdlg";d.className="evdlg hdlg";d.setAttribute("aria-labelledby","vdH");document.body.appendChild(d)}
  const t0=id?vTrips().find(x=>x.id===id):null;VED=t0?JSON.parse(JSON.stringify(t0)):{id:"t"+Date.now().toString(36),ti:"",dest:null,acc:null,from:addD(T0,14),to:addD(T0,21),places:[]};vDraw();d.showModal?d.showModal():d.setAttribute("open","")}
function vDraw(){const d=$("vacdlg"),x=VED;if(!d||!x)return;const P=x.places||[];
  d.innerHTML=`<form class="hform" method="dialog" onsubmit="return false"><div class="dlghead"><h3 id="vdH">🏝️ ${vTrips().some(t=>t.id===x.id)?"Urlaub bearbeiten":"Urlaub anlegen"}</h3><button type="button" class="mbx" data-vclose aria-label="Schließen">✕</button></div>
   <label>Titel<input type="text" id="vTi" maxlength="60" value="${esc(x.ti)}" placeholder="z. B. Osterurlaub Mallorca 2028"></label>
   <div class="vgrow"><label>Urlaubsort<input type="text" id="vDest" value="${esc((x.dest&&x.dest.n)||"")}" placeholder="z. B. Alcúdia, Mallorca"></label><button type="button" class="pmini" data-vgeo="dest">Ort suchen</button></div>
   <small class="hhint" id="vDestH">${x.dest&&x.dest.lat!=null?`📍 gefunden: ${esc(x.dest.label||x.dest.n)}`:"Wird für Wetter und Entfernungen gebraucht."}</small>
   <div class="hf2"><label>Von<input type="date" id="vFrom" value="${esc(x.from)}"></label><label>Bis<input type="date" id="vTo" value="${esc(x.to)}"></label></div>
   <div class="vgrow"><label>Unterkunft <small>(optional, für Entfernungen)</small><input type="text" id="vAcc" value="${esc((x.acc&&x.acc.n)||"")}" placeholder="Adresse oder Name der Unterkunft"></label><button type="button" class="pmini" data-vgeo="acc">Suchen</button></div>
   <small class="hhint" id="vAccH">${x.acc&&x.acc.lat!=null?`📍 gefunden: ${esc(x.acc.label||x.acc.n)}`:""}</small>
   <h4 class="hday">🗺️ Ziele & Aktivitäten (${P.length})</h4>
   <details class="vimp"${P.length?"":" open"}><summary>Google-Maps-Liste einfügen</summary>
     <ol class="vhow"><li><b>Am einfachsten:</b> Namen einfügen, einer pro Zeile (auch Google-Maps-Links gehen).</li><li><b>Ganze Liste:</b> takeout.google.com → nur „Gespeichert“ auswählen → ZIP laden → CSV-Datei der Liste hier wählen.</li><li><b>Oder:</b> Liste im Browser öffnen, ganz nach unten scrollen, „Seite speichern“ und die HTML-Datei hier wählen.</li></ol>
     <textarea id="vImpT" rows="5" placeholder="Playa de Muro&#10;Cuevas del Drach&#10;Hidropark Alcúdia"></textarea>
     <div class="vgrow"><input type="file" id="vImpF" accept=".csv,.txt,.json,.geojson,.html,.htm,text/*"><button type="button" class="pbtn" data-vimp>Übernehmen & Orte suchen</button></div>
     <p class="hhint" id="vImpS"></p></details>
   <div class="vgrow"><input type="text" id="vAdd" placeholder="Einzelnes Ziel hinzufügen" maxlength="90"><button type="button" class="pmini" data-vadd>➕</button></div>
   <div class="vplist">${P.map(p=>`<div class="vpr"><span>${(VCAT[p.cat]||VCAT.sonst)[0]}</span><div><b>${esc(p.n)}</b><small>${p.lat!=null?"📍 gefunden":"⚠️ Ort nicht gefunden – erscheint ohne Entfernung"}</small></div><select data-vpcat="${esc(p.id)}" aria-label="Kategorie">${Object.entries(VCAT).map(([k,v])=>`<option value="${k}"${p.cat===k?" selected":""}>${v[0]} ${v[1]}</option>`).join("")}</select><button type="button" class="hx" data-vpdel="${esc(p.id)}" aria-label="${esc(p.n)} entfernen">✕</button></div>`).join("")}</div>
   <div class="hfbtn">${vTrips().some(t=>t.id===x.id)?`<button type="button" class="pmini hdel vdel" data-vdel>Urlaub löschen</button>`:""}<button type="button" class="pbtn" data-vclose>Abbrechen</button><button type="button" class="pbtn hsave" data-vsave>💾 Speichern</button></div></form>`}
function vRead(){const x=VED;x.ti=$("vTi").value.trim().slice(0,60);x.from=$("vFrom").value;x.to=$("vTo").value;const dn=$("vDest").value.trim(),an=$("vAcc").value.trim();
  if(!x.dest||x.dest.n!==dn)x.dest=dn?{n:dn,lat:x.dest&&x.dest.n===dn?x.dest.lat:null,lng:x.dest&&x.dest.n===dn?x.dest.lng:null}:null;
  if(!x.acc||x.acc.n!==an)x.acc=an?{n:an,lat:null,lng:null}:null}
async function vImport(text){vRead();const x=VED,L=vParse(text);const st=$("vImpS"),gl=/goo\.gl\//.test(text);if(!L.length){if(st)st.textContent=(gl?"Kurz-Links (maps.app.goo.gl) kann die App nicht lesen. ":"")+"Keine Orte erkannt. Bitte Namen (einer pro Zeile), eine Takeout-CSV oder eine gespeicherte Google-Maps-Seite verwenden.";return}
  const have=new Set((x.places||[]).map(p=>hNorm(p.n)));const nw=L.filter(p=>!have.has(hNorm(p.n)));
  if(!x.dest||x.dest.lat==null){if(x.dest&&x.dest.n){if(st)st.textContent="Suche Urlaubsort …";const g=await vGeo(x.dest.n);if(g)Object.assign(x.dest,g)}}
  let i=0;for(const p of nw){i++;if(st)st.textContent=`Suche Orte … ${i} von ${nw.length}: ${p.n}`;let osm="";
    if(p.lat==null){const g=await vGeo(p.n,x.dest)||(x.dest&&x.dest.n?await vGeo(p.n+", "+x.dest.n):null);if(g){p.lat=g.lat;p.lng=g.lng;osm=g.osm}}
    x.places=(x.places||[]).concat([{id:"p"+Date.now().toString(36)+i,n:p.n,note:p.note,lat:p.lat,lng:p.lng,url:p.url,cat:vGuess(p.n+" "+p.note,osm)}]);if(i%5===0||i===nw.length)vDrawKeep()}
  const miss=x.places.filter(p=>p.lat==null).length;vDrawKeep();const s2=$("vImpS");if(s2)s2.textContent=`✓ ${nw.length} neue Ziele übernommen${L.length-nw.length?`, ${L.length-nw.length} schon vorhanden`:""}${miss?` · ${miss} ohne Ortsangabe`:""}. Kategorien bei Bedarf unten anpassen, dann speichern.`}
function vDrawKeep(){const vals={};["vTi","vDest","vFrom","vTo","vAcc","vImpT"].forEach(k=>{const e=$(k);if(e)vals[k]=e.value});const st=($("vImpS")||{}).textContent||"";const op=($("vacdlg").querySelector(".vimp")||{}).open;vDraw();for(const k in vals){const e=$(k);if(e)e.value=vals[k]}const s=$("vImpS");if(s)s.textContent=st;const im=$("vacdlg").querySelector(".vimp");if(im&&op!=null)im.open=op}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#vacdlg"))return;const x=VED;if(!x)return;
  if(t.closest("[data-vclose]")){$("vacdlg").close();return}
  const g=t.closest("[data-vgeo]");if(g){vRead();const k=g.dataset.vgeo,o=x[k],h=$(k==="dest"?"vDestH":"vAccH");if(!o||!o.n){h.textContent="Bitte erst einen Ort eintragen.";return}h.textContent="Suche …";const r=await vGeo(o.n,k==="acc"?x.dest:null)||await vGeo(o.n);if(r){Object.assign(o,r);h.textContent="📍 gefunden: "+r.label}else h.textContent="Nicht gefunden – bitte genauer eingeben (z. B. mit Ort und Land).";return}
  if(t.closest("[data-vimp]")){const f=$("vImpF").files&&$("vImpF").files[0],tx=$("vImpT").value;const btn=t.closest("[data-vimp]");btn.disabled=true;try{await vImport(f?await f.text():tx);const ta=$("vImpT");if(ta)ta.value=""}finally{const b=$("vacdlg").querySelector("[data-vimp]");if(b)b.disabled=false}return}
  if(t.closest("[data-vadd]")){const n=$("vAdd").value.trim();if(!n)return;await vImport(n);return}
  const pd=t.closest("[data-vpdel]");if(pd){vRead();x.places=(x.places||[]).filter(p=>p.id!==pd.dataset.vpdel);vDrawKeep();return}
  if(t.closest("[data-vdel]")){if(!t.closest("[data-vdel]").dataset.sure){const b=t.closest("[data-vdel]");b.dataset.sure="1";b.textContent="Wirklich löschen? Nochmal tippen";return}hset("hurl:"+x.id,null);if(vPrevId()===x.id)LS.set("hwk-vacprev",null);$("vacdlg").close();VSIG="";renderHomeAll();vSync();toast("Urlaub gelöscht");return}
  if(t.closest("[data-vsave]")){vRead();if(!x.ti){toast("Bitte einen Titel eingeben");$("vTi").focus();return}if(!x.from||!x.to||x.to<x.from){toast("Bitte einen gültigen Zeitraum wählen");return}
    if(x.dest&&x.dest.n&&x.dest.lat==null){const r=await vGeo(x.dest.n);if(r)Object.assign(x.dest,r)}
    if(x.acc&&x.acc.n&&x.acc.lat==null){const r=await vGeo(x.acc.n,x.dest)||await vGeo(x.acc.n);if(r)Object.assign(x.acc,r)}
    vSave(x);$("vacdlg").close();VSIG="";renderHomeAll();vSync();toast(`🏝️ ${x.ti} gespeichert`+(T0>=x.from&&T0<=x.to?" – Urlaubsmodus ist aktiv":""));return}});
document.addEventListener("change",e=>{const s=e.target;if(!s.closest||!s.closest("#vacdlg")||!VED)return;if(s.dataset.vpcat){vRead();VED.places=VED.places.map(p=>p.id===s.dataset.vpcat?Object.assign({},p,{cat:s.value}):p)}});
setTimeout(vSync,0);
