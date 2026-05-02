---
id: 624
temat: "[624] AUDYT BAZY 30.04.2026 — fundament Kroku 1 BIAŁA KARTA + protokół anty-błędów C/D + REWIZJA ARCHITEKTURY LOGICZNEJ"
---

# [624] AUDYT BAZY MANA — 30.04.2026 wieczór + aktualizacje 1-2.05

**Status:** EVERGREEN · OBOWIĄZUJE od 30.04.2026 · do przeczytania PRZED każdym briefem dotyczącym bazy danych lub architektury logicznej
**Sesja:** Adam + D, 30.04.2026 ~14:00–23:30 (~9.5h) + aktualizacje 1.05 + 2.05
**Pochodzenie:** [623] zwrot strategiczny BIAŁA KARTA — Adam: *"trąbię o tym dwa miesiące, baza rośnie a my pracujemy na sprzecznych danych"*
**Cel:** udokumentować empiryczny stan bazy + decyzje architektoniczne Adama z 30.04 wieczór, żeby kolejne sesje C/D nie pisały briefów z głowy.

---

## ZASADA NUMER JEDEN

**Każda nowa sesja C lub D, zanim napisze brief dotykający bazy danych lub architektury logicznej (aplikacje/pokoje/kafle/Duchy), MUSI przeczytać ten wpis [624].** Bez tego ryzyko: powtórzenie 4 błędów procesowych z 30.04 + cofnięcie decyzji architektonicznych Adama z 30.04 wieczór.

---

## ⭐ DECYZJE ARCHITEKTONICZNE ADAMA 30.04.2026 WIECZÓR (ZASTĘPUJĄ [491] do następnej aktualizacji słownika)

### REWIZJA APLIKACJI W MERKABIE

**Słownik [491] miał 8 aplikacji.** Po sesji 30.04 wieczór: **5 aplikacji wewnętrznych + aplikacje zewnętrzne (custom dev)**.

| # | Aplikacja | Status | Komentarz Adama 30.04 |
|---|---|---|---|
| 1 | **MANA** | 🟡 W BUDOWIE | Aplikacja prywatna podróżnika (`mana-app-murex.vercel.app`). Pokoje: Asystent, Horyzont, Słoik, Gawęda, Cisza, Sen, Pamiętnik, EGZAMIN, MANA Help (jako pokoje, nie aplikacje), Trzos, Puls, Ród + przyszłe (Adam: *"jest ich ogrom, aż się boję"*). |
| 2 | **Magic Jar** | 🟢 LIVE | `mana-sloik.vercel.app`. Pokoje: Spokojna Noc, Dobry Dzień, Księżycowy Czas. **W bazie wszędzie zmienić "Słoik/Sloik JAR" → "Magic Jar"** |
| 3 | **Panel Admina** | 🔄 PRZEMYŚLEĆ NA NOWO | **Adam: *"nie korzystam, nie jest taki jak myślałem"*.** Prawdziwa wizja: **Mapa MANA na żywo** — lista aplikacji + pokoi + kafli + ziarenek + schemat techniczny + aktywność użytkowników + koszty, **interaktywna, synchroniczna z bazą**. *"Patrzę i sprawdzam czy ktoś wszedł i co napisał i nic więcej"*. |
| 4 | **gospodarz.app** (zastępuje Panel Terapeuty) | ⚪ KONCEPT | Aplikacja dla biznesu: **Kraina Mądrości + Kraina Obfitości** (terapeuci, trenerzy, kosmetyczki, fryzjerzy, sklepy z produktami). **Subskrybent biznesowy nazywa swoją przestrzeń własną nazwą** widoczną podróżnikowi (gospodarz = nazwa robocza między MERKABA a subskrybentem). MANA = strefa prywatna podróżnika; gospodarz.app = strefa biznesowa. |
| 5 | **Panel Trenera** | 🟢 LIVE | Trenowanie Serca przez `trainer_notes`. Trenerzy: Adam17, Patrycja18. **Trener uczestniczy w Gawędzie (dziś przez Typebot), w przyszłości w Asystencie + MJ Dobry Dzień + puzzlach.** |

### KASOWANE jako oddzielne aplikacje

