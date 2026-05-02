---
id: 633
temat: "[628] BRIEF SESJA 3.5 — domknięcie rotacji (diagnoza MJ + Revoke)"
---

# [628] BRIEF SESJA 3.5 — domknięcie rotacji kluczy Supabase

**Data:** 2.05.2026 wieczór (do wykonania 3-4.05)
**Autor:** D (Claude Desktop) na podstawie checkpoint sesji 3
**Adresat:** nowa sesja (Claude Desktop dla MCP smoke testu)
**Cel:** dokończyć rotację — naprawić MJ + Revoke + świadectwo DONE
**Czas:** 1-1.5h
**Status:** PILNE — wyciekły JWT (...bHfqI1SXX7dL...) nadal aktywny

---

## STAN PO SESJI 3 (4/7 DONE)

✅ Frontendy: iskierka.html, index.html, admin.html, mana-app + Vercel ENV
✅ Bonus: call-serce zrefaktoryzowane (verify_jwt=false + custom auth) — Krystyna żyje
✅ MCP mana_v2.cjs: fallback klucz zamieniony na publishable (czeka na restart Claude Desktop)

🔴 BLOKADY do Revoke:
1. **MJ Dobry Dzień — Duch DD nie odpowiada.** Niewiadomo regresja czy preexisting.
2. **MJ Spokojna Noc — INSERT nie ląduje w `dd_entries`.** Niewiadomo regresja czy preexisting.

⏳ Zostają: PUNKT 5 (smoke E2E pełen), PUNKT 6 (Revoke), PUNKT 7 (świadectwo)

---

## CO ROBISZ — 6 KROKÓW

### KROK 1 — diagnoza Duch DD (~15 min)

Magic Jar Dobry Dzień produkcyjnie od 29.03. Adam wpisuje myśl → Serce milczy.

**Adam wykonuje:**
1. Otwórz **iskierka.html** w przeglądarce, F12 → zakładka **Network**
2. Loguj jako tester (np. Adasko)
3. Wejdź w Dobry Dzień, wpisz myśl: `"test 3.5"`
4. Patrz na Network: jaka funkcja jest wywoływana?

**Możliwe scenariusze:**

