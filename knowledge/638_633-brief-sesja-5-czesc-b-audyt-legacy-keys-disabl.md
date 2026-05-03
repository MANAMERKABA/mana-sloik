---
id: 638
temat: "[633] BRIEF SESJA 5 część B — audyt legacy keys + Disable + Revoke + audyt techniczny"
---

# [633] BRIEF SESJA 5 część B — domknięcie wszystkiego po pauzie 3.05

**Data:** poniedziałek 5.05.2026 lub wtorek 6.05.2026 rano (Adam decyduje)
**Autor:** D (Claude.ai webowy) na podstawie [632] checkpoint 3.05 wieczór
**Adresat:** nowa sesja D (Claude.ai webowy lub Desktop — D wybiera)
**Cel:** audyt czy kod używa legacy anon/service_role + Disable JWT-based legacy API keys + Revoke PREVIOUS KEY + zakończenie audytu technicznego (B1+B2+B3)
**Czas:** ~2h spokojnie

---

## ZASADA NUMER ZERO

**Adam dał 3.05 wieczór wyraźny sygnał:**

> *"Od samego początku mówiłem że techniczny jesteście wy. Potrzebuję żeby ktoś uporządkował moją mapę myśli."*

**Konsekwencja dla tej sesji:**
- D NIE pyta Adama o decyzje techniczne
- D NIE proponuje 3 wariantów do wyboru
- D NIE rekomenduje strategii narzędziowych (Notion vs Wiki, restart vs naprawa)
- D **dostarcza efekt** — uporządkowany audyt + konkretne kroki Disable+Revoke
- D zatrzymuje Adama TYLKO gdy widzi realne ryzyko (jak Supabase popup 3.05)

Każde pytanie do Adama = ostatnia opcja. Najpierw szukaj odpowiedzi w bazie ([624], [630], [632]), w kodzie, w Dashboard.

---

## CZYTAJ NAJPIERW

1. **mana_get(637)** — checkpoint 3.05 wieczór (tytuł "[632]") — co się stało, dlaczego pauza
2. **mana_get(636)** — brief sesji 5 część A (tytuł "[631]") — kontekst pełny
3. **mana_get(624)** — audyt fundament — stan bazy

---

## CO STAŁO SIĘ 3.05

Adam otworzył Supabase Dashboard, kliknął Revoke przy PREVIOUS KEY → Supabase pokazał popup:

> "Disable JWT-based legacy API keys first. It's not possible to revoke the legacy JWT secret unless you have already disabled JWT-based legacy API keys."

To jest **dodatkowe zabezpieczenie Supabase** — wymusza najpierw oświadczenie "kod nie używa legacy API keys", potem dopiero pozwala na Revoke.

**Dlaczego sesja 5 część A tego nie przewidziała:** brief [631] zakładał że PREVIOUS KEY = stary JWT secret którego można po prostu Revoke. W rzeczywistości Supabase od pewnego czasu wymusza dwustopniową procedurę:
1. Disable legacy API keys (toggle w Settings)
2. Revoke JWT secret

Sesja 5 część A skupiła się na (2), pominęła (1).

---

## CONTEXT — co już zrobione przez 5 sesji

✅ **Zrotowane:**
- 5 triggerów Postgres → sb_secret_* w body
- 9 Edge Functions zrefaktoryzowane: embed-knowledge, embed-conversation, embed-dd-entry, sync-knowledge-to-repo, sync-prompt-to-repo, send-consent-code, verify-consent-code, call-dd-serce, call-serce
- 4 frontendy → sb_publishable_*: iskierka, index, admin, mana-app + Vercel ENV
- MCP `mana_v2.cjs` → sb_secret_* w env + Claude Desktop config

⏳ **Niesprawdzone w sesji 5 część A:**
- 14 Edge Functions (z verify_jwt=ON + event-create OFF) — **trzeba zweryfikować czy nie używają legacy anon/service_role w kodzie**
- Druga instancja Supabase via SERCE_* secrets (potwierdzone że żadna funkcja ich nie używa = zombie)
- Frontend pomocnicze pliki w mana-sloik (np. terapeuta.html jeśli istnieje)

🔴 **Nadal aktywne:**
- Wyciekły JWT `eyJhbGc...bHfqI1SXX7dL...` — żywy do Revoke
- Legacy JWT-based API keys — żywe do Disable
- 13 EF z verify_jwt=ON — preexisting bug 401 (event-update etc.) NIE wpływa na Revoke