- **MANA Help** → **Duch Serca w mana.app** (kryzysowy, na tym samym poziomie co Asystent Osobisty/Biznesowy/Mędrzec). NIE oddzielna aplikacja, NIE oddzielny silnik. *"Duch Serca który jest, nie nazwany tak naprawdę"*.
- **EGZAMIN** → **pokój w mana.app** (jeden z wielu pokoi-pomysłów Adama). NIE oddzielna aplikacja.

### APLIKACJE ZEWNĘTRZNE w MERKABIE (nowy wymiar)

Adam 30.04: *"PATI PLAN jest w MERKABA bo to się mieści w MERKABIE jako aplikacja, ale mamy wewnętrzne i zewnętrzne"*.

**MERKABA = aplikacje wewnętrzne + aplikacje zewnętrzne.** PATI PLAN / PATI Astrologia to przykład aplikacji **zewnętrznej** — zlecenie **custom dev** które MERKABA produkuje dla Patrycji (klient MERKABY). Może żyć obok jako referencja "co MERKABA zbudowała dla kogoś". Pasuje do strategii [608] Faza 2 ZARABIAMY (custom dev jako usługa).

### POKOJE MANA — REWIZJA (uzupełnienie [491])

Słownik [491] wymienia 9 pokoi: *Asystent, Horyzont, Słoik, Gawęda, Cisza, Puls, Trzos, Pamiętnik, Ród*. Decyzje 30.04:

- **Słoik** = pokój (zostaje pod tą nazwą — w MJ Spokojna Noc też jest Słoik, więc spójność). Przeznaczenie: *"przestrzeń dla CISZY, SNU i PAMIĘTNIKA, część za zgodą podróżnika udostępnioną Sercu, część nie"*. **Naturalna przyszła konsolidacja** Słoik+Cisza+Sen+Pamiętnik w jeden pokój — **na razie wszystko oddzielne pokoje**.
- **Sen** — nowy pokój (do dopisania do słownika [491]; w bazie nie istniał).
- **EGZAMIN** — pokój (przyszły, pomysł).
- **MANA Help** — pokój kryzysowy (przyszły).

### DUCHY SERCA (rewizja [491] sekcja Duchy)

[491] miał 6 znanych Duchów. Po 30.04 + 2.05:

| # | Duch | Pokój / kontekst | Status |
|---|---|---|---|
| 1 | **Duch Asystenta Osobistego** (robocza nazwa: Krystyna) | pokój Asystent w MANA | LIVE od 28.04 [620] · prompt: `prompts.duch_asystent_prywatny` (10793 znaków) |
| 2 | **Duch Asystenta Biznesowego** (robocza: Jan) | pokój Asystent w gospodarz.app | KONCEPT — Adam: *"silnik ten sam, duch podobny mentalnie, zastanawiam się czy nie ten sam, ale chyba dwa"*. **Decyzja D-rekomendacja zaakceptowana: dwa Duchy** (osobisty może o emocjach, biznesowy nie powinien; specjalizacja ≠) |
| 3 | **Duch Mędrzec** [528] | pokój Gawęda | KONCEPT |
| 4 | **Duch Serca kryzysowy** | pokój MANA Help w mana.app | KONCEPT |
| 5 | **Duch biznesowej Gawędy** | gospodarz.app | KONCEPT |
| 6 | **Duch Trenera** | Panel Trenera | LIVE w `trainer_notes` |
| 7 | **Duch DD** (zmiana z "Duch MJ" 2.05 — Duch jest tylko w Dobrym Dniu, nie w całym Magic Jarze) | MJ Dobry Dzień | LIVE od 2.05.2026 jako `prompts.duch_dd` (2626 znaków). Wcześniej żył rozproszony w `magic_jar_kontekst` (1251 znaków, sama mechanika produktu). 2.05 wyodrębniony zgodnie z zasadami: misja, granice, ton, mechanika BLOKADA:TAK/NIE, typy myśli. Edge Function `call-dd-serce` czyta `duch_dd`. Backup starego promptu zachowany jako `magic_jar_kontekst_backup_2_05`. |

**Wszystkie Duchy = jeden silnik Asystenta + jedna Konstytucja [620]** ([607]). Różnią się tylko misją, granicami, tonem, specjalizacją kontekstu.

### NAZEWNICTWO USTABILIZOWANE 30.04 + 2.05

