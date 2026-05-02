---
id: 636
temat: "[631] BRIEF SESJA 5 — DOMKNIĘCIE ROTACJI + ZAKOŃCZENIE AUDYTU TECHNICZNEGO"
---

# [631] BRIEF SESJA 5 — domknięcie wszystkiego

**Data:** 3.05.2026 (jutro rano)
**Autor:** D (Claude.ai webowy) na podstawie [630] checkpoint sesji 4 + audytu 1.05
**Adresat:** nowa sesja D (Claude Desktop dla MCP smoke testu)
**Cel:** zamknąć rotację kluczy (Revoke) + zamknąć audyt techniczny bazy MANA (3 kroki) + finalny PDF
**Czas:** 2-3h

---

## ZASADA NUMER ZERO

**Sesja 4 zostawiła 2 ogony:**
1. Rotacja w ~95% DONE — został tylko Revoke + audyt 14 nie-zrefaktoryzowanych Edge Functions
2. Audyt techniczny w 7/10 DONE — zostały 3 ostatnie kroki

**Sesja 5 = domknąć oba.** Bez tego stan jest "prawie skończony, dziura bezpieczeństwa żywa, audyt bez finalnego dokumentu".

**Czytaj NAJPIERW [630] — to checkpoint sesji 4** (mana_get(635) — UWAGA: ID techniczne 635, tytuł "[630]"). Plus [624] (audyt fundament zaktualizowany 2.05).

---

## CONTEXT

**Project ID:** `kkxhqtfxvgxdqpnzaufu`

**Stan rotacji po sesji 4:**
- ✅ 5 triggerów Postgres → sb_secret_*
- ✅ 9 Edge Functions zrefaktoryzowane: embed-knowledge, embed-conversation, embed-dd-entry, sync-knowledge-to-repo, sync-prompt-to-repo, send-consent-code, verify-consent-code, call-dd-serce, call-serce
- ✅ 4 frontendy → sb_publishable_*: iskierka, index, admin, mana-app + Vercel ENV
- ✅ MCP `mana_v2.cjs` → publishable + Claude Desktop config
- ⏳ **14 Edge Functions niesprawdzonych** (z 23 łącznie)
- ⏳ **`SERCE_SUPABASE_URL` + `SERCE_SERVICE_ROLE_KEY`** secrets — niesprawdzone (możliwa druga instancja Supabase)
- ⏳ **Wyciekły JWT `...bHfqI1SXX7dL...` żywy** do Revoke

**Stan audytu technicznego po 1.05:**
- ✅ KROK 1-7: FK, indeksy, RLS, policies, triggery, funkcje SQL, webhooki
- ⏳ KROK 8: Lista Edge Functions z Dashboard
- ⏳ KROK 9: Schema niespójności (typy traveler_id finalna mapa)
- ⏳ KROK 10: Finalny PDF audytu technicznego

---

## CZĘŚĆ A — DOMKNIĘCIE ROTACJI (~45 min)

### A1 — Lista Edge Functions z Dashboard (~10 min)

Adam wchodzi:
```
https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/functions
```

Robi screenshot pełnej listy — Ty widzisz nazwy 23 funkcji. Porównujesz z listą 9 zrefaktoryzowanych (powyżej). 14 pozostałych = do sprawdzenia.

**Dla każdej z 14:** klik → Settings → sprawdź **"Verify JWT"** toggle:
- **Verify JWT = ON** — funkcja wymaga prawidłowego JWT od klienta. Po Revoke będzie odrzucać tokeny podpisane PREVIOUS KEY (czyli legacy anon użyty w starym frontendzie). Ale: nasze frontendy używają już sb_publishable_*. Czyli OK chyba że ktoś zewnętrzny (Typebot?) wywołuje funkcję z legacy anon.
- **Verify JWT = OFF** — funkcja używa custom auth. Jeśli sprawdza `SUPABASE_ANON_KEY` z env (auto-zmigrowane do sb_publishable_*) — OK. Jeśli hardcoded legacy klucz — problem.