| Co widać w Network | Diagnoza | Naprawa |
|---|---|---|
| Brak requestu | JS error w iskierka.html | F12 Console — sprawdź błąd |
| Request do `call-dd-serce` zwraca 401 | Verify JWT włączone w UI | Supabase Dashboard → Functions → call-dd-serce → Settings → wyłącz Verify JWT |
| Request do `call-dd-serce` zwraca 500 | Bug w kodzie funkcji | Sprawdź Response, prawdopodobnie martwy fetch do embed-dd-entry (dług #1 z [626]) |
| Request do innej funkcji niż `call-dd-serce` | Frontend wywołuje inną | Refaktor tej funkcji (verify_jwt=false + custom auth) |
| Request 200 ale Serce nie odpowiada | Frontend nie renderuje response | Sprawdź Console — błąd JS |

**DoD KROK 1:** wiesz dokładnie co nie działa, masz plan naprawy.

---

### KROK 2 — naprawa Duch DD (~15-30 min, zależnie od diagnozy)

Jeśli **Verify JWT** — wyłącz w Dashboard, retest.

Jeśli **martwy fetch** — w `call-dd-serce` skomentuj/usuń wywołanie do `embed-dd-entry` (embedding i tak działa przez trigger `dd_entries_auto_embed`). Deploy.

Jeśli **inna funkcja niż call-dd-serce** — analogicznie do call-serce w sesji 3: dodaj custom auth, wyłącz verify_jwt.

**Smoke test po naprawie:**
```
iskierka.html → Adasko → Dobry Dzień → myśl "test naprawy"
Serce odpowiada → DZIAŁA ✅
SQL: SELECT * FROM dd_entries WHERE mysl = 'test naprawy';
→ wiersz istnieje, embedding wypełniony ✅
DELETE FROM dd_entries WHERE mysl = 'test naprawy';
```

**DoD KROK 2:** Duch DD odpowiada na nową myśl.

---

### KROK 3 — diagnoza i naprawa Spokojna Noc INSERT (~10-20 min)

Adam wpisuje myśl w MJ Spokojna Noc → wpis nie pojawia się w `dd_entries`.

**Adam wykonuje:**
1. F12 Network włączony
2. Spokojna Noc → wpisz myśl `"test SN 3.5"`
3. Patrz na Network

**Możliwe scenariusze:**

| Network | Diagnoza | Naprawa |
|---|---|---|
| INSERT do `dd_entries` przez supabase-js | RLS blokuje INSERT z anon | Dodaj policy: `INSERT WHERE traveler_uuid IS NOT NULL` (lub uproszczone) |
| Request do Edge Function (call-noc-serce?) | Funkcja zwraca błąd | Patrz Response, refaktor jak call-serce |
| Brak requestu | JS error w iskierka.html | Console |
| 200 ale wiersz nie ląduje | RLS pozwala ale milcząco filtruje | Sprawdź `qual` policy w `pg_policies` dla `dd_entries` |

**Uwaga z [626]:** wszystkie wpisy `dd_entries` mają `traveler_uuid = NULL` mimo że tabela jest UUID-only. To może być źródłem problemu — frontend nie wypełnia UUID przy INSERT.

**DoD KROK 3:** myśl Adama z MJ Spokojna Noc ląduje w `dd_entries`.

---

### KROK 4 — pełen smoke test E2E (~10 min)

Wszystkie 6 testów PASS:

1. **Magic Jar onboarding RODO** — nowy tester, email, kod, konto ✅
2. **Magic Jar Dobry Dzień** — myśl, Serce odpowiada, embedding ✅
3. **Magic Jar Spokojna Noc** — myśl, INSERT do `dd_entries` ✅
4. **MANA Asystent** — Krystyna odpowiada koherentnie ✅
5. **MANA Horyzont** — wydarzenie tworzy się i kasuje ✅
6. **MCP Claude Desktop** — `mana_get(624)` zwraca wpis ✅

Jeśli któryś FAIL → wróć do diagnozy. **NIE rób Revoke z FAILem.**

---

### KROK 5 — Revoke PREVIOUS KEY (~5 min)

⚠️ **TO JEST MOMENT KIEDY WYCIEKŁY JWT UMIERA.**

1. `https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/jwt`
2. **JWT Signing Keys** → wiersz **PREVIOUS KEY** (Legacy HS256, `8BCD6A3B-...`)
3. Menu trzech kropek `⋯` → **Revoke** → Confirm

**Smoke test natychmiast:**
- Krystyna odpowiada (incognito → mana-app/asystent/) ✅
- Magic Jar żyje (incognito → iskierka.html) ✅
- MCP odpowiada w Claude Desktop ✅

Jeśli FAIL — gdzieś nadal jest legacy klucz. Wygeneruj **Standby Key** w JWT Keys jako rollback. Znajdź miejsce, napraw, retry.

---

### KROK 6 — świadectwo DONE (~5 min)

Wywołaj `mana_add`:

```
temat: [629-DONE] Rotacja kluczy Supabase MANA — ZAKOŃCZONA 2.05.2026 (sesje 1+2+3+3.5)

tresc:
# Rotacja kluczy Supabase MANA — ZAKOŃCZONA

**Sesje:** 4 (1+2+3+3.5), łącznie ~9-11h
**Brief pierwotny [625]:** szacował 2-3h — niedoszacowanie 4-5x
**Brief sesji 3 [627]:** miał 2 błędy faktograficzne (anon vs service_role w MCP, scope refaktoru call-serce)

## DONE wszystko:
- 5 triggerów Postgres → sb_secret_*
- 9 Edge Functions zrefaktoryzowanych (verify_jwt=false + custom auth): 
  embed-knowledge, embed-conversation, embed-dd-entry, sync-knowledge-to-repo, 
  sync-prompt-to-repo, send-consent-code, verify-consent-code, call-dd-serce, call-serce
- 4 frontendy → sb_publishable_* (iskierka, index, admin, mana-app)
- Vercel ENV: pominięte (mana-app klucz w kodzie — dług)
- MCP mana_v2.cjs → publishable + Claude Desktop config env
- E2E smoke 6/6 PASS
- PREVIOUS KEY revoked
- Wyciekły JWT bHfqI1SXX7dL martwy

## Długi do osobnych zadań:
1. Krystyna nie czyta events (call-serce dług funkcjonalny)
2. memory tabela nie istnieje, call-serce ma try/catch milczący
3. mana-app klucz w kodzie zamiast Vercel ENV
4. Vercel zombie deploy mana-sloik (do skasowania)
5. Migracja na SUPABASE_SECRET_KEYS / SUPABASE_PUBLISHABLE_KEYS
6. Pliki testowe w repo mana-sloik/knowledge/ (do usunięcia)

## Powiązane:
- [625] brief pierwotny (częściowo nieaktualny)
- [626] checkpoint sesji 1+2
- [627] brief sesji 3 (z 2 błędami faktograficznymi)
- [628] brief sesji 3.5 (ten dokument)
- [629] DONE świadectwo (ten wpis)
- [624] audyt bazy
```

Wracaj do D (sesja audytu) z wiadomością "DONE rotacja, [629] zapisane".

---

## ROLLBACK

Każdy krok 1-3 ma rollback przez przywrócenie poprzedniego stanu funkcji/policy.

Krok 5 (Revoke) — bez rollbacku. Robisz dopiero po PASS smoke testu.

Stary klucz NADAL DZIAŁA do Revoke. Masz okno bezpieczeństwa.

---

## CO NIE WCHODZI W SCOPE

- Audyt techniczny bazy (wraca do D)
- Naprawa Krystyna+events (osobny dług)
- Naprawa memory→travels.dd_state (osobny dług)
- Migracja mana-app na Vercel ENV (osobny dług)
- Refaktor traveler_uuid w iskierka.html (osobny dług)

---

## META

- Autor: D na podstawie [626] checkpoint
- Cel sesji: 1-1.5h skupione, mechaniczne
- Po DONE: Adam wraca do D dokończyć audyt techniczny