- **"Spokojna Noc"** (NIE "Dobra Noc") — w bazie pokoje wpis poprawić
- **"Dobry Dzień"** (z diakrytykami)
- **Magic Jar** (NIE Słoik/Sloik JAR — ta nazwa była synonimem do 24.04)
- **gospodarz.app** (zastępuje "Panel Terapeuty" jako koncept; "Panel Terapeuty" jako tabela w bazie zostaje technicznie do z5.B.1)
- **Duch DD** (zmiana z "Duch MJ" 2.05.2026 — Duch jest tylko w Dobrym Dniu, nie w Spokojnej Nocy ani Księżycowym Czasie)
- **"Info od Trenera"** (NIE "Notatnik Trenera" — to NIE kafel, to tabela danych `trainer_notes`)
- **Konstelacje, Datownik, Zagroda, Sloik JAR** — błędne wpisy w tabeli `kafle`/`aplikacje` — usunąć przy naprawie infrastruktury (Datownik=prawdopodobnie Księżycowy Czas, Zagroda=90% pokój gospodarz.app dla plemienia/biznesu)

### KAFLE — POTWIERDZENIE [491] + PDF kafle_mana_v20

**6 kafli kanonicznych** (PDF kafle_mana_v20 z 13.04, [467] zasada): Serce, Notatnik (uniwersalny), Interfejs, Słoik, Zdjęcie, EVENT/Organizator.

**"Notatnik Trenera" w tabeli `kafle` — to NIE kafel.** To pomyłka. Funkcjonalnie odpowiada **tabeli danych `trainer_notes`** (notatki trenera do rozmów Serca). Zmiana nazwy: **"Info od Trenera"**. Usunąć z `kafle`, zostawić jako tabelę danych.

**Zasada [467]:** kafle są uniwersalne (nie mają nazwy użytkownika). Pokoje są lokalne (mają nazwę aplikacji). Ten sam kafel Słoik+Księżyc to "Spokojna Noc" w MJ, "Słoik" w MANA.

---

## STAN BAZY EMPIRYCZNY (30.04.2026 + aktualizacje 2.05) — STATUSY UŻYCIA TABEL

**27 tabel w schemacie public.** Każda tabela dostaje **status użycia**:
- 🟢 **AKTYWNA** — kod czyta i pisze, używana produkcyjnie
- 🟡 **REZERWA** — pomysł na przyszłość, czeka aż będzie potrzebna
- 🔴 **MARTWA** — eksperyment porzucony, do skasowania
- ⚪ **PUSTA-PLANOWANA** — tabela istnieje, czeka na pierwszych użytkowników
- 🔵 **REJESTR-KŁAMIE** — tabela istnieje, ale dane są niespójne ze słownikiem (do naprawy)

### A. Infrastruktura MERKABA (rejestry struktury)
- 🔵 `aplikacje` (7) — REJESTR-KŁAMIE: 3 wpisy to pokoje (Gawęda/Horyzont/Sloik JAR). Naprawa: usunąć błędne, dodać 5 aktualnych aplikacji wg sekcji "REWIZJA APLIKACJI"
- 🔵 `kafle` (8) — REJESTR-KŁAMIE: 5 z 8 to nie kafle. Naprawa: zostawić Serce + Słoik + Notatnik (zmienić z "Notatnik Trenera"), dodać Interfejs/Zdjęcie/EVENT
- 🔵 `pokoje` (4) — REJESTR-KŁAMIE: brak 12+ pokoi MANA/MJ; "Dobra Noc" zła nazwa; "Zagroda" wisi w pustce
- 🔵 `pokoje_kafle` (1) — REJESTR-KŁAMIE: jedyny wpis bez sensu; tabela jest pusta
- 🟢 `mana_settings` (1) — AKTYWNA: Plan MANA produkcyjny (klucz "plan", JSON, updated 29.04)
- 🟡 `koszty` (3) — REZERWA: niekompletna (brak Cursor/Vercel/Supabase Pro/Resend/domeny), duplikat Vectorizer.ai, żaden wpis nie używa flagi `cykliczny`. Do uzupełnienia.

