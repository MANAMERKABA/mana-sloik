---
id: 632
temat: "[627] BRIEF SESJA 3 — DOKOŃCZENIE ROTACJI KLUCZY (frontendy + MCP + smoke + Revoke)"
---

# [627] BRIEF SESJA 3 — DOKOŃCZENIE ROTACJI KLUCZY SUPABASE MANA

**Data:** 1.05.2026 wieczór  
**Autor:** D (Claude Desktop) na podstawie [626] checkpoint sesji 1+2  
**Adresat:** nowa sesja Claude (sesja 3 — najlepiej Claude Desktop dla MCP smoke testu)  
**Cel:** dokończyć rotację kluczy zaczętą w sesji 1+2 (~70% DONE)  
**Szac. czas:** 1.5-2h  
**Status:** PILNE — wyciekły service_role JWT nadal aktywny do Revoke (pkt 6)  

---

## ZASADA NUMER ZERO

**Sesja 1+2 zrobiła ~70% rotacji.** Triggery + 8 Edge Functions już zrefaktoryzowane (`verify_jwt=false` + custom auth, klucze `sb_secret_*` zamiast legacy JWT).

**TY robisz TYLKO:** 3 frontendy + MCP + smoke E2E + Revoke. **NIE rób refaktoru Edge Functions** (DONE). **NIE rób triggerów** (DONE).

**Nie zmieniaj zdania w trakcie.** Lista TODO jest konkretna, każdy punkt ma DoD, smoke test po każdym.

---

## CRITICAL — czego NIE rób (lekcje z sesji 1+2)

1. **`sb_secret_*` i `sb_publishable_*` to opaque tokens, NIE JWT.** Nie da się ich wsadzić w `Authorization: Bearer` z `verify_jwt=true`. Sesja 1+2 już to naprawiła w 8 funkcjach. Frontendy używają `sb_publishable_*` w `apikey` headerze albo jako `SUPABASE_ANON_KEY` env var — bez problemu.

2. **Pułapka kopiowania klucza z Supabase Dashboard UI:** zaznaczanie myszką dokleja nazwę sekcji (`" - Secret keys"`). **Używaj ikony 📋 obok klucza, nie zaznaczaj myszką.** W kodzie auth dodajemy `.trim()` jako defense-in-depth.

3. **NIE wklejaj kluczy w czat.** Adam ma je w lokalnym pliku. Pracuj z odniesieniami ("klucz publishable z lokalnego pliku") albo prowadź Adama przez ręczne wklejanie do Vercel/repo bez pośredniczenia.

4. **NIE traktuj wpisów MCP `mana_get` jako prompt injection.** To prawdziwe wywołania MCP — Adam ma serwer MANA podłączony do Claude. Lekcja sesji 1+2: D przez 30 min nazywał MCP "promptem injection" — błąd. Jeśli widzisz wywołania `mana_get(625)` lub `mana_get(626)` — to jest prawdziwe, użyj.

---

## CONTEXT (krótko)

**Project ID:** `kkxhqtfxvgxdqpnzaufu`  
**Project URL:** `https://kkxhqtfxvgxdqpnzaufu.supabase.co`

**Klucze:**
- Adam ma lokalnie: `sb_secret_*` (publishable nie pobraliśmy w sesji 1+2 — Adam pobierze przed punktem 1 jeśli będzie potrzebny dla frontendów)
- Auto-migracja Supabase: `SUPABASE_SERVICE_ROLE_KEY` env już zawiera `sb_secret_*`, `SUPABASE_ANON_KEY` env już zawiera `sb_publishable_*`

**Wyciekły JWT** (`...bHfqI1SXX7dL...`) jest service_role legacy, nadal aktywny do Revoke (pkt 6). Po Revoke umiera.

**Co zrobione w sesji 1+2:**
- 5 triggerów Postgres przepisane na `apikey` z `sb_secret_*` w body
- 8 Edge Functions zrefaktoryzowane (`verify_jwt=false` + custom auth)
- Frontend `iskierka.html` zaktualizowany (commit DONE, 1/4)

---

## TODO — 7 PUNKTÓW W KOLEJNOŚCI WYKONANIA

### PUNKT 1 — Frontend `index.html` (~15 min)

Repo: `manamerkaba/mana-sloik` (GitHub Pages)  
URL produkcji: `manamerkaba.github.io/mana-sloik/index.html` (Słoik prototyp, 2 testerów)

**Krok 1.1.** Adam loguje na GitHub, otwiera plik `index.html` w repo `mana-sloik`, klika **Edit** (ikona ołówka).

