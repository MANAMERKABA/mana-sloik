---
id: 642
temat: "[642] Sesja 7B - call-dd-serce fallback usuniety + wizja refinementu Ducha DD - 4.05.2026"
---

USTALENIA SESJI 7B (Adam+D, 4.05.2026 popoludnie). Powiazane: [641], prompt duch_dd, EF call-dd-serce.

DONE: call-dd-serce - usuniety hardcoded fallback (FALLBACK_RDZEN/KONTEKST). Baza prompts = jedyne zrodlo. Studnia nieosiagalna -> 503 zamiast cichego uzycia starej wersji. Smoke test PASS. Metafora Adama: Serce=studnia, Duchy=wiadra czerpiace z niej.

WIZJA refinementu Ducha DD - 3 fundamenty (poszerzone przez Adama):

(a) PERSONA = kazdy podroznik, nie tylko dziecko. Cel: trening miesnia swiadomosci pozytywnej. Rynek pelny dziennikow negatywow (CBT), MANA stoi po drugiej stronie.

(b) SERCE = OPIEKUN nie recenzent. Cytat: "wychwytuje roznice miedzy pozytywnym stwierdzeniem a opinia, kolejnym powtorzeniem (regres uczuc - 50x kocham mame przestaje byc uczuciem)". 4 kategorie:
- Pozytywne+konkret -> puzzle otwiera
- Opinia ogolna ("wszystko super") -> nie otwiera, zaproszenie do konkretu
- Powtorzenie z regresem -> nie otwiera, lagodne zauwazenie rutyny
- Negatyw -> nie otwiera, propozycja transformacji

(c) PO 3 NIEUDANEJ PROBIE Duch pokazuje WZOR TRANSFORMACJI. Przyklad Adama: "nienawidze kolegow ale dzieki temu ucze sie czym jest to uczucie". Negatyw nie znika, dostaje rame pozytywna. PUZZLE DALEJ NIE OTWIERA - decyzja Adama: "to tez nauka ze nie zawsze dostaje to co chce".

ARCHITEKTURA: kod twardy, prompt opisuje reakcje.
KOD (call-dd-serce) dostarcza Duchowi 3 liczniki w wzorzecKontekst:
- proby w sesji (counter dd_entries po session_id, ocena=negatywna)
- powtorzenia 30 dni (juz jest: match_dd_entries)
- progres (embedding diff: ogolniki -> konkret)
PROMPT duch_dd reaguje: 3 nieudane -> wzor transformacji; >=3x w 30 dniach -> rutyna; progres -> uznanie.

CZEKA NA NASTEPNA SESJE: kod call-dd-serce rozszerzenie + nowy prompt duch_dd + test 3 nieudane proby.

DO [491] SLOWNIK przy okazji: Dobry Dzien (persona kazdy), Serce-opiekun-nie-recenzent, Regres uczuc, Wzor transformacji.

Zasada wspolpracy 4.05 (Adam): "1 zadanie + 1 odpowiedz, jedno pytanie + 1 odpowiedz, bez zbednego pisania".