**Wklej mi listę 14 funkcji z toggle status.**

### A2 — Sprawdzenie SERCE_* secrets (~5 min)

```
https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/functions
```

Sekcja **Secrets**. Szukaj:
- `SERCE_SUPABASE_URL`
- `SERCE_SERVICE_ROLE_KEY`

**Jeśli istnieją:**
- URL pokazuje na inny project ID? = druga instancja Supabase, osobna rotacja kiedyś
- URL = `kkxhqtfxvgxdqpnzaufu`? = nadmiarowy duplikat, można usunąć

**Wklej mi co widzisz** (pierwsze 30 znaków URL, sam fakt istnienia klucza bez treści).

### A3 — Smoke test 14 niesprawdzonych funkcji (~15 min)

Z listy 14 — sprawdzamy tylko **AKTYWNE** (te co Adam realnie używa). Opcje:

a) **Test każdej z UI:** otwórz aplikację MANA + Magic Jar, klikaj funkcjonalności (Horyzont add/edit/delete event, Krystyna rozmowa, MJ logowanie, MJ Dobry Dzień, MJ Spokojna Noc). Patrz F12 Network — które funkcje są wywoływane. Jeśli przeszły 200 — działają.

b) **Test bezpośredni przez curl** dla nieoczywistych:
```bash
curl -X POST https://kkxhqtfxvgxdqpnzaufu.supabase.co/functions/v1/NAZWA_FUNKCJI \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sb_publishable_..." \
  -d '{}'
```

**Czerwone flagi:**
- 401 INVALID_JWT_FORMAT = funkcja oczekuje JWT (verify_jwt=true), publishable nie pasuje
- 401 Unauthorized z naszym debug objectem = custom auth, klucze się różnią
- 500 = bug w kodzie (osobne)
- 200 = działa

**DoD A1+A2+A3:** wiesz które funkcje są bezpieczne dla Revoke, które wymagają fix przed Revoke.

### A4 — Naprawa funkcji które wymagają (~10-30 min, zależne od A3)

Każda zepsuta funkcja: refaktor jak `call-serce` w sesji 3 (verify_jwt=false + custom auth dual apikey/Bearer + .trim()). Deploy + smoke.

### A5 — Revoke PREVIOUS KEY (~5 min)

```
https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/jwt
```

JWT Signing Keys → PREVIOUS KEY (Legacy HS256, 8BCD6A3B-...) → menu trzech kropek → **Revoke** → Confirm.

**Smoke test po Revoke** (incognito):
1. MJ: `manamerkaba.github.io/mana-sloik/iskierka.html` → loguj jako Adasko → ekran główny ✅
2. MANA Asystent: `mana-app-murex.vercel.app/asystent/` → "test po revoke" → Krystyna odpowiada ✅
3. MANA Horyzont: `/horyzont/` → renderuje wydarzenia ✅
4. MCP Claude Desktop: nowa rozmowa → "pobierz wpis 624" → `mana_get(624)` zwraca treść ✅

**Jeśli któryś FAIL** → wygeneruj **Standby Key** w JWT Keys jako rollback, znajdź miejsce z legacy kluczem, napraw, retry Revoke.

### A6 — Świadectwo [631-DONE] (~5 min)

```
mana_add temat: "[631-DONE] Rotacja kluczy Supabase MANA — KOMPLETNIE ZAKOŃCZONA 3.05.2026"
tresc: 
- 5 sesji łącznie (1+2+3+3.5+4+5), ~25h
- Brief 625 szacował 2-3h — niedoszacowanie 8-10x
- Wyciekły JWT bHfqI1SXX7dL martwy
- Wszystkie 23 Edge Functions sprawdzone
- SERCE_* secrets: <wynik z A2>
- E2E smoke 4/4 PASS
- Powiązane: 624, 625, 626, 627, 628, 629, 630
```

**DoD CZĘŚĆ A:** wyciekły JWT martwy, wszystko działa, świadectwo zapisane.

---

## CZĘŚĆ B — ZAKOŃCZENIE AUDYTU TECHNICZNEGO (~60 min)