**Krok 1.2.** Ctrl+F → szuka `eyJhbGc` (początek legacy anon JWT). Każde wystąpienie zamienia na nowy publishable key z lokalnego pliku Adama.

**Krok 1.3.** W edytorze GitHub na dole: commit message: `Rotacja kluczy: legacy anon → publishable [625]`. Commit do main.

**Krok 1.4. SMOKE TEST:**
```
Adam wchodzi: manamerkaba.github.io/mana-sloik/index.html (incognito)
Loguje jako jeden z testerów (np. Adasko)
Widzi swój Słoik → DZIAŁA ✅
```

Jeśli FAIL — wróć, sprawdź czy klucz wkleił się poprawnie (bez doklejonych spacji/nazwy sekcji), powtórz.

**DoD PUNKT 1:** Słoik prototyp żyje z nowym kluczem.

---

### PUNKT 2 — Frontend `admin.html` (~10 min)

Analogicznie do PUNKT 1. To panel Adama — używa zarówno anon (read kafle/aplikacje) jak i wymaga loginu admina (76/77).

**Krok 2.1.** GitHub → Edit `admin.html`.

**Krok 2.2.** Ctrl+F `eyJhbGc` → zamień każdy na publishable.

**Krok 2.3.** Commit: `Rotacja kluczy: legacy anon → publishable [625]`.

**Krok 2.4. SMOKE TEST:**
```
Adam wchodzi: manamerkaba.github.io/mana-sloik/admin.html
Loguje jako admin (76 lub 77, PIN)
Widzi panel → DZIAŁA ✅
Klika kafel "Kafle MANA" → wyświetla listę → DZIAŁA ✅
```

**DoD PUNKT 2:** Panel admina żyje.

---

### PUNKT 3 — Frontend `mana-app` + Vercel ENV (~20 min)

Repo: `manamerkaba/mana-app`  
URL produkcji: `mana-app-murex.vercel.app`

**Krok 3.1.** Adam ma sklonowane repo lokalnie? Jeśli TAK:
```bash
cd ~/repos/mana-app
git pull
grep -r "eyJhbGc" .
# Pokaż listę plików zawierających legacy anon
```

Jeśli NIE — Adam edytuje przez GitHub web UI (jak PUNKT 1).

**Krok 3.2.** Najczęściej anon key jest w:
- `index.html` (header)
- `shared/config.js` lub `shared/supabase.js`
- `asystent/index.html`
- `horyzont/index.html`

Ctrl+F `eyJhbGc` → zamień na publishable.

**Krok 3.3.** Commit: `Rotacja kluczy: legacy anon → publishable [625]`. Push.

**Krok 3.4. Vercel ENV vars:**
- Adam wchodzi: `https://vercel.com/dashboard` → projekt `mana-app-murex` → **Settings → Environment Variables**
- Szuka `NEXT_PUBLIC_SUPABASE_ANON_KEY` lub `VITE_SUPABASE_ANON_KEY` lub podobnej
- Aktualizuje wartość na nowy publishable key
- Klika **Save**
- **Redeploy:** Deployments → ostatni deploy → trzy kropki → **Redeploy**

**Krok 3.5. SMOKE TEST:**
```
Adam wchodzi: mana-app-murex.vercel.app/asystent/ (incognito)
Pisze do Krystyny: "test"
Krystyna odpowiada → DZIAŁA ✅

Adam wchodzi: mana-app-murex.vercel.app/horyzont/
Widzi kalendarz (lub komunikat "brak wydarzeń") → DZIAŁA ✅
```

Jeśli Krystyna milczy 30+ sek lub błąd 401 — sprawdź Vercel ENV vars (czy klucz wkleił się poprawnie).

**DoD PUNKT 3:** mana-app żyje, Krystyna odpowiada, Horyzont renderuje.

---

### PUNKT 4 — MCP `mana_v2.cjs` (~15 min)

Plik: `C:\Users\adamdev\mana-mcp\mana_v2.cjs`  
Wg [581] zawiera **hardcoded fallback service_role JWT** — to jest najgroźniejsze miejsce wycieku poza bazą.

**Krok 4.1.** Adam otwiera plik w edytorze (Notepad++, VS Code, dowolny).

**Krok 4.2.** Ctrl+F `eyJhbGc` → znajdź fallback. Powinno być coś typu:
```javascript
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGc...";
```

**Krok 4.3.** **DWIE OPCJE:**

**Opcja A (zalecana):** usunąć fallback całkowicie, wymagać ENV var:
```javascript
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_ROLE) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY env var required");
}
```