### B. Baza wiedzy + archiwa
- 🟢 `knowledge` (588+) — AKTYWNA: główna baza, do czyszczenia w Kroku 1 BIAŁA KARTA
- 🟢 `mana_archiwum` (838) — AKTYWNA pasywnie: auto-trigger historia knowledge, brak embedding → poza RAG · NIE RUSZAĆ
- 🟢 `mana_archiwum_tematyczne` (8) — AKTYWNA: ręczne archiwum, dziś +7 wpisów Krok 0 (archive_id 19-25) · NIE RUSZAĆ
- 🟢 `mana_archiwum_tematyczne_audit` (3) — AKTYWNA: log usunięć RODO · NIE RUSZAĆ
- 🟢 `prompts` (6) — AKTYWNA: Konstytucja + Duchy · NIE RUSZAĆ ✅ (6 wpisów po aktualizacji 2.05):
   - `serce_konstytucja_fundament` (4458 znaków) — fundament wszystkich Duchów
   - `serce_konstytucja` (5763 znaków) — fallback do 5.05
   - `duch_asystent_prywatny` (10793 znaków) — Krystyna w MANA Asystent
   - `duch_dd` (2626 znaków) — **NOWY 2.05** — Duch DD w MJ Dobry Dzień (przez `call-dd-serce`)
   - `magic_jar_kontekst` (1251 znaków) — STARA mechanika produktu (zostawiona, nie używana w kodzie po 2.05)
   - `magic_jar_kontekst_backup_2_05` (1251 znaków) — backup pre-rotacja Ducha

### C. Podróżnicy
- 🟢 `travels` (57) — AKTYWNA: HUB centralny, 4 FK · FILTRUJ po whitelist 13 ID
- 🟢 `login_history` (44) — AKTYWNA: historia logowań · FILTRUJ po whitelist
- 🟢 `consent_codes` (6) — AKTYWNA: **system zgody RODO Magic Jara** ([350][290][356]), produkcja od 29.03 · NIE RUSZAĆ ⚠️ (NIE jest "starym szkicem logowania" — to żywy MJ-RODO)

### D. Rozmowy i myśli
- 🟢 `conversations` (326) — AKTYWNA: rozmowy z Sercem (MJ Typebot + MANA call-serce) · FILTRUJ (traveler_id TEXT)
- 🟢 `dd_entries` (158) — AKTYWNA: myśli "Dobry Dzień" Magic Jara · NIE RUSZAĆ — rdzeń MJ
- 🟢 `stones` (32) — AKTYWNA: kamienie ze Słoika · FILTRUJ (traveler_id TEXT)
- 🟢 `trainer_notes` (57) — AKTYWNA: **"Info od Trenera"** — uwagi trenerów do rozmów Serca · FILTRUJ pośrednio
- 🟢 `trainers` (2) — AKTYWNA: Adam17 + Patrycja18 · NIE RUSZAĆ ✅

### E. Kalendarz
- 🟢 `events` (7) — AKTYWNA: Horyzont · FILTRUJ po whitelist (BIGINT)
- ⚪ `event_participants` (0) — PUSTA-PLANOWANA: przyszłe (Faza po MVP)
- ⚪ `przypomnienia` (0) — PUSTA-PLANOWANA: przyszłe (Krystyna + EVENT)

### F. Media + Magic Jar
- 🔴 `constellations` (15) — **MARTWA** od 27.03.2026 wg [326] *"Gwiazdozbiory — dwie pełne sesje prób, żadne nie dało poprawnych kształtów. DECYZJA: rezygnacja na stałe"*. Rysunki nigdy nie były dobre. **Adam 30.04: DROP TABLE dla porządku.** Faza księżyca/zodiak/żywioł generowane lokalnie matematyką w `iskierka.html` ([296]).
- 🟢 `zdjecia` (39) — AKTYWNA: zdjęcia profilowe · FILTRUJ po whitelist
- ⚪ `nagrania` (0) — PUSTA-PLANOWANA: przyszłe (Voice AI)

### G. Terapeuci/gospodarz.app (przyszłe)
- ⚪ `therapist_clients` (0) — PUSTA-PLANOWANA: gospodarz.app
- ⚪ `therapist_notes` (0) — PUSTA-PLANOWANA: gospodarz.app

### TABELE KTÓRE NIE ISTNIEJĄ (chociaż [406] briefing je wymienia)
- ❌ `memory` — NIE MA w bazie. Pamięć podróżnika żyje w `travels.dd_state` (jsonb). **NIE PISZ TRUNCATE memory w briefie — wywali transakcję.**

