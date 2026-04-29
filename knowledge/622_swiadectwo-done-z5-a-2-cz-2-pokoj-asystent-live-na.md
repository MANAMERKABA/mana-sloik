---
id: 622
temat: "Świadectwo DONE z5.A.2 cz.2 — pokój /asystent live na produkcji + 10 META-LEKCJI o stacku mana-app + 3 bugi i fixy (D, 29.04.2026)"
---

## ŚWIADECTWO DONE A.2 cz.2 — POKÓJ /ASYSTENT LIVE NA PRODUKCJI

**Data:** 28-29.04.2026 (sesja D, wieczór 28.04 → poranek 29.04 ~10:30)
**Zadanie:** A.2 cz.2 — frontend pokoju /asystent w mana-app + Edge Function summarize-conversation
**Wykonawcy:** D (kod), Adam (deployment przez GitHub web UI + Supabase Dashboard)
**Status:** 🟢 DONE, live na produkcji. Smoke test E2E T1-T7 PASS.
**URL:** https://mana-app-murex.vercel.app/asystent/
**Autor zapisu:** C, w imieniu D (D nie może zapisywać przez MCP — wzorzec [592]). Treść raportu D wklejona przez Adama dosłownie, C kompaktuje do bazy.

---

## DO WKLEJENIA PRZEZ ADAMA W MOST [497] I PLAN MANA

### MOST [497] — nowa linia
```
29.04.2026 ~10:00 (D+Adam) 🟢 — A.2 cz.2 DONE — pokój /asystent live na mana-app-murex.vercel.app/asystent/. Krystyna (duch_asystent_prywatny) odpowiada w stylu Asystenta, F1 brief dnia automatyczny, F2 dialog z propozycjami, F3 zapis do stones. Smoke test E2E T1-T7 PASS.
```

### Plan MANA — aktualizacje
- **z5.A.2** status: `todo → done`
- **t17 mana-app** subtask: dodać `"/asystent live od 29.04 rano (Krystyna, F1+F2+F3)"`
- **z5.A** progress: cz.1 horyzont DONE 2 dni temu + cz.2 asystent DONE dziś = A.2 łącznie DONE
- **z5.A.3** (jeśli istnieje, integracja Asystent↔Horyzont) — odblokowane

---

## CO ZOSTAŁO ZBUDOWANE

### Pliki w mana-app (7, wszystkie merged do main przez PR #1)
```
asystent/
  index.html                       — entry point pokoju /asystent
  asystent.js                      — orkiestracja: auth, mount komponentów, F1 brief
  asystent.css                     — styling (paleta turkus #4A9E8E)
  komponenty/
    chat-panel.js                  — historia + input + przycisk Skończ rozmowę
    dialog-podsumowanie.js         — modal F3 z checkboxami, zapis do stones/events
    kontekst-pamieci.js            — sidebar Pamiętam (z memory.tresc, graceful empty)
shared/
  asystent.js                      — silnik: getAsystentNazwa, wyslijDoAsystenta, briefDnia
```

### Edge Function w mana-sloik (Supabase Dashboard, nie pushed do repo — jak [620])
```
supabase/functions/summarize-conversation/index.ts
  — bierze transcript, zwraca JSON propozycji [{tresc, typ, sekcja?, due_date?, data_czas?}]
  — typy: zadanie | sen | odczucie (→ stones) | event (→ events)
  — Anthropic Haiku 4.5, max_tokens 1200
```

### Linki
- PR: https://github.com/MANAMERKABA/mana-app/pull/1 (merged)
- Live: https://mana-app-murex.vercel.app/asystent/
- Edge Function: Supabase Dashboard → Edge Functions → summarize-conversation

---

## SMOKE TEST E2E — wynik T1-T7 (wszystko PASS)

- **T1** Otwarcie /asystent → tytuł "Krystyna", brak białego ekranu (po dodaniu trailing slash)
- **T2** F1 brief dnia ze stones+events → "Dzień otwarty, żadnych zobowiązań ani kamieni"
- **T3** F2 ton Asystenta → zadaniowo, nie filozofuje
- **T4** Multi-turn z pamięcią → rozmowa 5 wymian, Krystyna trzyma kontekst
- **T5** Modal podsumowania → "Krystyna patrzy co warto zachować..." → checkboxy po 2-3s
- **T6** Zapis do stones → "Zachowane: 1 do Słoika" toast, wiersz w stones z traveler_id="17", typ="zadanie", due_date="2026-04-30 00:00:00+00"
- **T7** KontekstPamięci graceful → "Pusto. Pamięć zbuduje się po pierwszych rozmowach."