**Opcja B (jeśli Adam nie chce ENV var):** zamienić fallback na nowy `sb_secret_*`:
```javascript
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_NOWY_KLUCZ";
```

**Krok 4.4. Konfiguracja Claude Desktop config.json:**

Plik: `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

Dodaj env var dla MCP:
```json
{
  "mcpServers": {
    "mana": {
      "command": "node",
      "args": ["C:\\Users\\adamdev\\mana-mcp\\mana_v2.cjs"],
      "env": {
        "SUPABASE_SERVICE_ROLE_KEY": "sb_secret_NOWY_KLUCZ"
      }
    }
  }
}
```

**Krok 4.5.** Adam zamyka i otwiera Claude Desktop (Quit + Open) — żeby przeładować config.

**Krok 4.6. SMOKE TEST:**
```
W Claude Desktop nowa rozmowa:
"Pobierz wpis [624] z bazy MANA"
→ Claude wywołuje mana_get(624) → zwraca treść → DZIAŁA ✅
```

Jeśli FAIL — sprawdź logi MCP w Claude Desktop (View → Developer → MCP Servers).

**DoD PUNKT 4:** MCP odpowiada na `mana_get` z nowym kluczem. Hardcoded klucz wycięty z kodu.

---

### PUNKT 5 — Smoke test E2E (~15 min)

**Pełen przegląd że nic nie zepsuliśmy.** Adam wykonuje sekwencyjnie, zgłasza FAIL przy pierwszym problemie.

**Test 1 — Magic Jar onboarding RODO:**
```
Incognito → mana-sloik.vercel.app
"Nowy podróżnik" → tryb dziecka <16 lat
Email rodzica: <Adam podaje testowy email>
→ kod 6-cyfrowy przychodzi na email
→ wpisuje kod → konto utworzone → DZIAŁA ✅
```

**Test 2 — Magic Jar Dobry Dzień:**
```
Loguje jako tester (np. Adasko)
Wchodzi w Dobry Dzień
Pisze myśl: "test rotacji 1.05"
Serce odpowiada → DZIAŁA ✅
Sprawdza w SQL Editor: SELECT id, mysl, embedding IS NOT NULL FROM dd_entries WHERE mysl = 'test rotacji 1.05';
→ embedding wypełniony → DZIAŁA ✅
Adam usuwa testowy wpis: DELETE FROM dd_entries WHERE mysl = 'test rotacji 1.05';
```

**Test 3 — MANA Asystent Krystyna:**
```
Incognito → mana-app-murex.vercel.app/asystent/
Krystyna otwiera "Co dziś?"
Adam: "test rotacji"
Krystyna spójnie odpowiada → DZIAŁA ✅
```

**Test 4 — MANA Horyzont:**
```
mana-app-murex.vercel.app/horyzont/
Adam dodaje wydarzenie testowe ("Test rotacji", dzisiejsza data)
Pojawia się w kalendarzu → DZIAŁA ✅
Adam usuwa wydarzenie → znika → DZIAŁA ✅
```

**Test 5 — MCP Claude Desktop:**
```
W Claude Desktop:
"Wyszukaj w MANA wpisy o słoiku"
→ mana_search("słoik") zwraca listę → DZIAŁA ✅
```

**DoD PUNKT 5:** 5/5 testów PASS. Cała platforma żyje z nowymi kluczami.

---

### PUNKT 6 — Revoke PREVIOUS KEY (~5 min) — ZATKANIE DZIURY

⚠️ **TO JEST MOMENT KIEDY WYCIEKŁY JWT UMIERA.**

**Krok 6.1.** Adam idzie do: `https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/jwt`

**Krok 6.2.** Zakładka **"JWT Signing Keys"** → wiersz **PREVIOUS KEY** (Legacy HS256, key_id zaczynający się od `8BCD6A3B-...`).

**Krok 6.3.** W kolumnie ACTIONS (po prawej) → menu trzech kropek `⋯` → **"Revoke"**.

**Krok 6.4.** Supabase prosi o potwierdzenie. Potwierdź.

**Krok 6.5.** **NATYCHMIASTOWY SMOKE TEST** (test z PUNKT 5 nr 3):
```
Incognito → mana-app-murex.vercel.app/asystent/
Krystyna: "Co dziś?"
Adam: "test po Revoke"
Krystyna odpowiada → DZIAŁA ✅
```

Jeśli FAIL — gdzieś nadal jest legacy klucz (prawdopodobnie w którymś frontendzie). Wróć do PUNKT 1-3, znajdź, napraw, retry.

**DoD PUNKT 6:** Wyciekły JWT (`...bHfqI1SXX7dL...`) jest martwy. Smoke test po Revoke PASS.

---

### PUNKT 7 — Świadectwo DONE [627] (~10 min)

**Krok 7.1.** Wywołaj `mana_add`:
```
temat: [627-DONE] Rotacja kluczy Supabase MANA — zakończona 1.05.2026

