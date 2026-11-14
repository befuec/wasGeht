/* =====================================================================
   Eigene Veranstaltungen: selbst gefundene Termine per Eingabemaske
   eintragen. Gespeichert verschlüsselt wie alles andere ("uev:<id>"),
   damit die ganze Familie sie sieht. Ort = bekanntes Ziel aus der App
   oder ein eigener Ort (Adresse wird über OpenStreetMap gesucht).
   ===================================================================== */
const UHOME={lat:53.76,lng:10.00};
const uevAll=()=>Object.keys(SETS).filter(k=>k.startsWith("uev:")).map(k=>Object.assign({id:k.slice(4)},SETS[k])).filter(x=>x&&x.ti&&x.dt);
let UEVSIG="";
function uevApply(force,quiet){const L=uevAll(),sig=JSON.stringify([L,T0]);if(!force&&sig===UEVSIG)return;UEVSIG=sig;
  PLACES.forEach(p=>{if(p.up&&p.up.some(e=>e.own))p.up=p.up.filter(e=>!e.own)});
  const pl=new Map();
  L.forEach(x=>{if((x.to||x.dt)<T0)return;
    const e={dt:x.to&&x.dt<T0?T0:x.dt,dt0:x.dt,to:x.to||null,t:x.t||"",te2:x.te||"",ti:x.ti,no:[x.no||"",x.pr||""].filter(Boolean).join(" · "),u:x.u||null,an:!!x.an,own:1,uid:x.id,oa:x.aud||"b"};
    let p=x.pid!=null&&x.pid!==""?PLACES.find(q=>q.id==x.pid):null;
    if(!p){const k="u|"+(x.v||"")+"|"+(x.a||"");if(!pl.has(k)){const km=x.lat!=null?Math.round(hav(UHOME,x)*10)/10:15,v=km<10?35:km<30?40:55;let h=0;for(const ch of k)h=(h*31+ch.charCodeAt(0))>>>0;
      pl.set(k,{id:8000000+h%900000,own:true,n:x.v||"Eigener Ort",a:x.a||"",lat:x.lat,lng:x.lng,km,car:Math.max(5,Math.round((km*1.3/v*60+5)/5)*5),web:x.u||"",up:[],hay:"",aud:"b",c:"ausflug",s:"FSHW"})}p=pl.get(k)}
    p.up.push(e)});
  const srt=p=>p.up&&p.up.sort((a,b)=>(a.dt+a.t).localeCompare(b.dt+b.t));PLACES.forEach(srt);pl.forEach(srt);
  window.UEVPL=[...pl.values()];
  try{EVCACHE=null;EVCT=0}catch(_){}
  if(!quiet&&window.__refresh)try{window.__refresh()}catch(_){}}
window.uevApply=uevApply;

/* ---------- Eingabemaske ---------- */
let UED=null;
function uevDlg(id){let d=$("uevdlg");if(!d){d=document.createElement("dialog");d.id="uevdlg";d.className="evdlg hdlg";d.setAttribute("aria-labelledby","uevH");document.body.appendChild(d)}
  const x=id?uevAll().find(e=>e.id===id):null;const au=window.getAud?getAud():"fam";
  UED=x?JSON.parse(JSON.stringify(x)):{id:"u"+Date.now().toString(36),ti:"",dt:T0,to:"",t:"",te:"",v:"",a:"",lat:null,lng:null,pid:"",u:"",pr:"",no:"",an:false,aud:au==="erw"?"e":au==="fam"?"f":"b"};uevDraw();d.showModal?d.showModal():d.setAttribute("open","")}