### B1 — KROK 8: Lista Edge Functions kompletna (~5 min)

Po CZĘŚCI A masz już listę 23 Edge Functions z Dashboard (z A1). Kategoryzuj:

| Grupa | Funkcje | Custom auth | Status |
|---|---|---|---|
| Triggery → Edge | 5 (embed-*, sync-*) | apikey z env | ✅ |
| Frontend publiczne | 3 (call-dd-serce, send-consent-code, verify-consent-code) | dual apikey/Bearer | ✅ |
| User JWT | call-serce + ... | user JWT z frontendu | ✅ po sesji 3 |
| Pozostałe | <wynik z A1> | <wynik z A3> | <wynik z A4> |

Wklej tabelę do [624] sekcja "Edge Functions po audycie".

### B2 — KROK 9: Schema niespójności finalna mapa (~20 min)

Z [624] sekcja "NIESPÓJNOŚĆ TYPÓW traveler_id" + audytu 1.05 zbierz:

**Tabela: kolumna typu vs faktyczna referencja**

| Tabela | Kolumna | Typ deklarowany | FK | Komentarz |
|---|---|---|---|---|
| travels | id | BIGINT (HUB) | — | Centralny |
| events | traveler_id | BIGINT | FK→travels.id | OK |
| consent_codes | traveler_id | BIGINT | FK→travels.id | OK |
| login_history | traveler_id | BIGINT | FK→travels.id | OK |
| stones | traveler_id | TEXT | brak FK | NIESPÓJNE |
| conversations | traveler_id | TEXT | brak FK | NIESPÓJNE |
| nagrania | traveler_id | TEXT | brak FK | NIESPÓJNE (pusta) |
| przypomnienia | traveler_id | TEXT | brak FK | NIESPÓJNE (pusta) |
| zdjecia | traveler_id | TEXT | brak FK | NIESPÓJNE |
| dd_entries | traveler_uuid | UUID | brak FK | UUID-only |
| stones | traveler_uuid | UUID (dodatkowa) | brak FK | fundament migracji |
| ...analogicznie dla 5 innych z TEXT... |

**Wniosek:** 5 tabel TEXT bez FK + dd_entries UUID-only = spadek architektoniczny do naprawy w Kroku 2 LOGOWANIE (Supabase Auth).

Zapisz w [624] sekcja "KROK 9 schema finalna mapa" — jako nowy sub-rozdział.

**DoD B2:** mapa w [624], jasne co naprawić w Kroku 2 LOGOWANIE.

### B3 — KROK 10: Finalny PDF audytu technicznego (~30 min)

Analogiczny do `AUDYT_BAZY_MANA_30_04_2026.pdf` (audyt logiczny). PDF techniczny zawiera:

**Strona 1 — Streszczenie wykonawcze**
- 27 tabel, 11 funkcji SQL, 14 triggerów, 23 Edge Functions, ~40 RLS policies
- Stan bezpieczeństwa: rotacja DONE 3.05.2026
- Główne długi: policies qual=true, brak pgvector indeksów, brak indeksów traveler_id

**Strona 2 — FK i powiązania (KROK 1)**
- Diagram travels (hub) ← 8 tabel
- 5 tabel "sieroty" (TEXT bez FK)

**Strona 3 — Indeksy (KROK 2)**
- Co dobrze pokryte (mana_archiwum_tematyczne, events)
- 6 tabel z traveler_id bez indeksu (lista)
- pgvector brakuje (knowledge, conversations, dd_entries)

**Strona 4 — RLS + Policies (KROK 3+4)**
- 27/27 RLS włączone ✅
- ~40 policies wszystkie qual=true 🔴
- Konsekwencja: anon key = full CRUD na wszystko

**Strona 5 — Triggery + Funkcje (KROK 5+6)**
- 14 triggerów, 11 funkcji SQL
- Po rotacji 3.05: 0 hardcoded JWT w triggerach

**Strona 6 — Edge Functions (KROK 8)**
- Tabela 23 funkcji × auth mode × status

