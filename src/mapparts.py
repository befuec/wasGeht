rep('/* Upcoming strip */','''/* Map */
.mapbox{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px;display:grid;gap:10px;min-width:0}
.maphead{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px}
.maphead h2{font-family:var(--f-display);font-size:18px;margin:0;font-weight:700}
.zoom{display:flex;gap:4px}
.zoom button{font:inherit;font-size:13px;padding:4px 10px;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:999px;cursor:pointer}
.zoom button[aria-pressed=true]{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.zoom button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.mapwrap{position:relative;width:100%;max-width:100%;aspect-ratio:4/3}
#map{width:100%;height:100%;display:block}
#map .ring{fill:none;stroke:var(--line);stroke-width:1}
#map .ringl{fill:var(--muted);font-size:12px;font-family:var(--f-body)}
#map .elbe{fill:none;stroke:var(--elbe);stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
#map .elbel{fill:var(--elbe-ink);font-size:13px;font-style:italic;font-family:var(--f-body)}
#map .town{fill:var(--muted);font-size:13px;font-family:var(--f-body)}
#map .townd{fill:var(--muted)}
#map .home{fill:var(--ink)}
#map .homer{fill:none;stroke:var(--ink);stroke-width:1.5}
#map .homel{fill:var(--ink);font-weight:700;font-size:14px;font-family:var(--f-body)}
#map .pt{stroke:var(--surface);stroke-width:1.5;cursor:pointer}
#map .pt.ev{stroke:var(--apple);stroke-width:3}
#map .pt:hover,#map .pt:focus{stroke:var(--ink);stroke-width:3;outline:none}
.tip{position:absolute;pointer-events:none;background:var(--ink);color:var(--surface);font-size:12.5px;line-height:1.35;padding:6px 9px;border-radius:6px;width:max-content;max-width:230px;transform:translate(-50%,calc(-100% - 10px));z-index:2}
.tip b{display:block}
.legend{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12.5px;color:var(--muted)}
.legend span{display:inline-flex;align-items:center;gap:5px}
.legend i{width:10px;height:10px;border-radius:50%;display:inline-block}
.mapnote{font-size:12.5px;color:var(--muted)}
.cat .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:1px}

/* Upcoming strip */''')

rep('''      <section class="soon" id="soon"''','''      <section class="mapbox" aria-labelledby="mapH">
        <div class="maphead"><h2 id="mapH">Karte ab Henstedt-Rhen</h2>
          <div class="zoom" role="group" aria-label="Kartenausschnitt">
            <button type="button" data-r="20" id="z20">20 km</button><button type="button" data-r="40" id="z40">40 km</button><button type="button" data-r="70" id="z70">70 km</button>
          </div></div>
        <div class="mapwrap"><svg id="map" role="img" aria-label="Karte der gefilterten Ziele rund um Henstedt-Rhen"></svg><div class="tip" id="tip" hidden></div></div>
        <div class="legend" id="legend"></div>
        <div class="mapnote" id="mapnote"></div>
      </section>

      <section class="soon" id="soon"''')