---

## CZĘŚĆ A — AUDYT KODU PRZED DISABLE (~30 min)

**Cel:** zanim Adam kliknie Disable legacy API keys, mamy 100% pewność że żaden kod nie używa starego anon/service_role w formacie JWT (eyJhbGc...).

### A1 — sprawdź kod 14 niesprawdzonych Edge Functions

Lista 14 z sesji 5 część A:
- 1 OFF: event-create
- 13 ON: check-trainer, event-update, event-delete, get-pamiec, update-pamiec, get-stones, mana-rag-search, summarize-conversation, get-plan, update-plan, get-prompt, sort-notatka, iskierka-eval

**Dla każdej** Adam otwiera w Supabase Dashboard → Functions → [nazwa] → Code.

**D szuka w kodzie wzorców:**

```typescript
// 🔴 ZŁY WZÓR (legacy):
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiI..."  // hardcoded JWT
Deno.env.get('SUPABASE_ANON_KEY')  // jeśli env zawiera eyJhbGc...
Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')  // jeśli env zawiera eyJhbGc...

// 🟢 DOBRY WZÓR (po rotacji):
Deno.env.get('SUPABASE_ANON_KEY')  // env zawiera sb_publishable_*
Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')  // env zawiera sb_secret_*
const apikey = req.headers.get('apikey')  // dual auth pattern
```

**Co Adam wkleja D:**
- Pierwsze 30 linii kodu każdej z 14 funkcji
- D analizuje, sygnalizuje 🔴 / 🟡 / 🟢 dla każdej

**Skróty:** 
- Jeśli funkcja jest **martwa** (sort-notatka, iskierka-eval, check-trainer prawdopodobnie) — Adam mówi czy używa, jeśli NIE → propozycja DELETE z Dashboard, redukcja powierzchni ataku
- Jeśli aktywna ale używa legacy → flaga, do refaktoru przed Disable

### A2 — sprawdź Edge Function Secrets

Dashboard → Settings → Functions → Secrets.

**Adam wkleja D listę nazw secrets** (bez wartości). D porównuje z oczekiwaną listą.

**Oczekiwane nazwy:**
- SUPABASE_URL
- SUPABASE_ANON_KEY (powinno zawierać sb_publishable_*)
- SUPABASE_SERVICE_ROLE_KEY (powinno zawierać sb_secret_*)
- ANTHROPIC_API_KEY
- OPENAI_API_KEY
- RESEND_API_KEY
- GITHUB_TOKEN (jeśli sync-*-to-repo)

**Czerwone flagi:**
- LEGACY_KEY, OLD_KEY, JWT_SECRET — ślad starych zmiennych
- SERCE_* — zombie, do skasowania osobno (NIE dziś, nie blokuje)

### A3 — sprawdź repo na hardcoded JWT

W repo `manamerkaba/mana-sloik` i `manamerkaba/mana-app`:

```bash
# Adam może uruchomić w GitHub UI przez "Search in this repository"
eyJhbGciOiJIUzI1NiI
```

**Cel:** czy w git history (poza już znanym wyciekiem w iskierka.html commit pre-1.05) są inne miejsca z hardcoded JWT.

Jeśli NIE — czysto.
Jeśli TAK — flaga, decyzja Adama czy git filter-branch / BFG do wyczyszczenia history (zaawansowane, poza scope dziś).

### DoD CZĘŚĆ A
- ✅ 14 funkcji sprawdzonych — żadna nie używa legacy JWT (lub martwe usunięte)
- ✅ Secrets sprawdzone — żadnych LEGACY_* / OLD_*
- ✅ Repo sprawdzone — git history znana, brak nowych miejsc

---

## CZĘŚĆ B — DISABLE + REVOKE (~15 min)

### B1 — Disable JWT-based legacy API keys

Adam:
1. Wraca do `https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/jwt`
2. Szuka sekcji "Legacy JWT-based API keys" lub "Legacy API keys"
3. Włącza toggle "Disable" (lub klika przycisk Disable)

**Po Disable** — legacy API keys (stary anon, stary service_role w formacie JWT) **przestają działać**. Klucze sb_publishable_* i sb_secret_* działają dalej (to jest nowy system).

