/* ===== Plus-Funktionen: gemeinsame Sterne & Besuche, Top 3, Ausflugsplan, Teilen, Neu-Markierung, Listenansicht, Filter-Blatt, Vorlesen ===== */
(function(){
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const byId=id=>PLACES.find(p=>p.id==id)||(window.getXPL?getXPL():[]).find(p=>p.id==id), byName=n=>PLACES.find(p=>p.n===n);
/* --- Speicher: gemeinsam (db) oder nur auf diesem Gerät --- */
const ST={places:LS.get("hwkp-places",{}),plans:LS.get("hwkp-plans",{}),evw:LS.get("hwkp-evw",{}),maybe:LS.get("hwkp-maybe",{}),busy:LS.get("hwkp-busy",{})};
const M2S=["heute","entdecken","plan","zuhause"];
let M2=(()=>{const h=window.HASH0||"";if(h==="#heute")return"heute";if(h==="#plan")return"plan";if(h==="#zuhause")return"zuhause";if(h==="#ziele"||h==="#veranstaltungen"||h==="#termine")return"entdecken";
  try{const s=sessionStorage.getItem("hwk-m2");if(M2S.includes(s))return s}catch(e){}
  return new Date().getHours()<14?"heute":"entdecken"})();window.M2=M2;
let MYID=null,UAPI=null;const PROF={};
{const s=(()=>{try{return JSON.parse(localStorage.getItem("hwk-fam-sb")||"null")}catch(e){return null}})();if(s&&s.name)MYID=s.name}let PSEEN=LS.get("hwkp-planseen",0);
let DB=null, SHARED=false, CANWRITE=true;
const pq={}; // eine Schreiboperation je Dokument
function persistLocal(){LS.set("hwkp-places",ST.places);LS.set("hwkp-plans",ST.plans);LS.set("hwkp-evw",ST.evw);LS.set("hwkp-maybe",ST.maybe);LS.set("hwkp-busy",ST.busy)}
const SB_URL="https://klnjjherjqxiihxwaveh.supabase.co",SB_KEY="sb_publishable_mixDdB0UbIg2mTCKfz2dZA_5oQmRxE5";
let SB=LS.get("hwk-fam-sb",null);
async function sbRpc(fn,args){const r=await fetch(SB_URL+"/rest/v1/rpc/"+fn,{method:"POST",headers:{apikey:SB_KEY,"Content-Type":"application/json"},body:JSON.stringify(args)});
  if(!r.ok){let j=null;try{j=await r.json()}catch(_){}const e=new Error((j&&j.message)||("HTTP "+r.status));e.code=j&&j.code;throw e}return r.json()}
function write(path,body){persistLocal();
  if(SB){const [kind,...rest]=path.split("/"),id=rest.join("/");pq[path]=pq[path]||{busy:false,next:undefined};pq[path].next=body;
    const run=()=>{const b=pq[path].next;pq[path].next=undefined;pq[path].busy=true;
      sbRpc("fam_put",{p_code:SB.code,p_kind:kind,p_id:id,p_data:b||null}).then(()=>{sbErr(null)}).catch(e=>{if(e.code==="28000")sbLogout(true);else sbErr("Speichern gerade nicht möglich – wird beim nächsten Mal nachgeholt.")}).finally(()=>{pq[path].busy=false;if(pq[path].next!==undefined)run()})};
    if(!pq[path].busy)run();return}
  if(!DB||!CANWRITE)return;
  const run=()=>{const b=pq[path].next;pq[path].next=undefined;pq[path].busy=true;
    const ref=DB.doc(path);(b?ref.set(b):ref.delete()).catch(e=>{if(e&&e.code==="invalid_argument"){CANWRITE=false;syncNote()}}).finally(()=>{pq[path].busy=false;if(pq[path].next!==undefined)run()})};
  pq[path]=pq[path]||{busy:false,next:undefined};pq[path].next=body;if(!pq[path].busy)run()}
function setPlace(id,patch){const cur=Object.assign({},ST.places[id]||{},patch);
  const empty=!cur.star&&!cur.visited&&!cur.rating&&!cur.note;
  if(empty)delete ST.places[id];else ST.places[id]=cur;
  write("places/"+id,empty?null:cur);refresh()}
function setPlan(dt,items){if(items.length)ST.plans[dt]={items};else delete ST.plans[dt];write("plans/"+dt,items.length?{items}:null);refresh();renderPlan()}
const P_=id=>ST.places[id]||{};
/* Sterne der Kinderansicht mit dem Speicher abgleichen */
function syncStarsToKids(){if(typeof KSTAR==="undefined")return;KSTAR.clear();for(const id in ST.places)if(ST.places[id].star){const p=byId(id);if(p)KSTAR.add(p.n)}saveStars()}
window.plusStarChanged=(name,on)=>{const p=byName(name);if(p)setPlace(p.id,{star:on})};
/* bestehende lokale Sterne übernehmen */
if(typeof KSTAR!=="undefined"&&KSTAR.size){KSTAR.forEach(n=>{const p=byName(n);if(p&&!P_(p.id).star){ST.places[p.id]=Object.assign({},P_(p.id),{star:true})}});persistLocal()}
let RT=null;function refresh(){clearTimeout(RT);RT=setTimeout(()=>{const a=document.activeElement;if(a&&a.classList&&a.classList.contains("pnote"))return;
  syncStarsToKids();if(window.KIDS_ON){window.renderKidView&&window.renderKidView()}else{render();if(M2==="heute")renderHeute();if(M2==="plan")renderPlan();if(M2==="zuhause"&&window.renderHomeNow)renderHomeNow()}updateFabs()},120)}
(async()=>{try{if(SB||!window.claude||!window.claude.use)return;const db=await window.claude.use("db");if(!db)return;DB=db;
  try{const u=await window.claude.use("user");if(u){UAPI=u;if(u.can){const c=await u.can("data.write");if(c===false)CANWRITE=false}if(u.me){const me=await u.me();MYID=me&&me.id||null;if(MYID)PROF[MYID]=me}}}catch(e){}
  let first=true;
  db.collection("places").onSnapshot(s=>{const o={};s.docs.forEach(d=>{if(d.exists)o[d.id]=d.data()});
    if(first&&!s.size&&Object.keys(ST.places).length&&CANWRITE){first=false;for(const id in ST.places)write("places/"+id,ST.places[id]);return}
    first=false;ST.places=JSON.parse(JSON.stringify(o));SHARED=true;persistLocal();syncNote();refresh()},()=>{});
  db.collection("plans").onSnapshot(s=>{const o={};s.docs.forEach(d=>{if(d.exists)o[d.id]=d.data()});ST.plans=JSON.parse(JSON.stringify(o));persistLocal();refresh();renderPlan()},()=>{});
  let firstW=true;db.collection("evwish").onSnapshot(s=>{const o={};s.docs.forEach(d=>{if(d.exists)o[d.id]=d.data()});
    if(firstW&&!s.size&&Object.keys(ST.evw).length&&CANWRITE){firstW=false;for(const id in ST.evw)write("evwish/"+id,ST.evw[id]);return}
    firstW=false;ST.evw=JSON.parse(JSON.stringify(o));persistLocal();refresh()},()=>{});
  let firstB=true;db.collection("busy").onSnapshot(s=>{const o={};s.docs.forEach(d=>{if(d.exists)o[d.id]=d.data()});
    if(firstB&&!s.size&&Object.keys(ST.busy).length&&CANWRITE){firstB=false;for(const id in ST.busy)write("busy/"+id,ST.busy[id]);return}
    firstB=false;ST.busy=JSON.parse(JSON.stringify(o));persistLocal();refresh()},()=>{});
  let firstM=true;db.collection("maybe").onSnapshot(s=>{const o={};s.docs.forEach(d=>{if(d.exists)o[d.id]=d.data()});
    if(firstM&&!s.size&&Object.keys(ST.maybe).length&&CANWRITE){firstM=false;for(const id in ST.maybe)write("maybe/"+id,ST.maybe[id]);return}
    firstM=false;ST.maybe=JSON.parse(JSON.stringify(o));persistLocal();refresh()},()=>{});
}catch(e){}})();
/* --- Supabase: Laden, Abgleich, Anmeldung mit Familien-Code --- */
let SBSIG="",SBERR=null;const SETS={};
/* Einstellungen (Familie, freie Wochentage) gemeinsam speichern */
window.plusSettingsChanged=what=>{if(!SB||window.APPLYING)return;
  if(what==="family"){SETS.family={ad:FAM.ad,kids:FAM.kids.slice()};write("settings/family",SETS.family)}
  if(what==="freedays"){SETS.freedays={days:[...(window.FREEDAYS||[])]};write("settings/freedays",SETS.freedays)}
  if(window.homeIsKey&&window.homeIsKey(what)){write("settings/"+what,SETS[what]===undefined?null:SETS[what]);return}
  if(what==="hiddenrg"){SETS.hiddenrg={items:Object.assign({},window.HIDRG||{})};write("settings/hiddenrg",SETS.hiddenrg)}};
function applySettings(s,full){if(!s)return;window.APPLYING=true;try{
  if(s.family&&Number.isFinite(s.family.ad)&&Array.isArray(s.family.kids)&&JSON.stringify(s.family)!==JSON.stringify({ad:FAM.ad,kids:FAM.kids})){FAM.ad=s.family.ad;FAM.kids=s.family.kids.slice();saveFam();renderKids();if($("setFam"))$("setFam").textContent=FAM.ad+" Erw. · "+(FAM.kids.length?FAM.kids.length+(FAM.kids.length===1?" Kind":" Kinder"):"keine Kinder")}
  if(s.freedays&&Array.isArray(s.freedays.days)){window.FREEDAYS=new Set(s.freedays.days);try{localStorage.setItem("hwk-freedays",JSON.stringify(s.freedays.days))}catch(_){}if(typeof renderFreeDays==="function")renderFreeDays()}
  if(s.hiddenrg&&s.hiddenrg.items&&typeof s.hiddenrg.items==="object"&&JSON.stringify(s.hiddenrg.items)!==JSON.stringify(window.HIDRG)){window.HIDRG=s.hiddenrg.items;try{localStorage.setItem("hwk-hidrg",JSON.stringify(HIDRG))}catch(_){}window.HIDV++;if(typeof renderHidRg==="function")renderHidRg();EVCACHE=null;setTimeout(()=>{refresh()},0)}
  Object.assign(SETS,s);if(window.homeApply)window.homeApply(s,full);if(window.renderHomeSetNow)renderHomeSetNow()}finally{window.APPLYING=false}}
/* Sicherung: alles als JSON-Datei herunterladen und wiederherstellen */
function backupData(){const E=[];const m={places:ST.places,plans:ST.plans,evwish:ST.evw,maybe:ST.maybe,busy:ST.busy};for(const k in m)for(const id in m[k])E.push({kind:k,id,data:m[k][id]});
  E.push({kind:"settings",id:"family",data:{ad:FAM.ad,kids:FAM.kids}});E.push({kind:"settings",id:"freedays",data:{days:[...(window.FREEDAYS||[])]}});E.push({kind:"settings",id:"hiddenrg",data:{items:window.HIDRG||{}}});for(const k in SETS)if(window.homeIsKey&&homeIsKey(k))E.push({kind:"settings",id:k,data:SETS[k]});
  return {app:"was-geht",version:1,exported:new Date().toISOString(),entries:E}}
let BKPEND=null;
document.addEventListener("click",e=>{
  if(e.target.id==="bkSave"){const d=backupData(),blob=new Blob([JSON.stringify(d,null,1)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="was-geht-sicherung-"+T0+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);$("bkInfo").textContent="✅ "+d.entries.length+" Einträge als Datei gespeichert.";return}
  if(e.target.id==="bkGo"&&BKPEND){const n=BKPEND.length;BKPEND.forEach(x=>{const k=x.kind,id=String(x.id);if(k==="settings"){applySettings({[id]:x.data});window.plusSettingsChanged(id);return}const map={places:ST.places,plans:ST.plans,evwish:ST.evw,maybe:ST.maybe,busy:ST.busy}[k];if(!map)return;map[id]=x.data;write(k+"/"+id,x.data)});
    BKPEND=null;persistLocal();refresh();renderPlan();$("bkInfo").textContent="✅ "+n+" Einträge wiederhergestellt"+(SB?" und gemeinsam gespeichert.":" (nur auf diesem Gerät).");return}});
document.addEventListener("change",e=>{if(e.target.id!=="bkFile")return;const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(r.result);if(d.app!=="was-geht"||!Array.isArray(d.entries))throw 0;BKPEND=d.entries;
    $("bkInfo").innerHTML=`Sicherung vom ${esc(new Date(d.exported).toLocaleString("de-DE"))} mit ${d.entries.length} Einträgen. Gleiche Einträge werden überschrieben, andere bleiben. <button type="button" class="pmini" id="bkGo">Jetzt wiederherstellen</button>`}
  catch(_){BKPEND=null;$("bkInfo").textContent="Das ist keine Sicherungsdatei von „Was geht?“."}};r.readAsText(f);e.target.value=""});
function sbErr(m){SBERR=m;const s=$("sbStat");if(s)renderSbStat()}
async function sbLoad(first){if(!SB)return;try{const rows=await sbRpc("fam_list",{p_code:SB.code});
    const o={places:{},plans:{},evwish:{},maybe:{},busy:{},settings:{}};rows.forEach(r=>{if(o[r.kind])o[r.kind][r.id]=r.data});
    if(first&&!o.settings.family)window.plusSettingsChanged("family");
    if(first&&!o.settings.freedays)window.plusSettingsChanged("freedays");
    if(first&&!rows.filter(r=>r.kind!=="settings").length){const loc={places:ST.places,plans:ST.plans,evwish:ST.evw,maybe:ST.maybe,busy:ST.busy};let n=0;for(const k in loc)for(const id in loc[k]){write(k+"/"+id,loc[k][id]);n++}if(n){SHARED=true;syncNote();return}}
    for(const path in pq){const q=pq[path];if(q.busy||q.next!==undefined){const [k,...r]=path.split("/"),id=r.join("/");const cur={places:ST.places,plans:ST.plans,evwish:ST.evw,maybe:ST.maybe,busy:ST.busy,settings:SETS}[k];if(cur){if(cur[id]!==undefined)o[k][id]=cur[id];else delete o[k][id]}}}
    const sig=JSON.stringify(o);SHARED=true;sbErr(null);if(sig===SBSIG)return;SBSIG=sig;
    ST.places=o.places;ST.plans=o.plans;ST.evw=o.evwish;ST.maybe=o.maybe;ST.busy=o.busy;applySettings(o.settings,true);persistLocal();syncNote();refresh();renderPlan()}
  catch(e){if(e.code==="28000")sbLogout(true);else sbErr("Keine Verbindung zur gemeinsamen Datenbank – es wird lokal weitergearbeitet.")}}
function sbLogout(wrong){SB=null;LS.set("hwk-fam-sb",null);SHARED=false;MYID=null;syncNote();renderSbStat();if(wrong)famAsk("Der Familien-Code stimmt nicht mehr. Bitte neu eingeben.")}
function famAsk(msg){const d=$("famdlg");if(!d)return;$("famErr").textContent=msg||"";$("famName").value=(SB&&SB.name)||LS.get("hwk-fam-name","")||"";d.showModal?d.showModal():d.setAttribute("open","");setTimeout(()=>$("famCode").focus(),50)}
function renderSbStat(){const s=$("sbStat");if(!s)return;
  s.innerHTML=SB?`<p class="famnote">✅ Verbunden als <b>${esc(SB.name||"–")}</b>. Plan, Vielleicht, verplante Tage, Wünsche und Sterne sind auf allen Geräten mit diesem Code gleich.${SBERR?`<br>⚠️ ${esc(SBERR)}`:""}</p><button type="button" class="pmini" id="sbOut">Abmelden</button>
    <details class="hown" id="codeChg"><summary>🔑 Familien-Code ändern</summary><div class="hmgr"><input type="password" class="faminp" id="ccOld" autocomplete="current-password" placeholder="Bisheriger Code"><input type="password" class="faminp" id="ccNew" autocomplete="new-password" placeholder="Neuer Code (mind. 10 Zeichen)"><input type="password" class="faminp" id="ccNew2" autocomplete="new-password" placeholder="Neuer Code wiederholen"><button type="button" class="pmini" id="ccGo">Code ändern</button><p class="famnote" id="ccMsg" aria-live="polite"></p><p class="famnote">Danach müssen sich alle anderen Geräte einmal mit dem neuen Code anmelden.</p></div></details>`
    :`<p class="famnote">Nicht verbunden – Einträge gelten nur auf diesem Gerät.</p><button type="button" class="pmini" id="sbIn">Mit Familien-Code verbinden</button><p class="famnote">Noch keinen Code? Im Anmeldefenster „✨ Neue Familie anlegen“. Code vergessen? Er lässt sich nicht auslesen – dann eine neue Familie anlegen und Einträge über 💾 Sicherung mitnehmen.</p>`}
document.addEventListener("click",async e=>{if(e.target.id!=="ccGo")return;const m=$("ccMsg"),o=$("ccOld").value,n=$("ccNew").value,n2=$("ccNew2").value;
  if(n.length<10){m.textContent="Der neue Code braucht mindestens 10 Zeichen.";return}if(n!==n2){m.textContent="Die beiden neuen Codes stimmen nicht überein.";return}
  m.textContent="Wird geändert …";try{await sbRpc("fam_setcode",{p_old:o,p_new:n});SB.code=n;LS.set("hwk-fam-sb",SB);["ccOld","ccNew","ccNew2"].forEach(id=>$(id).value="");m.textContent="✅ Neuer Code gespeichert. Auf den anderen Geräten einmal neu anmelden.";toast("🔑 Familien-Code geändert")}
  catch(err){m.textContent=err.code==="28000"?"Der bisherige Code stimmt nicht.":err.code==="22023"?"Der neue Code braucht mindestens 10 Zeichen.":err.code==="23505"?"Diesen Code gibt es schon – bitte einen anderen wählen.":/fam_setcode|PGRST202|42883/.test((err.code||"")+(err.message||""))?"Diese Funktion ist in Supabase noch nicht eingerichtet – einmal supabase/mehrere-familien.sql ausführen.":"Hat nicht geklappt: "+(err.message||"keine Verbindung")}});
document.addEventListener("click",e=>{if(e.target.id==="sbOut"){sbLogout(false);return}if(e.target.id==="sbIn"){famAsk("");return}});
function syncNote(){const el=$("oursNote");if(!el)return;el.textContent=SHARED?(CANWRITE?"Sterne, Besuche, Notizen und Ausflugsplan sind für alle mit Zugriff auf diese Seite gleich (geräteübergreifend).":"Du kannst die gemeinsamen Sterne und Besuche sehen, aber nicht ändern."):"Gespeichert auf diesem Gerät. Sobald die Seite gemeinsam gespeichert werden kann, gelten die Angaben für alle Geräte."}
/* --- Filter „Unsere Ziele“ --- */
const PS=Object.assign({visit:"all",wish:false,rail:false},LS.get("hwkp-filter",{}));
const VISIT={all:"Alle",new:"Noch nicht besucht",done:"Schon besucht",fav:"Lieblinge (4–5 👍)"};
function renderOurs(){$("ours").innerHTML=Object.entries(VISIT).map(([k,v])=>`<label class="chip"><input type="radio" name="pvisit" value="${k}"${PS.visit===k?" checked":""}><span>${v}</span></label>`).join("")+
  `<label class="chip"><input type="checkbox" id="pwish"${PS.wish?" checked":""}><span>⭐ Wunsch der Kinder</span></label><label class="chip"><input type="checkbox" id="prail"${PS.rail?" checked":""}><span>🚆 U-/S-Bahn in der Nähe</span></label>`;
  $("h-ours").textContent=[PS.visit!=="all"?VISIT[PS.visit]:"",PS.wish?"⭐":"",PS.rail?"🚆":""].filter(Boolean).join(", ");syncNote()}
$("ours").addEventListener("change",e=>{const t=e.target;if(t.name==="pvisit")PS.visit=t.value;if(t.id==="pwish")PS.wish=t.checked;if(t.id==="prail")PS.rail=t.checked;LS.set("hwkp-filter",PS);renderOurs();render()});
window.plusMatch=p=>{const s=P_(p.id);if(PS.visit==="new"&&s.visited)return false;if(PS.visit==="done"&&!s.visited)return false;if(PS.visit==="fav"&&!((s.rating||0)>=4))return false;
  if(PS.wish&&!s.star)return false;if(PS.rail&&!p.st)return false;return true};
window.plusActive=a=>{if(PS.visit!=="all")a.push(["Unsere Ziele",VISIT[PS.visit],()=>{PS.visit="all";LS.set("hwkp-filter",PS);renderOurs()}]);
  if(PS.wish)a.push(["Kinder","⭐ Wunsch",()=>{PS.wish=false;LS.set("hwkp-filter",PS);renderOurs()}]);
  if(PS.rail)a.push(["Anreise","🚆 U-/S-Bahn in der Nähe",()=>{PS.rail=false;LS.set("hwkp-filter",PS);renderOurs()}])};
window.plusCount=()=>(PS.visit!=="all")+PS.wish+PS.rail;
window.plusSnap=()=>Object.assign({},PS);
window.plusRestore=(s,quiet)=>{Object.assign(PS,s);if(!quiet){LS.set("hwkp-filter",PS);renderOurs()}};
/* --- Kacheln: Abzeichen und Aktionen --- */
const inPlan=(type,id)=>Object.entries(ST.plans).some(([d,v])=>(v.items||[]).some(x=>x.type===type&&x.id===id));
window.plusBadges=p=>{const s=P_(p.id),b=[];if(s.visited)b.push(`<span class="pb ok">${CHK_ON} besucht</span>`);if(s.rating)b.push(`<span class="pb">${"👍".repeat(s.rating>3?2:1)} ${s.rating}/5</span>`);if(inPlan("place",p.id))b.push(`<span class="pb plan">📌 im Plan</span>`);if(s.note)b.push(`<span class="pb">📝</span>`);return b.length?`<div class="pbadges">${b.join("")}</div>`:""};
const RAIL=p=>"https://www.google.com/maps/dir/?api=1&origin="+encodeURIComponent("Henstedt-Ulzburg Rhen")+"&destination="+encodeURIComponent(p.n+", "+p.a)+"&travelmode=transit";
const CHK_OFF=`<svg class="chk" width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,CHK_ON=`<svg class="chk" width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><rect x="1" y="1" width="18" height="18" rx="4" fill="#1F7A3A"/><path d="M5.5 10.5l3 3 6-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
window.plusCard=p=>{const s=P_(p.id),pd=planDateOf(p.id);
  return `<div class="pcard" data-pid="${p.id}">
    <div class="pacts">${pd?`<span class="pplan on">${IC.pin}Eingeplant: ${esc(dayLabel(pd))}<button type="button" data-act="unplan" aria-label="Aus dem Ausflugsplan entfernen">✕</button></span>`:`<button type="button" class="pbtn" data-act="plan">${IC.pin}Einplanen</button>`}${window.plusMaybeBtn(p)}<button type="button" class="pbtn" data-act="visit" aria-pressed="${!!s.visited}">${s.visited?CHK_ON:CHK_OFF} Besucht</button><button type="button" class="pbtn" data-act="share">${IC.share}Teilen</button><a class="pbtn" href="${RAIL(p)}" target="_blank" rel="noopener">🚆 Bahn-Route</a></div>
    <div class="prate" role="group" aria-label="Wie hat es euch gefallen?"><span>Bewertung</span>${[1,2,3,4,5].map(i=>`<button type="button" data-rate="${i}" aria-pressed="${(s.rating||0)>=i}" aria-label="${i} von 5">👍</button>`).join("")}</div>
    <textarea class="pnote" rows="2" placeholder="Eigene Notiz, z. B. „Parkplatz ab 11 Uhr voll“" aria-label="Notiz zu ${esc(p.n)}">${esc(s.note||"")}</textarea>
  </div>`};
let NT={};
const gridClick=e=>{const b=e.target.closest(".pcard [data-act],.pcard [data-rate]");if(b){e.stopPropagation();const id=+b.closest(".pcard").dataset.pid,p=byId(id);
    if(b.dataset.rate){const r=+b.dataset.rate;setPlace(id,{rating:P_(id).rating===r?0:r});return}
    const a=b.dataset.act;if(a==="visit")setPlace(id,{visited:!P_(id).visited});
    if(a==="plan"){openPick(p)}
    if(a==="unplan"){const d=planDateOf(id);if(d)togglePlacePlan(p,d)}if(a==="share")share(placeText(p));return}
  if(e.target.closest(".pcard")){e.stopPropagation();return}
  const lp=e.target.closest("[data-lplan]");if(lp){e.stopPropagation();openPick(byId(+lp.dataset.lplan));return}
  const lu=e.target.closest("[data-lunplan]");if(lu){e.stopPropagation();const p=byId(+lu.dataset.lunplan),d=planDateOf(p.id);if(d)togglePlacePlan(p,d);return}
  const r=e.target.closest(".lrow");if(r&&!e.target.closest("a,button")){const id=+r.dataset.id;LEXP.has(id)?LEXP.delete(id):LEXP.add(id);render();setTimeout(()=>{const n=document.getElementById("p"+id);n&&n.focus({preventScroll:true})},0)}};window.gridClick=gridClick;$("grid").addEventListener("click",gridClick,true);
const gridInput=e=>{const t=e.target;if(!t.classList.contains("pnote"))return;const id=+t.closest(".pcard").dataset.pid;clearTimeout(NT[id]);NT[id]=setTimeout(()=>setPlace(id,{note:t.value.trim()}),900)};window.gridInput=gridInput;$("grid").addEventListener("input",gridInput);
const gridFocusOut=e=>{const t=e.target;if(!t.classList||!t.classList.contains("pnote"))return;const id=+t.closest(".pcard").dataset.pid;clearTimeout(NT[id]);if((P_(id).note||"")!==t.value.trim())setPlace(id,{note:t.value.trim()});else refresh()};window.gridFocusOut=gridFocusOut;$("grid").addEventListener("focusout",gridFocusOut);
/* --- Listenansicht --- */
window.VIEW=LS.get("hwkp-view","cards");
function syncView(){document.querySelectorAll(".viewtog button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.view===window.VIEW)))}
document.querySelector(".viewtog").addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(!b)return;window.VIEW=b.dataset.view;LS.set("hwkp-view",window.VIEW);syncView();render()});
const LEXP=new Set();
window.plusRow=p=>{const fc=famCost(p),ti=tierOf(fc),on=openNow(p),s=P_(p.id),nx=p.up[0];
  const price=p.pk==="free"?"kostenlos":fc!=null&&fc>0?fmtEur(fc,p.pest):COST_SHORT[ti];
  return `<article class="lrow" id="p${p.id}" data-id="${p.id}" tabindex="0" aria-expanded="${LEXP.has(p.id)}" title="Antippen für Details"><span class="dot" style="background:var(--c-${p.c})"></span>
    <div class="ln"><span><b>${esc(p.n)}</b>${KSTAR&&KSTAR.has(p.n)?" ⭐":""}${s.visited?" "+CHK_ON:""}${s.rating?` 👍${s.rating}`:""}${inPlan("place",p.id)?" 📌":""}</span><small>${esc(CATS[p.c])}${nx?` · nächster Termin ${fmtDate(nx.dt)}`:""}</small></div>
    <span class="lmeta"><span class="lc">${Math.round(p.km)} km</span><span class="lc">🚗 ${p.car}′</span><span class="lc lp">${price}</span><span class="lc lo ${on===true?"y":on===false?"n":""}">${on===true?"offen":on===false?"zu":"–"}</span></span>
    <span class="lact">${(()=>{const pd=planDateOf(p.id);return pd?`<button type="button" class="lbtn on" data-lunplan="${p.id}" title="Aus dem Ausflugsplan entfernen">${IC.pin}${esc(dayLabel(pd))} ✕</button>`:`<button type="button" class="lbtn" data-lplan="${p.id}">${IC.pin}Einplanen</button>`})()}${window.plusMaybeBtn(p,null,true)}<span class="lchev" aria-hidden="true">▾</span></span></article>${LEXP.has(p.id)?`<div class="lexp">${window.card(p).replace(/ id="p\d+"/,"").replace('class="card','class="card open')}</div>`:""}`};
$("grid").addEventListener("keydown",e=>{const r=e.target.closest(".lrow");if(r&&e.target===r&&(e.key==="Enter"||e.key===" ")){e.preventDefault();const id=+r.dataset.id;LEXP.has(id)?LEXP.delete(id):LEXP.add(id);render();setTimeout(()=>{const n=document.getElementById("p"+id);n&&n.focus({preventScroll:true})},0)}});
/* --- Teilen (Text kopieren) --- */
function placeText(p){return `${p.n}\n${p.a}\n${p.d}\nAnfahrt: Auto ca. ${p.car} Min.${p.bike?", Rad ca. "+p.bike+" Min.":""}\nKarte: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.n+", "+p.a)}${p.ws?"":"\nWebsite: "+p.web}`}
function evText(p,e){const d=pdate(e.dt);return `${WDL[d.getDay()]}, ${d.getDate()}. ${MONL[d.getMonth()]}${e.t?", "+e.t+" Uhr":""}: ${e.ti}\n${p.n}, ${p.a}${e.no?"\n"+e.no:""}${e.u?"\nInfos: "+e.u:""}`}
function toast(m){let t=$("ptoast");t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,2600)}
function share(text){const done=()=>toast("Kopiert – jetzt z. B. in WhatsApp einfügen");
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done,()=>fallbackCopy(text))}else fallbackCopy(text)}
function fallbackCopy(text){const d=$("pcopy");$("pcopyT").value=text;d.showModal?d.showModal():d.setAttribute("open","");$("pcopyT").select()}
$("pcopyX").addEventListener("click",()=>$("pcopy").close());
/* --- Termine: Abzeichen, Merken, Teilen, Neu seit letztem Besuch --- */
window.evKey=(p,e)=>p.id+"|"+(e.dt0||e.dt)+"|"+e.t+"|"+e.ti;
const prevSeen=LS.get("hwkp-seen",null), lastVisit=LS.get("hwkp-last",null);
window.EVNEW=new Set();const allKeys=[];PLACES.forEach(p=>p.up.forEach(e=>{const k=evKey(p,e);allKeys.push(k);if(prevSeen&&!prevSeen.includes(k))EVNEW.add(k)}));
setTimeout(()=>{LS.set("hwkp-seen",[...new Set([...(prevSeen||[]),...allKeys])].slice(-6000));LS.set("hwkp-last",T0)},4000);
window.NEWONLY=false;
if(EVNEW.size){$("newTogL").hidden=false;$("newCnt").textContent=EVNEW.size+" neu"+(lastVisit?" seit "+fmtDate(lastVisit):"")}
$("newTog").addEventListener("change",e=>{window.NEWONLY=e.target.checked;renderEvMap();renderNewBar()});
function renderNewBar(){const b=$("newBar");if(!b)return;if(!EVNEW.size){b.hidden=true;return}b.hidden=false;
  b.innerHTML=`<span>🆕 <b>${EVNEW.size} neue Termine</b> seit eurem letzten Besuch${lastVisit?" am "+fmtDate(lastVisit).replace(/\.$/,""):""}</span><button type="button" data-newonly aria-pressed="${!!window.NEWONLY}">${window.NEWONLY?"Alle Termine zeigen":"Nur neue zeigen"}</button>`}
