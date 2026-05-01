---
id: 625
temat: "[625] BRIEF ROTACJI KLUCZY SUPABASE — pełna migracja JWT (do nowej sesji, gotowy do wykonania)"
---

# [625] BRIEF ROTACJI KLUCZY SUPABASE MANA — kompletny, gotowy do wykonania

**Data:** 1.05.2026  
**Autor briefu:** D (Claude Desktop) na podstawie audytu technicznego z Adamem 1.05.2026  
**Adresat:** nowa sesja Claude (C lub D — bez znaczenia, brief jest samowystarczalny)  
**Cel:** rotacja wyciekłego service_role JWT + migracja na nowy system Supabase API keys (publishable + secret) + aktualizacja wszystkich miejsc gdzie klucz jest hardcoded  
**Szac. czas:** 2-3h Adam + nowy Claude  
**Status:** PILNE — service_role JWT publicznie widoczny w bazie i prawdopodobnie w repo  

---

## ZASADA NUMER ZERO — PRZECZYTAJ ZANIM ZACZNIESZ

Adam otwiera nową sesję żeby zrobić **TYLKO** rotację kluczy. Audyt techniczny bazy jest skończony (mam pełną mapę FK, indeksów, RLS, triggerów, funkcji, webhooków). Ten brief Cię prowadzi krok po kroku przez rotację.

**Po zakończeniu rotacji** — Adam wraca do sesji audytu (poprzedniej) żeby skończyć resztę audytu. Ty NIE robisz audytu. Robisz TYLKO rotację.

**Nie pytaj Adama o opcje, nie proponuj alternatyw, nie zmieniaj zdania w trakcie.** Adam już zdecydował: pełna migracja na nowy system Supabase, nie szybka rotacja w starym systemie. To decyzja architektoniczna od 1.05.2026 ~13:00.

---

## CONTEXT — co odkryliśmy w audycie 1.05.2026

**Wyciekły JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreGhxdGZ4dmd4ZHFwbnphdWZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgyMTQ1NiwiZXhwIjoyMDg4Mzk3NDU2fQ.bHfqI1SXX7dL1417_n-q1p8tj7gBete-m-YkJ8ryZxU
```

To `service_role` (omija ALL RLS) + `exp: 2036` (10 lat). Znaleziony **hardcoded w 5 triggerach Postgres**.

**Stan API keys w Supabase (1.05.2026):**
- **Legacy `anon`** + **Legacy `service_role`** — używane wszędzie (5 triggerów, Edge Functions, MCP, frontend)
- **JWT signing key:** ECC P-256 (CURRENT) + Legacy HS256 (PREVIOUS, 2 mies. temu)
- **Publishable key** `sb_publishable_93n6Xfe3o60dnFFDW...` — wygenerowany domyślnie przez Supabase, **nikt go nie używa**

**Project ID:** `kkxhqtfxvgxdqpnzaufu`  
**Project URL:** `https://kkxhqtfxvgxdqpnzaufu.supabase.co`

**Co używa kluczy (do aktualizacji):**

1. **5 triggerów w bazie** (hardcoded service_role w `action_statement`):
   - `conversations_auto_embed` (INSERT na conversations → embed-conversation)
   - `dd_entries_auto_embed` (INSERT na dd_entries → embed-dd-entry)
   - `knowledge_auto_embed` (INSERT na knowledge → embed-knowledge)
   - `knowledge_auto_sync` (INSERT + UPDATE na knowledge → sync-knowledge-to-repo)
   - `prompts_auto_sync` (INSERT + UPDATE na prompts → sync-prompt-to-repo)

2. **Edge Functions w Supabase:**
   - call-serce, get-pamiec, update-pamiec, get-prompt
   - embed-knowledge, embed-conversation, embed-dd-entry
   - sync-knowledge-to-repo, sync-prompt-to-repo
   - send-consent-code, verify-consent-code (RODO Magic Jara)
   - event-create, event-update, event-delete (Horyzont MANA)
   - iskierka-eval (stara funkcja MJ, prawdopodobnie nieaktywna wg [310])