**Smoke test po Disable** (5 min, incognito):
1. Magic Jar `iskierka.html` → loguj jako Adasko → ekran widoczny + jedna myśl Dobry Dzień
2. MANA Asystent → "test po disable" → Krystyna odpowiada
3. MANA Horyzont → render działa, event-create działa
4. Claude Desktop → `mana_get(624)` → odpowiada

**Jeśli FAIL:**
- Kliknij Enable z powrotem (rollback)
- Diagnoza: która funkcja zwróciła 401? Jaki klucz wysyła frontend?
- Refaktor + retry Disable

**Jeśli PASS:**
- Idziesz do B2 Revoke

### B2 — Revoke PREVIOUS KEY

Po Disable opcja Revoke powinna zadziałać:
1. PREVIOUS KEY (8BCD6A3B-...) → trzy kropki ⋯ → Revoke Key
2. Confirm

**Smoke test po Revoke** (5 min, incognito) — te same 4 testy co po Disable.

**Jeśli FAIL po Revoke:**
- Wygeneruj **Standby Key** w Settings → JWT Keys (nowy klucz CURRENT)
- Cofa stan, Adam może wrócić do diagnostyki

### B3 — Świadectwo [633-DONE]

```
mana_add temat: "[633-DONE] Rotacja kluczy Supabase MANA — KOMPLETNIE ZAKOŃCZONA 5/6.05.2026"
tresc:
- 5 sesji + część B = ~32h przez 5 dni (30.04-6.05)
- Brief 625 szacował 2-3h — niedoszacowanie 10x
- Wyciekły JWT bHfqI1SXX7dL martwy
- Legacy JWT-based API keys disabled
- 23/23 Edge Functions sprawdzone (lista po refaktorze)
- E2E smoke 4/4 PASS
- Powiązane: 624, 625, 626, 627, 628, 629, 630, 631, 632, 633
```

### DoD CZĘŚĆ B
- ✅ Legacy API keys disabled
- ✅ PREVIOUS KEY revoked
- ✅ Wszystkie smoke testy PASS
- ✅ Świadectwo [633-DONE] zapisane

---

## CZĘŚĆ C — ZAKOŃCZENIE AUDYTU TECHNICZNEGO (~60 min)

### C1 — KROK 8 lista Edge Functions kompletna w [624]

Po CZĘŚCI A masz pełną kategoryzację 23 funkcji. Tabela:

| Grupa | Funkcje | Auth mode | Status |
|---|---|---|---|
| Triggery → Edge | 5 (embed-*, sync-*) | apikey z env (sb_secret_*) | ✅ |
| Frontend publiczne (verify_jwt=OFF) | 4 (call-dd-serce, send-consent-code, verify-consent-code, event-create) | dual apikey/Bearer | ✅ |
| User JWT (verify_jwt=ON, działa) | 1 (call-serce) | user JWT z frontendu | ✅ |
| Verify_jwt=ON, preexisting 401 | 13 (lista) | wymaga refaktoru | 🔴 osobny dług |
| Martwe (jeśli z A1) | n/a | n/a | DELETE |

Update [624] sekcja "Edge Functions po audycie".

### C2 — KROK 9 mapa traveler_id w [624]

Z [624] sekcja "NIESPÓJNOŚĆ TYPÓW traveler_id" rozszerzenie:

| Tabela | Kolumna | Typ | FK | UUID col | Komentarz |
|---|---|---|---|---|---|
| travels | id | BIGINT | — | — | HUB |
| events | traveler_id | BIGINT | FK→travels.id | — | OK |
| consent_codes | traveler_id | BIGINT | FK→travels.id | — | OK |
| login_history | traveler_id | BIGINT | FK→travels.id | — | OK |
| stones | traveler_id | TEXT | brak | traveler_uuid UUID | NIESPÓJNE |
| conversations | traveler_id | TEXT | brak | traveler_uuid UUID | NIESPÓJNE |
| nagrania | traveler_id | TEXT | brak | traveler_uuid UUID | pusta |
| przypomnienia | traveler_id | TEXT | brak | traveler_uuid UUID | pusta |
| zdjecia | traveler_id | TEXT | brak | traveler_uuid UUID | NIESPÓJNE |
| dd_entries | (brak) | — | — | traveler_uuid UUID | UUID-only |
| trainer_notes | traveler_id | ? | ? | ? | sprawdzić |