document.addEventListener("click",e=>{if(!e.target.closest("[data-newonly]"))return;window.NEWONLY=!window.NEWONLY;$("newTog").checked=window.NEWONLY;renderEvMap();renderNewBar()});
const days=dt=>Math.round((pdate(dt)-TODAY)/864e5);
const hsh=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return "w"+(h>>>0).toString(36)};
const evWished=k=>!!ST.evw[hsh(k)];window.plusWished=evWished;
function toggleWish(k){const id=hsh(k);if(ST.evw[id]){delete ST.evw[id];write("evwish/"+id,null)}else{const o={k,at:Date.now()};if(MYID)o.by=MYID;ST.evw[id]=o;write("evwish/"+id,o)}persistLocal();if(!window.KIDS_ON)refresh()}
window.plusKidEv=()=>{const kidOk=e=>{if(!FAM.kids.length)return true;const r=evAgeRange(e);return !r||FAM.kids.some(k=>k>=r[0]&&k<=r[1])};
  const seen=new Set(),L=allEvs(PLACES.filter(p=>p.km<=45)).filter(x=>x.p.km<=45&&x.e.dt<=plus(13)&&(x.e.to||x.e.dt)>=T0&&!x.e.rg&&!FULL.test(x.e.no||"")&&kidOk(x.e)).filter(x=>{const k=x.p.id+"|"+x.e.ti;if(seen.has(k))return false;seen.add(k);return true});
  L.sort((a,b)=>(evWished(evKey(b.p,b.e))-evWished(evKey(a.p,a.e)))||(a.e.dt<T0?T0:a.e.dt).localeCompare(b.e.dt<T0?T0:b.e.dt));
  if(!L.length)return"";
  const ico=x=>{try{const c=evCats(x.p,x.e);const z=c.length&&EVK.find(q=>q[0]===c[0]);return z?z[1]:"🎉"}catch(_){return"🎉"}};
  const dn=x=>{const s=x.e.dt<T0?T0:x.e.dt;return (Math.round((pdate(s)-TODAY)/864e5)<7?kDayName(s):WDL[pdate(s).getDay()]+" "+pdate(s).getDate()+".")+(x.e.to?" bis "+pdate(x.e.to).getDate()+"."+(pdate(x.e.to).getMonth()+1)+".":x.e.t?" · "+x.e.t+" Uhr":"")};
  return `<h3>🎉 Was ist los?</h3><p class="khint">Tippe auf ☆, wenn du da hin möchtest – Mama und Papa sehen deinen Wunsch.</p><div class="kevg">${L.slice(0,14).map(x=>{const k=evKey(x.p,x.e),on=evWished(k);
    return `<article class="kevc${on?" on":""}"><span class="ki" aria-hidden="true">${ico(x)}</span><button type="button" class="kws" data-kw="${esc(k)}" aria-pressed="${on}" aria-label="${on?"Wunsch wegnehmen":"Da will ich hin"}: ${esc(x.e.ti)}">${on?"⭐":"☆"}</button><span class="kd">${esc(dn(x))}</span><span class="kt">${esc(x.e.ti)}</span><span class="kp">${esc(x.p.n)} · ${x.p.bike&&x.p.bike<=15?"🚲 "+x.p.bike:"🚗 "+x.p.car} Min.</span></article>`}).join("")}</div>`};