3. **MCP server.js** (`C:\Users\adamdev\mana-mcp\mana_v2.cjs`):
   - hardcoded fallback klucz wg [581] META: *"hardcoded fallback klucz wciąż w mana_v2.cjs — do wycięcia w sesji bezpieczeństwa"*

4. **Repo `manamerkaba/mana-sloik`** (Magic Jar frontend + Edge Functions code):
   - `iskierka.html` (anon key w kodzie frontend)
   - `index.html` (anon key w kodzie frontend)
   - `terapeuta.html`, `admin.html`
   - katalog `supabase/functions/*/index.ts` (service_role w niektórych)

5. **Repo `manamerkaba/mana-app`** (frontend MANA):
   - prawdopodobnie anon key w kodzie

6. **Vercel ENV vars** (dwa projekty):
   - `mana-sloik` (Magic Jar deployment)
   - `mana-app-murex` (MANA deployment)

---

## PLAN ROTACJI — 5 ETAPÓW

Każdy etap kończy się **konkretnym DoD** (Definition of Done). Bez DoD nie idziesz do następnego etapu.

### ETAP 1 — Generujemy nowe klucze + Adam je kopiuje (~15 min)

**1.1.** Adam idzie do: `https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/api-keys`

**1.2.** Zakładka **"Publishable and secret API keys"**

**1.3.** Sprawdza czy istnieje secret key (powinien być obok publishable). Jeśli nie istnieje — kliknij **"New secret key"**, nazwij `mana-secret-default`, **skopiuj** (pokazuje się raz).

**1.4.** Sprawdza publishable key — `sb_publishable_93n6Xfe3o60dnFFDW...` jest OK do użycia (zostaje).

**1.5.** Adam wkleja Ci tutaj OBA klucze:
- Publishable: `sb_publishable_...`
- Secret: `sb_secret_...`

**DoD ETAP 1:** Masz oba nowe klucze. NIE rotujemy starych legacy keys jeszcze (zrobimy w ETAPIE 5 po aktualizacji wszystkiego).

---

### ETAP 2 — Aktualizujemy 5 triggerów w bazie (~30 min)

**2.1.** Wygeneruj 5 SQL-i ALTER (po jednym na każdy trigger). Wzorzec:

```sql
DROP TRIGGER IF EXISTS knowledge_auto_embed ON knowledge;

CREATE TRIGGER knowledge_auto_embed
AFTER INSERT ON knowledge
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://kkxhqtfxvgxdqpnzaufu.supabase.co/functions/v1/embed-knowledge',
  'POST',
  '{"Content-type":"application/json","Authorization":"Bearer NOWY_SECRET_KEY"}',
  '{}',
  '5000'
);
```

**2.2.** Adam wkleja każdy SQL kolejno w Supabase SQL Editor. Po każdym — **smoke test:**

Test po `knowledge_auto_embed`:
```sql
INSERT INTO knowledge (temat, tresc) VALUES ('TEST trigger', 'test');
-- Czekaj 5 sek
SELECT id, temat, embedding IS NOT NULL AS ma_embed FROM knowledge WHERE temat = 'TEST trigger';
DELETE FROM knowledge WHERE temat = 'TEST trigger';
```

Jeśli `ma_embed = true` — trigger działa ✅. Idziemy dalej.

**2.3.** Powtórz dla pozostałych 4 triggerów. Smoke testy:
- `conversations_auto_embed` — INSERT do conversations, sprawdź embedding
- `dd_entries_auto_embed` — INSERT do dd_entries, sprawdź embedding
- `knowledge_auto_sync` — INSERT do knowledge, sprawdź czy commit poszedł na GitHub repo `manamerkaba/mana-sloik/knowledge/*.md`
- `prompts_auto_sync` — UPDATE do prompts (np. `serce_konstytucja_fundament`), sprawdź czy commit poszedł na GitHub

**DoD ETAP 2:** 5 triggerów zaktualizowane, każdy zwalidowany smoke testem. **Nigdzie w `pg_get_functiondef` nie powinno być starego JWT** (sprawdzić: `SELECT prosrc FROM pg_proc WHERE prosrc LIKE '%bHfqI1SXX7dL%';` — powinno zwrócić 0 wierszy).