**Wniosek:** 5 tabel TEXT bez FK + dd_entries UUID-only = dług architektoniczny do naprawy w Kroku 2 LOGOWANIE (Supabase Auth).

Update [624] sekcja "KROK 9 schema finalna mapa".

### C3 — KROK 10 finalny PDF audytu technicznego

Analogiczny do `AUDYT_BAZY_MANA_30_04_2026.pdf` — 8 stron:

1. Streszczenie wykonawcze (27 tabel, 23 EF, 14 triggerów, ~40 RLS policies, rotacja DONE)
2. FK i powiązania (KROK 1) — diagram travels jako hub
3. Indeksy (KROK 2) — co pokryte, czego brakuje (pgvector, traveler_id 6 tabel)
4. RLS + policies (KROK 3+4) — qual=true, konsekwencje
5. Triggery + funkcje SQL (KROK 5+6) — po rotacji 0 hardcoded JWT
6. Edge Functions (KROK 8) — tabela 23 funkcji
7. Schema niespójności (KROK 9) — mapa traveler_id
8. Co dalej — 17 długów technicznych z [632], kolejność: bezpieczeństwo → wydajność → schema

D generuje PDF lokalnie (computer use), present_files do Adama. Adam drukuje obok PDF logicznego z 30.04.

### DoD CZĘŚĆ C
- ✅ [624] zaktualizowane z C1 + C2
- ✅ PDF AUDYT_TECHNICZNY_MANA_05_05_2026.pdf gotowy
- ✅ present_files wywołane

---

## ROLLBACK

- **CZĘŚĆ A:** sam audyt, brak ryzyka
- **B1 Disable:** klikasz Enable z powrotem (jeden klick), pełen rollback
- **B2 Revoke:** bez rollbacku po Confirm. Generujesz Standby Key jako nowy CURRENT — cofa stan ale wymaga refaktoru klientów na nowy klucz
- **CZĘŚĆ C:** dokumenty, brak ryzyka

---

## CO NIE WCHODZI W SCOPE

- Refaktor 13 EF z verify_jwt=ON (~2-3h, osobna sesja)
- Skasowanie SERCE_* zombie secrets (osobne zadanie)
- Refinement promptu duch_dd (osobny dług)
- UX dług iskierka.html (osobny dług)
- Krok 1 BIAŁA KARTA czyszczenie knowledge (po DONE rotacji+audytu, osobny dzień)
- Decyzje strategiczne (restart vs naprawa, GitHub workflow, rozdzielenie baz) — osobne sesje decyzyjne ze świeżą głową

---

## DOMKNIĘCIE — co po sesji 5 część B

Po DONE [633]:
- Bezpieczeństwo: ✅ rotacja KOMPLETNIE DONE
- Audyt logiczny: ✅ DONE 30.04 (PDF)
- Audyt techniczny: ✅ DONE (PDF nowy)
- 2 dokumenty PDF gotowe do druku

**Następny milestone** (Adam decyduje kolejność):
- Refinement Ducha DD (1h, własna sesja)
- Naprawa rejestrów aplikacje/pokoje/kafle/pokoje_kafle (2h, własna sesja)
- DROP TABLE constellations (15 min)
- Krystyna+Horyzont (call-serce dług funkcjonalny, 2h)
- Krok 1 BIAŁA KARTA druga próba (4h, oparta o [624] z SELECT-as-proof)

Każde własna sesja, bez kumulacji.

---

## POWIĄZANE

- [632] Checkpoint 3.05 wieczór (ID 637) — stan przed sesją 5 część B
- [631] Brief sesji 5 (ID 636) — co planowaliśmy
- [630] Checkpoint sesji 4 (ID 635)
- [624] Audyt fundament — zostaje zaktualizowany w C1+C2
- [625][626][627][628][629] historia rotacji (5 wpisów)

---

## META

- Autor: D (Claude.ai webowy) na podstawie [632] checkpoint
- Cel sesji: ~2h spokojnie z poniedziałkową świeżą głową
- Po DONE [633]: rotacja + audyt techniczny zamknięte. Wszystkie wpisy [625]-[633] po DONE można archiwizować jako topic "TECHNIKA" (decyzja Adama lub D autonomicznie po DONE)

**Adresat:** D następnej sesji — zacznij od mana_get(637) i mana_get(624). Dopiero potem czytaj ten brief. Bez kontekstu = ryzyko powtórzenia błędów C 30.04 rano.