$("kEv").addEventListener("click",e=>{const b=e.target.closest("[data-kw]");if(!b)return;toggleWish(b.dataset.kw);const on=evWished(b.dataset.kw);b.setAttribute("aria-pressed",String(on));b.textContent=on?"⭐":"☆";b.closest(".kevc").classList.toggle("on",on)});
window.plusEvBadge=(p,e)=>{const b=[];if(EVNEW.has(evKey(p,e)))b.push(`<span class="newtag">NEU</span>`);if(evWished(evKey(p,e)))b.push(`<span class="kidwish" title="In der Kinderansicht gewünscht">⭐ Kinderwunsch</span>`);
  if(e.an&&!FULL.test(e.no)){const m=(e.no||"").match(/Anmeldung bis ([^,;·]+)/i);if(m)b.push(`<span class="soontag">⏳ Anmeldung bis ${esc(m[1].trim())}</span>`);else if(days(e.dt)<=14&&!e.rg)b.push(`<span class="soontag">⏳ bald – jetzt anmelden</span>`)}
  return b.length?" "+b.join(" "):""};
window.inPlanEv=k=>Object.values(ST.plans).some(v=>(v.items||[]).some(x=>x.type==="ev"&&x.k===k));
window.plusEvActs=(p,e)=>{const k=evKey(p,e),pl=Object.values(ST.plans).some(v=>(v.items||[]).some(x=>x.type==="ev"&&x.k===k));
  return `<button type="button" class="pmini" data-evplan="${p.id}" data-k="${esc(k)}" aria-pressed="${pl}" title="${pl?"Im Ausflugsplan – antippen zum Entfernen":"In den Ausflugsplan"}">${IC.pin}${pl?"Eingeplant":"Einplanen"}</button>${window.plusMaybeBtn(p,e)}<button type="button" class="pmini" data-evshare="${p.id}" data-k="${esc(k)}">${IC.share}Teilen</button>`};
const findEv=(id,k)=>{const p=byId(id);return p?[p,p.up.find(e=>evKey(p,e)===k)]:[null,null]};
document.addEventListener("click",e=>{const a=e.target.closest("[data-evplan],[data-evshare]");if(!a)return;e.preventDefault();e.stopPropagation();
  const [p,ev]=findEv(+(a.dataset.evplan||a.dataset.evshare),a.dataset.k);if(!p||!ev)return;
  if(a.dataset.evshare){share(evText(p,ev));return}
  const k0=a.dataset.k,planned=Object.values(ST.plans).some(v=>(v.items||[]).some(x=>x.k===k0));
  if(ev.to&&!planned){openPickEv(p,ev,a);return}
  toggleEvPlan(p,ev);const on=Object.values(ST.plans).some(v=>(v.items||[]).some(x=>x.k===a.dataset.k));a.setAttribute("aria-pressed",String(on));a.innerHTML=a.classList.contains("elpin")?IC.pin:IC.pin+(on?"Eingeplant":"Einplanen")},true);
/* --- Ausflugsplan --- */
const planDay=()=>{const d=(typeof WXDAY!=="undefined"&&WXDAY>=T0)?WXDAY:T0;return d};
function planDateOf(id){return Object.keys(ST.plans).find(d=>(ST.plans[d].items||[]).some(x=>x.type==="place"&&x.id===id))}
function togglePlacePlan(p,dt0){const dt=dt0||planDay(),items=((ST.plans[dt]||{}).items||[]).slice();const i=items.findIndex(x=>x.type==="place"&&x.id===p.id);
  if(i>=0){items.splice(i,1);toast("Aus dem Ausflugsplan entfernt")}else{const ev=tripEv(p,dt);items.push(stamp({type:"place",id:p.id,k:"p"+p.id,t:ev.t,te:ev.te2}));toast("📌 Im Ausflugsplan für "+dayLabel(dt))}
  // andere Tage: Ort dort entfernen, wenn er schon eingeplant war
  if(i<0)for(const d in ST.plans)if(d!==dt&&(ST.plans[d].items||[]).some(x=>x.type==="place"&&x.id===p.id)){setPlan(d,ST.plans[d].items.filter(x=>!(x.type==="place"&&x.id===p.id)))}
  setPlan(dt,items)}
function toggleEvPlan(p,e,dt0){const k=evKey(p,e);let dt=dt0||e.dt;if(!dt0){const f=Object.keys(ST.plans).find(d=>(ST.plans[d].items||[]).some(x=>x.k===k));if(f)dt=f}const items=((ST.plans[dt]||{}).items||[]).slice();const i=items.findIndex(x=>x.k===k);
  if(i>=0){items.splice(i,1);toast("Aus dem Ausflugsplan entfernt")}else{items.push(stamp({type:"ev",id:p.id,k,t:e.t||"",te:e.te2||""}));toast("📌 Im Ausflugsplan für "+fmtDate(dt))}setPlan(dt,items)}
function stamp(o){o.at=Date.now();if(MYID)o.by=MYID;return o}
function resolveProfiles(ids){if(SB||!window.claude)return;ids=[...new Set(ids)].filter(i=>i&&!(i in PROF));if(!ids.length||!UAPI||!UAPI.profiles)return;ids.forEach(i=>PROF[i]=null);
  UAPI.profiles(ids).then(ps=>{let ch=false;for(const i in ps){PROF[i]=ps[i];ch=true}if(ch)renderPlan()}).catch(()=>{})}
function byTag(x){if(!x.by)return"";if(SB||!window.claude){if(/^u_/.test(x.by))return"";const me=x.by===MYID,nm=String(x.by);let h=0;for(const c of nm)h=(h*31+c.charCodeAt(0))>>>0;const col=["#0E6A61","#9A3B62","#5B4FC4","#B4532A","#2F6DB5","#7A5444"][h%6];
    return `<span class="pby" style="background:${col}" title="Eingeplant von ${esc(me?"dir":nm)}">${esc(me?"Du":nm.trim().split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase())}</span>`}
  const pr=PROF[x.by];if(!pr)return"";const me=x.by===MYID,nm=pr.name||"";
  const ini=me?"Du":nm?nm.trim().split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase():"?";
  return `<span class="pby" style="background:${esc(pr.color||"#7A8A87")}" title="Eingeplant von ${esc(me?"dir":(nm||"jemand anderem"))}">${esc(ini)}</span>`}
const isNewPlan=x=>!!(x.by&&x.by!==MYID&&(x.at||0)>PSEEN);
let PDAY=null;
function planItems(dt){return((ST.plans[dt]||{}).items||[]).map(x=>{const p=byId(x.id);if(!p)return null;if(x.type==="ev"){const ev=p.up.find(e=>evKey(p,e)===x.k);if(!ev)return null;return{x,p,ev,t:x.t,ti:ev.ti}}return{x,p,t:x.t,ti:"Ausflug: "+p.n}}).filter(Boolean).sort((a,b)=>(a.t||"99").localeCompare(b.t||"99"))}
function planEntries(){const out=[];Object.keys(ST.plans).sort().forEach(d=>{if(d<T0)return;planItems(d).forEach(o=>out.push(Object.assign({d},o)))});return out}
function rangeOf(o){const e=o.ev;if(!e||!e.to)return null;const a=(e.dt0||e.dt);return[a<T0?T0:a,e.to]}
const toM=t=>{const[h,m]=String(t).split(":").map(Number);return h*60+(m||0)},fmM=m=>{m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0")};
function hav(a,b){if(a.lat==null||b.lat==null)return 0;const R=6371,r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lng-a.lng)*r,s=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(s))}
function dayPlan(L){const info={},segs=[];let prev=null;
  L.forEach(o=>{if(!o.t)return;const s=toM(o.t);let e=o.x.te?toM(o.x.te):(o.ev&&o.ev.te2?toM(o.ev.te2):s+(o.ev?90:Math.round((o.p.stay||2)*60)));if(e<=s)e=s+60;
    const inf={s,e};
    if(prev){const same=prev.p===o.p||hav(prev.p,o.p)<0.3,dm=same?0:Math.round(hav(prev.p,o.p)*1.3/40*60+5);inf.dm=dm;inf.from=prev.p.n;inf.leave=s-dm;
      const free=s-prev.e;if(free<0)inf.warn=`Überschneidet sich mit „${prev.ti}“ (bis ca. ${fmM(prev.e)} Uhr)`;else if(free<dm)inf.warn=`Knapp: nur ${free} Min. nach „${prev.ti}“, Fahrt dauert ca. ${dm} Min.`;
      if(dm&&free>=0)segs.push({a:prev.e,b:prev.e+Math.min(dm,Math.max(free,dm)),c:"d"})}
    else{inf.home=true;inf.leave=s-o.p.car;segs.push({a:s-o.p.car,b:s,c:"d"})}
    segs.push({a:s,b:e,c:o.ev?"e":"z",ti:o.ti,x:!!inf.warn});info[o.x.k]=inf;prev={p:o.p,e,ti:o.ti}});
  const last=L.filter(o=>o.t).pop();if(last){const i=info[last.x.k];segs.push({a:i.e,b:i.e+last.p.car,c:"d"});i.back=i.e+last.p.car}
  const lo=Math.min(480,...segs.map(g=>Math.floor(g.a/120)*120)),hi=Math.max(1200,...segs.map(g=>Math.ceil(g.b/120)*120)),pc=m=>Math.max(0,Math.min(100,(m-lo)/(hi-lo)*100));
  const lab=[];for(let m=lo;m<=hi;m+=120)lab.push(m/60);
  const tl=segs.length?`<div class="ptl" aria-hidden="true">${segs.map(g=>{const l=pc(g.a),w=pc(g.b)-l;return w>0?`<span class="b ${g.c}${g.x?" x":""}" style="left:${l}%;width:${w}%" title="${g.ti?esc(g.ti)+" ":""}${fmM(g.a)}–${fmM(g.b)}">${g.ti&&w>9?esc(g.ti.replace(/^Ausflug: /,"")):""}</span>`:""}).join("")}</div><div class="ptls">${lab.map((h,i)=>`<span>${h}${i===lab.length-1?" Uhr":""}</span>`).join("")}</div><div class="pleg2">Schraffiert: Fahrzeit (geschätzt: Luftlinie × 1,3 bei 40 km/h)${last?` · zurück in Rhen ca. ${fmM(info[last.x.k].back)} Uhr`:""}</div>`:"";
  return {info,tl}}
const dep=(t,p)=>{if(!t)return"–";const[h,m]=t.split(":").map(Number);const s=h*60+m-p.car;return String(Math.floor(s/60)).padStart(2,"0")+":"+String(((s%60)+60)%60).padStart(2,"0")};
function pdet(o){const {p,ev,d}=o;
  if(ev){const full=FULL.test(ev.no||""),link=ev.u||p.cal||p.web,kind=ev.an?(full?"voll / Warteliste":evKind(ev)==="tix"?"🎟️ Tickets nötig":"✍️ Anmeldung nötig"):"";
    const lt=ev.u?(ev.an?(full?"Warteliste / Details":evKind(ev)==="tix"?"Tickets kaufen":"Zur Anmeldung"):"Details"):(p.cal?"Programmseite":"Website");
    return `<div class="pdet">${ev.t?`<span>🕑 ${esc(ev.t)}${ev.te?"–"+esc(ev.te):""} Uhr</span>`:""}${kind?`<span>${kind}</span>`:""}${ev.rg?`<span>regelmäßig: ${esc(ev.rg)}</span>`:""}${ev.no?`<span>${esc(ev.no)}</span>`:""}${link?`<a href="${link}" target="_blank" rel="noopener">${lt} ↗</a>`:""}<a href="${ROUTE(p)}" target="_blank" rel="noopener">Route ↗</a></div>`}
  const sp=p.h?p.h[DIDX(pdate(d))]:null,fc=famCost(p);
  return `<div class="pdet">${p.d?`<span>${esc(p.d.length>160?p.d.slice(0,158)+"…":p.d)}</span>`:""}${p.h?`<span>${sp&&!closedSeason(p)?"🕑 geöffnet "+esc(fmtSpan(sp)):"⚠️ laut Öffnungszeiten geschlossen"}</span>`:""}${p.pk==="free"?`<span>🆓 kostenlos</span>`:fc!=null&&fc>0?`<span>💶 ca. ${esc(fmtEur(fc,p.pest))} für eure Familie</span>`:""}${p.web?`<a href="${p.web}" target="_blank" rel="noopener">${p.ws?"Website suchen":"Website"} ↗</a>`:""}<a href="${ROUTE(p)}" target="_blank" rel="noopener">Route ↗</a></div>`}
