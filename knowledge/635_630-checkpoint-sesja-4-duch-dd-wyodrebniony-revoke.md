---
id: 635
temat: "[630] CHECKPOINT sesja 4 — Duch DD wyodrębniony, Revoke przełożony na jutro"
---

# [630] CHECKPOINT sesja 4 — DUCH DD DONE, REVOKE PRZEŁOŻONY

**Data:** 2.05.2026 ~21:30
**Sesja:** Adam + D (Claude.ai webowy), kontynuacja audytu z 30.04 + 1.05
**Stan:** Sesja 4 KROK 1+2 DONE · Spokojna Noc bez bugu (preexisting interpretacja sesji 3 błędna) · Magic Jar Dobry Dzień DZIAŁA · Revoke przełożony na sesję 5 z powodu zmęczenia + niesprawdzonych Edge Functions

---

## CO ZROBIONE 2.05 (sesja 4 częściowo)

### KROK 1 — Duch DD wyodrębniony jako prompt ✅
- Backup `magic_jar_kontekst_backup_2_05` (1251 znaków) — zachowany
- Nowy `prompts.duch_dd` (2626 znaków) — pełna tożsamość Ducha (misja, granice, ton, mechanika BLOKADA:TAK/NIE, typy myśli)
- Nazwa zmieniona z `duch_mj` na `duch_dd` w trakcie sesji (Adam: precyzyjniej, bo Duch jest tylko w Dobrym Dniu, nie w całym Magic Jarze)
- Stan tabeli `prompts` (6 wpisów po update):
  - `serce_konstytucja_fundament` (4458)
  - `serce_konstytucja` (5763)
  - `duch_asystent_prywatny` (10793)
  - `duch_dd` (2626) — NOWY
  - `magic_jar_kontekst` (1251) — STARY, nie używany w kodzie
  - `magic_jar_kontekst_backup_2_05` (1251)

### KROK 2 — Update Edge Function `call-dd-serce` ✅
- Adam zmienił `.eq('nazwa', 'magic_jar_kontekst')` na `.eq('nazwa', 'duch_dd')`
- Deploy DONE
- Smoke test: myśl "ugotowałam zupę z mamą" → odpowiedź "To bardzo ładne wspomnienie — razem w kuchni, coś co się tworzy. Czy mamę lubisz gdy gotujecie razem?" — DZIAŁA technicznie, jakościowo do dopracowania (puste frazy "to bardzo ładne wspomnienie" + dziwna składnia "czy mamę lubisz")
- Puzzle otworzyło się (BLOKADA:NIE) ✅

### Aktualizacja [624] ✅
- Sekcja DUCHY SERCA pozycja #7: zmiana z "Duch MJ NIE wyodrębniony" na "Duch DD LIVE od 2.05.2026 jako prompts.duch_dd"
- Sekcja prompts: z 4 wpisów na 6 (z opisem każdego)
- Sekcja NAZEWNICTWO: dopisana zmiana Duch MJ → Duch DD
- META: aktualizacja 2.05 wieczór

### Diagnoza preexisting NIE-bugów (sesja 3 błędna interpretacja)
1. **Spokojna Noc INSERT** — sesja 3 myślała że nie zapisuje. Faktycznie: kod zapisuje do `travels.sn_items_cloud` (jsonb), NIE do `dd_entries`. Adasko ma stary wpis "Jestem zły na zosie" w `sn_items_cloud` — celowa architektura, nie bug.
2. **MJ Dobry Dzień "tam nie ma pola do wpisania"** — Adam zobaczył że textarea znika gdy zużył dzienny limit (4×4 puzzle = 3 myśli, 5×5 = 4, 6×6 = 5). Mechanika produktu działa poprawnie. Komunikat "Na dziś koniec!" wyświetla się tylko po `ddBack()`, nie po `ddEnter()` — UX dług, nie blokada.

---

## CO ZOSTAŁO (sesja 5 jutro, ~30 min)

### Przed Revoke MUSI być sprawdzone (czego dziś nie sprawdzono):
1. **Lista 23 Edge Functions** w Dashboard — sesja 1+2 zrefaktoryzowała 9. Pozostałe 14 nie sprawdzone czy używają legacy JWT.
2. **`SERCE_SUPABASE_URL` + `SERCE_SERVICE_ROLE_KEY`** w Edge Function Secrets — wygląda na drugą instancję Supabase. Jeśli zawiera wyciekły JWT, Revoke ją zabije.
3. **Smoke test wszystkich 14 nie-zrefaktoryzowanych funkcji** — przynajmniej tych aktywnych

### Revoke krok po kroku:
4. `https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/jwt`
5. **PREVIOUS KEY** (Legacy HS256, 8BCD6A3B-...) → menu trzech kropek → **Revoke** → Confirm
6. Smoke test po Revoke (incognito): MJ + MANA Asystent + MCP + 3 inne losowe Edge Functions
7. Świadectwo `[631-DONE]` rotacja kompletnie zakończona