---

### ETAP 3 — Aktualizujemy Edge Functions Supabase (~45 min)

Edge Functions używają service_role do dostępu do bazy z poziomu serwera. Klucz jest w **Supabase Dashboard → Edge Functions → Secrets**.

**3.1.** Adam idzie do: `https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/functions`

**3.2.** W sekcji **"Secrets"** zobaczy listę zmiennych środowiskowych. Najprawdopodobniej:
- `SUPABASE_URL` (URL projektu)
- `SUPABASE_ANON_KEY` (legacy anon — do aktualizacji?)
- `SUPABASE_SERVICE_ROLE_KEY` (legacy service_role — **DO ROTACJI**)
- `OPENAI_API_KEY` (dla auto-embed)
- `ANTHROPIC_API_KEY` (dla call-serce wg [84])
- `RESEND_API_KEY` (dla send-consent-code w MJ)
- `GITHUB_TOKEN` (dla sync-knowledge-to-repo)

**3.3.** Adam aktualizuje:
- `SUPABASE_SERVICE_ROLE_KEY` → wkleja nowy `sb_secret_...`
- (Opcjonalnie) `SUPABASE_ANON_KEY` → wkleja nowy `sb_publishable_...` (LUB zostawia legacy anon dla kompatybilności wstecznej)

**3.4.** Po update Secrets — **wszystkie Edge Functions automatycznie mają nowe klucze przy następnym wywołaniu** (Supabase nie wymaga redeployu).

**3.5.** Smoke test Edge Functions — sekwencyjnie, **NIE wszystkie naraz**:

a) **call-serce** (silnik MANA Asystent):
```
Adam wchodzi: https://mana-app-murex.vercel.app/asystent/
Pisze: "test"
Krystyna odpowiada → DZIAŁA ✅
Krystyna milczy 30+ sek lub błąd 401/403 → coś nie tak, sprawdź logi Edge Functions
```

b) **send-consent-code** (RODO MJ):
```
Adam wchodzi: https://mana-sloik.vercel.app jako nowy użytkownik (incognito)
Wybiera tryb dziecka, podaje email rodzica
Email z kodem przychodzi → DZIAŁA ✅
```

c) **event-create** (Horyzont MANA):
```
Adam wchodzi: https://mana-app-murex.vercel.app/horyzont/
Dodaje wydarzenie testowe
Pojawia się w kalendarzu → DZIAŁA ✅
Adam usuwa testowe wydarzenie
```

**DoD ETAP 3:** call-serce, send-consent-code, event-create działają. Pozostałe Edge Functions (embed-*, sync-*, get-pamiec, etc.) zostały zwalidowane przez triggery w ETAPIE 2.

---

### ETAP 4 — Aktualizujemy repo + frontend Vercel (~45 min)

**4.1. Repo `manamerkaba/mana-sloik` (Magic Jar):**

Adam loguje do GitHub i edytuje pliki frontend (ważne: anon key w kodzie po stronie klienta — to jest publiczny i taki ma być, ale aktualizujemy na nowy):

