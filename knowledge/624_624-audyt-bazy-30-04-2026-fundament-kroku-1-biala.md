---
id: 624
temat: "[624] AUDYT BAZY 30.04.2026 — fundament Kroku 1 BIAŁA KARTA + protokół anty-błędów C/D"
---

# [624] AUDYT BAZY MANA — 30.04.2026 wieczór

**Status:** EVERGREEN · OBOWIĄZUJE od 30.04.2026 · do przeczytania PRZED każdym briefem dotyczącym bazy danych

**Sesja:** Adam + D, 30.04.2026 ~14:00–22:30 (8.5h)
**Pochodzenie:** [623] zwrot strategiczny BIAŁA KARTA — Adam: *"trąbię o tym dwa miesiące, baza rośnie a my pracujemy na sprzecznych danych"*
**Cel:** udokumentować empiryczny stan bazy żeby kolejne sesje C/D nie pisały briefów z głowy.

---

## ZASADA NUMER JEDEN

**Każda nowa sesja C lub D, zanim napisze brief dotykający tabel bazy, MUSI przeczytać ten wpis [624].** 

Bez tego ryzyko: powtórzenie 4 błędów procesowych z 30.04 (patrz niżej) i zniszczenie produkcyjnego Magic Jara.

---

## STAN BAZY EMPIRYCZNY (30.04.2026)

**27 tabel w schemacie public.** Pogrupowane wg funkcji:

### A. Infrastruktura MERKABA (rejestry struktury) — 5 z 6 KŁAMIE
- `aplikacje` (7) — 🔴 BAŁAGAN: 3 wpisy to pokoje (Gawęda/Horyzont/Sloik JAR), brak 4 prawdziwych aplikacji (MANA, Panel Admina, EGZAMIN, PATI PLAN)
- `kafle` (8) — 🔴 BAŁAGAN: 5 z 8 to nie kafle (Baza Wiedzy/Konstelacje/Koszty API/Horyzont/Dziennik DD), brak 3 z 6 kanonicznych (Notatnik uniwersalny, Interfejs, Zdjęcie, EVENT)
- `pokoje` (4) — 🔴 BAŁAGAN: brak 9 pokoi MANA, brak Księżycowego Czasu, "Dobra Noc" zła nazwa (powinno "Spokojna Noc"), "Zagroda" wisi w pustce (NULL aplikacja_id)
- `pokoje_kafle` (1) — 🔴 BAŁAGAN: jedyny wpis bez sensu (Dobra Noc ↔ Baza Wiedzy, status nie_dotyczy)
- `mana_settings` (1) — ✅ OK: zawiera Plan MANA produkcyjny (klucz "plan", JSON)
- `koszty` (3) — 🟡 NIEKOMPLETNE: brak Cursor/Vercel/Supabase Pro/Resend/domeny, duplikat Vectorizer.ai, żaden wpis nie używa flagi cykliczny

**Konsekwencja:** rejestry strukturalne MANA (utworzone 8.04) NIGDY nie zsynchronizowane z decyzjami architektonicznymi z 24-26.04 ([491][595][604][607]). Tabele te są MARTWE — kod aplikacji ich nie czyta (pokoje są zaszyte na sztywno w mana-app folderach), ale każdy kto przeczyta je jako "źródło prawdy" dostanie kłamstwo.

### B. Baza wiedzy + archiwa
- `knowledge` (588) — główna baza, do czyszczenia w Kroku 1 BIAŁA KARTA
- `mana_archiwum` (838) — auto-trigger historia knowledge, brak embedding → poza RAG · NIE RUSZAĆ
- `mana_archiwum_tematyczne` (8) — ręczne archiwum, dziś +7 wpisów Krok 0 (archive_id 19-25) · NIE RUSZAĆ
- `mana_archiwum_tematyczne_audit` (3) — log usunięć RODO · NIE RUSZAĆ
- `prompts` (4) — Konstytucja + Duchy · NIE RUSZAĆ ✅ (sprawdzone empirycznie)

### C. Podróżnicy
- `travels` (57) — HUB centralny, 4 FK wskazują tu · FILTRUJ po whitelist 13 ID
- `login_history` (44) — historia logowań · FILTRUJ po whitelist
- `consent_codes` (6) — **system zgody RODO Magic Jara** ([350][290][356]), produkcja od 29.03 · NIE RUSZAĆ ⚠️ (NIE jest "starym szkicem logowania" — to żywy MJ)

### D. Rozmowy i myśli
- `conversations` (326) — rozmowy z Sercem (MJ Typebot + MANA call-serce) · FILTRUJ (traveler_id TEXT)
- `dd_entries` (158) — myśli "Dobry Dzień" Magic Jara · NIE RUSZAĆ — rdzeń MJ
- `stones` (32) — kamienie ze Słoika · FILTRUJ (traveler_id TEXT)
- `trainer_notes` (57) — notatki trenerów · FILTRUJ pośrednio
- `trainers` (2) — Adam17 + Patrycja18 · NIE RUSZAĆ ✅