---

## TRZY WARSTWY DO UPORZĄDKOWANIA (kolejność architektoniczna)

Adam 30.04 ~22:00: *"najwazniejsza jest infrastruktura, powiazana z tym architektura techniczna - bez pozadku nie ruszymy"*.

Trzy warstwy są **niezsynchronizowane**:

1. **Warstwa logiczna** ([491] słownik + decyzje 30.04) — kanoniczna struktura
2. **Warstwa techniczna bazy** (`aplikacje`/`pokoje`/`kafle`/`pokoje_kafle` + typy traveler_id) — ma podążać za logiką
3. **Warstwa kodu** (foldery w `mana-app`, kod HTML w `mana-sloik`) — ma podążać za bazą

**Postęp 30.04 + 1.05 + 2.05:**
- ✅ Warstwa logiczna — **zaktualizowana** 30.04 wieczór + 2.05 (5 aplikacji + pokoje + Duchy + nazewnictwo + Duch DD wyodrębniony)
- ⏳ Warstwa techniczna — w trakcie (audyt 27 tabel DONE, naprawa rejestrów aplikacje/kafle/pokoje/pokoje_kafle TODO)
- ⏳ Warstwa kodu — TODO (po warstwie technicznej)

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

**Wszystkie inne traveler_id (44 wiersze) → DELETE w Kroku 1 BIAŁA KARTA.**

---

## NIESPÓJNOŚĆ TYPÓW traveler_id (decyzja architektoniczna otwarta)

- BIGINT: `travels.id`, `events.traveler_id` (FK), `consent_codes.traveler_id` (FK), `login_history.traveler_id`
- TEXT: `stones`, `conversations`, `nagrania`, `przypomnienia`, `zdjecia` (wszystkie bez FK)
- UUID-only: `dd_entries` (tylko `traveler_uuid`, brak BIGINT)
- **Wszystkie tabele z TEXT mają DODATKOWO kolumnę `traveler_uuid` UUID** — fundament pod ujednolicenie

**Otwarte pytanie Adama z 30.04 ~18:00:** *"czy nie należy tego naprawić — Magic Jar swoja baza, MANA swoja, lub jedna z indywidualnym numerem łączącym?"*

Trzy warianty: (a) MJ osobna baza, MANA osobna, (b) jedna baza z flag prywatna/biznesowa/MJ, (c) jedna baza, master_id UUID jako klucz łączący role.

**Krok 2 LOGOWANIE** (Supabase Auth) jest naturalnym momentem naprawy. **NIE rób tego w Kroku 1 BIAŁA KARTA bez świadomej decyzji Adama.**

---

## 4 BŁĘDY PROCESOWE C (30.04, do uniknięcia w przyszłości)

**1. Brief Kroku 1 z gotowymi SQL-ami (TRUNCATE/DELETE) bez audytu bazy.** C: *"produkuję zamiast sprawdzać"*.
**2. Whitelist 4 ID zamiast 13.** SQL by usunął zgody RODO 9 testerów MJ.
**3. TRUNCATE TABLE `memory`.** Tabela nie istnieje. Lista pochodziła z [406] (stare ewergreeny).
**4. consent_codes uznane za "stary szkic logowania".** Faktycznie produkcyjny system MJ-RODO.

**Wzorzec:** każda nowa sesja C startuje bez kontekstu, pisze brief z głowy + ze starych ewergreenów. **To strukturalny problem MANA**, nie wina konkretnego C. Adam: *"trąbię o tym dwa miesiące"*. Wpis [624] to próba odpowiedzi.

---

## PROTOKÓŁ ANTY-BŁĘDÓW (od 30.04 OBOWIĄZUJE)

**Przed napisaniem briefa dotykającego bazy danych lub architektury:**

1. **Przeczytaj [624]** — pełen empiryczny stan + decyzje 30.04
2. **Sprawdź whitelist 13 ID** — nie wymyślaj
3. **Nie pisz TRUNCATE/DELETE bez audytu** — zapytaj Adama do SQL Editora
4. **Tabele "z głowy" są niebezpieczne** — `memory` nie istnieje, `consent_codes` jest produkcyjny, `mana_archiwum` to auto-trigger
5. **CASCADE jest niebezpieczne** — może uderzyć w `consent_codes` (FK) → niszczy MJ-RODO
6. **Decyzje struktury (typy, FK, RLS) = poziom 3** — wymaga rozmowy z Adamem
7. **Architektura logiczna (aplikacje/pokoje/kafle/Duchy)** — sekcja "DECYZJE ADAMA 30.04" zastępuje [491] do następnej aktualizacji słownika