rep('function renderSoon(list){','''const ORIGIN=[53.76,10.00];
const KX=111.32*Math.cos(ORIGIN[0]*Math.PI/180), KY=110.57;
const toKm=(la,ln)=>[(ln-ORIGIN[1])*KX,-(la-ORIGIN[0])*KY];
const ELBE=[[53.785,9.40],[53.73,9.47],[53.62,9.53],[53.575,9.63],[53.570,9.70],[53.556,9.80],[53.544,9.91],[53.545,9.97],[53.535,10.025],[53.51,10.07],[53.462,10.065],[53.41,10.17],[53.40,10.25],[53.42,10.37],[53.39,10.50]];
const TOWNS=[["Hamburg",53.5503,9.9925],["Norderstedt",53.7064,10.0108],["Pinneberg",53.659,9.80],["Ahrensburg",53.674,10.24],["Elmshorn",53.753,9.652],["Bad Segeberg",53.936,10.31],["Kaltenkirchen",53.833,9.96],["Bergedorf",53.488,10.215],["Harburg",53.46,9.98],["Stade",53.60,9.476],["Buxtehude",53.477,9.70],["Lübeck",53.866,10.686],["Bad Oldesloe",53.81,10.375]];
let ZR=40; try{ZR=+(localStorage.getItem("hwk-zoom")||40)||40}catch(e){}
function renderLegend(){$("legend").innerHTML=Object.entries(CATS).map(([k,v])=>`<span><i style="background:var(--c-${k})"></i>${v}</span>`).join("")+`<span><i style="background:transparent;border:2px solid var(--apple)"></i>mit Terminen</span>`}
function renderMap(list){
  const svg=$("map"), W=800, H=600, sc=Math.min(W,H)/2/ZR, cx=W/2, cy=H/2;
  svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
  const P=(la,ln)=>{const [x,y]=toKm(la,ln);return [cx+x*sc, cy+y*sc]};
  const rings=[5,10,20,30,50,70,100].filter(r=>r<=ZR*1.25 && r>=ZR/5);
  let g=rings.map(r=>`<circle class="ring" cx="${cx}" cy="${cy}" r="${r*sc}"/>${cy-r*sc>14?`<text class="ringl" x="${cx+5}" y="${cy-r*sc-5}">${r} km</text>`:""}`).join("");
  g+=`<polyline class="elbe" points="${ELBE.map(p=>P(...p).map(v=>v.toFixed(1)).join(",")).join(" ")}"/>`;
  const el=P(53.552,9.86); g+=`<text class="elbel" x="${el[0].toFixed(1)}" y="${(el[1]+20).toFixed(1)}">Elbe</text>`;
  g+=TOWNS.map(([n,la,ln])=>{const [x,y]=P(la,ln); if(x<0||x>W-60||y<12||y>H) return ""; return `<circle class="townd" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5"/><text class="town" x="${(x+6).toFixed(1)}" y="${(y-6).toFixed(1)}">${n}</text>`}).join("");
  let out=0;
  g+=list.slice().sort((a,b)=>b.km-a.km).map(p=>{const [x,y]=P(p.lat,p.lng);
    if(x<8||x>W-8||y<8||y>H-8){out++;return ""}
    return `<circle class="pt${p.up.length?" ev":""}" data-id="${p.id}" tabindex="0" role="button" aria-label="${esc(p.n)}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${ZR<=20?8:6.5}" fill="var(--c-${p.c})"></circle>`}).join("");
  g+=`<circle class="homer" cx="${cx}" cy="${cy}" r="12"/><circle class="home" cx="${cx}" cy="${cy}" r="5"/><text class="homel" x="${cx+16}" y="${cy+5}">Henstedt-Rhen</text>`;
  svg.innerHTML=g;
  $("mapnote").textContent=`${list.length-out} von ${list.length} gefilterten Zielen im Ausschnitt`+(out?` · ${out} weiter entfernt, größeren Ausschnitt wählen`:"")+". Schematische Karte mit vereinfachter Elbe; Punkt antippen springt zum Ort in der Liste.";
  document.querySelectorAll(".zoom button").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.r===ZR)));
}
function showTip(c){const p=PLACES.find(x=>x.id==c.dataset.id);if(!p)return;const wb=c.closest(".mapwrap").getBoundingClientRect(),cb=c.getBoundingClientRect();
  const t=$("tip");t.innerHTML=`<b>${esc(p.n)}</b>${CATS[p.c]} · ${Math.round(p.km)} km${p.h?`<br>${focusDay()[1]}: ${fmtSpan(p.h[focusDay()[0]])}`:""}${p.up[0]?`<br>Nächster Termin: ${fmtDate(p.up[0].dt)}`:""}`;
  let left=cb.left+cb.width/2-wb.left; left=Math.max(120,Math.min(wb.width-120,left));
  t.style.left=left+"px";t.style.top=(cb.top-wb.top)+"px";t.hidden=false}
function jump(id){const c=$("p"+id);if(!c)return;c.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});c.classList.add("flash");setTimeout(()=>c.classList.remove("flash"),1600)}
$("map").addEventListener("mouseover",e=>{if(e.target.classList.contains("pt"))showTip(e.target)});
$("map").addEventListener("focusin",e=>{if(e.target.classList.contains("pt"))showTip(e.target)});
$("map").addEventListener("mouseout",e=>{if(e.target.classList.contains("pt"))$("tip").hidden=true});
$("map").addEventListener("focusout",()=>{$("tip").hidden=true});
$("map").addEventListener("click",e=>{if(e.target.classList.contains("pt"))jump(e.target.dataset.id)});
$("map").addEventListener("keydown",e=>{if(e.target.classList.contains("pt")&&(e.key==="Enter"||e.key===" ")){e.preventDefault();jump(e.target.dataset.id)}});
document.querySelectorAll(".zoom button").forEach(b=>b.addEventListener("click",()=>{ZR=+b.dataset.r;try{localStorage.setItem("hwk-zoom",ZR)}catch(e){};render()}));
renderLegend();

function renderSoon(list){''')
rep('  renderSoon(list);','  renderSoon(list);\n  renderMap(list);')
rep('<div class="cat">${CATS[p.c]}</div>','<div class="cat"><span class="dot" style="background:var(--c-${p.c})"></span>${CATS[p.c]}</div>')