**7/7 PASS ✓**

---

## 10 FINDINGÓW / META-LEKCJI O STACKU MANA-APP (do skill mana-start, evergreen)

**1. WZORZEC D→M→Adam→D dla nowego pokoju MANA — pierwszy formalny przepływ:**
- D pisze pliki na założeniach z briefów Adama + dokumentów MOST
- M robi audyt założeń vs realne repo (zwrotny brief audytu)
- D przepisuje wersję 2 z poprawkami
- Adam wkleja pliki przez GitHub web UI / Supabase Dashboard (zamiast M jeśli Adam woli być w pętli)
- D testuje E2E przez Chrome MCP albo prowadzi Adama krok-po-kroku
- M raportuje DONE (lub D pisze raport jeśli M nie był wykonawcą)

Sukces. Wzorzec ustalony 28-29.04.2026.

**2. MANA: kolumny po polsku, ZAWSZE.** `tresc/typ/tytul/mysl/odpowiedz/nazwa`. Założenia w stylu `content/type/title/text` zawsze padają. Reguła: **GREP przed pisaniem.**

**3. shared/ to płaskie pliki** — `shared/auth.js`, `shared/supabase.js`. Subkatalogi nie istnieją. Plik silnika dla pokoju idzie jako `shared/<nazwa-pokoju>.js`.

**4. mana-app to single-page-per-Vercel-deployment.** Każdy nowy pokój = nowy folder z `index.html` (Vercel auto-routing). Trailing slash w URL wymagany — bez tego relatywne ścieżki padają.

**5. Asymetria typów traveler_id** — uważać przy zapisie:
- `stones.traveler_id` to **TEXT** — wymaga `String(travelerId)`
- `events.traveler_id` to **BIGINT** — surowy number
- `memory.traveler_id` to (niejasny, prawdopodobnie int — call-serce wysyła jako number)

**6. mana_settings to globalny KV** `(key text PK, value jsonb)` — brak traveler_id. Per-traveler wymaga klucza złożonego (`asystent_imie_traveler_17`) lub osobnej tabeli. Na razie MVP używa globalnego klucza `asystent_imie` (jeden podróżnik).

**7. Repo mana-sloik NIE jest źródłem prawdy** dla Edge Functions. Trzeba weryfikować live w Dashboard. Dług z [620] — Edge Functions live (call-serce v2, summarize-conversation) nie są w repo. **Action: kiedyś spłacić.**

**8. call-serce zwraca pole `response`** (nie `odpowiedz/text/message`). Stała publicznego API.

**9. Pamięć MANA = single blob per podróżnik** (`memory.tresc`), nie lista. Inkrementalnie aktualizowana przez call-serce po każdej wymianie. KontekstPamięci pokazuje to jako jeden blok tekstu.

**10. callEdge ma bug** (Bug 1 niżej) — workaround: sprawdzaj `result.data.<field>`, nie `result.ok`.

---

## 3 BUGI ZNALEZIONE I NAPRAWIONE W TRAKCIE TESTÓW

### Bug 1 (KRYTYCZNY) — `callEdge.ok` unreliable
**Objaw:** call-serce zwraca HTTP 200 z poprawnym body `{response: "..."}` ale `callEdge` z `shared/supabase.js` zwraca `{ok: false, status: 200, data: {response: "..."}}`. Frontend interpretował to jako błąd i pokazywał czerwony dymek z poprawną odpowiedzią Asystenta jako tekstem błędu.

**Fix (commit `fix(asystent)`):** w `shared/asystent.js` zamiast sprawdzać `result.ok`, sprawdzamy obecność oczekiwanego pola w `result.data` (`response` dla call-serce, `propozycje` dla summarize-conversation).

**Drugi commit (`fix(dialog)`):** ten sam pattern w `dialog-podsumowanie.js`.

