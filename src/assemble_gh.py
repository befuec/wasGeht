# Baut die GitHub-Pages-Fassung (index.html) aus ausfluege-plus.html
import os
body=open('ausfluege-plus.html').read()
head='''<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0E6A61">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Was geht?">
<meta name="robots" content="noindex">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src https://klnjjherjqxiihxwaveh.supabase.co https://api.open-meteo.com; object-src 'none'; base-uri 'none'; form-action 'self'; frame-src 'none'; worker-src 'self'; manifest-src 'self'">
<meta name="referrer" content="no-referrer">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>
'''
os.makedirs('gh',exist_ok=True)
open('gh/index.html','w').write(head+body+'\n</body></html>\n')
print('gh/index.html',len(head+body))

# Service Worker (Offline-Speicher) mit Versionskennung je Build
import hashlib
ver=hashlib.sha1((head+body).encode()).hexdigest()[:10]
sw=open('sw_template.js').read().replace('__VER__',ver)
open('gh/sw.js','w').write(sw)
print('sw.js',ver)