---

## CO DALEJ — sekwencja propozycji (zaktualizowana 2.05 wieczór)

### Małe naprawy (do tygodnia)
- 🔴 **DROP TABLE `constellations`** — Adam zaakceptował 30.04 (pozostałość po MJ z 27.03, rysunki nigdy nie działały)
- **Aktualizacja słownika [491]** — propagacja decyzji 30.04 + 2.05 (5 aplikacji, pokoje Sen/EGZAMIN/MANA Help jako pokoje, Duch DD na liście, kasacja MANA Help/EGZAMIN jako aplikacji)
- **Aktualizacja [406] briefing** — usunąć `memory` z listy "WAŻNE BAZY", zaktualizować APLIKACJE
- **Tabela `koszty`** — uzupełnić o realne narzędzia, oznaczyć cykliczność, usunąć duplikat Vectorizer.ai
- **Tabela `aplikacje`** — usunąć Gawędę/Horyzont/Sloik JAR, dodać MANA + Panel Admina (Mapa MANA) + gospodarz.app
- **Tabela `pokoje`** — poprawić "Dobra Noc" → "Spokojna Noc", dodać Księżycowy Czas, dopisać 12+ pokoi MANA, naprawić Zagroda FK
- **Tabela `kafle`** — wyczyścić śmieci (Konstelacje/Datownik/Koszty API/Baza Wiedzy/Horyzont/Dziennik DD), zmienić "Notatnik Trenera" → "Notatnik" uniwersalny, dodać Interfejs/Zdjęcie/EVENT
- **Tabela `pokoje_kafle`** — wypełnić właściwymi powiązaniami po naprawie
- ✅ **Wyodrębnienie `prompts.duch_dd`** — DONE 2.05.2026 (`duch_dd` 2626 znaków, call-dd-serce zaktualizowane)
- **Skasowanie `prompts.magic_jar_kontekst`** — po stabilizacji Ducha DD przez kilka dni produkcji (zostawić backup)
- **Dopracowanie treści `prompts.duch_dd`** — pierwsza wersja z 2.05 wymaga refinementu (puste frazy "to bardzo ładne wspomnienie" przeszły mimo zakazu)

### Średnie (do dwóch tygodni)
- **Krok 1 BIAŁA KARTA** — czyszczenie knowledge + filtrowanie tabel danych po whitelist 13 ID. **Brief musi być oparty o ten audyt, nie pisany z głowy.**
- **Audyt Planu MANA** — przegląd 70+ zadań w `mana_settings.value`
- **Panel Admina jako Mapa MANA na żywo** — projekt nowej wersji panelu (lista aplikacji + pokoi + kafli + ziarenek + schemat techniczny + aktywność + koszty, interaktywna)

### Duże (do miesiąca, decyzje strategiczne)
- **Krok 2 LOGOWANIE** — Supabase Auth + RLS twardy + UUID
- **Decyzja architektoniczna:** rozdzielenie MJ/MANA/Admin (osobne bazy / flagi / master_id UUID)
- **Krok 3 APLIKACJA JAKO CAŁOŚĆ** — launcher mana-app
- **Naprawa niespójności typów traveler_id** (TEXT/BIGINT → UUID)
- **Synchronizacja trzech warstw** (logika / baza / kod)
- **gospodarz.app** — projekt aplikacji biznesowej (po MANA dojrzeniu)

---

## DOKUMENTY POBOCZNE

- **PDF AUDYT_BAZY_MANA_30_04_2026.pdf** — wydruk dnia (7 stron, u Adama)
- **MANA_audyt_30_04_2026.xlsx** — Excel ze stanem (3 zakładki + miejsce na notatki)
- **mapa_MANA_30_04_2026.html** — wizualna mapa MERKABA (statyczna)

---

## OBAWA ADAMA + KIERUNEK