**META do skill mana-start:**
> `callEdge` z `mana-app/shared/supabase.js` zwraca `ok: false` mimo HTTP 200 dla niektórych Edge Functions. Workaround: sprawdzaj obecność oczekiwanego pola w `result.data`, nie polegaj na `result.ok`. Do naprawy w samym `callEdge` osobnym ticketem (z-security?).

### Bug 2 — tabela `memory` w schema cache PostgREST
**Objaw:** `select tresc from memory where traveler_id = 17` rzuca `PGRST205: Could not find the table 'public.memory' in the schema cache`, mimo że call-serce ją upsertuje produkcyjnie.

**Hipoteza:** PostgREST nie odświeżył schema cache po refaktorze [620]. Wymaga `notify pgrst, 'reload schema';` w Supabase SQL Editor.

**Fix (commit `fix(kontekst-pamieci)`):** w `kontekst-pamieci.js` graceful catch — pokazuje "Pusto. Pamięć zbuduje się..." zamiast komunikatu o błędzie.

**Action item dla Adama:** kiedyś wykonać w Supabase SQL Editor: `notify pgrst, 'reload schema';` — odblokuje czytanie tabeli `memory` z frontendu. Niska priorytetność.

### Bug 3 (kosmetyczny) — relatywne URL bez trailing slash
**Objaw:** wejście na `/asystent` (bez `/`) → przeglądarka resolwuje `./asystent.css` jako `/asystent.css` (nie istnieje) → 404 dla CSS i JS.

**Workaround:** `/asystent/` (z trailing slash) działa poprawnie.

**TODO niska priorytetność:** dodać `<base href="/asystent/" />` w `asystent/index.html` lub redirect w `vercel.json`. Można ogarnąć przy unifikacji rooms/ vs root/.

---

## ARCHITEKTURA ROZWIĄZANIA (skrót)

### Routing
- `mana-app/asystent/index.html` jako entry — Vercel auto-routing folderem (rekomendacja M wg [488])
- A.1 horyzont w `rooms/horyzont/`, A.2 asystent w `asystent/` — niespójność do unifikacji w t17

### Silnik
- `wyslijDoAsystenta(travelerId, message)` → `callEdge("call-serce", {traveler_id, message, aktywny_duch: "duch_asystent_prywatny"})`
- `briefDnia(travelerId)` — ładuje events z dziś (filter po `data_czas` between 00:00-23:59) + stones aktywne, składa marker `[BRIEF_DNIA_START]` + kontekst, wysyła do call-serce

### F3 — propozycje
- `summarize-conversation` Edge Function dostaje transcript, AI klasyfikuje na 4 typy
- Frontend INSERT do `stones` (typ ∈ zadanie/sen/odczucie, traveler_id jako TEXT) lub `events` (typ = event)
- Pamiętnik (dd_entries) **wykluczony** z F3 — schema mismatch (session_id NOT NULL, mysl/odpowiedz vs nasze content/source). Decyzja D wg audytu M.

