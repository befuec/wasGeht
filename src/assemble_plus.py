# Baut ausfluege-plus.html: plus.js in die Vorlage einbetten, Daten einsetzen
import datetime
t=open('template_plus.html').read()
i=t.index('<script>\n/* ===== Plus-Funktionen'); j=t.index('</script>',i)
pj=open('plus.js').read().rstrip(); assert pj.endswith('})();')
t=t[:i]+'<script>\n'+pj[:-5]+'\n'+open('home.js').read()+'\n})();\n'+t[j:]
open('template_plus.html','w').write(t)
t=t.replace('__DATA__',open('places.json').read()).replace('__GEO__',open('geo.json').read()).replace('__EXT__',open('ext.json').read()).replace('__BUILD__',datetime.date.today().isoformat())
open('ausfluege-plus.html','w').write(t)
