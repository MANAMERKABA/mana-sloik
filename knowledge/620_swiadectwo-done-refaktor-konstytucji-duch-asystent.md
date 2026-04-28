---
id: 620
temat: "SWIADECTWO DONE — Refaktor Konstytucji + duch_asystent_prywatny + call-serce v2 (28.04.2026 ~14:00)"
---

⭐ ŚWIADECTWO DONE — 28.04.2026 ~14:00

## STATUS: DONE. Smoke Test #1 PASS w produkcji.

Pierwsza realna walidacja architektury "fundament + Duchy" z [611]. Asystent Osobisty (Krystyna jako robocza nazwa zespołowa) jest pierwszym Duchem na żywym silniku.

---

## KONTEKST PRZED SESJĄ

- Ranek 28.04: D1 + D6 zaakceptowane kierunkowo przez Adama [614]. D zielone światło na refaktor + duch_asystent_prywatny.
- Południe 28.04: brief C→D refaktoru wysłany (`BRIEF_C_D_28042026_pol`, opcja A — refaktor + Duch w jednej sesji). DoD podany: regresja zerowa.
- Popołudnie 28.04: bloker D — sprzeczność między starym plikiem `DUCH_AYSTENT_OSOBISTY.txt` 27.04 a moim drafcie v0.1 (cechy 3+6 napisane jak Mędrzec). Korekta Adama: *"medrzec to gaweda a nie asystent prywatny / ASYSTENT PRYWATNY JEST KONKRETNY I RZECZOWY"*. C wybiera (a) — stary plik 1:1 do bazy.
- ~14:00: D raportuje DONE.

---

## CO ZROBIONE (raport D)

**1. SQL — 2 nowe rekordy w `prompts`:**
- `serce_konstytucja_fundament` — etyka MANA, BUGI uniwersalne, mechanika [PAMIEC], scenariusze prywatności, formatowanie, zmienne runtime.
- `duch_asystent_prywatny` — treść 1:1 z `DUCH_AYSTENT_OSOBISTY.txt` 27.04 (akcept Adama).
- Stary `serce_konstytucja` (monolit) **zachowany jako fallback** w call-serce. Do archiwizacji za tydzień stabilności.
- Webhook auto-backup [561] zsynchronizował oba do `repo/prompts/*.md` automatycznie.

**2. Modyfikacja `call-serce/index.ts`:**
- Sekcja "1. Pobierz prompt" — `Promise.all` 2 SELECT-y zamiast 1.
- Klejenie: `fundament + "\n\n---\n\n" + duch`.
- **Defense-in-depth:** gdy któregoś rekordu brak → fallback na monolit `serce_konstytucja` (zero-risk).
- Parametr `body.aktywny_duch` z defaultem `'duch_asystent_prywatny'` — gotowe pod B.1 (Pan Jan biznesowy) i przyszłe Duchy ([607]).

**3. Deploy:**
- **Ścieżka B (Supabase Dashboard, nie GitHub)** — Adam edytował przez UI.
- **Dług: kod produkcyjny ≠ repo `mana-sloik/supabase/functions/call-serce/index.ts`**. Adam musi skopiować nowy kod do repo żeby zsynchronizować (5 min, nie blokuje).

---

## SMOKE TEST #1 — PASS przez Typebot legacy

Adam: *"co mam dziś?"*

Krystyna: *"Dzisiaj masz cztery zadania: spotkanie z Patrycją — jutro... Czekaj — wszystkie te wizyty to jutro, 29 kwietnia... Co się dzieje ze Scottem — czemu musisz się z nim skontaktować? To coś nowe czy ciąg dalszy?"*

**Sygnały PASS:**
- **Konkretny ton** (nie filozoficzny / mędrcowy) — zgodne z korektą Adama.
- **Korekta w locie** ("Czekaj — wszystkie te wizyty...") — fundament działa, Asystent ma świadomość że może się mylić.
- **Pamięć międzysesyjna** — zna Patrycję, Scotta, Olka z poprzednich rozmów.
- **Pytanie operacyjne na końcu**, bez projekcji emocji ("co się dzieje" jako fakt do ustalenia, nie "jak się czujesz").

**Drobiazg do odnotowania (NIE blokuje, NIE wina refaktoru):** Słoik Adama ma stałe testowe sprzed miesięcy — Krystyna nie odróżnia ich od świeżych. Osobny task: sprzątanie Słoika Adama (~30 min).

