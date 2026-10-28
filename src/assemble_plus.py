# Baut ausfluege-plus.html: plus.js in die Vorlage einbetten, Daten einsetzen
import datetime
t=open('template_plus.html').read()
i=t.index('<script>\n/* ===== Plus-Funktionen'); j=t.index('</script>',i)
pj=open('plus.js').read().rstrip(); assert pj.endswith('})();')
t=t[:i]+'<script>\n'+pj[:-5]+'\n'+open('home.js').read()+'\n})();\n'+t[j:]
open('template_plus.html','w').write(t)
# Sicherheit: in Link-Feldern nur http(s)-Adressen zulassen und "</" entschärfen
import json,re
URLK={'u','web','cal','url','link','ws'}
def san(o):
    if isinstance(o,dict):
        for k,v in list(o.items()):
            if k in URLK and isinstance(v,str) and v and not re.match(r'^https?://',v.strip(),re.I): o[k]=''
            else: san(v)
    elif isinstance(o,list):
        for v in o: san(v)
    return o
def J(f): return json.dumps(san(json.load(open(f))),ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
t=t.replace('__DATA__',J('places.json')).replace('__GEO__',open('geo.json').read()).replace('__EXT__',J('ext.json')).replace('__BUILD__',datetime.date.today().isoformat())
open('ausfluege-plus.html','w').write(t)