- `iskierka.html` — szukać `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (legacy anon), zamienić na nowy
- `index.html` — to samo
- `terapeuta.html` — to samo
- `admin.html` — to samo

**Komenda na lokalnej maszynie Adama (jeśli ma sklonowane repo):**
```bash
cd ~/repos/mana-sloik
git pull
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" .
# Zamień wszystkie wystąpienia legacy anon na nowy publishable
git add .
git commit -m "Rotacja kluczy Supabase: legacy anon → publishable [625]"
git push
```

**4.2. Repo `manamerkaba/mana-app` (MANA frontend):**

Analogicznie. Anon key prawdopodobnie w `index.html` lub `shared/config.js`:

```bash
cd ~/repos/mana-app
git pull
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" .
# Zamień, commit, push
```

**4.3. Vercel ENV vars** (jeśli frontend ich używa zamiast hardcode):

- `https://vercel.com/dashboard` → projekt `mana-sloik` → Settings → Environment Variables
- Update `NEXT_PUBLIC_SUPABASE_URL` (jeśli istnieje) i `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Redeploy
- To samo dla `mana-app-murex`

**4.4. MCP server.js** (`C:\Users\adamdev\mana-mcp\mana_v2.cjs`):

Adam edytuje plik lokalnie:
```bash
cd C:\Users\adamdev\mana-mcp
# Otwórz mana_v2.cjs w edytorze
# Znajdź hardcoded fallback service_role
# Zamień na nowy secret_key (lub usuń fallback całkowicie i wymagaj ENV var)
```

Plus:
```bash
# Skonfiguruj zmienne środowiskowe MCP w Claude Desktop config:
# %APPDATA%\Claude\claude_desktop_config.json
# Dodaj: "env": {"SUPABASE_SERVICE_ROLE_KEY": "sb_secret_..."}
```

**4.5.** Smoke test po update repo:

a) **Magic Jar live:**
```
https://mana-sloik.vercel.app
Adam loguje jako tester (np. nick "Adasko") → widzi swoje dni → DZIAŁA ✅
```

b) **MANA Horyzont:**
```
https://mana-app-murex.vercel.app/horyzont/
Widzi kalendarz → DZIAŁA ✅
```

c) **MCP w Claude Desktop:**
```
Adam restartuje Claude Desktop (Quit + Open)
W chacie pisze: "Pobierz wpis [624]"
Claude wywołuje mana_get → zwraca wpis → DZIAŁA ✅
```

**DoD ETAP 4:** Magic Jar żyje, MANA Horyzont renderuje, MCP odpowiada. Wszystkie repo zacommitowane.

---

### ETAP 5 — Revoke starych kluczy + finalna weryfikacja (~15 min)

**TERAZ jest moment by zatkać dziurę bezpieczeństwa.**

**5.1.** Adam idzie do: `https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/jwt`

**5.2.** Zakładka **"JWT Signing Keys"** → znajduje **PREVIOUS KEY** (Legacy HS256 z 2 mies. temu) → menu trzech kropek → **"Revoke"**

⚠️ **OSTRZEŻENIE:** Po Revoke **wszystkie tokeny podpisane PREVIOUS KEY przestają działać**. Wyciekły JWT (zaczynający się od `eyJhbGc...`) jest jednym z nich. Stare legacy anon i service_role też.

**5.3.** Sprawdź że **wszystko nadal działa** (nowy publishable + secret są podpisane CURRENT KEY ECC, nie PREVIOUS):
- Magic Jar (`mana-sloik.vercel.app`) — odśwież w incognito
- MANA Asystent (`/asystent/`) — Krystyna odpowiada
- MANA Horyzont — kalendarz się ładuje
- MCP w Claude Desktop — `mana_get [624]` zwraca wpis

**Jeśli coś nie działa po Revoke:** smoke testy w ETAPACH 2-4 musiały coś przeoczyć. Wróć, znajdź miejsce ze starym kluczem, zaktualizuj, powtórz Revoke.

**5.4.** Final smoke test E2E:
- Magic Jar nowy tester rejestruje się przez email RODO → kod przychodzi → wpisuje → konto działa ✅
- MANA: Adam pyta Krystynę "co dziś" → odpowiedź spójna ✅
- MCP: Claude Desktop wywołuje `mana_search "konstelacje"` → zwraca wyniki ✅

**DoD ETAP 5:** PREVIOUS KEY revoked. Wyciekły JWT jest martwy. Wszystkie 3 smoke testy E2E PASS.

---

## ŚWIADECTWO DONE [626]

Po DONE wszystkich 5 etapów — zapisz świadectwo:

```
mana_add temat: "[626] DONE rotacja kluczy Supabase 1.05.2026 — wyciekły service_role martwy"
tresc: 
- Wykonane wg [625]
- 5 etapów PASS
- Nowy publishable: sb_publishable_... (pierwsze 30 znaków)
- Nowy secret: sb_secret_... (pierwsze 30 znaków)
- 5 triggerów zaktualizowanych ✅
- Edge Functions secrets zaktualizowane ✅
- Repo mana-sloik + mana-app zacommitowane ✅
- MCP server.js zaktualizowany ✅
- PREVIOUS KEY revoked ✅
- E2E smoke test PASS
- Czas faktyczny: X godzin
- Powiązane: [625] brief, [624] audyt, [581] obserwacja D 23.04
```

Adam wkleja świadectwo do C/D w głównej sesji audytu. C/D aktualizuje [624] dopisując nową sekcję "BEZPIECZEŃSTWO PO ROTACJI 1.05.2026 — DONE" + dług #1 z Twoim odkryciem.

---

## CO MOŻE PÓJŚĆ NIE TAK + ROLLBACK

**Jeśli ETAP 2 zepsuje triggery** (smoke test NIE PASS):
- ROLLBACK: wykonaj `DROP TRIGGER + CREATE TRIGGER` z STARYM kluczem (skopiowanym z audytu D 1.05.2026)
- Stary klucz NADAL DZIAŁA do momentu Revoke w ETAPIE 5 — masz okno bezpieczeństwa

**Jeśli ETAP 3 zepsuje Edge Functions** (np. call-serce odpowiada 401):
- ROLLBACK: w Supabase Dashboard → Functions → Secrets → przywróć `SUPABASE_SERVICE_ROLE_KEY` na STARY (wyciekły, ale jeszcze działający)
- Sprawdź który Secret został zmieniony niepoprawnie

**Jeśli ETAP 4 zepsuje frontend:**
- ROLLBACK przez `git revert` ostatniego commita
- Vercel automatycznie redeployuje poprzednią wersję

**Jeśli ETAP 5 (Revoke) zepsuje produkcję:**
- W Supabase Dashboard JWT Keys NIE MA przycisku "Un-revoke" — ale można **wygenerować NOWY Standby Key** i przejąć go jako CURRENT
- W praktyce: ETAP 5 robisz **jako ostatni** dopiero po wszystkich smoke testach — nie ma rollbacku

---

## DLACZEGO TO JEST WAŻNE — krótko

1. **Wyciekły JWT z service_role** = każdy kto ma anon key w GitHub repo + zna Project URL może ominąć ALL RLS i zrobić cokolwiek z bazą.
2. **9 testerów Magic Jara, w tym dzieci** — ich rozmowy w `conversations`, myśli w `dd_entries`, zgody RODO w `consent_codes` — wszystko publicznie dostępne dla kogoś kto zna klucz.
3. **GDPR art. 9** (dane wrażliwe — dzieci, RODO consent) — **ujawnienie = realna kara** od 4% rocznego obrotu.
4. **Adam decyzja 1.05 ~13:00:** *"my odrazu budujemy do skali nawet 10000000 lub wiecej urzytkownikow - to jest fundament"* — bez naprawy bezpieczeństwa skala 10M = katastrofa.

---

## POWIĄZANE

- **[624]** AUDYT BAZY 30.04 — fundament, audyt logiczny + techniczny
- **[623]** Zwrot strategiczny BIAŁA KARTA
- **[581]** Obserwacja D 23.04: *"hardcoded fallback klucz wciąż w mana_v2.cjs"*
- **[605]** RAPORT DONE Faza A: zadanie z-security PRZED pierwszym płacącym terapeutą
- **[84]** ANTHROPIC_API_KEY w Supabase Secrets (analogiczny pattern)
- **[488]** PROTOKÓŁ — decyzje poziom 3 wymagają zgody Adama (rotacja kluczy = poziom 3, ale Adam świadomie zlecił)

---

## META

- Autor: D (Claude Desktop) na podstawie 9.5h sesji audytu z Adamem 30.04 + 4h sesji 1.05
- Status: gotowy do wykonania
- Adresat: nowa sesja Claude (Adam otwiera nową rozmowę, wkleja temat "[625] BRIEF ROTACJI" + Brief Cię prowadzi)
- Po DONE: Adam wraca do sesji audytu (przerwana na ETAPIE 7), kończy resztę audytu