### Refinement Ducha DD (nie blokuje Revoke, osobny dług):
- Pierwsza wersja `duch_dd` ma puste frazy ("to bardzo ładne wspomnienie") mimo zakazu
- Doprecyzować: dodać konkretne ZŁE → DOBRE przykłady, rozszerzyć listę zakazanych fraz
- UPDATE prompt + retest

---

## STAN BEZPIECZEŃSTWA NA 2.05 ~21:30

🟡 **Wyciekły JWT `...bHfqI1SXX7dL...` NADAL ŻYWY:**
- Repo `mana-sloik` publiczne — klucz w git history (przed iskierka.html commit 1.05)
- 14 Edge Functions niesprawdzonych — mogą używać legacy JWT
- Druga instancja Supabase (SERCE_*) — niezweryfikowana

✅ **Zrotowane:**
- 5 triggerów Postgres → sb_secret_* (apikey w body)
- 9 Edge Functions zrefaktoryzowane: embed-knowledge, embed-conversation, embed-dd-entry, sync-knowledge-to-repo, sync-prompt-to-repo, send-consent-code, verify-consent-code, call-dd-serce, call-serce
- 4 frontendy → sb_publishable_*: iskierka, index, admin, mana-app + Vercel ENV
- MCP `mana_v2.cjs` → publishable + Claude Desktop config

**Ryzyko:** niskie ale niezerowe. Magic Jar to 9 testerów (dzieci + rodzina), nie public app. Klucz w git history wymaga celowego szukania `git log -p | grep eyJ`.

---

## DECYZJA ADAMA 2.05 ~21:30

Adam: *"jestes tego pewny?"* (czy Revoke nic nie zepsuje)
D: nie jestem 100% pewny — 14 Edge Functions nie sprawdzonych + SERCE_* secrets nieznane.
Adam: STOP, jutro spokojnie z pełnym audytem przed Revoke.

**Słuszna decyzja.** 9.5h sesji, fundamenty Ducha DD położone, Magic Jar ustabilizowany. Revoke wymaga 30 min świeżej głowy z Dashboard, nie pośpiechu po 9h.

---

## DŁUGI TECHNICZNE (do osobnych zadań)

1. ⏳ **Sesja 5 — Revoke** (jutro, ~30 min): audyt Edge Functions + SERCE_* + Revoke + świadectwo [631-DONE]
2. **Refinement `prompts.duch_dd`** — puste frazy, składnia "czy mamę lubisz"
3. **UX dług**: `updateDDUI()` po `ddEnter()` powinno pokazać "Na dziś koniec!" gdy limit zużyty
4. **Skasowanie `prompts.magic_jar_kontekst`** po stabilizacji Ducha DD przez kilka dni
5. **Migracja na SUPABASE_SECRET_KEYS / SUPABASE_PUBLISHABLE_KEYS** (JSON dictionaries — Supabase deprecated SUPABASE_SERVICE_ROLE_KEY env var)
6. **Pliki testowe w repo** mana-sloik/knowledge/ (626-631 do usunięcia)
7. **traveler_uuid NULL w dd_entries** (frontend nie wypełnia UUID przy INSERT)
8. **Krystyna nie czyta events** (call-serce dług funkcjonalny)
9. **memory tabela nie istnieje** w bazie, call-serce ma try/catch milczący
10. **mana-app klucz w kodzie** zamiast Vercel ENV
11. **mana-sloik.vercel.app martwy deploy** (do skasowania)
12. **call-dd-serce ma martwy fetch** do embed-dd-entry (entry_id vs id mismatch)

---

## POWIĄZANE

- **[624]** AUDYT BAZY 30.04 — fundament logiczny + techniczny + Duch DD wpisany 2.05
- **[625]** BRIEF ROTACJI pierwotny (1.05) — częściowo nieaktualny
- **[626]** Checkpoint sesji 1+2 (1.05) — 70% rotacji
- **[627]** Brief sesji 3 (ID 632 w bazie) — z 2 błędami faktograficznymi
- **[628]** Brief sesji 3.5 (ID 633 w bazie) — diagnoza MJ
- **[629]** Brief sesji 4 (ID 634 w bazie) — wyodrębnienie Ducha DD ✅ DONE + Revoke ⏳ przełożony

---

## META

- Autor: D (Claude.ai webowy) na podstawie sesji 4 z Adamem 2.05.2026 ~14:00–21:30
- Czas faktyczny sesji 4: ~7h (brief 629 szacował 1.5h — niedoszacowanie)
- Czas łączny rotacji: ~22h przez 4 sesje (brief 625 szacował 2-3h dla całości — niedoszacowanie 7-10x)
- Lekcja: rotacja kluczy + audyt bazy = 20+ godzin pracy. Każdy następny brief tej skali musi mieć rezerwę 3-5x.