function uevDraw(){const d=$("uevdlg"),x=UED;if(!d||!x)return;const known=x.pid!==""&&x.pid!=null?PLACES.find(p=>p.id==x.pid):null,mine=uevAll().filter(e=>(e.to||e.dt)>=T0).sort((a,b)=>(a.dt+a.t).localeCompare(b.dt+b.t));
  d.innerHTML=`<form class="hform nofill" autocomplete="off" action="#"><div class="dlghead"><h3 id="uevH">${uevAll().some(e=>e.id===x.id)?"Eigene Veranstaltung bearbeiten":"Eigene Veranstaltung"}</h3><button type="button" class="mbx" data-uclose aria-label="Schließen">✕</button></div>
   <label>Titel<input type="text" id="uTi" maxlength="90" value="${esc(x.ti)}" placeholder="z. B. Laternenumzug Rhen" name="wg-uev-titel"></label>
   <div class="hf2"><label>Datum<input type="date" id="uDt" value="${esc(x.dt)}"></label><label>bis <small>(mehrtägig, optional)</small><input type="date" id="uTo" value="${esc(x.to||"")}"></label></div>
   <div class="hf2"><label>Beginn <small>(optional)</small><input type="time" id="uT" value="${esc(x.t||"")}"></label><label>Ende <small>(optional)</small><input type="time" id="uTe" value="${esc(x.te||"")}"></label></div>
   <label>Ort <small>– bekanntes Ziel wählen oder eigenen Namen eintragen</small><input type="text" id="uV" list="uevPl" value="${esc(known?known.n:x.v)}" placeholder="z. B. Bürgerhaus Henstedt-Ulzburg" name="wg-uev-ort" autocomplete="off"></label>
   <datalist id="uevPl">${PLACES.slice().sort((a,b)=>a.n.localeCompare(b.n)).map(p=>`<option value="${esc(p.n)}"></option>`).join("")}</datalist>
   <div class="vgrow" id="uAW"${known?" hidden":""}><label>Adresse <small>(für Entfernung und Route)</small><input type="text" id="uA" value="${esc(x.a||"")}" placeholder="Straße, Ort" name="wg-uev-adresse"></label><button type="button" class="pmini" data-ugeo>Suchen</button></div>
   <small class="hhint" id="uAH">${known?`📍 bekanntes Ziel: ${esc(known.a||"")}`:x.lat!=null?"📍 Ort gefunden":"Ohne Adresse wird keine Entfernung berechnet."}</small>
   <span class="hlab">Für wen?</span><div class="dquick" id="uAud">${[["f","Kinder"],["e","Erwachsene"],["b","Beide"]].map(([k,l])=>`<button type="button" data-uaud="${k}" aria-pressed="${x.aud===k}">${l}</button>`).join("")}</div>
   <div class="hf2"><label>Preis <small>(optional)</small><input type="text" id="uPr" maxlength="60" value="${esc(x.pr||"")}" placeholder="z. B. frei, 5 € p. P."></label><label>Link <small>(optional)</small><input type="url" id="uU" value="${esc(x.u||"")}" placeholder="https://…"></label></div>
   <label>Hinweis <small>(optional)</small><input type="text" id="uNo" maxlength="140" value="${esc(x.no||"")}" placeholder="z. B. Laternen selbst mitbringen"></label>
   <label class="famchk"><input type="checkbox" id="uAn"${x.an?" checked":""}> Anmeldung oder Ticket nötig</label>
   <div class="hfbtn">${uevAll().some(e=>e.id===x.id)?`<button type="button" class="pmini hdel vdel" data-udel>Löschen</button>`:""}<button type="button" class="pbtn" data-uclose>Abbrechen</button><button type="button" class="pbtn hsave" data-usave>💾 Speichern</button></div>
   ${mine.length?`<h4 class="hday">Eure eigenen Veranstaltungen (${mine.length})</h4><div class="uevl">${mine.map(e=>`<button type="button" class="uevr" data-uedit="${esc(e.id)}"${e.id===x.id?' aria-current="true"':""}><b>${esc(e.ti)}</b><small>${esc(fmtDate(e.dt))}${e.to?" – "+esc(fmtDate(e.to)):""}${e.t?" · "+esc(e.t)+" Uhr":""} · ${esc((e.pid!==""&&e.pid!=null&&(PLACES.find(p=>p.id==e.pid)||{}).n)||e.v||"ohne Ort")}</small></button>`).join("")}</div>`:""}
   </form>`}