### E. Kalendarz
- `events` (7) — Horyzont · FILTRUJ po whitelist (BIGINT)
- `event_participants` (0) — pusta
- `przypomnienia` (0) — pusta

### F. Media + Magic Jar
- `constellations` (15) — gwiazdozbiory MJ Spokojna Noc · NIE RUSZAĆ
- `zdjecia` (39) — zdjęcia profilowe · FILTRUJ po whitelist
- `nagrania` (0) — pusta

### G. Terapeuci (przyszłe)
- `therapist_clients` (0) — pusta
- `therapist_notes` (0) — pusta

### TABELE KTÓRE NIE ISTNIEJĄ (chociaż [406] briefing je wymienia)
- ❌ `memory` — NIE MA w bazie. Pamięć podróżnika żyje w `travels.dd_state` (jsonb). **NIE PISZ TRUNCATE memory w briefie — wywali transakcję.**

---

## TRZY WARSTWY DO UPORZĄDKOWANIA (kolejność architektoniczna)

Adam 30.04 ~22:00: *"najwazniejsza jest infrastruktura, powiazana z tym architektura techniczna - bez pozadku nie ruszymy"*. 

Trzy warstwy są **niezsynchronizowane** ze sobą:

1. **Warstwa logiczna** ([491] słownik) — mówi *"MANA ma 9 pokoi: Asystent, Horyzont, Słoik, Gawęda, Cisza, Puls, Trzos, Pamiętnik, Ród"*
2. **Warstwa techniczna bazy** (`aplikacje`/`pokoje`/`kafle`/`pokoje_kafle`) — mówi *"4 pokoje z których 3 błędne"*
3. **Warstwa kodu** (foldery w `mana-app`, kod HTML w `mana-sloik`) — mówi *"2 pokoje istnieją (Asystent + Horyzont), reszta nie"*

**Trzy różne prawdy o tym samym.** Ten brak synchronizacji jest źródłem wszystkich błędów C/D pisanych "z głowy".

**Kolejność naprawy (decyzja Adama 30.04):**
- Najpierw warstwa **logiczna** — spisać 1 listę kanoniczną: 8 aplikacji × ich pokoje × ich kafle. Twój podpis pod każdym wierszem.
- Potem warstwa **techniczna** — baza podąża za listą logiczną
- Potem warstwa **kodu** — folder layout zsynchronizowany z bazą + listą logiczną

Sesja 30.04 zaczęła krok 1 (lista 8 aplikacji w propozycji). Jutro kontynuacja: pokoje + kafle.

---

## NAZEWNICTWO DO USTABILIZOWANIA

Adam 30.04 ~22:00: *"warto przy okazji naprawy ustabilizować nazewnictwo które też trzeba dodać do audytu"*. 

Nazewnictwo jest **długiem równym strukturze**. Bez stabilnych nazw nie ma stabilnej struktury.

### Konkretne niespójności wykryte 30.04:

**Pokoje Magic Jara:**
- "Spokojna Noc" ([491] słownik) vs "Dobra Noc" (tabela `pokoje`) — wybrać jedną
- "Dobry Dzień" ([491]) vs "Dobry Dzien" (tabela `pokoje`) — diakrytyki
- "Księżycowy Czas" ([491]) — nie istnieje w bazie

**Pokoje MANA:**
- "Słoik" ([491]) vs "Sloik JAR" (tabela `aplikacje` — błędnie) vs "Słoik JAR" (historyczne do 24.04 wg [491])

**Kafle:**
- "Notatnik" (uniwersalny, [491]) vs "Notatnik Trenera" (tabela `kafle` — specjalizacja zamiast Ducha?)
- "Konstelacje", "Datownik", "Zagroda" — w bazie są, w słowniku [491] **nie ma definicji** (czym to jest?)

**Asystent:**
- "Krystyna" (nazwa default Ducha prywatnego) vs "Asystent" (pokój) vs "Pan Jan" (Duch biznesowy) — relacja tych pojęć zmieniała się 2× ([596] → [607])

**Aplikacje:**
- "Magic Jar" / "Iskierka" — synonimy ([491])
- "MERKABA" / "Merkaba" — duże/małe litery niekonsekwentnie
- "mana-app" (frontend MANA) vs "MANA" (aplikacja) — czy to to samo?

### Wniosek:

Stabilizacja nazewnictwa = część raportu ponaprawczego (po BIAŁEJ KARCIE i naprawach infrastruktury). Wymaga **kanonicznej listy** + **podpisu Adama** + **propagacji** do: bazy, kodu, słownika [491], briefingu [406], skilla `mana-metaphor`.

---

## WHITELIST 13 PODRÓŻNIKÓW (zostają w `travels` po BIAŁEJ KARCIE)

| ID | Nick | Rola |
|---|---|---|
| 17 | Adam | MANA — główny tester, plemię, trener |
| 18 | Patrycja | MANA — plemię, trener |
| 51 | Adam | Magic Jar — tester |
| 52 | Adasko | Magic Jar — tester |
| 53 | Patrycja | Magic Jar — tester |
| 61 | Gabrysia | Magic Jar — tester |
| 69 | Anna | Magic Jar — tester |
| 70 | Alexander | Magic Jar — tester |
| 71 | Monika | Magic Jar — tester |
| 72 | Jan | Magic Jar — tester |
| 76 | MANA_ADMIN_55 | Panel admina #1 |
| 77 | MANA_ADMIN_55 | Panel admina #2 |
| 78 | Piotr | Magic Jar — tester |

**Wszystkie inne traveler_id (44 wiersze) → DELETE w Kroku 1 BIAŁA KARTA.** Wraz z kaskadą po `stones`, `conversations`, `events`, `login_history`, `zdjecia` (z konwersją typów TEXT/BIGINT).

---

## NIESPÓJNOŚĆ TYPÓW traveler_id (decyzja architektoniczna otwarta)

- BIGINT: `travels.id`, `events.traveler_id` (FK), `consent_codes.traveler_id` (FK), `login_history.traveler_id`
- TEXT: `stones`, `conversations`, `nagrania`, `przypomnienia`, `zdjecia` (wszystkie bez FK)
- UUID-only: `dd_entries` (tylko `traveler_uuid`, brak BIGINT)
- **Wszystkie tabele z TEXT mają DODATKOWO kolumnę `traveler_uuid` UUID** — fundament pod ujednolicenie

**Otwarte pytanie Adama z 30.04 ~18:00:** *"czy nie należy tego naprawić — Magic Jar swoja baza, MANA swoja, lub jedna z indywidualnym numerem łączącym?"*

Decyzja poziomu 3 wg [488]. Trzy warianty:
- (a) MJ osobna baza, MANA osobna
- (b) jedna baza z flag prywatna/biznesowa/MJ
- (c) jedna baza, master_id UUID jako klucz łączący role

**Krok 2 LOGOWANIE** (Supabase Auth) jest naturalnym momentem naprawy — Auth wprowadza UUID jako standard. **NIE rób tego w Kroku 1 BIAŁA KARTA bez świadomej decyzji Adama.**

---

## 4 BŁĘDY PROCESOWE C (30.04, do uniknięcia w przyszłości)

**1. Brief Kroku 1 z gotowymi SQL-ami (TRUNCATE/DELETE) bez audytu bazy.** C sam przyznał: *"produkuję zamiast sprawdzać"*.

**2. Whitelist 4 ID zamiast 13.** SQL by usunął zgody RODO 9 testerów MJ → MJ przestaje działać. D wykrył przed wykonaniem.

**3. TRUNCATE TABLE `memory`.** Tabela nie istnieje. Lista pochodziła z [406] briefingu (stare ewergreeny niepoprawne). SQL by przerwał całą transakcję BIAŁEJ KARTY.

**4. consent_codes uznane za "stary szkic logowania do skasowania".** Faktycznie produkcyjny system MJ-RODO od 29.03 ([350][290][356]). D znalazł kontekst przez `mana_search consent_codes magic link`.

**Wzorzec:** każda nowa sesja C startuje bez kontekstu, pisze brief z głowy + ze starych ewergreenów ([406] briefing wymienia tabelę memory), wprowadza błędy które mogą zniszczyć produkcję. **To strukturalny problem MANA**, nie wina konkretnego C. Adam: *"trąbię o tym dwa miesiące"*. Wpis [624] to próba odpowiedzi.

---

## PROTOKÓŁ ANTY-BŁĘDÓW (od 30.04 OBOWIĄZUJE)

**Przed napisaniem briefa dotykającego tabel bazy:**

1. **Przeczytaj [624]** (ten wpis) — pełen empiryczny stan
2. **Sprawdź whitelist 13 ID** — nie wymyślaj, nie kompiluj z fragmentów
3. **Nie pisz TRUNCATE/DELETE bez audytu** — zapytaj Adama do SQL Editora żeby sprawdzić stan
4. **Tabele "z głowy" są niebezpieczne** — `memory` nie istnieje, `consent_codes` jest produkcyjny, `mana_archiwum` to auto-trigger nie do skasowania
5. **CASCADE jest niebezpieczne** — może uderzyć w `consent_codes` (FK do travels) → niszczy MJ-RODO
6. **Każda decyzja struktury (typy, FK, RLS) = poziom 3** — wymaga rozmowy z Adamem, nie samodzielnego SQL-a

