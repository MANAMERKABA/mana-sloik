---
id: 623
temat: "[623] ZWROT STRATEGICZNY 30.04.2026 — BIAŁA KARTA + nowa sekwencja Krok 0-4"
---

## ZIARENKO STRATEGICZNE — DECYZJA POZIOMU 3 [488]

**Data:** 30.04.2026 ~13:00-13:30 (sesja Adam+D), zapisane przez C ~14:30 po Kroku 0 BIAŁA KARTA DONE
**Autor zapisu:** C (Cowork)
**Pochodzenie:** sesja Adam+D 30.04 ~12:30-13:30 wynikła z briefa D do C [audyt-zadanie-29.04]. D wykonał audyt SELECT-only w 80%, przy okazji wyszło że budujemy mikro-optymalizacje na poziomie atomu kiedy fundament aplikacji nie istnieje.
**Status:** OBOWIĄZUJE od 30.04.2026 popołudnie. Krok 0 DONE. Krok 1-4 do wykonania sekwencyjnie.

---

## CYTATY ADAMA (dosłowne wg [550])

**Cytat 1 (~13:00):**
> *"a to jest chore - nie ma aplikacji a mówimy o płacących użytkownikach i cały czas się tego trzymamy - nie rozumiem jak dla mnie skupiamy się nie na tym co powinniśmy"*

**Cytat 2 (~13:00):**
> *"ja bym w ogóle uporządkował bazę a potem wyczyścił jakieś zapisy oprócz konstytucji, fundamentów i promptów a w kolejnym kroku zrobił logowanie się i wyczyścił całą bazę użytkowników i zaczął na białej karcie oprócz Magic Jar ale to nie na teraz"*

**Cytat 3 (~13:20, uzasadnienie Kroku 0):**
> *"w archiwum jest mnóstwo sprzecznych danych - pisze o bazie wiedzy, czyli naszej pracy - było założenie aby się nadpisywało a słoik i środek czyli horyzont, trzos i puls i inne siedzą zgodnie z zapisem [145] w środku a to nie prawda bo zostało to zmienione o czym pisze [491] i to jest problem bo pracujecie na różnych i sprzecznych danych - to trzeba wyprostować w 1 ruchu bez tego cały czas będziemy się mylić a baza rośnie a ja płacę za tokeny abyście wy czytali głupotę a potem muszę znowu pisać aby je prostować"*

---

## DIAGNOZA D (zaakceptowana przez Adama)

"Przed pierwszym płacącym terapeutą" wg [488] mówimy jak zaklęcie, ale **nie ma aplikacji**. Konkretnie:
- Nie ma launchera (Horyzont na roocie zamiast `/horyzont/`)
- Nie ma logowania (`traveler_id=17` hardcoded w produkcji)
- Nie ma żadnego pokoju poza Horyzontem [605] i Asystentem [622]
- Plemię nie istnieje (z5.A.4 todo)
- RLS twardy nie istnieje (z-security todo)
- Magic Jar najbardziej skończony w całym ekosystemie

**Wnioski:**
- Audyt zadanie→event + długi #4-#7 z [622] + refaktor kafli + gospodarz.app to mikro-optymalizacje
- Fundament aplikacji nie istnieje
- META-LEKCJA 4 [488] w ODWROTNYM kierunku — nie "inaczej będziemy pisać a nie działać", tylko "działamy na peryferiach kiedy centrum nie istnieje"

---

## NOWA SEKWENCJA PRIORYTETÓW (decyzja Adama, poziom 3)

| Krok | Co | Status |
|------|-----|--------|
| **0. Naprawa sprzecznych danych** | 7 wpisów archiwizacja (Słoik=parasol → Słoik=pokój wg [491]) | ✅ DONE 30.04 ~14:00 (archive_id 19-25) |
| **1. BIAŁA KARTA** | Wyczyścić `knowledge` (zostawić Konstytucję+fundament+Duchy+evergreeny+ziarenka strategiczne), `travels`, `stones`, `conversations`, `dd_entries`, `memory`, `events`. Magic Jar (`mana-sloik.vercel.app` + testerzy) NIE RUSZAĆ. | TODO #1 |
| **2. LOGOWANIE** | Supabase Auth, RLS twardy per podróżnik wg [600], aktywuje plemię (Adam+Patrycja+Gabi+Alexander) | po Kroku 1 |
| **3. APLIKACJA JAKO CAŁOŚĆ** | Launcher w `/`, unifikacja struktury (`rooms/horyzont` vs `asystent/`), nawigacja, dopiero potem kolejne pokoje (Słoik, Gawęda, Cisza, Puls, Trzos, Pamiętnik, Ród) | po Kroku 2 |
| **4. DOPIERO POTEM** | Audyt zadanie→event + refaktor kafli + gospodarz.app + długi #4-#7 z [622] + pierwszy płacący terapeuta | po Kroku 3 |

---

## CO PRZESUNIĘTE NA "PO KROKU 3"