function prow(o,light,inf){const {x,p,ev,t,ti,d}=o,e=ev||tripEv(p,d),r=rangeOf(o);
  const go=light||!t?"":inf&&inf.dm!=null&&!inf.home?(inf.dm?` · weiter ab ${esc(inf.from)} ca. ${fmM(inf.leave)} (${inf.dm} Min.)`:" · gleicher Ort"):` · Abfahrt ca. ${dep(t,p)}`;
  return `<div class="prow ${ev?"pe":"pz"}${light?" plight":""}"><div style="min-width:0"><div class="t">${esc(ti)}${byTag(x)}${isNewPlan(x)?`<span class="pnew">neu</span>`:""}</div><div class="p">${ev?esc(p.n)+" · ":""}${esc(p.a.split(",").pop().trim())} · 🚗 ${p.car} Min.${go}</div>${!light&&inf&&inf.warn?`<div class="pwarn">⚠️ ${esc(inf.warn)}</div>`:""}${light?"":pdet(o)}
    ${r?`<div class="prange">↔ läuft ${fmtDate(r[0])} – ${fmtDate(r[1])}${light?` · <b>bevorzugt ${esc(fmtDate(d))}</b>`:""}</div>${light?`<button type="button" class="pmove" data-move="${esc(x.k)}" data-from="${d}" data-to="${PDAY}">${IC.pin}Lieber an diesem Tag</button>`:`<label class="ppref">⭐ Bevorzugter Tag <input type="date" data-pref="${esc(x.k)}" data-d="${d}" min="${r[0]}" max="${r[1]}" value="${d}"></label>`}`:""}${light?"":`<label class="ptime">🕑 <input type="time" value="${t||""}" data-pt="${esc(x.k)}" data-d="${d}" aria-label="Uhrzeit ${esc(ti)}"></label>`}</div>
    <div class="pr">${light?"":`<a href="${gcal(p,Object.assign({},e,{t:t||e.t,dt:d,to:null}),false)}" target="_blank" rel="noopener" title="In Google Kalender">📅</a><button type="button" data-prm="${esc(x.k)}" data-d="${d}" aria-label="Entfernen">✕</button>`}</div></div>`}
function movePlan(k,from,to){if(from===to)return;const it=((ST.plans[from]||{}).items||[]).find(x=>x.k===k);if(!it)return;
  const rest=((ST.plans[from]||{}).items||[]).filter(x=>x.k!==k),dest=((ST.plans[to]||{}).items||[]).filter(x=>x.k!==k).concat([it]);
  if(rest.length)ST.plans[from]={items:rest};else delete ST.plans[from];write("plans/"+from,rest.length?{items:rest}:null);setPlan(to,dest);toast("⭐ Bevorzugt: "+fmtDate(to))}
let INF={},KI=0,KSIG="",KL=[];
function renderPlan(){if(M2!=="plan")return;const E=planEntries();renderWE();renderMaybe();
  INF={};const DP={};[...new Set(E.map(o=>o.d))].forEach(dd=>{DP[dd]=dayPlan(E.filter(o=>o.d===dd));Object.assign(INF,Object.fromEntries(Object.entries(DP[dd].info).map(([k,v])=>[dd+"|"+k,v])))});
  const I=o=>INF[o.d+"|"+o.x.k];resolveProfiles(E.map(o=>o.x.by));
  if(!CALM)CALM=(PDAY||(E[0]?E[0].d:T0)).slice(0,7);if(CALM<T0.slice(0,7))CALM=T0.slice(0,7);renderPCal(E);
  const [y,m]=CALM.split("-").map(Number);let h="",head="";
  if(PDAY){const L=E.filter(o=>o.d===PDAY),R=E.filter(o=>{const r=rangeOf(o);return o.d!==PDAY&&r&&r[0]<=PDAY&&PDAY<=r[1]});
    const BZ=ST.busy[PDAY];
    head=`<div class="pdhead"><div class="pdt"><b>${WDL[pdate(PDAY).getDay()]}, ${pdate(PDAY).getDate()}. ${MONL[pdate(PDAY).getMonth()]}</b><button type="button" class="pall" data-pall>← ${MONL[m-1]}</button></div>${PDAY>=T0&&!BZ?`<div class="pdacts"><button type="button" class="pmini pexp" data-explore="${PDAY}">🔭 Für diesen Tag entdecken</button><button type="button" class="pmini busybtn" data-busy="${PDAY}">⛔ Anderweitig verplant</button></div>`:""}</div>`
      +(PDAY>=T0&&BZ?`<div class="busyban"><span>⛔ <b>Anderweitig verplant</b></span><input type="text" class="busynote" data-busynote="${PDAY}" value="${esc(BZ.note||"")}" placeholder="Notiz, z. B. Geburtstag Oma" maxlength="60" aria-label="Notiz"><button type="button" class="pmini" data-busy="${PDAY}">Wieder freigeben</button></div>`:"");
    const MBL=PDAY>=T0?maybeOn(PDAY):[];const busyHtml=MBL.length?`<div class="pmbday"><div class="psub">♡ Vielleicht an diesem Tag</div>${MBL.map(x=>mbRow(x,"d")).join("")}</div>`:"";
    h=(window.homeDay&&!BZ?homeDay(PDAY,L):"")+busyHtml+(L.length?L.map(o=>{const i=I(o);return (i&&i.dm?`<div class="pdrive">🚗 ca. ${i.dm} Min. Fahrt</div>`:"")+prow(o,false,i)}).join("")+(PDAY>=T0&&!BZ?(SUGOPEN?daySug(PDAY,"💡 Was passt noch dazu?"):`<button type="button" class="pall sugmore" data-sugopen>💡 Weitere Vorschläge für diesen Tag</button>`):"")
      :(PDAY>=T0?(BZ?"":`<div class="sugfree">🟢 Noch frei – unsere Vorschläge:</div>`+daySug(PDAY)):`<div class="evempty">An diesem Tag war nichts geplant.</div>`))+(R.length?`<div class="psub">Läuft an diesem Tag auch – an einem anderen Tag bevorzugt:</div>`+R.map(o=>prow(o,true)).join(""):"");
  }else{const L=PALL?E:E.filter(o=>o.d.startsWith(CALM));
    const MS=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];const mons=[...new Set(E.map(o=>o.d.slice(0,7)).concat([CALM]))].sort();
    const tog=`<span class="pmode" role="group" aria-label="Monat oder alle">${mons.map(ym=>{const [yy,mm]=ym.split("-").map(Number);return `<button type="button" data-pmon="${ym}" aria-pressed="${!PALL&&ym===CALM}" title="${MONL[mm-1]} ${yy}">${MS[mm-1]}${yy!==TODAY.getFullYear()?" "+String(yy).slice(2):""}</button>`}).join("")}<button type="button" data-pmode="a" aria-pressed="${PALL}">Alle</button></span>`;
    head=`<b>${PALL?"Alles Geplante":"Alles im "+MONL[m-1]+" "+y}</b>${tog}<span class="pcnt">${L.length} ${L.length===1?"Eintrag":"Einträge"}</span>`;
    let last="",lm="";L.forEach(o=>{if(PALL&&o.d.slice(0,7)!==lm){lm=o.d.slice(0,7);const [yy,mm]=lm.split("-").map(Number);h+=`<h3 class="pmh">${MONL[mm-1]} ${yy}</h3>`}if(o.d!==last){const nw=Object.values(DP[o.d]?DP[o.d].info:{}).filter(v=>v.warn).length;h+=`<h4 class="pdh">${o.d===T0?"Heute · ":o.d===plus(1)?"Morgen · ":""}${fmtDate(o.d)}${nw?` <span class="pwarn" style="display:inline">⚠️ ${nw===1?"1 Überschneidung":nw+" Überschneidungen"}</span>`:""}</h4>`;last=o.d}h+=prow(o,false,I(o))});
    if(!L.length)h=PALL?`<div class="evempty">Noch nichts geplant. Bei Zielen und Terminen „Einplanen“ antippen.</div>`:`<div class="evempty">Im ${MONL[m-1]} ist noch nichts geplant. Bei Zielen und Terminen „Einplanen“ antippen.</div>`}
  $("pHead").innerHTML=head;$("pList").innerHTML=h;{const pf=$("pFair");if(pf&&window.homeFairMini)pf.innerHTML=homeFairMini()}
  KL=PDAY?E.filter(o=>o.d===PDAY):PALL?E:E.filter(o=>o.d.startsWith(CALM));const sig=KL.map(o=>o.d+o.x.k).join(",");if(sig!==KSIG){KSIG=sig;KI=0}renderStep();updateFabs()}
function calUrl(o){const e=o.ev||tripEv(o.p,o.d);return gcal(o.p,Object.assign({},e,{t:o.t||e.t,te2:o.x.te||e.te2,dt:o.d,to:null}),false)}
function renderStep(){const a=$("pCalStep");if(!a)return;const n=KL.length;a.hidden=!n;if(!n)return;
  if(KI>=n){a.removeAttribute("href");a.innerHTML=`✓ Alle ${n} im Kalender <small>· nochmal</small>`;return}
  a.href=calUrl(KL[KI]);a.innerHTML=KI===0?`📅 ${n===1?"In den Kalender":"Alle "+n+" in den Kalender"} <small>(1/${n})</small>`:`📅 Nächsten eintragen <small>(${KI+1}/${n})</small>`;
  a.title=KL[KI].ti+" – "+fmtDate(KL[KI].d)}
{const c=$("pCopy");if(c){const a=document.createElement("a");a.id="pCalStep";a.className="pbtn pcalstep";a.target="_blank";a.rel="noopener";a.hidden=true;c.parentNode.insertBefore(a,c);
  a.addEventListener("click",e=>{if(KI>=KL.length){e.preventDefault();KI=0;renderStep();return}setTimeout(()=>{KI++;renderStep();if(KI<KL.length)toast("Eingetragen? Dann den nächsten Termin antippen");else toast("Fertig – alle Termine an Google Kalender übergeben")},80)})}}
function planText(dt){const L=planItems(dt),d=pdate(dt);return `Ausflugsplan ${WDL[d.getDay()]}, ${d.getDate()}. ${MONL[d.getMonth()]}\n`+L.map(({p,ev,t,ti})=>`${t||"--:--"}  ${ti}${ev?" ("+p.n+")":""}\n       ${p.a} · Auto ca. ${p.car} Min.`).join("\n")}
let CALM=null,PALL=false;
function renderPCal(E){const EVN=evAllNear(),MBD={};maybeEntries().forEach(x=>{if(x.ev&&!x.ev.to&&!x.planned)(MBD[x.ev.dt]=MBD[x.ev.dt]||[]).push(x)});const [y,m]=CALM.split("-").map(Number),first=new Date(y,m-1,1),off=(first.getDay()+6)%7,n=new Date(y,m,0).getDate();
  const iso=d=>y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0");let h=["Mo","Di","Mi","Do","Fr","Sa","So"].map((w,i)=>`<span class="wd${i>4?" we":""}${i===5?" sa":""}">${w}</span>`).join("")+"<span></span>".repeat(off);
  for(let d=1;d<=n;d++){const s=iso(d),c=E.filter(o=>o.d===s).length,rg=E.filter(o=>{const r=rangeOf(o);return o.d!==s&&r&&r[0]<=s&&s<=r[1]}).length,
    dw=pdate(s).getDay(),bz=!!ST.busy[s],wef=!bz&&s>=T0&&(window.FREEDAYS?FREEDAYS.has(dw):(dw===0||dw===6))&&!c,wx=(typeof WXD!=="undefined"&&WXD)?WXD.find(x=>x.dt===s):null,
    cl=[s>=T0&&window.homeBlockDay&&homeBlockDay(s)?"hblk":"",s<T0?"past":"",s===T0?"today":"",c?"has":"",!c&&rg?"rng":"",wef?"wefree":"",bz?"obusy":"",dw===6?"sa":"",dw===6||dw===0?"wkend":""].filter(Boolean).join(" "),
    mb=(MBD[s]||[]).length,hn=s>=T0&&window.homeDots?homeDots(s):0,hb=window.homeBlockDay&&homeBlockDay(s),dots=E.filter(o=>o.d===s).map(o=>`<b class="cd ${o.ev?"e":"z"}"></b>`).concat((MBD[s]||[]).map(()=>`<b class="cd m"></b>`)).concat(hn?[`<b class="cd h"></b>`]:[]).slice(0,3).join("");
    h+=`<button type="button" data-cal="${s}" class="${cl}" aria-pressed="${s===PDAY}" title="${bz?esc("Anderweitig verplant"+(ST.busy[s].note?": "+ST.busy[s].note:"")):mb?esc("♡ Vielleicht: "+MBD[s].map(x=>x.ev.ti).join(", ")):wef?esc(dayTip(s,EVN)||"frei"):""}" aria-label="${fmtDate(s)}${bz?", anderweitig verplant":""}${wef?", freier Ausflugstag":""}${c?", "+c+" geplant":""}${rg?", "+rg+" mehrtägig":""}${mb?", "+mb+" vielleicht":""}"${s<T0?" disabled":""}>${d}${wx&&s>=T0?`<em>${wxIcon(wx.rain,wx.code,wx.hi)}</em>`:""}${c||mb||hn?`<i class="cds">${dots}</i>`:bz?`<i class="cbz">⛔</i>`:rg?`<i class="r">┄</i>`:""}</button>`}
  const can=CALM>T0.slice(0,7);
  $("pCal").innerHTML=`<div class="pcalh"><button type="button" data-calm="-1" aria-label="Vorheriger Monat"${can?"":" disabled"}>‹</button><span>${MONL[m-1]} ${y}</span><button type="button" data-calm="1" aria-label="Nächster Monat">›</button></div><div class="pcalq"><button type="button" data-jump="today">Heute</button><button type="button" data-jump="free">Nächstes freies Wochenende</button></div><div class="pcalg">${h}</div><div class="pleg2"><span><b class="cd z"></b>Ziel</span><span><b class="cd e"></b>Veranstaltung</span><span><b class="cd m"></b>Vielleicht</span><span><b class="cd h"></b>Zuhause</span><span><i class="lgf"></i>frei</span><span><i class="lg5"></i>anderweitig verplant</span><span><i class="lgr">┄</i>mehrtägig</span></div>`;
  renderNext(E)}
function renderNext(E){const el=$("pNext");if(!el)return;const N=E.filter(o=>o.d>=T0).slice(0,5);
  el.innerHTML=`<h4>Nächste Ausflüge</h4>`+(N.length?N.map(o=>`<button type="button" class="nxrow" data-cal="${o.d}"><span class="nxd">${o.d===T0?"Heute":o.d===plus(1)?"Morgen":fmtDate(o.d)}${o.t?`<small>${esc(o.t)}</small>`:""}</span><span class="nxt"><b class="cd ${o.ev?"e":"z"}"></b>${esc(o.ti.replace(/^Ausflug: /,""))}</span></button>`).join(""):`<p class="pvsub">Noch nichts eingeplant.</p>`)}
