# Erzeugt App-Symbole (icons/) und den QR-Code zur App-Adresse (icons/qr.svg)
import math, glob, sys
from PIL import Image, ImageDraw, ImageFont
def icon(S, maskable):
    im=Image.new("RGB",(S,S),"#0E6A61"); d=ImageDraw.Draw(im)
    cx=cy=S/2; r=S*(0.15 if maskable else 0.2)
    for i in range(12):
        a=i*math.pi/6
        d.line([(cx+r*1.35*math.cos(a),cy+r*1.35*math.sin(a)),(cx+r*1.75*math.cos(a),cy+r*1.75*math.sin(a))],fill="#FFC93C",width=max(2,int(S*0.035)))
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill="#FFC93C")
    fp=[f for f in glob.glob("/usr/share/fonts/**/DejaVuSans-Bold.ttf",recursive=True)]
    if fp: d.text((cx,cy+r*0.05),"?",font=ImageFont.truetype(fp[0],int(r*1.5)),fill="#0E6A61",anchor="mm")
    return im
for S,name,m in [(192,"icon-192.png",0),(512,"icon-512.png",0),(512,"icon-maskable-512.png",1),(180,"apple-touch-icon.png",0),(32,"favicon-32.png",0)]:
    icon(S,m).save("icons/"+name,optimize=True)
# QR-Code (python-qrcode, Pfad als Argument)
if len(sys.argv)>1:
    sys.path.insert(0,sys.argv[1]); import qrcode
    q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,border=2); q.add_data("https://befuec.github.io/wasGeht/"); q.make(fit=True)
    M=q.get_matrix(); n=len(M)
    p="".join(f"M{x} {y}h1v1h-1z" for y,row in enumerate(M) for x,v in enumerate(row) if v)
    open("icons/qr.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" shape-rendering="crispEdges"><rect width="{n}" height="{n}" fill="#fff"/><path d="{p}" fill="#000"/></svg>')
print("ok")