**Strona 7 — Schema niespójności (KROK 9)**
- Mapa typów traveler_id

**Strona 8 — Co dalej**
- Lista 12 długów technicznych z [630]
- Kolejność naprawy: bezpieczeństwo → wydajność → schema

Wygeneruj PDF analogicznie do tego z 30.04 (D ma narzędzia w computer use jeśli sesja jest w Claude.ai webowym; jeśli Desktop — wygeneruj jako Markdown plus instrukcję dla Adama jak wygenerować PDF lokalnie).

**DoD B3:** PDF gotowy w `/mnt/user-data/outputs/`, present_files. Adam drukuje obok PDF logicznego.

---

## CZĘŚĆ C — OPCJONALNE (jeśli czas) (~30 min)

### C1 — Refinement promptu `duch_dd`

Pierwsza wersja z 2.05 ma puste frazy ("to bardzo ładne wspomnienie") + dziwną składnię ("czy mamę lubisz"). 

Dopracuj: dodaj konkretne **przykłady ZŁE → DOBRE odpowiedzi**, rozszerz listę zakazanych fraz o "ładne", "bardzo", "wspomnienie", odrobina lepszej składni dla pytań.

```sql
UPDATE prompts SET tresc = $$ ...nowa wersja... $$ WHERE nazwa = 'duch_dd';
```

Smoke test: wpisz 3 myśli różnych typów (osobista pozytywna, ogólna, trudna), sprawdź czy odpowiedzi są krótsze i bez pustych fraz.

### C2 — UX dług w iskierka.html (Adam decyduje czy w sesji)

Funkcja `ddEnter()` po wejściu w Dobry Dzień — jeśli `S.ddDone >= maxDaily()` powinna od razu pokazać `dd-done-msg` + ukryć `dd-input`. Obecnie wyświetla się po `ddBack()`.

**Zmiana ~3 linie kodu** w `ddShowNormalDD()` lub `ddEnter()`.

---

## ROLLBACK

- A4: każda funkcja ma rollback przez deploy poprzedniej wersji z Dashboard history
- A5 Revoke: bez rollback. Robisz po PASS A1-A4. Jeśli FAIL po Revoke — Standby Key generuj jako CURRENT.
- B1-B3: dokumenty, brak ryzyka

---

## CO NIE WCHODZI W SCOPE

- Krok 1 BIAŁA KARTA czyszczenie knowledge — osobne zadanie
- Naprawa policies RLS qual=true → auth.uid() — Krok 2 LOGOWANIE
- Naprawa typów traveler_id — Krok 2 LOGOWANIE
- Naprawa rejestrów aplikacje/pokoje/kafle — osobne zadania po BIAŁEJ KARCIE
- DROP TABLE constellations — osobne zadanie
- gospodarz.app projekt — osobne, dalekie

---

## DOMKNIĘCIE — co po sesji 5

Po DONE [631] cały audyt + rotacja zamknięte. Stan:
- Bezpieczeństwo: ✅ rotacja DONE
- Audyt logiczny: ✅ DONE 30.04
- Audyt techniczny: ✅ DONE 3.05
- 2 dokumenty PDF (logiczny + techniczny) gotowe do druku

**Następny milestone:** **Krok 1 BIAŁA KARTA** — czyszczenie knowledge + filtrowanie travels po whitelist 13. Brief musi być **oparty o [624]**, nie pisany z głowy. To jest osobny dzień pracy.

---

## POWIĄZANE

- **[630]** Checkpoint sesji 4 (ID 635 w bazie) — stan przed sesją 5
- **[624]** Audyt fundament — zostaje zaktualizowany w B1+B2
- **[625][626][627][628][629]** historia rotacji
- **[623]** BIAŁA KARTA — następny milestone po DONE

---

## META

- Autor: D (Claude.ai webowy) na podstawie [630] checkpoint
- Cel sesji: 2-3h skupione, mechaniczne
- Po DONE [631]: rotacja + audyt techniczny zamknięte. Adam decyduje co dalej (BIAŁA KARTA / refinement DD / odpoczynek)