function openPlan(){setM2("plan")}
window.renderPlanNow=()=>renderPlan();
$("planView").addEventListener("click",e=>{
  const wc=e.target.closest("[data-wed]");if(wc){PALL=false;PDAY=wc.dataset.wed;CALM=PDAY.slice(0,7);renderPlan();const c=$("pHead");c&&c.scrollIntoView({behavior:"smooth",block:"start"});return}
  const ex=e.target.closest("[data-explore]");if(ex){exploreDay(ex.dataset.explore);return}
  const se=e.target.closest("[data-sugev]");if(se){const [p,ev]=findEv(+se.dataset.sugev,se.dataset.k);if(p&&ev)toggleEvPlan(p,ev,se.dataset.d);return}
  const sp=e.target.closest("[data-sugpl]");if(sp){const p=byId(+sp.dataset.sugpl);if(p)togglePlacePlan(p,sp.dataset.d);return}
  const mp=e.target.closest("[data-mbplan]");if(mp){const o=ST.maybe[mp.dataset.mbplan];if(!o)return;const p=byId(o.id);if(!p)return;
    if(o.type==="ev"){const ev=p.up.find(x=>evKey(p,x)===o.k);if(!ev)return;if(ev.to)openPickEv(p,ev,null);else toggleEvPlan(p,ev)}else openPick(p);return}
  const md=e.target.closest("[data-mbdet]");if(md){const k=md.dataset.mbdet;MBOPEN.has(k)?MBOPEN.delete(k):MBOPEN.add(k);renderPlan();return}
  const mx=e.target.closest("[data-mbx]");if(mx){const o=ST.maybe[mx.dataset.mbx];if(o)toggleMaybe(o);return}
  const pm=e.target.closest("[data-pmode]");if(pm){PALL=true;PDAY=null;renderPlan();return}
  const pmo=e.target.closest("[data-pmon]");if(pmo){PALL=false;PDAY=null;CALM=pmo.dataset.pmon;renderPlan();return}
  const jp=e.target.closest("[data-jump]");if(jp){PALL=false;SUGOPEN=false;let d=T0;if(jp.dataset.jump==="free"){for(let i=0;i<120;i++){const s=plus(i),w=pdate(s).getDay();if((w===6||w===0)&&!planItems(s).length&&!ST.busy[s]){d=s;break}}}PDAY=d;CALM=d.slice(0,7);renderPlan();const hd=$("pHead");if(hd&&hd.getBoundingClientRect().top>innerHeight*0.7)hd.scrollIntoView({behavior:"smooth",block:"start"});return}
  const c=e.target.closest("[data-cal]");if(c){PALL=false;SUGOPEN=false;PDAY=PDAY===c.dataset.cal?null:c.dataset.cal;if(PDAY)CALM=PDAY.slice(0,7);renderPlan();if(PDAY){const hd=$("pHead");if(hd&&hd.getBoundingClientRect().top>innerHeight*0.7)hd.scrollIntoView({behavior:"smooth",block:"start"})}return}
  if(e.target.closest("[data-sugopen]")){SUGOPEN=true;renderPlan();return}
  const bz=e.target.closest("[data-busy]");if(bz){const d=bz.dataset.busy;if(ST.busy[d]){delete ST.busy[d];write("busy/"+d,null);toast("Tag wieder frei")}else{const o={at:Date.now(),note:""};if(MYID)o.by=MYID;ST.busy[d]=o;write("busy/"+d,o);toast("⛔ "+fmtDate(d)+" anderweitig verplant")}persistLocal();renderPlan();return}
  if(e.target.closest("[data-pall]")){PDAY=null;renderPlan();return}
  const mm=e.target.closest("[data-calm]");if(mm){PALL=false;const [y,m]=CALM.split("-").map(Number),d=new Date(y,m-1+(+mm.dataset.calm),1);CALM=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");PDAY=null;renderPlan();return}
  const mv=e.target.closest("[data-move]");if(mv){movePlan(mv.dataset.move,mv.dataset.from,mv.dataset.to);return}
  const r=e.target.closest("[data-prm]");if(r){const dd=r.dataset.d,all=((ST.plans[dd]||{}).items||[]),ix=all.findIndex(x=>x.k===r.dataset.prm);if(ix<0)return;const it=all[ix];
    const o=planEntries().find(z=>z.d===dd&&z.x.k===it.k),nm=o?o.ti.replace(/^Ausflug: /,""):"Eintrag";
    setPlan(dd,all.filter(x=>x.k!==it.k));
    undoToast(`„${nm}“ am ${fmtDate(dd)} gelöscht`,()=>{const cur=((ST.plans[dd]||{}).items||[]).filter(x=>x.k!==it.k);cur.splice(Math.min(ix,cur.length),0,it);setPlan(dd,cur);toast("↩️ Wiederhergestellt")})}});
/* Regelmäßige Angebote ausblenden / wieder einblenden */
document.addEventListener("click",e=>{const h=e.target.closest("[data-rghide]");if(h){e.preventDefault();e.stopPropagation();const k=h.dataset.rghide;
    HIDRG[k]={ti:h.dataset.ti,pn:h.dataset.pn,rg:h.dataset.rg||"",at:Date.now()};saveHidRg();refreshAllEv();
    undoToast(`„${h.dataset.ti}“ ausgeblendet – wieder einblenden unter ⚙️ Einstellungen`,()=>{delete HIDRG[k];saveHidRg();refreshAllEv()});return}
  const s=e.target.closest("[data-rgshow]");if(s){delete HIDRG[s.dataset.rgshow];saveHidRg();refreshAllEv();toast("↩️ Wird wieder angezeigt")}},true);
function refreshAllEv(){EVCACHE=null;if(typeof renderEvMap==="function")renderEvMap();refresh()}
renderHidRg();
/* Rückgängig-Leiste mit ablaufendem Balken */
const UNDO_MS=6000;let UNDO=null;
function undoToast(msg,fn){let u=$("undoToast");if(!u){u=document.createElement("div");u.id="undoToast";u.className="undot";u.setAttribute("role","status");u.setAttribute("aria-live","polite");document.body.appendChild(u)}
  if(UNDO)clearTimeout(UNDO.t);const tp=$("ptoast");if(tp)tp.hidden=true;
  u.innerHTML=`<span class="umsg"></span><button type="button" class="ubtn">↩️ Rückgängig</button><i class="ubar" style="animation-duration:${UNDO_MS}ms"></i>`;u.querySelector(".umsg").textContent=msg;u.hidden=false;
  const close=()=>{u.hidden=true;UNDO=null};UNDO={t:setTimeout(close,UNDO_MS)};
  u.querySelector(".ubtn").onclick=()=>{clearTimeout(UNDO&&UNDO.t);close();fn()}}
let BNT=null;$("planView").addEventListener("input",e=>{const t=e.target;if(!t.dataset.busynote)return;const d=t.dataset.busynote;clearTimeout(BNT);BNT=setTimeout(()=>{if(!ST.busy[d])return;ST.busy[d]=Object.assign({},ST.busy[d],{note:t.value.trim()});write("busy/"+d,ST.busy[d]);persistLocal()},700)});
$("planView").addEventListener("change",e=>{const t=e.target;
  if(t.dataset.pref&&t.value&&t.value>=t.min&&t.value<=t.max){if(PDAY)PDAY=t.value;CALM=t.value.slice(0,7);movePlan(t.dataset.pref,t.dataset.d,t.value);return}
  if(t.dataset.pt){const dd=t.dataset.d,items=((ST.plans[dd]||{}).items||[]).map(x=>x.k===t.dataset.pt?Object.assign({},x,{t:t.value}):x);setPlan(dd,items)}});
$("pCopy").addEventListener("click",()=>{const ds=PDAY?[PDAY]:[...new Set(planEntries().filter(o=>PALL||o.d.startsWith(CALM)).map(o=>o.d))];share(ds.length?ds.map(planText).join("\n\n"):"Noch nichts geplant.")});

/* --- Datum wählen beim Einplanen --- */
let PICK=null;
function openPick(p){PICK=p;PICKEV=null;$("pkH").textContent="Wann wollt ihr hin?";$("pkOk").innerHTML=IC.pin+"Einplanen";$("pkDate").max="";const d=$("pickdlg");$("pkT").textContent=p.n;$("pkDate").min=T0;$("pkDate").value=planDay();
  const days=(typeof WXD!=="undefined"&&WXD&&WXD.length)?WXD:Array.from({length:7},(_,i)=>({dt:plus(i)}));
  $("pkDays").innerHTML=days.map(x=>{const sp=p.h?p.h[DIDX(pdate(x.dt))]:null,open=p.h?(!!sp&&!closedSeason(p)):null;
    return `<button type="button" class="pkd" data-d="${x.dt}" aria-pressed="${x.dt===planDay()}"><span class="dn">${dayLabel(x.dt)}</span>${x.hi!=null?`<span class="ic" aria-hidden="true">${wxIcon(x.rain,x.code,x.hi)}</span><span class="tp">${Math.round(x.hi)}°</span>`:""}<span class="op ${open===false?"n":"y"}">${open===null?"Zeiten ?":open?"offen":"zu"}</span></button>`}).join("");
  pkInfo();d.showModal?d.showModal():d.setAttribute("open","")}
function pkInfo(){const v=$("pkDate").value,p=PICK;if(!p||!v){$("pkInfo").textContent="";return}
  if(PICKEV){const e=PICKEV.e;document.querySelectorAll("#pkDays .pkd").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.d===v)));
    const ok=v>=e.dt&&v<=e.to;$("pkInfo").innerHTML=ok?`${v>plus(6)?fmtDate(v):dayLabel(v)}: ${esc(e.ti)}${e.t?", ab "+esc(e.t)+" Uhr":""} · läuft bis ${fmtDate(e.to)}`:`Bitte einen Tag zwischen ${fmtDate(e.dt)} und ${fmtDate(e.to)} wählen.`;return}
  const sp=p.h?p.h[DIDX(pdate(v))]:null;document.querySelectorAll("#pkDays .pkd").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.d===v)));
  const ev=p.up.filter(e=>e.dt===v&&!e.rg);
  $("pkInfo").innerHTML=`${dayLabel(v)}${v>plus(6)?" ("+fmtDate(v)+")":""}: ${p.h?(sp&&!closedSeason(p)?"geöffnet "+esc(fmtSpan(sp)):"laut Öffnungszeiten <b>geschlossen</b>"):"Öffnungszeiten unbekannt"}${ev.length?" · 🎉 "+ev.map(e=>(e.t?e.t+" ":"")+esc(e.ti)).join(", "):""}`}
$("pkDays").addEventListener("click",e=>{const b=e.target.closest("[data-d]");if(!b)return;$("pkDate").value=b.dataset.d;pkInfo()});
$("pkDate").addEventListener("change",pkInfo);
$("pkX").addEventListener("click",()=>$("pickdlg").close());$("pkCancel").addEventListener("click",()=>$("pickdlg").close());
$("pickdlg").addEventListener("click",e=>{if(e.target===$("pickdlg"))$("pickdlg").close()});
$("pkOk").addEventListener("click",()=>{const v=$("pkDate").value;if(!PICK||!v||v<T0){$("pkDate").focus();return}
  if(PICKEV){const {e,btn}=PICKEV;if(v<e.dt||v>e.to){$("pkDate").focus();pkInfo();return}toggleEvPlan(PICK,e,v);
    if(btn){btn.setAttribute("aria-pressed","true");btn.innerHTML=btn.classList.contains("elpin")?IC.pin:IC.pin+"Eingeplant"}PICKEV=null;$("pickdlg").close();return}
  togglePlacePlan(PICK,v);$("pickdlg").close()});
let PICKEV=null;
function openPickEv(p,e,btn){PICK=p;PICKEV={e,btn};const d=$("pickdlg");
  $("pkH").textContent="An welchem Tag wollt ihr hin?";$("pkT").textContent=e.ti+" – "+p.n+" (bis "+fmtDate(e.to)+")";$("pkOk").innerHTML=IC.pin+"Einplanen";
  const from=e.dt<T0?T0:e.dt;$("pkDate").min=from;$("pkDate").max=e.to;
  const wx={};if(typeof WXD!=="undefined"&&WXD)WXD.forEach(x=>wx[x.dt]=x);
  const days=[];for(let i=0;i<14;i++){const s=plus(Math.round((pdate(from)-TODAY)/864e5)+i);if(s>e.to)break;days.push(s)}
  const pre=(typeof WXDAY!=="undefined"&&WXDAY>=from&&WXDAY<=e.to)?WXDAY:from;$("pkDate").value=pre;
  $("pkDays").innerHTML=days.map(s=>{const x=wx[s];return `<button type="button" class="pkd" data-d="${s}" aria-pressed="${s===pre}"><span class="dn">${dayLabel(s)}</span>${x&&x.hi!=null?`<span class="ic" aria-hidden="true">${wxIcon(x.rain,x.code,x.hi)}</span><span class="tp">${Math.round(x.hi)}°</span>`:`<span class="tp">${pdate(s).getDate()}.${pdate(s).getMonth()+1}.</span>`}<span class="op y">offen</span></button>`}).join("");
  pkInfo();d.showModal?d.showModal():d.setAttribute("open","")}
/* --- Schwebende Knöpfe: Ausflugsplan, Filter (Handy) --- */
function planCount(){return planEntries().length}
window.updateFabs=()=>updateFabs();
function updateFabs(){const n=planCount(),nw=planEntries().some(o=>isNewPlan(o.x));const nn=$("navPlanN");if(nn){nn.textContent="";nn.title=nw?"Neu im Plan":"";nn.classList.toggle("dot",!!nw)}renderNewBar();
  const a=(typeof AF!=="undefined"&&AF.length)?[String(AF.length)]:null;$("fabFilter").innerHTML=`${IC.filter}Filter${a?` <span class="fc">${a[0]}</span>`:""}`;
  $("fabs").hidden=!!window.KIDS_ON}
$("fabPlan").addEventListener("click",openPlan);
const MQ=matchMedia("(max-width:900px)");
function sheet(open){document.body.classList.toggle("sheetopen",open);if(open)((typeof MT!=="undefined"&&MT!=="ziele")?$("evFilters"):$("filters")).open=true;$("sheetBack").hidden=!open}
window.sheet=sheet;
$("fabFilter").addEventListener("click",()=>sheet(true));
$("sheetBack").addEventListener("click",()=>sheet(false));
$("sheetDone").addEventListener("click",()=>sheet(false));
if($("evSheetDone"))$("evSheetDone").addEventListener("click",()=>sheet(false));
if($("evFilters"))$("evFilters").querySelector("summary").addEventListener("click",e=>{if(document.body.classList.contains("sheetopen")){e.preventDefault();sheet(false)}});
$("filters").querySelector("summary").addEventListener("click",e=>{if(document.body.classList.contains("sheetopen")){e.preventDefault();sheet(false)}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("sheetopen"))sheet(false)});
/* --- Top 3 für den gewählten Tag --- */
function topFor(dt,list){return topForAll(dt).slice(0,3)}
function topForAll(dt){const d=(typeof WXD!=="undefined"&&WXD)?WXD.find(x=>x.dt===dt):null,c=d?wxClass(d):null,di=DIDX(pdate(dt));
  const cand=PLACES.filter(p=>!(p.c==="laden"||p.c==="sonst")&&!offSeason(p)&&window.plusMatch(p));
  const sc=p=>{const s=P_(p.id);let v=0,why=[];
    if(p.h){if(!p.h[di])return null;v+=1}else v-=1;
    if(c==="rain"&&p.wx!=="egal")return null;if(c&&c!=="warm"&&p.wx==="warm")return null;if(c==="warm"&&p.io==="draussen")v+=1;if(c==="rain"&&p.io==="drinnen")v+=1;
    if(s.star){v+=4;why.push("⭐ Wunsch der Kinder")}
    if(s.rating>=4){v+=2;why.push("👍 "+s.rating+"/5")}else if(s.visited&&s.rating&&s.rating<3)v-=3;
    if(!s.visited)v+=.5;
    const evs=p.up.filter(e=>e.dt===dt&&!e.rg&&!FULL.test(e.no));if(evs.length){v+=3;why.push("🎉 "+(evs[0].t?evs[0].t+" ":"")+evs[0].ti)}
    if(FAM.kids.length&&FAM.kids.every(k=>k>=p.amin&&k<=p.amax))v+=1.5;
    v-=p.km/15;if(p.km<=10)why.push("🚲/🚗 nah");
    if(p.h&&p.h[di])why.push("offen "+fmtSpan(p.h[di]));
    return {p,v,why}};
  return cand.map(sc).filter(Boolean).sort((a,b)=>b.v-a.v)}