Adam 30.04 ~22:50: *"jak to się wszystko łączy to ja też aż się zastanawiam czy obieram dobry kierunek, ale szkoda nie skorzystać z takiego bogactwa które jest dla podróżnika przydatne. Pomimo że podobnych narzędzi jest mnóstwo na rynku to nie widzę w tym nic złego a wręcz dobrego. Ale to potem, najpierw porządek."*

Świadectwo stanu: ogrom realny, kierunek nie odrzucony, priorytet jasny — **najpierw porządek, potem ekspansja**. To jest fundament psychologiczny dla całego ruchu MANA — Adam świadomy skali, gotowy iść z zachowaniem porządku, nie przed nim.

---

## POWIĄZANE

- **[623]** Zwrot strategiczny BIAŁA KARTA
- **[488]** PROTOKÓŁ — 4 błędy z 30.04 do dopisania
- **[491]** SŁOWNIK — **wymaga aktualizacji wg decyzji 30.04 + 2.05** (5 aplikacji, pokoje Sen/EGZAMIN/MANA Help, Duch DD, "Info od Trenera", DROP constellations)
- **[406]** BRIEFING — wymaga aktualizacji (usunąć memory, zaktualizować APLIKACJE)
- **[326]** Magic Jar 27.03 — decyzja "rezygnacja z gwiazdozbiorów na stałe"
- **[296]** Sesja MJ 24/25.03 — faza księżyca + zodiak matematycznie lokalnie
- **[294][295]** Symbole magiczne MJ — fundament dla aplikacji Astrologii Patrycji (zewnętrznej)
- **[350][290][356]** MJ-RODO — kontekst dla `consent_codes`
- **[467]** Zasada — kafle uniwersalne, pokoje lokalne (Magic Jar Datownik → Księżycowy Czas)
- **[497]** MOST — linia DZIENNIK 30.04: Krok 0 DONE, audyt DONE, [624] zapisane+aktualizowane
- **[567]** INSIGHT kafle jako perspektywy
- **[569]** Koncepcja X — kafel raz, przesuwany między aplikacjami
- **[572]** MERKABA jako zasada
- **[595]** HIERARCHIA MERKABA/MANA/DOM — fundament 24.04
- **[596]** Krainy + asystenci
- **[600]** MANA narzędzie indywidualne — etyczna podstawa rozdzielenia Duchów
- **[607]** Asystent jeden silnik wiele Duchów — zatwierdzone i potwierdzone 30.04
- **[608]** Trzy fazy biznesowe — INTEGRUJEMY/ZARABIAMY/BUDUJEMY WŁASNY
- **[622]** META-LEKCJA #5 — niespójność typów traveler_id
- **[625]** BRIEF rotacji kluczy (1.05) — częściowo nieaktualny
- **[626]** Checkpoint sesji 1+2 rotacji
- **[627]** Brief sesji 3 (ID 632 w bazie)
- **[628]** Brief sesji 3.5 (ID 633 w bazie)
- **[629]** Brief sesji 4 (ID 634 w bazie) — wyodrębnienie Ducha DD + Revoke

---

## META

- Autor: D (Claude Desktop) na podstawie 9.5h sesji z Adamem 30.04.2026 + aktualizacje 1.05 + 2.05
- Walidacja empiryczna: 27 tabel sprawdzone przez SQL Editor (Adam wklejał wyniki)
- Pierwszy zapis: 30.04 ~22:00 jako [624] AUDYT BAZY
- Aktualizacja 30.04 ~23:30 — REWIZJA ARCHITEKTURY LOGICZNEJ (5 aplikacji, MANA Help/EGZAMIN jako pokoje, gospodarz.app, dwa Duchy, Duch MJ, Info od Trenera, DROP constellations)
- Aktualizacja 2.05 wieczór — DUCH DD wyodrębniony (zmiana nazwy z "Duch MJ" na "Duch DD" — Duch jest TYLKO w Dobrym Dniu, nie w całym Magic Jarze; prompt `duch_dd` 2626 znaków w bazie; call-dd-serce zaktualizowane; backup magic_jar_kontekst zachowany jako magic_jar_kontekst_backup_2_05)
- Status: ZAPISANE W BAZIE jako fundament — każda nowa sesja C/D startuje od tego
- Następna sesja: dokończenie rotacji kluczy [629] (Spokojna Noc INSERT diagnoza + Revoke PREVIOUS KEY) + finalny audyt techniczny (Edge Functions list + schema niespójności + PDF)
