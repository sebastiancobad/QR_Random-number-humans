# -*- coding: utf-8 -*-
"""
Genera el PNG del codigo QR para la lamina del deck.

    pip install qrcode[pil]
    python herramientas_qr.py https://USUARIO.github.io/REPO/?s=s04-2026-2s

Deja qr_actividad.png a 1200 px, tinta #1F497D sobre blanco.
"""
import sys
import qrcode
from qrcode.constants import ERROR_CORRECT_M

url = sys.argv[1] if len(sys.argv) > 1 else "https://USUARIO.github.io/REPO/"

qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_M,
                   box_size=20, border=2)
qr.add_data(url)
qr.make(fit=True)
img = qr.make_image(fill_color="#1F497D", back_color="white")
img = img.resize((1200, 1200))
img.save("qr_actividad.png")
print("qr_actividad.png generado para:", url)