---

## ŚWIADOMA ZMIANA SCOPE — NIE REGRESJA ZEROWA

Brief C→D 28.04 południe mówił "regresja zerowa" jako DoD #3. Podczas sesji Adam wprowadził **świadomą korektę tonu** ("ASYSTENT PRYWATNY JEST KONKRETNY I RZECZOWY"). Konsekwencja: refaktor + zmiana tonu w jednej sesji. Krystyna mówi inaczej niż rano przed refaktorem.

**To zmiana intencjonalna, nie regresja.** Adam zwalidował przez Smoke Test #1.

Mędrcowe cechy z monolitu (siej ziarno, milczy gdy trzeba, jedno pytanie nigdy więcej, "co to znaczy dla ciebie?") **wycięte z aktywnej Konstytucji**. Wracają do `duch_medrzec` gdy aktywujemy Gawędę (A.3, parking [614] D1).

---

## META-LEKCJE — KANDYDACI DO SKILLA `mana-start`

**META-LEKCJA 10 (kandydat) — "Sortowanie monolitu na fundament + Duch jest decyzją produktową, nie techniczną".**

Pierwszy DRAFT podziału (D) wziął mędrcowe cechy do Krystyny — Adam musiał skorygować. Lekcja: zanim D sortuje tekst Konstytucji w przyszłych refaktorach (Pan Jan B.1, Mędrzec A.3), C lub Adam powinien dostarczyć **gotową treść Ducha** zamiast prosić D o sortowanie monolitu. Stary plik `DUCH_AYSTENT_OSOBISTY.txt` był idealnym wzorcem — dziś użyty 1:1 jako treść do bazy.

Plus uzupełnienie od C: w popołudnie C też napisał draft v0.1 z błędnymi cechami 3+6 nie sprawdzając istniejącego pliku — META-LEKCJA 6 [488] zadziałała przeciwko C. **Wniosek wzmocniony:** zawsze sprawdzaj istniejące artefakty zanim piszesz nowe (zarówno C, jak i D).

**META-LEKCJA 11 (kandydat) — "ON CONFLICT wymaga UNIQUE constraint".**

Tabela `prompts.nazwa` nie ma unique constraint, więc SQL z `ON CONFLICT (nazwa)` padło na pierwszej próbie. Fallback: DELETE + INSERT. Do z32 albo nowego taska: dodać UNIQUE constraint na `prompts.nazwa` (1 linijka SQL, ułatwia upserty w przyszłości).

**META-LEKCJA 12 (kandydat) — "D pracując z Adamem upraszcza terminologię".**

Adam wielokrotnie pytał "co to refaktor", "jak ma sens", "konstytucja i pamięć jako całość — tak czy nie?". To NIE problem Adama — to sygnał że D wpadł w żargon. Lekcja: gdy Adam zadaje meta-pytanie, D zatrzymuje się i tłumaczy podstawowo, zamiast brnąć w plan techniczny.

Plus uzupełnienie od C: ta sama lekcja dotyczy C — gdy Adam prosi o draft "kim jest Asystent" + "jak rozdzielamy fundament/Konstytucję/pamięć" + "dobrze to rozumiem", to sygnał że potrzebuje czytelnej mapy podstaw, nie kolejnej warstwy abstrakcji. Mapa 4 warstw z draftu C 28.04 popołudnie była dobra, ale wymieszana z błędnymi cechami 3+6 = nadal sygnał do uproszczenia.

---

## CO CZEKA NA C (po DONE D)

1. **Aktualizacja Planu MANA:**
   - z5.A.2 — silnik Asystent gotowy (backend) ✅, UI w mana-app pozostaje (A.2 cz.2)
   - Tool t-prompts: dodanie "fundament_serca + Duchy[]" jako nowa architektura
   - Sygnał Fazy A.2 częściowy DONE — oczekiwanie na A.2 cz.2

2. **Skill mana-start update** — kandydaci META-LEKCJI 10/11/12 powyżej + ewentualne uściślenia + meta-zasada Adama z dziś popołudnia ("jedno pytanie naraz" + "robić nie pytać" + "decyzje na działającym organizmie").