window.plusAfterRender=list=>{if(M2==="heute")setTimeout(renderHeute,0);if(M2==="plan")setTimeout(renderPlan,0);const dt=planDay(),T=topFor(dt,list),d=(typeof WXD!=="undefined"&&WXD)?WXD.find(x=>x.dt===dt):null;
  const el=$("top3");if(!T.length||window.KIDS_ON){el.hidden=true;renderAfMini();return}el.hidden=false;
  $("t3H").textContent=(dt===T0?"Heute los?":dayLabel(dt)+" los?")+" Unsere Top 3";
  $("t3Sub").textContent=el.open?(d?wxIcon(d.rain,d.code,d.hi)+" "+WX[wxClass(d)]+", "+Math.round(d.hi)+"° · ":"")+"passend zu Wetter, Öffnungszeit, Alter und euren Sternen":T.map((x,i)=>(i+1)+". "+x.p.n).join(" · ");
  renderAfMini();
  $("t3Grid").innerHTML=`${T.map(({p,why},i)=>`<div class="t3"><div class="t3n"><span class="t3i">${i+1}</span><button type="button" class="t3go" data-go="${p.id}">${esc(p.n)}</button></div><div class="t3w">${why.slice(0,3).map(esc).join(" · ")}</div><div class="t3a"><span>🚗 ${p.car} Min. · ${Math.round(p.km)} km</span>${(()=>{const pd=planDateOf(p.id);return pd?`<span class="pplan on">${IC.pin}Eingeplant: ${esc(dayLabel(pd))}<button type="button" data-t3un="${p.id}" aria-label="Aus dem Ausflugsplan entfernen">✕</button></span>`:`<button type="button" class="pmini" data-t3plan="${p.id}">${IC.pin}Einplanen</button>`})()}</div></div>`).join("")}`};
try{if(LS.get("hwkp-t3open",!matchMedia("(max-width:900px)").matches)===false)$("top3").open=false}catch(e){}
$("top3").addEventListener("toggle",()=>{LS.set("hwkp-t3open",$("top3").open);window.plusAfterRender([])});
/* Aktive Filter oben am Tab-Balken, sobald der Filterkasten aus dem Bild ist */
let AFVIS=true;
window.renderAfMini=()=>renderAfMini();
function evChipsVis(){const r=$(MT==="ziele"?"zChips":"evChips");if(!r||!r.children.length)return false;const b=r.getBoundingClientRect();return b.bottom>60&&b.top<innerHeight}
addEventListener("scroll",()=>{if(typeof MT!=="undefined"){clearTimeout(window._amT);window._amT=setTimeout(renderAfMini,60)}},{passive:true});
function renderAfMini(){const m=$("afMini");if(!m)return;const ev=typeof MT!=="undefined"&&MT!=="ziele";const show=!evChipsVis()&&typeof AF!=="undefined"&&AF.length&&!window.KIDS_ON;m.hidden=!show;if(!show)return;
  m.innerHTML=`<span class="aml">Filter:</span>`+AF.map((f,i)=>`<button type="button" class="amc" data-i="${i}" title="Filter entfernen"><span><small>${esc(f[0])}:</small> ${esc(f[1].length>28?f[1].slice(0,26)+"…":f[1])}</span> ✕</button>`).join("")+`<button type="button" class="amall" id="amAll">Alle löschen</button>`}
if("IntersectionObserver" in window){new IntersectionObserver(es=>{es.forEach(e=>{AFVIS=e.isIntersecting||$("activeF").hidden&&false;renderAfMini()})},{threshold:0}).observe($("activeF"));const io2=new IntersectionObserver(()=>renderAfMini(),{threshold:0});["zChips","evChips"].forEach(id=>$(id)&&io2.observe($(id)))}
$("afMini").addEventListener("click",e=>{const b=e.target.closest(".amc");if(b){const f=AF[+b.dataset.i];if(f){f[2]();syncControls();render()}return}if(e.target.id==="amAll")$("afClear").click()});
$("top3").addEventListener("click",e=>{const g=e.target.closest("[data-go]");if(g){openEv(g.dataset.go);return}const b=e.target.closest("[data-t3plan]");if(b){openPick(byId(+b.dataset.t3plan));return}const u=e.target.closest("[data-t3un]");if(u){const p=byId(+u.dataset.t3un),d=planDateOf(p.id);if(d)togglePlacePlan(p,d)}});
/* --- Kinderansicht: Vorlesen --- */
$("kGrid").addEventListener("click",e=>{const b=e.target.closest("[data-speak]");if(!b||!window.speechSynthesis)return;const p=byId(+b.dataset.speak);if(!p)return;
  speechSynthesis.cancel();const io=p.io==="drinnen"?"Das ist drinnen.":p.io==="draussen"?"Das ist draußen.":"Das ist drinnen und draußen.";
  const u=new SpeechSynthesisUtterance(`${p.n}. ${kDesc(p)}. ${io} Für Kinder ${p.amin===0?"bis "+p.amax:"von "+p.amin+" bis "+p.amax} Jahre. ${p.bike&&p.bike<=15?p.bike+" Minuten mit dem Fahrrad.":p.car+" Minuten mit dem Auto."}`);
  u.lang="de-DE";u.rate=.95;const v=speechSynthesis.getVoices().find(v=>/^de/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)});

/* ===== Modi: Heute · Entdecken · Unser Plan ===== */
function setM2(m,first){const prev=M2;M2=m;window.M2=m;document.body.dataset.m2=m;if(m!=="heute")document.body.classList.remove("wizon");try{sessionStorage.setItem("hwk-m2",m)}catch(e){}
  $("heuteView").hidden=m!=="heute";$("planView").hidden=m!=="plan";if($("homeView"))$("homeView").hidden=m!=="zuhause";
  document.querySelectorAll("#modeNav [data-m2]").forEach(b=>b.setAttribute("aria-current",b.dataset.m2===m?"page":"false"));
  try{history.replaceState(null,"",m==="heute"?"#heute":m==="plan"?"#plan":m==="zuhause"?"#zuhause":(MT==="ziele"?"#ziele":"#veranstaltungen"))}catch(e){}
  if(prev==="plan"&&m!=="plan"){PSEEN=Date.now();LS.set("hwkp-planseen",PSEEN)}
  if(m==="heute")renderHeute();if(m==="plan"){if(!first||!PDAY){PDAY=null;CALM=null}renderPlan()}if(m==="entdecken"&&prev!==m&&!first){render()}if(m==="zuhause"&&window.renderHomeNow)renderHomeNow();
  if(!first&&prev!==m)scrollTo(0,0);updateFabs()}
window.setM2=setM2;
$("modeNav").addEventListener("click",e=>{const b=e.target.closest("[data-m2]");if(b)setM2(b.dataset.m2)});
const ageFit=e=>{if(!FAM.kids.length)return true;const r=evAgeRange(e);return !r||FAM.kids.some(k=>k>=r[0]&&k<=r[1])};
/* Highlight-Wert eines Termins */
function hl(x){const e=x.e,p=x.p;let s=0;let c=[];try{c=evCats(p,e)}catch(_){}
  if(e.rg)s-=5;if(FULL.test(e.no||""))s-=10;
  if(c.some(k=>{const z=EVK.find(q=>q[0]===k);return z&&z[3]}))s+=3;
  if(/theater|musical|show|planetarium|zauber|puppen|zirkus|konzert|kino|märchen|laterne|weihnachtsmarkt|fest\b|festival/i.test(e.ti+" "+p.n))s+=2;
  if(e.an&&evKind(e)==="tix")s+=1;
  if(evWished(evKey(p,e)))s+=5;if(isMaybe(evKey(p,e)))s+=3;
  if(/elterncaf|krabbel|pekip|kurs\b|kurs |beratung|sprechstunde|väter-gruppe|stillcaf|nähstüb|selbsthilfe|eltern-kind-kurs/i.test(e.ti))s-=4;
  if(FAM.kids.length){const r=evAgeRange(e);if(r&&!FAM.kids.some(k=>k>=r[0]&&k<=r[1]))s-=6}
  return s-p.km/30}
let EVCACHE=null,EVCT=0;
let EVHV=-1;function evAllNear(){if(EVCACHE&&Date.now()-EVCT<5000&&EVHV===window.HIDV)return EVCACHE;EVHV=window.HIDV;EVCACHE=allEvs(PLACES.filter(p=>p.km<=45)).filter(x=>x.p.km<=45);EVCT=Date.now();return EVCACHE}
const onDay=(x,dt)=>x.e.dt<=dt&&(x.e.to||x.e.dt)>=dt;
const ROUTE=p=>"https://www.google.com/maps/dir/?api=1&origin=53.76,10.00&destination="+encodeURIComponent(p.n+", "+p.a);
const fmDur=m=>m>=60?(Math.floor(m/60)+(m%60>=30?",5":"")+" h"):m+" Min.";
/* --- Heute (A4: nur, was zeitlich noch passt) --- */
function wxHalf(dt){const h=window.WXH&&WXH[dt];if(!h||!h.am||!h.pm||h.am.hi<-90)return null;return h}
function wxHalfHtml(dt,nowM){const h=wxHalf(dt);if(!h)return"";const one=(lab,o,past)=>{const c=wxClass(o);return `<span class="${o.rain>=50?"wet":""}${past?" past":""}" title="${lab==="Vorm."?"Vormittag (8–12 Uhr)":"Nachmittag (12–18 Uhr)"}: ${WX[c]}">${lab} ${wxIcon(o.rain,o.code,o.hi)} ${Math.round(o.hi)}° · 💧${Math.round(o.rain)} %</span>`};
  return `<span class="hwx2">${one("Vorm.",h.am,nowM!=null&&nowM>=12*60)}${one("Nachm.",h.pm,nowM!=null&&nowM>=18*60)}</span>`}
let HD="jetzt",HWXOPEN=false;
const HWXT={rain:"Vorgeschlagen werden nur Ziele, die bei jedem Wetter gehen – drinnen zuerst. Draußen-Veranstaltungen rutschen nach hinten und bekommen „☔ Regenjacke“.",
  mixed:"Ziele, die nur bei Sonne Spaß machen (z. B. Badeseen), fallen weg. Alles andere bleibt – Regenjacke einpacken.",
  cloudy:"Draußen geht gut. Nur reine Sonnen-Ziele (z. B. Badeseen) fallen weg.",
  dry:"Draußen-Ziele und -Veranstaltungen passen gut. Nur reine Sonnen-Ziele (z. B. Badeseen) fallen weg.",
  warm:"Alles ist möglich – Draußen-Ziele und Draußen-Veranstaltungen rücken nach oben."};
function wxInfo(dt,wc,hh){const src=($("wxSrc")&&$("wxSrc").textContent)||"";
  return `${wc?`<b>${esc(WX[wc])}</b> – ${esc(HWXT[wc]||"")}`:"Für diesen Tag gibt es noch keine Vorhersage."}${hh?`<br>Vorm. = 8–12 Uhr, Nachm. = 12–18 Uhr. Bei Veranstaltungen zählt das Wetter zur jeweiligen Uhrzeit.`:""}${src?`<br><small>${esc(src)}</small>`:""}`}
function wxBtn(inner,dt,wc,hh){return `<span class="hwxwrap"><button type="button" class="hwxbtn" data-hwx aria-expanded="${HWXOPEN}" title="Was bedeutet das Wetter für die Vorschläge?">${inner}<span class="hwxi" aria-hidden="true">ⓘ</span></button>${HWXOPEN?`<span class="hwxinfo" role="note">${wxInfo(dt,wc,hh)}</span>`:""}</span>`}
const HQK=["dur","mood","drive","cost"],HQI={dur:"⏱️",mood:"💭",drive:"🚗",cost:"💶"};
let HSTEP=(()=>{try{return sessionStorage.getItem("hwk-hqdone")?4:0}catch(e){return 0}})();
const hqDone=()=>{HSTEP=4;try{sessionStorage.setItem("hwk-hqdone","1")}catch(e){}};
const HQ=Object.assign({dur:null,mood:null,cost:null,drive:null},LS.get("hwkp-hq",{}));
const HQO={dur:["Wie lange?",[["2h","⏱️ 2–3 Stunden"],["half","🌗 Halber Tag"],["day","🌞 Ganzer Tag"]]],
  mood:["Worauf habt ihr Lust?",[["toben","🤸 Austoben"],["cozy","☕ Gemütlich"],["learn","🔬 Was lernen"],["animals","🐐 Tiere"]]],
  drive:["Wie lange fahren?",[["15","🚲 bis 15 Min."],["30","🚗 bis 30 Min."],["60","🚗 bis 1 Stunde"]]],
  cost:["Budget?",[["free","🆓 Kostenlos"],["low","💶 Günstig"],["more","💎 Gerne auch mehr"]]]};
const MOODP={toben:p=>["aktiv","spiel","baden"].includes(p.c)||/spielplatz|toben|trampolin|kletter|bewegung|rutsch/i.test(p.d||""),
  cozy:p=>["cafe","natur","hof"].includes(p.c)||/spazier|gemütlich|café|kuchen/i.test(p.d||""),
  learn:p=>["museum","kreativ"].includes(p.c)||/museum|ausstellung|planetarium|forsch|experiment|bücherei|technik/i.test(p.n+" "+(p.d||"")),
  animals:p=>/tier|zoo|wildpark|bauernhof|esel|ziege|pony|vogel|aquar|schaf|alpaka|hühner|pferd/i.test(p.n+" "+(p.d||""))};
const MOODE={toben:/spiel|turn|sport|toben|kletter|lauf|rallye|bewegung|schwimm|trampolin|fußball|tanz|parkour|bouldern/i,
  cozy:/lesung|vorles|theater|kino|puppen|märchen|musical|konzert|bastel|laterne|weihnachtsmarkt|adventsmarkt|café/i,
  learn:/workshop|museum|planetarium|führung|ausstellung|forsch|experiment|programmier|robot|3d|wissen|natur|entdeck/i,
  animals:/tier|zoo|hof|bauernhof|schaf|pony|vogel|wildpark|alpaka|fütter|esel|pferd/i};
function hqPlace(p){if(HQ.drive&&p.car>+HQ.drive)return false;
  if(HQ.dur==="2h"&&p.dur>3)return false;if(HQ.dur==="half"&&p.dur>5.5)return false;if(HQ.dur==="day"&&p.dur<4)return false;
  if(HQ.mood&&!MOODP[HQ.mood](p))return false;
  if(HQ.cost){const fc=famCost(p);if(HQ.cost==="free"&&!(p.pk==="free"||fc===0))return false;if(HQ.cost==="low"&&!(p.pk==="free"||(fc!=null&&fc<=30)||p.pt==="frei"||p.pt==="bis5"||p.pt==="bis15"))return false}
  return true}
function hqEvent(x){const {p,e}=x;if(HQ.drive&&p.car>+HQ.drive)return false;if(HQ.dur==="2h"&&p.car>30)return false;
  if(HQ.mood&&!MOODE[HQ.mood].test(e.ti+" "+(e.no||"")+" "+p.n))return false;
  if(HQ.cost){const pr=evPrice(x);if(HQ.cost==="free"&&pr!==0)return false;if(HQ.cost==="low"&&pr>12)return false}
  return true}