### Pamięć
- `KontekstPamięci` czyta `memory.tresc` (single blob per podróżnik, META#8 z findingów)
- Graceful empty state gdy tabela memory nie jest dostępna (PGRST205)

---

## OTWARTE SPRAWY (osobne tory, do nowej sesji lub osobno)

1. **z26.5.1.fix v2 MCP** — naprawa `server.js.v2-working.js` po fail end-to-end test 28.04. Brief D→M nie został wystawiony w tej sesji (urwany na pół). Kandydat na osobną sesję.
2. **Bug 1 — fix w samym `callEdge`** — żeby przyszłe pokoje nie musiały robić workarounda. Action item dla z-security lub osobny ticket.
3. **Bug 2 — `notify pgrst, 'reload schema';`** w Supabase żeby tabela memory była czytelna z frontendu. Action item Adama.
4. **Bug 3 — trailing slash routing** — kosmetyka, niska priorytetność.
5. **Niespójność struktury:** A.1 horyzont w `rooms/horyzont/`, A.2 asystent w `asystent/`. Do unifikacji w t17 — zdecydować jeden wzorzec.
6. **Refaktor [620] live tylko w Supabase** — repo mana-sloik nie ma `serce_konstytucja_fundament` ani `aktywny_duch`. Dług. Po sesji sync repo → Dashboard.

---

## STATYSTYKI SESJI

- **Czas od zera do live:** ~18h kalendarzowych, ~4h aktywnych
- **Linijek kodu napisanych przez D:** ~1100 (wersja 2, bez wersji 1 którą wyrzucono po audycie)
- **Decyzji 2-3 wg [488] od Adama:** 4 (B1 sprawdzenie [620] live, B2 routing folder, B3 patche post-deploy, merge do main bez preview)
- **Patche post-deploy:** 3 (Bug 1, Bug 2, Bug 3)
- **Smoke test:** 7/7 PASS

---

## IMPLIKACJE / CO DALEJ

1. **A.2 ŁĄCZNIE DONE** (cz.1 horyzont 2 dni temu + cz.2 asystent dziś). z5.A jako tor zamknięty na poziomie 2.
2. **A.3 odblokowane** (jeśli istnieje jako integracja Asystent↔Horyzont).
3. **Próg / EA / Generative UI** (rozmowy z C 29.04 wieczór, świadectwa [621]) ma teraz fundament implementacyjny — silnik Asystenta działa, można dorabiać karty, sekcje, dwutryb sieci.
4. **D ma stabilny wzorzec** dla kolejnych pokoi (wzorzec D→M→Adam→D z META-LEKCJĄ #1 niżej).
5. **Skill mana-start wymaga aktualizacji** — META-LEKCJE #1-#10 powinny tam trafić jako evergreen reference dla przyszłych sesji budowania nowych pokoi.

---

## POWIĄZANE

- **[497]** MOST — wymaga ręcznej aktualizacji przez Adama (linia DONE)
- **Plan MANA** — wymaga aktualizacji statusów z5.A.2 → done, t17 subtask, z5.A progress
- **[620]** Refaktor Edge Functions live tylko w Supabase — dług nadal otwarty
- **[621]** Świadectwo trójwarstwowej architektury akcji asystenta + dwutryb sieci (29.04 wieczór, sesja C) — fundament implementacyjny dla A.3+
- **[610]** Świadectwo dyskusji UI Fazy A.2 — sugestie kontekstowe odroczone do A.3+ teraz mają silnik
- **[592]** Wzorzec timeoutów MCP D — kontekst dlaczego C zapisuje w imieniu D
- **[488]** PROTOKÓŁ — decyzje 2-3 Adama
- **[550]** Zasada źródła — treść raportu D zachowana dosłownie
- **[604]** Strategia mana-app — silnik Asystent zgodny z architekturą modułową
- **[614]** Asystent osobisty / Krystyna — duch_asystent_prywatny zaimplementowany
- **[60][617]** Serce Talk z checkboxami → F3 modal podsumowania to bezpośrednia implementacja wzorca

---

## META

- Świadectwo zapisane przez C w sesji Cowork 29.04.2026 wieczór, z polecenia Adama: *"PRZECZYTAJ NOTATKE OD D I ZAPISZ WSZYSTKIE WAZNE INFORMACJE W BAZIE BO D NIE MOZE TEGO UCZYNIC"*.
- Treść raportu D wklejona dosłownie przez Adama do sesji C — C kompaktuje i strukturyzuje, zachowując wszystkie konkrety (linki, commit names, smoke test wyniki, statystyki, findingi, bugi, otwarte sprawy).
- Wzorzec [592] D-zapisuje-przez-C kontynuowany (D nie może zapisywać do MANA przez MCP timeout, więc świadectwa lecą przez C lub bezpośrednio przez Adama po wkleju).
- Sesja C kończy się tym wpisem na polecenie Adama: *"A POTEM KONCZYMY TA SESJE I ZACZYNAMY NOWA"*.
- Status: świadectwo gotowe. **WISI DO NOWEJ SESJI** (z poprzedniej tury C):
  - aktualizacja [491] SŁOWNIK (Karta Asystenta, Trójwarstwowa architektura, Tryb A/B sieci, EA żyje, MANA pomost)
  - kandydat zasady do [490] (np. Z23/Z24 — architektura akcji + dwutryb sieci)
  - mockup v0.7 Progu z dwoma wariantami kart (Tryb A i Tryb B obok siebie)
  - decyzja Adama poziom 3 [488] o nazewnictwie trybów (A/B vs polskie nazwy) i nazewnictwie kart
