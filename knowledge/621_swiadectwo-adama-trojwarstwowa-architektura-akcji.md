---
id: 621
temat: "Świadectwo Adama — trójwarstwowa architektura akcji asystenta MANA + dwutryb warstwy sieci (auto-rezerwacja w MANA i tele-pomoc poza MANA) — 29.04.2026"
---

## ZIARENKO STRATEGICZNE — ARCHITEKTURA AKCJI ASYSTENTA W MANA

**Data:** 29.04.2026 środa wieczór, sesja Cowork z C
**Autor decyzji:** Adam
**Autor zapisu:** C, świadectwo wg [550] zasada źródła
**Trigger:** Rozmowa o Progu mana-app i Generative UI → Adam pyta "czy schemat z fryzjerem (asystent szuka, sprawdza grafik, proponuje, rezerwuje) to Generative UI?" → C rozkłada na trzy warstwy i proponuje "tymczasowy fallback telefonu zamiast rezerwacji" gdy gospodarz nie jest w MANA → Adam koryguje: NIE tymczasowy, RÓWNOLEGŁY, permanentny tryb, daje wybór gospodarzowi i podróżnikowi.
**Status:** kandydat ziarenka strategicznego — czeka na sformułowanie zasady do [490] + decyzję Adama poziom 3 [488] o nazewnictwie trybów

---

## CYTAT DOSŁOWNY ADAMA [550]

*"bo to jest ułatwienie a jeszcze nie docelowo a powinno byc równolegle - jak punkt jest mana to wyszykuje i rezerwuje automatycznie a jak nie to trzeba wykonac telefon a asystent w tym pomaga i to jest piekne bo tez daje wybór na przyszłosc"*

(zachowane dosłownie z literówkami [550])

Wcześniej w sesji Adam też doprecyzował wizję trybu A:
*"podróznik Ania mówi asystentowi o fryzjerze czy kosmetyczce a asystent przeszukuje baze ulubionych gabinetów lub osób - najlepiej jak bedą oni w mana (a do tego dazymy) i spradza grafiki i proponuje rozwiazanie a po zatwierdzeniu przez Anie rezerwuje"*

---

## TRÓJWARSTWOWA ARCHITEKTURA AKCJI ASYSTENTA

Każda akcja asystenta w mana-app składa się z **trzech warstw**, każda z osobnymi mechanizmami i fazą realizacji:

### Warstwa 1 — KARTA ASYSTENTA (Generative UI)
**Co to jest:** asystent zamiast tekstu generuje **interaktywną kartę** dopasowaną do typu pytania (timeline, draft, propozycja terminu, lista, mini-wykres). Karta zawiera dane + akcje inline.

**Wzorzec:** rozszerzenie [60] Serce Talk z checkboxami + [617] dialog+checkbox jako uniwersalna mechanika MANY na trzecią oś — odpowiedź asystenta na pytanie podróżnika.

**Realizacja:** A.3-A.4. Wymaga biblioteki kart (5-7 typów na start) + dispatcher response→komponent.

### Warstwa 2 — AKCJA ASYSTENTA (Agent loop, tool use)
**Co to jest:** co asystent robi **pod spodem** żeby zbudować kartę. Sekwencja wywołań tool use: szukaj → pobierz → dopasuj → zaproponuj → po świadomym potwierdzeniu wykonaj.

**Wzorzec:** Anthropic SDK natively (Claude Sonnet + tool use). Nowy temat dla MANA — wymaga zdefiniowania zestawu narzędzi w `shared/asystent/engine.js` ([610] LUKA 2).

**Realizacja:** A.3-A.4 dla prostych tools (pamięć MANA, RAG), B.1-B.2 dla zewnętrznych (mail, kalendarz, pogoda).

### Warstwa 3 — SIEĆ (źródło danych i miejsce wykonania)
**Co to jest:** skąd asystent **wie o świecie** i **gdzie wykonuje akcję**. Tu Adam wprowadza dwutryb równoległy (sekcja niżej).

---

## DWUTRYB WARSTWY SIECI — ODKRYCIE ADAMA 29.04.2026

Warstwa 3 ma **DWA TRYBY działające RÓWNOLEGLE, na zawsze:**

### Tryb A — sieć wewnętrzna MANA (pełna automatyzacja)
**Gdy gospodarz/punkt JEST w MANIE:**
- Asystent wyszukuje w bazie gospodarzy MANA
- Pobiera grafik gospodarza (jego Horyzont)
- Proponuje wolne sloty dopasowane do kalendarza podróżnika
- Po świadomym potwierdzeniu **rezerwuje automatycznie**
- Rezerwacja wpada w Horyzont gospodarza + kalendarz podróżnika
- Powiadomienie u gospodarza