function renderHeute(){const v=$("heuteView");if(!v||M2!=="heute")return;
  const now=new Date(),nm=now.getHours()*60+now.getMinutes();const late=nm>=18*60;let mode=HD,auto=false;if(late){mode="morgen";auto=false}
  const dt=mode==="jetzt"?T0:plus(1),start=mode==="jetzt"?nm:9*60,w=(typeof WXD!=="undefined"&&WXD)?WXD.find(x=>x.dt===dt):null,di=DIDX(pdate(dt)),wc=w?wxClass(w):null;
  const lateDay=HQ.dur==="day"&&mode==="jetzt"&&nm>=13*60;
  const hh=wxHalf(dt);
  /* Ziele: Wetter (über topForAll), Öffnungszeit (A4) und Antworten */
  const items=[];
  topForAll(dt).forEach(o=>{const p=o.p;if(!p.h||!p.h[di])return;if(!hqPlace(p))return;if(!HQ.drive&&mode==="jetzt"&&nm>=15*60&&p.car>35)return;
    const arrive=start+p.car;const segs=p.h[di].split(",").map(s=>s.split("-").map(toM));const sg=segs.find(s=>s[1]>arrive);if(!sg)return;
    const open=Math.max(sg[0],arrive),left=sg[1]-open,need=HQ.dur==="day"?Math.min(300,Math.round((p.stay||2)*60)):Math.max(60,Math.min(Math.round((p.stay||2)*60),150));if(left<need)return;
    const dep=sg[0]>arrive?fmM(sg[0]-p.car):null;
    items.push({k:"p",p,sc:o.v+(HQ.cost==="more"&&(p.pt==="ueber15"||(famCost(p)||0)>30)?1.5:0),why:o.why,meta:`<span class="hl">${sg[1]>=1440?"rund um die Uhr offen":"offen bis "+fmM(sg[1])+" Uhr"}</span> · ${left>=300?"viel Zeit":"noch "+fmDur(left)+" vor Ort"}`,
      go:mode==="jetzt"?(dep?`Losfahren um ${dep} (öffnet ${fmM(sg[0])})`:`Jetzt losfahren: 🚗 ${p.car} Min., an ca. ${fmM(arrive)}`):`Öffnet ${fmM(sg[0])} · 🚗 ${p.car} Min.`})});
  /* Veranstaltungen: Wetter bei Draußen-Terminen */
  const seen=new Set();evAllNear().filter(x=>onDay(x,dt)&&!x.e.rg&&!FULL.test(x.e.no||"")&&ageFit(x.e)&&!/elterncaf|pekip|krabbel|beratung|stillcaf/i.test(x.e.ti)&&hqEvent(x))
    .filter(x=>{if(!x.e.t||x.e.to)return true;return toM(x.e.t)>=start+x.p.car-10})
    .filter(x=>{const k=x.p.id+"|"+x.e.ti;if(seen.has(k))return false;seen.add(k);return true})
    .forEach(x=>{let s=hl(x)+2;if(HQ.cost==="more"&&x.e.an&&evKind(x.e)==="tix")s+=1.5;const out=evIO(x)==="draussen";let ec=wc;if(hh&&x.e.t){const o=toM(x.e.t)<12*60?hh.am:hh.pm;ec=wxClass(o)}if(out&&ec==="rain")s-=4;if(out&&ec==="warm")s+=1;if(s>-2)items.push({k:"e",x,sc:s,wet:out&&ec==="rain"})});
  items.sort((a,b)=>b.sc-a.sc);
  const wl=hh?"":(w?`${wxIcon(w.rain,w.code,w.hi)} ${WX[wc]}, ${Math.round(w.hi)}° · 💧 ${Math.round(w.rain)} %`:"");const halfHtml=wxHalfHtml(dt,mode==="jetzt"?nm:null);
  const hcost=s=>s?` · <span class="hcost" title="${/p\. P\./.test(s)?"Preis pro Person laut Veranstalter":/🆓/.test(s)?"Eintritt frei":/€/.test(s)?"Eintritt für eure ganze Familie (geschätzt)":"Preis steht auf der Infoseite"}">${s}</span>`:"";
  const evCostTxt=x=>{const pr=evPrice(x);if(pr===0)return "🆓 kostenlos";if(pr<1e5)return `🎟️ ${fmtEur(pr)} p. P.`;return x.e.an?"🎟️ Preis auf Infoseite":""};
  const plCostTxt=p=>{if(p.pk==="free")return "🆓 kostenlos";const fc=famCost(p);return fc===0?"🆓 kostenlos":fc!=null?"🎟️ "+fmtEur(fc,p.pest):""};
  const ecard=(x,big,wet)=>{const {p,e}=x,k=evKey(p,e),pl=window.inPlanEv(k),st=e.t?toM(e.t):null;
    return `<div class="hcard ev${big?" big":""}">${big?`<span class="hbadge">⭐ Unser Vorschlag</span>`:""}<span class="hk">🎉 Veranstaltung${p.x?" · nicht in euren Listen":""}</span><b>${esc(e.ti)}</b><div class="hm"><span class="hl">${e.t?e.t+" Uhr":e.to?"läuft bis "+fmtDate(e.to):"ganztägig"}</span> · ${esc(p.n)} · ${Math.round(p.km)} km${hcost(evCostTxt(x))}</div>
      <div class="hw">${st!=null?`Losfahren um ${fmM(st-p.car-10)} · 🚗 ${p.car} Min.`:`🚗 ${p.car} Min.`}${wet?" · ☔ draußen – Regenjacke!":""}${e.no?" · "+esc(e.no.length>70?e.no.slice(0,68)+"…":e.no):""}</div>
      <div class="ha"><button type="button" class="pmini" data-evplan="${p.id}" data-k="${esc(k)}" aria-pressed="${pl}">${IC.pin}${pl?"Eingeplant":"Einplanen"}</button>${window.plusMaybeBtn(p,e)}<a href="${ROUTE(p)}" target="_blank" rel="noopener">Route ↗</a>${e.u?`<a href="${e.u}" target="_blank" rel="noopener">Infos ↗</a>`:""}</div></div>`};
  const pcard=(o,big)=>{const p=o.p,pd=planDateOf(p.id);
    return `<div class="hcard${big?" big":""}">${big?`<span class="hbadge">⭐ Unser Vorschlag</span>`:""}<span class="hk">📍 ${esc(CATS[p.c]||"Ziel")}</span><b>${esc(p.n)}</b><div class="hm">${o.meta}${hcost(plCostTxt(p))}</div><div class="hw">${o.go}${o.why.length?" · "+o.why.filter(w=>!/^offen /.test(w)).slice(0,2).map(esc).join(" · "):""}</div>${big&&p.d?`<div class="hw">${esc(p.d.length>140?p.d.slice(0,138)+"…":p.d)}</div>`:""}
      <div class="ha">${pd===dt?`<span class="pplan on">${IC.pin}Eingeplant</span>`:`<button type="button" class="pmini" data-hplan="${p.id}" data-d="${dt}">${IC.pin}Einplanen</button>`}${window.plusMaybeBtn(p)}${(()=>{const s=P_(p.id);return `<button type="button" class="pmini hvis" data-hvisit="${p.id}" aria-pressed="${!!s.visited}">${s.visited?CHK_ON:CHK_OFF} Besucht</button>`})()}<a href="${ROUTE(p)}" target="_blank" rel="noopener">Route ↗</a></div>${(()=>{const s=P_(p.id);return s.visited?`<div class="prate hrate" role="group" aria-label="Wie hat es euch gefallen?"><span>${s.rating?"Eure Bewertung":"Wie war’s?"}</span>${[1,2,3,4,5].map(i=>`<button type="button" data-hrate="${i}" data-pid="${p.id}" aria-pressed="${(s.rating||0)>=i}" aria-label="${i} von 5">👍</button>`).join("")}${s.rating?`<b class="hrv">${s.rating}/5</b>`:""}</div>`:""})()}</div>`};
  const card=(it,big)=>it.k==="e"?ecard(it.x,big,it.wet):pcard(it,big);
  const any=Object.values(HQ).some(Boolean);
  const qs=Object.entries(HQO).map(([key,[lab,opts]])=>`<div class="hqrow"><span class="hql">${lab}</span><div class="hqo">${opts.map(([val,t])=>`<button type="button" data-hq="${key}" data-v="${val}" aria-pressed="${HQ[key]===val}">${t}</button>`).join("")}</div></div>`).join("");
  /* Lockerungs-Tipps, wenn nichts passt */
  let relax="";if(!items.length&&any){const save=Object.assign({},HQ);relax=Object.keys(HQ).filter(k=>save[k]).map(k=>{HQ[k]=null;const n=topForAll(dt).filter(o=>hqPlace(o.p)).length;HQ[k]=save[k];return n?`<button type="button" class="evtip" data-hqclr="${k}">„${esc(HQO[k][0].replace("?",""))}“ offen lassen</button>`:""}).join("")}
  const headHtml=`<div class="hhead"><h2 class="mtitle">${mode==="jetzt"?"☀️ Heute":"🌅 Morgen"}</h2>
    ${late?"":`<div class="hseg" role="group" aria-label="Tag"><button type="button" data-hd="jetzt" aria-pressed="${mode==="jetzt"}">Heute ab jetzt</button><button type="button" data-hd="morgen" aria-pressed="${mode==="morgen"}">Morgen</button></div>`}
    ${(halfHtml||wl)?wxBtn(halfHtml||`<span class="hwxd">${wl}</span>`,dt,wc,hh):""}<p class="hsub">${mode==="jetzt"?`Jetzt ${fmM(nm)} Uhr – nur, was ihr heute noch schafft`:`${WDL[pdate(dt).getDay()]}, ${pdate(dt).getDate()}. ${MONL[pdate(dt).getMonth()]} – Start ab 9 Uhr`}</p>
    </div>`;
  if(HSTEP<4){const key=HQK[HSTEP],[lab,opts]=HQO[key],big=t=>{const m=t.match(/^(\S+)\s(.*)$/);return m?`<span class="e">${m[1]}</span><span>${m[2]}</span>`:t};
    const wsh=w?`${wxIcon(w.rain,w.code,w.hi)} ${Math.round(w.hi)}° · 💧${Math.round(w.rain)} %`:"";document.body.classList.add("wizon");
    v.innerHTML=`<div class="hwhead">${late?`<span class="hwday">🌅 Ideen für morgen</span>`:`<div class="hseg" role="group" aria-label="Tag"><button type="button" data-hd="jetzt" aria-pressed="${mode==="jetzt"}">Heute</button><button type="button" data-hd="morgen" aria-pressed="${mode==="morgen"}">Morgen</button></div>`}${(halfHtml||wsh)?wxBtn(halfHtml||`<span class="hwx">${wsh}</span>`,dt,wc,hh):""}</div><div class="hwiz"><div class="hwtop"><span>Frage ${HSTEP+1} von ${HQK.length}</span><button type="button" class="hwskip" data-hqskip>Fragen überspringen ›</button></div>
      <div class="hwbar" aria-hidden="true"><i style="width:${(HSTEP+1)/HQK.length*100}%"></i></div>
      <div class="hwico" aria-hidden="true">${HQI[key]}</div><h3 class="hwq">${lab}</h3>
      <div class="hwopts">${opts.map(([val,t])=>`<button type="button" data-hqa="${key}" data-v="${val}" aria-pressed="${HQ[key]===val}">${big(t)}</button>`).join("")}<button type="button" data-hqa="${key}" data-v="" aria-pressed="${!HQ[key]}"><span class="e">🤷</span><span>Egal</span></button></div>
      ${HSTEP>0?`<button type="button" class="hwback" data-hqback>‹ Zurück</button>`:""}</div>`;return}
  document.body.classList.remove("wizon");
  const chosen=HQK.filter(k=>HQ[k]).map(k=>HQO[k][1].find(o=>o[0]===HQ[k])[1]);
  v.innerHTML=headHtml+`
<div class="hqsum"><span class="hql">Eure Antworten:</span>${chosen.length?chosen.map(c=>`<span class="hqc">${esc(c)}</span>`).join(""):`<span class="hqc">keine Vorgaben</span>`}<button type="button" class="hqredo" data-hqredo>✏️ Fragen neu beantworten</button></div>
    ${lateDay?`<p class="hnote">Für einen ganzen Tag ist es heute schon spät – vielleicht morgen?</p>`:""}
    ${items.length?card(items[0],true)+(items.length>1?`<div class="hsec"><h3>Weitere Ideen</h3><div class="hgrid">${items.slice(1,7).map(it=>card(it)).join("")}</div></div>`:"")
      :`<div class="hnote">Dazu passt ${mode==="jetzt"?"heute":"morgen"} leider nichts.${relax?`<div class="evtips" style="margin-top:6px">${relax}</div>`:""}</div>`}
    <button type="button" class="pbtn hmore" data-explore="${dt}">🔭 Mehr für ${mode==="jetzt"?"heute":"morgen"} entdecken</button>`}
$("heuteView").addEventListener("click",e=>{const h=e.target.closest("[data-hd]");if(h){HD=h.dataset.hd;renderHeute();return}
  if(e.target.closest("[data-hwx]")){HWXOPEN=!HWXOPEN;renderHeute();return}
  if(HWXOPEN&&!e.target.closest(".hwxinfo")){HWXOPEN=false;const ib=e.target.closest("button,a");renderHeute();if(!ib)return}
  const qa=e.target.closest("[data-hqa]");if(qa){HQ[qa.dataset.hqa]=qa.dataset.v||null;LS.set("hwkp-hq",HQ);HSTEP++;if(HSTEP>=HQK.length)hqDone();renderHeute();$("heuteView").scrollIntoView({block:"start"});return}
  if(e.target.closest("[data-hqskip]")){hqDone();renderHeute();return}
  if(e.target.closest("[data-hqback]")){HSTEP=Math.max(0,HSTEP-1);renderHeute();return}
  if(e.target.closest("[data-hqredo]")){HSTEP=0;renderHeute();return}
  const q=e.target.closest("[data-hq]");if(q){const k=q.dataset.hq;HQ[k]=HQ[k]===q.dataset.v?null:q.dataset.v;LS.set("hwkp-hq",HQ);renderHeute();return}
  const qc=e.target.closest("[data-hqclr]");if(qc){HQ[qc.dataset.hqclr]=null;LS.set("hwkp-hq",HQ);renderHeute();return}
  if(e.target.closest("[data-hqreset]")){for(const k in HQ)HQ[k]=null;LS.set("hwkp-hq",HQ);renderHeute();return}
  const hv=e.target.closest("[data-hvisit]");if(hv){const id=+hv.dataset.hvisit,v=!P_(id).visited;setPlace(id,{visited:v});toast(v?"✓ Als besucht markiert – wie war’s? Unten bewerten":"Besucht zurückgenommen");return}
  const hr=e.target.closest("[data-hrate]");if(hr){const id=+hr.dataset.pid,r=+hr.dataset.hrate;setPlace(id,{rating:P_(id).rating===r?0:r});return}
  const hp=e.target.closest("[data-hplan]");if(hp){const p=byId(+hp.dataset.hplan);if(p)togglePlacePlan(p,hp.dataset.d);return}
  const ex=e.target.closest("[data-explore]");if(ex)exploreDay(ex.dataset.explore,true)});
const MOODK={toben:["sport"],cozy:["buehne","lesen","werk"],learn:["fuehrung","werk"],animals:["natur"]};
function heuteToEv(){const n=[];evResetAll();EVAGE=true;n.push("passend zum Alter");
  if(HQ.drive){EVDIST=+HQ.drive;n.push("bis "+EVDIST+" Min. Fahrt")}
  if(HQ.cost==="free"){EVCOST="free";n.push("kostenlos")}
  if(HQ.mood&&MOODK[HQ.mood]){MOODK[HQ.mood].forEach(k=>EVKF.add(k));try{localStorage.setItem("hwk-evk",JSON.stringify([...EVKF]))}catch(_){}n.push(HQO.mood[1].find(o=>o[0]===HQ.mood)[1].replace(/^\S+\s/,""))}
  saveEvf();const dr=$("evDist");if(dr)dr.value=EVDIST;return n}
