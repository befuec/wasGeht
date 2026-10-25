# Baut die GitHub-Pages-Fassung (index.html) aus ausfluege-plus.html
import os
body=open('ausfluege-plus.html').read()
head='''<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#2F3A3F">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Was geht?">
<meta name="robots" content="noindex">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%98%80%EF%B8%8F%3C/text%3E%3C/svg%3E">
<style>body{margin:0}</style>
</head><body>
'''
os.makedirs('gh',exist_ok=True)
open('gh/index.html','w').write(head+body+'\n</body></html>\n')
print('gh/index.html',len(head+body))