function uevRead(){const x=UED,vn=$("uV").value.trim(),kp=PLACES.find(p=>p.n===vn);
  x.ti=$("uTi").value.trim().slice(0,90);x.dt=$("uDt").value;x.to=$("uTo").value&&$("uTo").value>x.dt?$("uTo").value:"";x.t=$("uT").value;x.te=$("uTe").value;
  if(kp){x.pid=kp.id;x.v="";x.a="";x.lat=null;x.lng=null}else{if(x.pid!==""||x.v!==vn||x.a!==$("uA").value.trim()){if(x.v!==vn||x.a!==$("uA").value.trim()){x.lat=null;x.lng=null}}x.pid="";x.v=vn;x.a=$("uA").value.trim()}
  x.pr=$("uPr").value.trim();x.u=/^https?:\/\//.test($("uU").value.trim())?$("uU").value.trim():"";x.no=$("uNo").value.trim();x.an=$("uAn").checked}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest)return;
  if(t.closest("[data-uevnew]")){uevDlg(null);return}
  const ued=t.closest("[data-uevedit]");if(ued&&!t.closest("#uevdlg")){uevDlg(ued.dataset.uevedit);return}
  if(!t.closest("#uevdlg")||!UED)return;const x=UED;
  if(t.closest("[data-uclose]")){$("uevdlg").close();return}
  const ua=t.closest("[data-uaud]");if(ua){x.aud=ua.dataset.uaud;$("uAud").querySelectorAll("[data-uaud]").forEach(b=>b.setAttribute("aria-pressed",String(b===ua)));return}
  const ue=t.closest("[data-uedit]");if(ue){const y=uevAll().find(v=>v.id===ue.dataset.uedit);if(y){UED=JSON.parse(JSON.stringify(y));uevDraw()}return}
  if(t.closest("[data-ugeo]")){uevRead();const h=$("uAH");if(!x.v&&!x.a){h.textContent="Bitte Ort oder Adresse eintragen.";return}h.textContent="Suche …";const r=await vGeo([x.v,x.a].filter(Boolean).join(", "),UHOME)||(x.a?await vGeo(x.a):null);if(r){x.lat=r.lat;x.lng=r.lng;h.textContent="📍 gefunden: "+r.label}else h.textContent="Nicht gefunden – bitte mit Ort eingeben (z. B. „Rathausplatz 1, Norderstedt“).";return}
  if(t.closest("[data-udel]")){const b=t.closest("[data-udel]");if(!b.dataset.sure){b.dataset.sure="1";b.textContent="Wirklich löschen? Nochmal tippen";return}hset("uev:"+x.id,null);$("uevdlg").close();uevApply(true);toast("🗑️ Veranstaltung gelöscht");return}
  if(t.closest("[data-usave]")){uevRead();if(!x.ti){toast("Bitte einen Titel eingeben");$("uTi").focus();return}if(!x.dt){toast("Bitte ein Datum wählen");return}
    if(x.pid===""&&x.lat==null&&(x.v||x.a)){const r=await vGeo([x.v,x.a].filter(Boolean).join(", "),UHOME)||(x.a?await vGeo(x.a):null);if(r){x.lat=r.lat;x.lng=r.lng}}
    const o=Object.assign({},x);delete o.id;hset("uev:"+x.id,o);$("uevdlg").close();uevApply(true);toast(`📅 „${x.ti}“ eingetragen – ${fmtDate(x.dt)}`);return}});
document.addEventListener("input",e=>{if(e.target.id!=="uV"||!UED)return;const kp=PLACES.find(p=>p.n===e.target.value.trim()),w=$("uAW"),h=$("uAH");if(w)w.hidden=!!kp;if(h)h.textContent=kp?`📍 bekanntes Ziel: ${kp.a||""}`:"Ohne Adresse wird keine Entfernung berechnet."});
setTimeout(()=>uevApply(true),0);