function exploreDay(dt,fromHeute){const hn=fromHeute?heuteToEv():null;EVDATE=dt;EVMON=null;if(typeof WXD!=="undefined"&&WXD&&WXD.some(x=>x.dt===dt)){WXDAY=dt;if(WXAUTO)applyWx(false);renderWx()}
  setM2("entdecken");setTab("termine");renderEvMap();render();
  requestAnimationFrame(()=>{const ts=document.querySelector(".tabstick");if(ts)scrollTo(0,ts.getBoundingClientRect().top+scrollY-8)});
  toast("🔭 "+fmtDate(dt)+(hn&&hn.length?" · "+hn.join(" · "):""))}
setInterval(()=>{if(M2==="heute"&&!document.hidden)renderHeute()},5*60*1000);
function updNavDay(){const late=new Date().getHours()>=18,l=$("navDayL"),i=$("navDayI");if(l)l.textContent=late?"Morgen":"Heute";if(i)i.textContent=late?"🌅":"☀️"}
updNavDay();setInterval(()=>{const was=$("navDayL")&&$("navDayL").textContent;updNavDay();if(M2==="heute"&&$("navDayL").textContent!==was)renderHeute()},60*1000);
/* --- B4: Vielleicht (ohne Datum merken) --- */
const isMaybe=k=>!!ST.maybe[hsh(k)];
function toggleMaybe(o){const id=hsh(o.k);if(ST.maybe[id]){delete ST.maybe[id];write("maybe/"+id,null);toast("Aus „Vielleicht“ entfernt")}
  else{const d={type:o.type,id:o.id,k:o.k,at:Date.now()};if(MYID)d.by=MYID;ST.maybe[id]=d;write("maybe/"+id,d);toast("♡ Gemerkt – unter „Unser Plan“")}persistLocal();refresh()}
window.plusMaybeBtn=(p,e,compact)=>{const k=e?evKey(p,e):"p"+p.id,on=isMaybe(k);
  return `<button type="button" class="pmini mbtn" data-maybe="${esc(k)}" data-mid="${p.id}" data-mt="${e?"ev":"place"}" aria-pressed="${on}" aria-label="${on?"Aus Vielleicht entfernen":"Vielleicht – ohne Datum merken"}" title="${on?"Gemerkt – antippen zum Entfernen":"Vielleicht – ohne Datum merken"}">${on?"♥":"♡"}${compact?"":`<span class="mbl"> Vielleicht</span>`}</button>`};
document.addEventListener("click",e=>{const b=e.target.closest("[data-maybe]");if(!b)return;e.preventDefault();e.stopPropagation();
  toggleMaybe({type:b.dataset.mt,id:+b.dataset.mid,k:b.dataset.maybe});const on=isMaybe(b.dataset.maybe);b.setAttribute("aria-pressed",String(on));b.firstChild.textContent=on?"♥":"♡"},true);
function maybeEntries(){return Object.entries(ST.maybe).map(([id,o])=>{const p=byId(o.id);if(!p)return null;
    if(o.type==="ev"){const ev=p.up.find(x=>evKey(p,x)===o.k);if(!ev||(ev.to||ev.dt)<T0)return null;return {id,o,p,ev,planned:window.inPlanEv(o.k)}}
    return {id,o,p,planned:!!planDateOf(p.id)}}).filter(Boolean)
  .sort((a,b)=>(a.planned-b.planned)||((a.ev?a.ev.dt:"9")+a.p.n).localeCompare((b.ev?b.ev.dt:"9")+b.p.n))}
const MBOPEN=new Set();
function mbRow({id,p,ev,planned,o},ctx){const op=MBOPEN.has(ctx+id);
  return `<div class="mbrow${ev?" mbe":""}"><div style="min-width:0"><b>${esc(ev?ev.ti:p.n)}</b><small>${ev?(ev.to?`läuft ${fmtDate(ev.dt<T0?T0:ev.dt)} – ${fmtDate(ev.to)}`:`${fmtDate(ev.dt)}${ev.t?", "+ev.t+" Uhr":""}`)+" · "+esc(p.n):esc(CATS[p.c]||"Ziel")+" · "+Math.round(p.km)+" km"}${byTag(o)} · <button type="button" class="mbdet" data-mbdet="${ctx+id}" aria-expanded="${op}">Details ${op?"▴":"▾"}</button></small>${op?pdet({p,ev,d:ev?ev.dt<T0?T0:ev.dt:(PDAY||T0)}):""}</div>
    <span class="mba">${planned?`<span class="pplan on">${IC.pin}eingeplant</span>`:`<button type="button" class="pmini" data-mbplan="${id}">${IC.pin}${ev&&!ev.to?"Einplanen":"Tag wählen"}</button>`}<button type="button" class="mbx" data-mbx="${id}" aria-label="Aus Vielleicht entfernen">✕</button></span></div>`}
function maybeOn(s){return maybeEntries().filter(x=>x.ev&&!x.ev.to&&!x.planned&&x.ev.dt===s)}
function renderMaybe(){const L=maybeEntries(),el=$("maybeList");if(!el)return;$("mbN").textContent=L.filter(x=>!x.planned).length||"";
  el.innerHTML=L.length?L.map(x=>mbRow(x,"l")).join("")
    :`<p class="pvsub">Noch nichts gemerkt. Bei Zielen und Terminen „♡ Vielleicht“ antippen – ganz ohne Datum.</p>`}
/* --- B2: Wochenend-Planer --- */
function weekends(n){const out=[],wd=TODAY.getDay(),sat=new Date(TODAY);sat.setDate(sat.getDate()+(wd===0?-1:(6-wd)));
  for(let i=0;i<n;i++){const su=new Date(sat);su.setDate(su.getDate()+1);out.push([iso(sat),iso(su)]);sat.setDate(sat.getDate()+7)}return out}
function dayTip(dt,EV){const M=maybeEntries().filter(o=>!o.planned),me=M.find(o=>o.ev&&onDay({e:o.ev},dt));if(me)return "♡ "+me.ev.ti;
  const c=EV.filter(x=>onDay(x,dt)&&!x.e.rg&&!FULL.test(x.e.no||"")&&ageFit(x.e)&&!window.inPlanEv(evKey(x.p,x.e))).map(x=>({x,s:hl(x)})).sort((a,b)=>b.s-a.s)[0];
  if(c&&c.s>0)return "💡 "+c.x.e.ti;const mp=M.find(o=>!o.ev&&o.p.h&&o.p.h[DIDX(pdate(dt))]);return mp?"♡ "+mp.p.n:null}
function renderWE(){const g=$("weGrid");if(!g)return;g.hidden=true;g.innerHTML="";return;const EVF=evAllNear(),fr=[],FD=window.FREEDAYS||new Set([6,0]);for(let i=0;i<70&&fr.length<12;i++){const s=plus(i);if(FD.has(pdate(s).getDay())&&!planItems(s).length)fr.push(s)}
  g.innerHTML=`<span class="wfl">🟢 Freie Ausflugstage</span>`+(fr.length?fr.slice(0,6).map(s=>{const tip=dayTip(s,EVF);return `<button type="button" data-wed="${s}"><b>${fmtDate(s)}</b>${tip?`<small>${esc(tip)}</small>`:""}</button>`}).join(""):`<span class="pvsub">${FD.size?"Die nächsten freien Tage sind alle verplant.":"Keine freien Wochentage gewählt – unter ⚙️ Einstellungen festlegen."}</span>`);return;const EV=evAllNear(),wx={};if(typeof WXD!=="undefined"&&WXD)WXD.forEach(x=>wx[x.dt]=x);
  g.innerHTML=weekends(8).map(([sa,so])=>{const cell=s=>{const d=pdate(s),past=s<T0,L=planItems(s),w=wx[s],tip=!L.length&&!past?dayTip(s,EV):null;
      return `<button type="button" class="wecell ${L.length?"busy":"free"}" data-wed="${s}" aria-pressed="${PDAY===s}"${past?" disabled":""}><span class="wd"><span>${["So","Mo","Di","Mi","Do","Fr","Sa"][d.getDay()]} ${d.getDate()}.${d.getMonth()+1}.</span>${w?`<span>${wxIcon(w.rain,w.code,w.hi)} ${Math.round(w.hi)}°</span>`:""}</span>
        <span class="wst">${past?"vorbei":L.length?`📌 ${esc(L[0].ti.replace(/^Ausflug: /,""))}${L.length>1?" +"+(L.length-1):""}`:"🟢 noch frei"}</span>${tip?`<span class="wtip">${esc(tip)}</span>`:""}</button>`};
    return `<div class="werow"><span class="wel">KW ${isoWeek(pdate(sa))}</span>${cell(sa)}${cell(so)}</div>`}).join("")}
function daySug(dt,title){if(!dt||dt<T0)return"";const EV=evAllNear(),seen=new Set(),di=DIDX(pdate(dt));
  const mb=maybeEntries().filter(o=>!o.planned&&(o.ev?onDay({e:o.ev},dt)&&!(!o.ev.to&&o.ev.dt===dt):(o.p.h&&o.p.h[di])));
  const ev=EV.filter(x=>onDay(x,dt)&&!x.e.rg&&!FULL.test(x.e.no||"")&&ageFit(x.e)&&!window.inPlanEv(evKey(x.p,x.e))&&!isMaybe(evKey(x.p,x.e))&&!/elterncaf|pekip|krabbel|beratung|stillcaf/i.test(x.e.ti))
    .map(x=>({k:"e",x,s:hl(x)+2})).filter(o=>o.s>0).sort((a,b)=>b.s-a.s).filter(o=>{const k=o.x.p.id;if(seen.has(k))return false;seen.add(k);return true}).slice(0,6);
  const pl=topForAll(dt).filter(o=>o.p.c!=="cafe"&&o.p.h&&o.p.h[di]&&planDateOf(o.p.id)!==dt&&!seen.has(o.p.id)).slice(0,6).map(o=>({k:"p",o,s:o.v}));
  const mix=[];{const A=ev.slice(),B=pl.slice();let turn=(A[0]?A[0].s:-99)>=(B[0]?B[0].s:-99);while(mix.length<8&&(A.length||B.length)){const src=turn?(A.length?A:B):(B.length?B:A);mix.push(src.shift());turn=!turn}}
  const row=(t,s,btn)=>`<div class="sugrow"><div style="min-width:0"><b>${t}</b><small>${s}</small></div>${btn}</div>`;
  const btnE=(p,k)=>`<button type="button" class="pmini" data-sugev="${p.id}" data-k="${esc(k)}" data-d="${dt}">${IC.pin}Einplanen</button>`,btnP=p=>`<button type="button" class="pmini" data-sugpl="${p.id}" data-d="${dt}">${IC.pin}Einplanen</button>`;
  let h="";
  mb.forEach(o=>{h+=o.ev?row("♡ "+esc(o.ev.ti),`Gemerkt · ${o.ev.t?o.ev.t+" Uhr · ":""}${esc(o.p.n)}`,btnE(o.p,o.o.k)):row("♡ "+esc(o.p.n),`Gemerkt · ${esc(CATS[o.p.c]||"Ziel")} · offen ${esc(fmtSpan(o.p.h[di]))}`,btnP(o.p))});
  mix.forEach(m=>{if(m.k==="e"){const x=m.x;h+=row("🎉 "+esc(x.e.ti),`Veranstaltung · ${x.e.t?x.e.t+" Uhr · ":x.e.to?"bis "+fmtDate(x.e.to)+" · ":""}${esc(x.p.n)} · 🚗 ${x.p.car} Min.${x.e.an?" · "+(evKind(x.e)==="tix"?"🎟️ Tickets":"✍️ Anmeldung"):""}`,btnE(x.p,evKey(x.p,x.e)))}
    else{const o=m.o;h+=row("📍 "+esc(o.p.n),`${esc(CATS[o.p.c]||"Ziel")} · offen ${esc(fmtSpan(o.p.h[di]))} · 🚗 ${o.p.car} Min.`,btnP(o.p))}});
  return h?`<div class="sugbox">${title?`<h4>${title}</h4>`:""}${h}</div>`:`<div class="evempty">Für diesen Tag haben wir keine Vorschläge.</div>`}
let SUGOPEN=false;
/* Start */
renderOurs();syncView();syncStarsToKids();render();setM2(M2,true);updateFabs();
{const onClaude=!!(window.claude&&window.claude.use);
 let FAMM="in";const famMode=m=>{FAMM=m;document.querySelectorAll("[data-famm]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.famm===m)));$("famNewW").hidden=m!=="new";$("famNewInfo").hidden=m!=="new";
   $("famH").textContent=m==="new"?"Neue Familie anlegen":"Familien-Code eingeben";$("famCode").autocomplete=m==="new"?"new-password":"current-password";document.querySelector("#famForm .pkok").textContent=m==="new"?"Familie anlegen":"Verbinden";$("famErr").textContent=""};
 document.addEventListener("click",e=>{const b=e.target.closest("[data-famm]");if(b)famMode(b.dataset.famm)});
 const missFn=err=>/PGRST202|42883|Could not find the function/.test((err.code||"")+" "+(err.message||""));
 $("famForm").addEventListener("submit",async e=>{e.preventDefault();const code=$("famCode").value.trim(),name=$("famName").value.trim();if(!code){$("famErr").textContent="Bitte den Familien-Code eingeben.";return}
   if(FAMM==="new"){if(code.length<10){$("famErr").textContent="Der Code braucht mindestens 10 Zeichen.";return}if(code!==$("famCode2").value.trim()){$("famErr").textContent="Die beiden Codes stimmen nicht überein.";return}
     $("famErr").textContent="Lege Familie an …";try{await sbRpc("fam_create",{p_code:code,p_name:name})}catch(err){$("famErr").textContent=err.code==="23505"?"Diesen Code gibt es schon – bitte einen anderen ausdenken.":err.code==="22023"?"Der Code braucht mindestens 10 Zeichen.":missFn(err)?"Supabase ist noch nicht für mehrere Familien eingerichtet (einmal supabase/mehrere-familien.sql ausführen).":"Hat nicht geklappt: "+(err.message||err);return}
     if(!$("famTake").checked){ST.places={};ST.plans={};ST.evw={};ST.maybe={};ST.busy={};for(const k of Object.keys(SETS))if(window.homeIsKey&&homeIsKey(k))delete SETS[k];LS.set("hwk-home",{});persistLocal()}
     SB={code,name:name||"Familie"};LS.set("hwk-fam-sb",SB);LS.set("hwk-fam-name",SB.name);MYID=SB.name;$("famdlg").close();renderSbStat();toast("🎉 Familie angelegt – Code an die anderen weitergeben");famMode("in");$("famCode2").value="";await sbLoad(true);return}
   $("famErr").textContent="Prüfe …";try{const ok=await sbRpc("fam_check",{p_code:code});if(!ok){$("famErr").textContent="Dieser Code stimmt nicht. Noch keinen Code? Oben „Neue Familie anlegen“.";return}
     SB={code,name:name||"Familie"};LS.set("hwk-fam-sb",SB);LS.set("hwk-fam-name",SB.name);MYID=SB.name;$("famdlg").close();renderSbStat();toast("✅ Verbunden – gemeinsamer Plan aktiv");await sbLoad(true)}
   catch(err){$("famErr").textContent="Keine Verbindung zu Supabase ("+(err.message||err)+")."}});
 $("famSkip").addEventListener("click",()=>{LS.set("hwk-fam-skip",1);$("famdlg").close()});
 renderSbStat();
 if(SB){sbLoad(true);setInterval(()=>{if(!document.hidden)sbLoad()},20000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)sbLoad()});addEventListener("focus",()=>sbLoad())}
 else if(!onClaude&&!LS.get("hwk-fam-skip",0))setTimeout(()=>famAsk(""),600);
 if(!SB){const iv=setInterval(()=>{if(SB){clearInterval(iv);setInterval(()=>{if(!document.hidden)sbLoad()},20000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)sbLoad()})}},1000)}}
document.querySelectorAll(".modebar button").forEach(b=>b.addEventListener("click",()=>setTimeout(updateFabs,0)));
})();