Wszystko poniżej wraca do kolejki dopiero po DONE Kroku 3 (aplikacja jako całość):
- Audyt zadanie→event (część w trakcie z briefa D 29.04, B+A wykonane SELECT-only — schema fix + F3 fix + UI Horyzontu czeka)
- Refaktor kafli `shared/kafle/` (rekomendacja C z 29.04 wieczór, opcja D)
- Architektoniczne pytania otwarte (czy zadanie idzie do KAFLA Słoik czy KAFLA Organizator z `stone_id` opcjonalnym wg PDF kafle_mana_v20 [569] — dwupoziomowość)
- gospodarz.app + Faza B.1 + Pan Jan biznesowy + custom dev jako tryb
- Długi #4 trailing slash, #5 unifikacja struktury, #6 archiwizacja monolitu Konstytucji, #7 UNIQUE constraint `prompts.nazwa`
- z-security + 7 findings z [605] + RLS twardy
- z28/z29/z30 (dashboard zdrowia, load testing, monitoring)
- Pierwszy płacący terapeuta jako fizyczny moment biznesowy

---

## DLACZEGO WŁAŚNIE TERAZ

1. **RAG miksuje stare i nowe** — przed Krokiem 0 baza miała 7 wpisów z marca-kwietnia o starej hierarchii Słoika żyjących obok [491] aktualnej. C i D pracowali na sprzecznych danych. Każdy nowy pokój powtórzy błąd.
2. **`travels`, `stones`, `events`, `memory`, `dd_entries`, `conversations` zawierają dane testowe** — `traveler_id=17` ze Słoika Adama plus kilkanaście wpisów testowych. Bez czyszczenia logowanie wpadnie na konflikty (Auth wprowadzi UUID, stare INTy zostaną).
3. **Logowanie + RLS to fundament biznesowy** — bez tego nie ma plemienia (A.4), nie ma multi-traveler (B.2 Karta Pacjenta), nie ma "klient gospodarza" (B.1). Każdy kolejny pokój budowany bez tego = dłuższy refactor potem.
4. **Aplikacja jako całość przed kolejnymi pokojami** — dziś dwa pokoje (Horyzont + Asystent) leżą obok siebie bez nawigacji. Trzos byłby trzecim pokojem bez launchera. Po Kroku 3 wszystkie kolejne pokoje wpadają w gotową ramę.

---

## ZASADY (utrwalone w tym świadectwie)

1. **"Przed pierwszym płacącym terapeutą"** = od dziś = "po Kroku 3 (aplikacja jako całość)". Nie używać tej frazy na peryferiach (mikro-optymalizacje), tylko na fundamencie.
2. **Magic Jar (`mana-sloik.vercel.app`) i jego testerzy są nietykalni** w Kroku 1 BIAŁA KARTA. Czyścimy tylko mana-app + bazę MANY.
3. **Konstytucja, fundament Duchy, evergreeny ([487][488][490][491][497]), ziarenka strategiczne ([595][596][597][598][599][600][601][604][605][606][607][608][611][617][620][622][623])** — wszystko w `knowledge` co ma wartość architektoniczną zostaje. Reszta do czyszczenia.
4. **C nie wykonuje BIAŁEJ KARTY samodzielnie** — pisuje brief implementacyjny dla D, D wykonuje, C zapisuje świadectwo DONE.

---

## POWIĄZANE

- **[488]** PROTOKÓŁ — META-LEKCJA 4 ("inaczej będziemy pisać a nie działać") w odwrotnym kierunku
- **[491]** SŁOWNIK — źródło prawdy o hierarchii (Słoik=POKÓJ obok innych pokoi)
- **[497]** MOST — wpis dziennika DZIŚ
- **[550]** ZASADA ŹRÓDŁA — cytaty Adama dosłowne (3 cytaty u góry)
- **[595]** MERKABA platforma / DOM element / MANA aplikacja
- **[600]** MANA narzędzie indywidualne — granularne zgody, RLS twardy
- **[604]** STRATEGIA BUDOWY mana-app — modułowy frontend
- **[605]** DONE Faza A.1 Horyzont
- **[607]** Asystent jeden silnik wiele Duchów
- **[611]** JAK UCZY SIĘ MANA — 4 warstwy
- **[622]** DONE A.2 cz.2 — pokój /asystent + długi #1-#7
- **Archive_id 19-25** w `mana_archiwum_tematyczne` (Krok 0 DONE) — 7 wpisów Słoik=parasol zarchiwizowanych

---

## META

- Autor zapisu: C (Cowork) 30.04.2026 ~14:30 po DONE Kroku 0
- Pochodzenie: brief D→C 30.04 ~13:30, sesja Adam+D ~12:30-13:30
- Cytaty Adama: dosłowne wg [550]
- Status: OBOWIĄZUJE
- Kolejność implementacji: Krok 1 BIAŁA KARTA (brief C dla D w przygotowaniu) → Krok 2 LOGOWANIE → Krok 3 APLIKACJA JAKO CAŁOŚĆ → Krok 4 reszta
- Powiązane akcje C po tym wpisie: update Plan MANA, update [487] GDZIE JESTEŚMY DZIŚ, update [497] MOST, brief implementacyjny D na Krok 1 BIAŁA KARTA