**Sprawdzona dziś wartość:**
- 4 prompty są OK ✅ (`serce_konstytucja_fundament`, `duch_asystent_prywatny`, `serce_konstytucja` jako fallback do 5.05, `magic_jar_kontekst`)
- 2 trenerzy są OK ✅ (Adam17, Patrycja18)
- Plan MANA w `mana_settings.value` jest aktualny (updated 29.04)

---

## CO DALEJ — sekwencja propozycji

### Małe naprawy (do tygodnia)
- **Stabilizacja nazewnictwa** — kanoniczna lista nazw (aplikacje × pokoje × kafle × asystenci), Adam podpisuje, propagacja do bazy + kodu + [491] + [406] + skilla `mana-metaphor`
- Tabela `koszty` — uzupełnić o realne narzędzia, oznaczyć cykliczność, usunąć duplikat Vectorizer.ai
- Tabela `aplikacje` — usunąć Gawędę/Horyzont/Sloik JAR, dodać MANA, Panel Admina, EGZAMIN, PATI PLAN
- Tabela `pokoje` — poprawić "Dobra Noc" → "Spokojna Noc", dodać Księżycowy Czas, dopisać 9 pokoi MANA, naprawić Zagroda FK
- Tabela `kafle` — wyczyścić śmieci, Notatnik Trenera → uniwersalny Notatnik, dodać Interfejs, Zdjęcie, EVENT
- Tabela `pokoje_kafle` — wypełnić właściwymi powiązaniami po naprawie pokoi i kafli

### Średnie (do dwóch tygodni)
- Krok 1 BIAŁA KARTA — czyszczenie knowledge + filtrowanie tabel danych po whitelist 13 ID. **Brief musi być oparty o ten audyt, nie pisany z głowy.**
- Audyt Planu MANA — przegląd 70+ zadań w `mana_settings.value`, co aktualne / co historyczne
- Aplikacja "Mapa MANA" (opcjonalnie) — żywy dokument który pamięta notatki Adama między sesjami

### Duże (do miesiąca, decyzje strategiczne)
- Krok 2 LOGOWANIE — Supabase Auth + RLS twardy + UUID jako fundament
- Decyzja architektoniczna: rozdzielenie MJ/MANA/Admin (osobne bazy / flagi / master_id UUID)
- Krok 3 APLIKACJA JAKO CAŁOŚĆ — launcher mana-app
- Naprawa niespójności typów traveler_id (TEXT/BIGINT → UUID)
- **Synchronizacja trzech warstw** (logika / baza / kod) — żeby kod czytał z bazy zamiast hardcodować

---

## DOKUMENTY POBOCZNE

- **PDF AUDYT_BAZY_MANA_30_04_2026.pdf** — wydruk dnia (7 stron, u Adama)
- **MANA_audyt_30_04_2026.xlsx** — Excel ze stanem (3 zakładki + miejsce na notatki)
- **mapa_MANA_30_04_2026.html** — wizualna mapa MERKABA (statyczna)

---

## POWIĄZANE

- **[623]** Zwrot strategiczny BIAŁA KARTA (źródło decyzji)
- **[488]** PROTOKÓŁ szefa projektu — 4 błędy z 30.04 do dopisania jako META-LEKCJE
- **[491]** SŁOWNIK pojęć — źródło prawdy o MERKABA/MANA/DOM/pokoje/kafle (do uzupełnienia o Konstelacje/Datownik/Zagroda lub usunięcia)
- **[406]** BRIEFING — **wymaga aktualizacji**: usunąć `memory` z listy "WAŻNE BAZY", dopisać tabele G grupy
- **[350][290][356]** Magic Jar zgoda RODO — kontekst dla `consent_codes`
- **[497]** MOST — linia DZIENNIK 30.04: Krok 0 DONE, audyt DONE, [624] zapisane
- **[622]** META-LEKCJA #5 — niespójność typów traveler_id

---

## META

- Autor: D (Claude Desktop) na podstawie 8.5h sesji z Adamem 30.04.2026
- Walidacja empiryczna: 27 tabel sprawdzone przez SQL Editor (Adam wklejał wyniki)
- Dokument: do wydruku (PDF gotowy), do oglądania (Excel + HTML), do przeczytania (ten wpis [624])
- Status: ZAPISANE W BAZIE jako fundament — każda nowa sesja C/D startuje od tego
- Następna sesja: lista kanoniczna pokoje + kafle (kontynuacja warstwy logicznej), potem stabilizacja nazewnictwa
