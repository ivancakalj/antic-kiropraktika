# Antika – Kostolomac

Statički sajt za Hadži Radomira Antića i porodicu Antić (narodna ortopedija, Dečanska metoda sinapsologije).

- Dizajn: rekreiran po uzoru na „Chiropractor & Spinal Health Clinic Website Design“ (Behance, FleexStudio).
- Sadržaj: preuzet sa https://kostolomac-antic.rs/ (O meni, Kako radim, Iz knjige utisaka, Video, Naslednici/Kontakt/Knjiga).

## Struktura

```
index.html            – cela stranica (jedna strana sa sekcijama)
assets/css/style.css  – stilovi (responsive: desktop / tablet / mobilni)
assets/js/main.js     – meni, animacije, slajder utisaka, video plejer
assets/img/           – slike preuzete sa postojećeg sajta
```

## Funkcije

- Fiksni meni koji postaje taman pri skrolovanju i označava trenutnu sekciju.
- „Zakažite termin“ otvara prozor za zakazivanje: izbor terapeuta, podaci, dan i deo dana.
  Poruka se šalje SMS-om, Viberom ili WhatsApp-om izabranom terapeutu (nema servera – sve ide preko telefona klijenta).
- FAQ i „Kako do tretmana“: samo jedno pitanje otvoreno, animirano otvaranje/zatvaranje.
- Animacije: uvod u hero sekciju, pojavljivanje sekcija pri skrolovanju, brojači, paralaksa, hover efekti
  (isključuju se ako korisnik u sistemu ima „smanji pokrete“).
- Slike su uvećane (EDSR super-rezolucija) i prikazuju se cele, bez sečenja.
- YouTube sličice su sačuvane lokalno u `assets/img/yt/`.

## Pokretanje

Nije potreban build – otvorite `index.html` u pretraživaču ili pokrenite lokalni server:

```
python3 -m http.server 8000
```

Sajt se može hostovati na bilo kom statičkom hostingu (GitHub Pages, Netlify, cPanel…).