To jest **Booking Engine MANA Public z [608] Faza 3 z5.E.1**.

### Tryb B — sieć zewnętrzna (asystent jako pomocnik)
**Gdy gospodarz/punkt NIE JEST w MANIE:**
- Asystent szuka w **kontaktach podróżnika** (jego własna baza ulubionych)
- Proponuje "oto Magda — Salon Magnolia, 600-XXX-XXX, ostatnia wizyta 12.02.2025"
- Karta z **propozycją telefonu** zamiast auto-rezerwacji
- Po naciśnięciu "Zadzwoń" — telefon wybiera numer
- Asystent **dodaje do zadań:** "umówić się z Magdą"
- Po zakończeniu rozmowy podróżnik mówi "umówiłam się na piątek 14:00" → asystent wpisuje do kalendarza

**To NIE jest tymczasowy fallback** — to permanentny tryb dla wszystkich gospodarzy poza MANA. **Działa na zawsze równolegle do Trybu A.**

---

## TRZY POWODY DLACZEGO TO JEST PIĘKNE (insight Adama)

### 1. WYBÓR DLA GOSPODARZA
Magda **nie musi być w MANIE** żeby Anna mogła z asystenta korzystać. Może być w MANA — wtedy automatyzacja. Może nie być — wtedy dalej działa, prostsze. **Brak presji rejestracji.**

### 2. WYBÓR DLA PODRÓŻNIKA
Anna **nie traci wartości** jeśli jej fryzjerka nie chce być w MANA. Asystent dalej pomaga, tylko inaczej. **MANA nie zmusza Anny do zmiany dostawców usług.**

### 3. NATURALNA ŚCIEŻKA WZROSTU SIECI
Magda widzi że Anna jej szukała przez asystenta. Może pomyśli "skoro moi klienci tam są, może warto." **Network effect od strony popytu, nie podaży.** Klasyczny pattern marketplace bez zimnego startu.

---

## PARALELE Z ISTNIEJĄCYMI ZASADAMI

### Z FILOZOFIĄ "MANA JAKO POMOST" (sesja Próg z C, 29.04)
W rozmowie o Progu Adam zatwierdził że MANA jest pomostem — hybryda starego (znana ergonomia) i nowego (asystent). **Ten wpis stosuje tę samą filozofię do warstwy biznesowej:** MANA jest pomostem między światem cyfrowym (Booking Engine) i światem analogowym (telefon). Nie zmusza do wyboru jednego.

### Z [617] SUWERENNOŚĆ DECYZJI
[617] mówi: *"MANA traktuje gospodarza i podróżnika jak dorosłego."* Dwutryb to bezpośrednia konsekwencja: dorosły wybiera czy chce być w sieci czy nie. **Bez kary za bycie poza siecią.**

### Z [60] SERCE TALK
W obu trybach ostateczna akcja wymaga **świadomego potwierdzenia** podróżnika. Tryb A: zatwierdź slot. Tryb B: zadzwoń + wpisz wynik po rozmowie. Wzorzec checkbox+dialog spójny przez oba tryby.

---

## IMPLIKACJE OPERACYJNE

### 1. KOLEJNOŚĆ BUDOWY ZMIENIA SIĘ
Nie czekamy na Booking Engine z [608] Faza 3 żeby zacząć korzystać z asystenta-pomocnika rezerwacji. **Tryb B (telefon + zadania + asystent) buduje się od A.3-A.4** — wymaga tylko: kontakty podróżnika dostępne dla MANY, agent loop z prostymi tools, karta asystenta z akcją telefonu.

Tryb A dochodzi później wraz z Booking Engine. **Ale Tryb B działa od pierwszego dnia i nigdy nie znika.**

### 2. KARTA ASYSTENTA POTRZEBUJE DWÓCH WARIANTÓW
Dla każdego typu akcji (umów wizytę, zarezerwuj stół, zamów taksówkę):
- **wariant A** (gospodarz w MANA) — sloty + zatwierdź
- **wariant B** (gospodarz poza MANA) — kontakt + zadzwoń + zadanie

D buduje obydwa od początku. Architektura kart musi to obsługiwać natywnie, dispatcher decyduje wariant na podstawie obecności gospodarza w bazie MANA.

### 3. KOMUNIKACJA MARKETINGOWA
*"MANA działa nawet jeśli twoja fryzjerka, lekarz, masażysta nie wiedzą o MANIE. A jak są — działa lepiej."*