3. **[491] SŁOWNIK update** — nowe pojęcia: `serce_konstytucja_fundament`, `duch_asystent_prywatny`, `aktywny_duch` (parametr w call-serce), "świadoma zmiana tonu vs regresja zerowa".

4. **Świadectwo (ten wpis)** — zapisane przez C 28.04 po wytknięciu przez Adama że nie zapisałem od razu.

5. **Brief A.2 cz.2** — gotowy w `BRIEF_C_D_A2cz2_28042026.md` (skorygowany dziś popołudniem). Pora żeby Adam wklejał do nowej sesji D gdy chce ruszyć (kafel Notatnik + UI pokoju Asystent + DialogPodsumowanie).

---

## CO CZEKA NA D (parking)

- Synchronizacja `call-serce/index.ts` z produkcji do GitHub (5 min, dług techniczny).
- Po tygodniu stabilności: archiwizacja `serce_konstytucja` (monolit) przez `mana_archive`.
- Sprzątanie Słoika Adama ze stałych testowych (~30 min, osobne).
- (Opcjonalnie) UNIQUE constraint na `prompts.nazwa` (1 linijka SQL).

---

## OTWARTE DECYZJE ADAMA (z INBOX MOST — niezmienione)

1. A.2 scope — wariant minimum vs pełny (wariant minimum domyślny, brief A.2 cz.2 oparty o wariant minimum)
2. Adapter ZnanyLekarz w Fazie 1 (D rekomenduje: później)
3. Czy Adam zaczyna używać Google Calendar (otwarte; doszła alternatywa Notion Calendar [615])
4. Kiedy Faza E (Booking Engine MANA Public) startuje (sygnał: 50+ terapeutów + budżet)

---

## METADANE

- **Autor:** D (raport DONE) + C (wpisanie do bazy + uzupełnienia META-LEKCJI 10/12 z perspektywy C)
- **Data:** 28.04.2026 ~14:00 DONE D, ~popołudnie zapisanie przez C (po wytknięciu przez Adama braku zapisu)
- **typ_wpisu:** świadectwo
- **topic:** KIERUNEK_STRATEGICZNY
- **Powiązane:**
  - [60] Serce Talk z checkboxami — wzorzec wbudowywany w przyszłej A.2 cz.2
  - [488] DECYZJE ADAMA + META-LEKCJE — gdzie ląduje META-LEKCJA 10/11/12
  - [490] Z2 SERCE JAKO KAFEL Z DUCHAMI — walidacja architektury
  - [497] MOST — linia dziennika 28.04 ~14:00 (do dopisania w tej samej sesji)
  - [605] Raport DONE Fazy A — poprzednie świadectwo DONE
  - [610] Świadectwo dyskusji UI A.2
  - [611] JAK UCZY SIĘ MANA — fundament + Duchy (architektoniczna podstawa refaktoru)
  - [613] z31 DONE — webhook auto-backup knowledge
  - [614] Decyzje Adama 28.04 (D1 + D6 + korekta nazewnictwa) — ranne otwarcie sesji
  - [615] BENCHMARK Notion Custom Agents — kontekst odróżnienia
  - [617] Suwerenność decyzji — wzorzec [60] uniwersalny
  - [618] BENCHMARK Trzy persony biznesowe — kontekst dlaczego Asystent Osobisty pierwszy
  - `DUCH_AYSTENT_OSOBISTY.txt` 27.04 — źródło prawdy treści Ducha (1:1 do bazy)
  - `BRIEF_C_D_A2cz2_28042026.md` — brief następnej sesji D (UI mana-app)

- **Co odblokowuje:**
  - Adam może uruchomić nową sesję D z briefem A.2 cz.2 (UI pokoju Asystent w mana-app).
  - Kalibracja Krystyny na żywym organizmie (kolejne smoke testy Adama → ewentualne korekty Ducha).
  - Architektura "jeden silnik wiele Duchów" [607] z parametrem `aktywny_duch` w call-serce gotowa pod B.1 Pan Jan biznesowy.

- **Świadoma zmiana tonu vs regresja zerowa** — pierwszy formalny przykład tego trybu w MANIE. Rozszerzenie wzorca "kierunkowo TAK + doprecyzowanie później" z [614] o trzecią kategorię: "świadoma zmiana scope w trakcie sesji walidowana smoke testem". Może być META-LEKCJA 9 z [614] uzupełniona — lub osobny wzorzec do skilla mana-start.