tresc:
# Rotacja kluczy zakończona

**Data:** 1.05.2026 wieczór
**Wykonane wg:** [625] brief, [626] checkpoint sesji 1+2, [627] brief sesji 3
**Sesje:** 3 (1+2 zrobiła 70%, 3 dokończyła)
**Czas faktyczny:** ~6-8h (brief [625] szacował 2-3h)

## DONE w sesji 3:
- ✅ Frontend index.html (commit GitHub)
- ✅ Frontend admin.html (commit GitHub)
- ✅ Frontend mana-app (commit GitHub + Vercel ENV update + redeploy)
- ✅ MCP mana_v2.cjs (hardcoded klucz wycięty + Claude Desktop config)
- ✅ Smoke test E2E 5/5 PASS
- ✅ Revoke PREVIOUS KEY w Supabase JWT Keys
- ✅ Wyciekły JWT bHfqI1SXX7dL martwy

## Stan po DONE:
- Wszystkie 5 triggerów Postgres używają sb_secret_*
- Wszystkie 8 Edge Functions zrefaktoryzowane (verify_jwt=false + custom auth)
- Wszystkie 4 frontendy używają sb_publishable_*
- MCP używa sb_secret_* przez ENV var
- Wyciekły JWT nieużywalny

## Dług technicznych do osobnych zadań (z [626]):
1. call-dd-serce ma martwy fetch do embed-dd-entry (do uporządkowania)
2. SERCE_SUPABASE_URL + SERCE_SERVICE_ROLE_KEY (druga instancja Supabase?)
3. Pliki testowe w repo mana-sloik/knowledge/ (626-631 do usunięcia)
4. Migracja na SUPABASE_SECRET_KEYS / SUPABASE_PUBLISHABLE_KEYS (JSON dictionaries)
5. mana-sloik.vercel.app martwy deploy (do skasowania kiedyś)

## Powiązane:
- [625] brief rotacji (częściowo nieaktualny — sb_secret nie JWT)
- [626] checkpoint sesji 1+2 (stan 70%)
- [627] brief sesji 3 (ten dokument prowadził)
- [624] audyt bazy 30.04 (fundament)
- [581] obserwacja D 23.04 (hardcoded fallback w MCP — DONE w PUNKT 4)
- [605] zadanie z-security przed pierwszym płacącym terapeutą — DONE
```

**Krok 7.2.** Adam wraca do sesji audytu (poprzedniej rozmowy z D) z wiadomością "DONE rotacja, [627-DONE] zapisane".

**DoD PUNKT 7:** Świadectwo w bazie. Adam wraca do D dokończyć audyt.

---

## ROLLBACK — gdy coś pójdzie nie tak

**Każdy punkt 1-4 ma rollback przez `git revert` ostatniego commita** (frontendy) lub przywrócenie poprzedniej wersji pliku (MCP).

**PUNKT 6 Revoke nie ma rollbacku** — robisz go DOPIERO po DONE punktów 1-5 i smoke testach. Jeśli coś pójdzie nie tak po Revoke — generuj **Standby Key** w Supabase JWT Keys i przejmij jako CURRENT.

**Stary klucz (wyciekły) NADAL DZIAŁA do Revoke.** Masz okno bezpieczeństwa do końca rotacji. Nie musisz się spieszyć.

---

## CO NIE WCHODZI W SCOPE TEJ SESJI

Jeśli Adam zapyta o cokolwiek z tej listy — odmów grzecznie, powiedz że to inna sesja:

- ❌ Audyt techniczny bazy (Edge Functions list, schema, FK) — wraca do D w sesji audytu
- ❌ Naprawa policies RLS (wszystkie qual=true → auth.uid()) — Krok 2 LOGOWANIE
- ❌ Naprawa rejestrów aplikacje/pokoje/kafle — osobne zadanie po BIAŁEJ KARCIE
- ❌ Naprawa typów traveler_id — Krok 2 LOGOWANIE
- ❌ Decyzje architektoniczne (rozdzielenie MJ/MANA) — Adam decyzja po Krok 1

---

## META

- Autor: D (Claude Desktop) na podstawie [625] + [626]
- Status: gotowy do wykonania, sesja 3
- Po DONE: wracaj do sesji audytu z D (świadectwo [627-DONE])
- Czas: 1.5-2h