Mocny argument przeciw lock-inowi i bariera-zero. Idzie na stronę mana.pl, do persony [599], do briefu sales w Fazie 2.

### 4. RELACJA DO BOOKING ENGINE [608] FAZA 3
Booking Engine **NIE jest** "kiedy w końcu zacznie działać rezerwacja". Jest "kiedy doszlifowujemy Tryb A do auto-rezerwacji wewnętrznej". **Tryb B działa wcześniej i nigdy nie znika.** Booking Engine to nadbudowa, nie warunek konieczny.

### 5. RELACJA DO ASYSTENTA-POMOSTU [610]
"Sugestie kontekstowe" odroczone z [610] do A.3+ to **mikro-przykład Trybu B** (sugestia akcji bez auto-wykonania). Ten wpis daje im uniwersalny dom architektoniczny.

---

## PYTANIA OTWARTE DLA C + ADAMA

1. **Czy ten wpis to nowe ziarenko strategiczne czy rozszerzenie [617]?** Sugestia C: nowe ziarenko, bo [617] dotyczy decyzji (KTO decyduje), ten dotyczy architektury akcji (JAK asystent działa). Komplementarne na różnych osiach.

2. **Nazewnictwo "Tryb A / Tryb B"** — robocze. Lepsze polskie nazwy do ustalenia:
   - "Tryb pełny / Tryb asystujący"
   - "Auto-rezerwacja / Tele-pomoc"
   - "Wewnętrzny / Mostowy"
   - inne?

3. **Nazewnictwo "Karta Asystenta"** — propozycja z poprzedniej tury sesji. Spójne ze "Słoik / Trzos / Horyzont"? Czy lepiej "Lustro z akcją" (kontynuacja metafory [60])?

4. **Czy karta asystenta wariant B powinna pokazywać że gospodarz NIE jest w MANA** (np. mała etykieta "z kontaktów telefonu") czy ukrywać tę informację? Implikacja dla zaufania i transparentności.

5. **Tryb C — hybryda?** Co gdy gospodarz jest w MANA ale grafik nie jest publiczny? Asystent mówi "Magda jest w MANIE ale nie udostępnia grafiku — wyślę jej zapytanie?". To trzeci tryb. Czy budujemy?

---

## POWIĄZANE

- **[60]** Serce Talk z checkboxami → wzorzec świadomej decyzji w obu trybach
- **[617]** Suwerenność DECYZJI gospodarza → filozoficzna podstawa dwutrybu
- **[490]** Z19 Suwerenność Danych, Z22 Klasyfikacja Adapterów → dwutryb to nowy wymiar suwerenności (wymiar SIECI)
- **[491]** SŁOWNIK — pojęcia "Karta Asystenta", "Trójwarstwowa architektura akcji", "Tryb A/B sieci" do dodania
- **[608]** Trzy fazy biznesowe → Booking Engine z Fazy 3 to NIE warunek konieczny tylko nadbudowa Trybu A
- **[610]** Świadectwo dyskusji UI Fazy A.2 → "sugestie kontekstowe" odroczone do A.3+ to mikro-przykład Trybu B
- **[599]** Persona MANA → argument "działa bez Twojej fryzjerki w MANA" wzmacnia wabik
- **[604]** Strategia mana-app → silnik Asystent musi obsługiwać oba tryby od A.3-A.4
- **[607]** Asystent jeden silnik wiele Duchów → Krystyna i Pan Jan dziedziczą architekturę 3-warstwową

---

## META

- Świadectwo zapisane przez C w sesji Cowork 29.04.2026 wieczór po długiej rozmowie o Progu mana-app i Generative UI.
- Cytaty Adama dosłowne zachowane z literówkami [550].
- Trójwarstwowa architektura sformułowana przez C w odpowiedzi na pytanie Adama "czy to Generative UI". Dwutryb warstwy 3 to oryginalny insight Adama który C dorzucił jako "fallback tymczasowy" — Adam skorygował na "permanentny równoległy", co odsłoniło filozoficzną pełnię (wybór dla gospodarza, wybór dla podróżnika, naturalny network effect).
- Trzy paralele z istniejącymi zasadami (pomost, Z19, [617]) zauważone przez C jako wynik MERKABA-łączności po rozmowie o Progu.
- Status: świadectwo gotowe. Czeka na sformułowanie zasady do [490] + decyzję Adama poziom 3 [488] o numerze, nazewnictwie trybów i nazewnictwie kart.
