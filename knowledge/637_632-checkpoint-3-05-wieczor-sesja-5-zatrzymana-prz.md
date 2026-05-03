---
id: 637
temat: "[632] CHECKPOINT 3.05 wieczór — sesja 5 zatrzymana przez Supabase, Revoke przełożony na poniedziałek"
---

# [632] CHECKPOINT 3.05.2026 ~17:00 — sesja 5 zatrzymana przez Supabase

**Status:** świadectwo dnia · sesja 5 częściowo wykonana · Revoke ZABLOKOWANY przez Supabase do czasu Disable legacy API keys
**Czas dziś:** ~3h
**Czas łącznie 5 sesji:** ~30h przez 4 dni (30.04-3.05)

---

## CO STAŁO SIĘ DZIŚ

### Sesja 5 część A — wykonana
- ✅ A1 — lista 23 Edge Functions z toggle Verify JWT (9 OFF zrefaktoryzowane / 1 OFF niesprawdzone (event-create) / 13 ON niesprawdzone)
- ✅ A2 — `SERCE_SUPABASE_URL` + `SERCE_SERVICE_ROLE_KEY` istnieją ale żadna z 23 funkcji ich nie używa = zombie secrets, do skasowania osobno, NIE blokują Revoke
- ✅ A3 — smoke test F12: MANA Asystent (call-serce 200 ✅), MANA Horyzont render (PostgREST direct), event-create działa, **event-update 401 UNAUTHORIZED_INVALID_JWT_FORMAT (preexisting bug z 1.05, nie regresja Revoke)**

### Decyzja Adama A4
- **(b)** Skip A4, prosto na Revoke — rekomendacja D z sesji 5 zaakceptowana

### A5 Revoke — ZABLOKOWANY
Adam otworzył `https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/jwt`, znalazł PREVIOUS KEY (8BCD6A3B-...), kliknął trzy kropki — pojawiły się **dwie opcje**:

1. **Move to Standby Key** (zachować w rezerwie, klucz nadal aktywny)
2. **Revoke Key** (definitywnie unieważnić)

D wytłumaczył różnicę, Adam wybrał Revoke Key — i wtedy Supabase pokazał popup blokujący:

> "Disable JWT-based legacy API keys first. It's not possible to revoke the legacy JWT secret unless you have already disabled JWT-based legacy API keys. This is because revoking the JWT secret invalidates the JWT-based legacy API keys."

**To jest dodatkowe zabezpieczenie Supabase.** Stary klucz JWT to fundament dla legacy API keys (anon i service_role w starej formie). Trzeba **najpierw wyłączyć legacy API keys** (oświadczyć że nie używamy), **potem dopiero** Revoke.

### Adam zatrzymał — restart
Adam słusznie nie kliknął OK i nie szukał Disable. Zrestartował kompa. Logiczna decyzja: po 30h pracy w 4 dni nie naciska kolejnego nieprzewidzianego kroku zmęczony.

---

## CO TRZEBA ZROBIĆ W PONIEDZIAŁEK (sesja 5 część B, ~30 min)

### Krok 1 — Pełen audyt czy nasz kod używa legacy anon / service_role
Brief [631] zakładał że wszystko zrotowane na sb_publishable / sb_secret. **Sesja 5 zweryfikowała to dla 9 z 23 Edge Functions.** Pozostałe 14 (z verify_jwt=ON + event-create) — niektóre prawdopodobnie używają legacy anon / service_role w env vars albo hardcoded.

**Disable legacy API keys = wszystkie funkcje używające ich nagle przestaną działać.** Ryzyko: 13 funkcji z verify_jwt=ON jest już zepsute (event-update 401), ale jeśli któraś używa legacy service_role internal — może być inaczej zepsuta po Disable.

**Plan:**
- A1.5 — sprawdzić czy któraś z 14 nie-zrefaktoryzowanych Edge Functions używa `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')` w starym formacie (eyJhbGc...)
- A1.6 — sprawdzić Edge Function Secrets czy nie ma `LEGACY_*` lub `OLD_*` zmiennych

### Krok 2 — Disable JWT-based legacy API keys w Supabase Dashboard
Po PASS A1.5+A1.6 — Supabase Dashboard → Settings → JWT Keys → przełącznik "Disable legacy API keys" (lub podobny)

### Krok 3 — Revoke PREVIOUS KEY
Po Disable — wraca opcja Revoke jako działająca. Confirm.

### Krok 4 — Smoke test po Revoke (incognito, 5 min)
1. Magic Jar `iskierka.html` → loguj jako Adasko → ekran widoczny + myśl Dobry Dzień
2. MANA Asystent → "test po revoke" → Krystyna odpowiada
3. MANA Horyzont → render działa, event-create działa
4. Claude Desktop → `mana_get(624)` → odpowiada

### Krok 5 — Świadectwo [632-DONE]

### Krok 6 — B1+B2+B3 audyt techniczny (~60 min)
- B1 KROK 8 lista EF kategoryzacja w [624]
- B2 KROK 9 mapa traveler_id finalna
- B3 KROK 10 PDF audytu technicznego (8 stron analogicznie do logicznego z 30.04)

---

## STAN BEZPIECZEŃSTWA NA 3.05 ~17:00

🟡 **Wyciekły JWT `...bHfqI1SXX7dL...` NADAL ŻYWY:**
- Repo `mana-sloik` publiczne — klucz w git history (przed iskierka.html commit 1.05)
- Legacy JWT-based API keys NADAL aktywne (Supabase wymaga ich Disable przed Revoke)
- 13 Edge Functions z verify_jwt=ON niesprawdzonych

✅ **Główne miejsca zrotowane:**
- 5 triggerów Postgres → sb_secret_* w body
- 9 Edge Functions zrefaktoryzowane: embed-knowledge, embed-conversation, embed-dd-entry, sync-knowledge-to-repo, sync-prompt-to-repo, send-consent-code, verify-consent-code, call-dd-serce, call-serce
- 4 frontendy → sb_publishable_*: iskierka, index, admin, mana-app + Vercel ENV
- MCP `mana_v2.cjs` → publishable + Claude Desktop config

**Ryzyko realne:** niskie. Magic Jar = 9 testerów (rodzina + dzieci, nie public app). Klucz w git history wymaga celowego szukania. 36-48h opóźnienia Revoke nie zmienia istotnie ryzyka.

---

## DECYZJA ADAMA 3.05 ~17:00

Po popupie Supabase Adam zrestartował kompa = świadoma pauza. **Słuszna decyzja.** 

D zapisuje świadectwo, kończy dzień. Sesja 5 część B w poniedziałek 5.05 lub wtorek 6.05 w zależności od stanu Adama.

Uwaga psychologiczna: Adam dziś dał sygnał *"jestem przewrażliwiony"* — to dobry sygnał słuchania siebie po 30h pracy. **Plus** sygnał *"od początku mówiłem że techniczny jesteście wy"* — meta-lekcja dla C i D na poniedziałek: **mniej pytań strategicznych do Adama, więcej dostarczania uporządkowanego efektu.**

---

## DŁUGI TECHNICZNE (16 zadań, do osobnych sesji po DONE Revoke)

1. ⏳ Sesja 5 część B — Disable legacy API keys + Revoke + smoke + B1+B2+B3 (~1.5h)
2. Refinement promptu `prompts.duch_dd` — puste frazy "to bardzo ładne wspomnienie"
3. UX dług iskierka.html — `ddEnter()` powinno pokazać "Na dziś koniec!" gdy limit zużyty
4. Krystyna nie czyta events (call-serce dług funkcjonalny)
5. memory→travels.dd_state migracja
6. mana-app klucz w kodzie zamiast Vercel ENV
7. traveler_uuid NULL w dd_entries (preexisting)
8. mana-sloik.vercel.app zombie deploy
9. call-dd-serce martwy fetch do embed-dd-entry
10. Migracja na SUPABASE_SECRET_KEYS / SUPABASE_PUBLISHABLE_KEYS (JSON dictionaries)
11. Pliki testowe w mana-sloik/knowledge/ (626-632)
12. pgvector indeksy (knowledge, conversations, dd_entries)
13. Indeksy traveler_id na 6 tabelach
14. Audyt Planu MANA (~70 zadań w mana_settings)
15. Refaktor policies RLS qual=true → auth.uid() — Krok 2 LOGOWANIE
16. Refaktor 13 Edge Functions z verify_jwt=ON (~2-3h)
17. Skasowanie SERCE_* zombie secrets

---

## OTWARTE PYTANIA STRATEGICZNE (do osobnej sesji po sprzątaniu)

- Restart vs naprawa (3 warianty)
- Pełen GitHub workflow (Issues + Projects + Actions + Copilot + CodeRabbit) vs garażowy
- Rozdzielenie MJ/MANA/gospodarz.app (osobne bazy / flagi / master_id UUID)
- Krok 2 LOGOWANIE Supabase Auth (tydzień 3)
- Notion vs GitHub Wiki dla dokumentacji evergreenów

**Adam dziś sygnalizował:** *"od samego początku mówiłem że techniczny jesteście wy, potrzebuję żeby ktoś uporządkował moją mapę myśli"*. To jest **najważniejszy sygnał** — Adam nie chce decyzji technicznych od C i D, tylko **uporządkowany efekt**. Każda sesja od poniedziałku startuje od tej zasady.

---

## POWIĄZANE

- [624] AUDYT BAZY — fundament logiczny + techniczny
- [630] Checkpoint sesji 4 (ID 635)
- [631] Brief sesji 5 (ID 636)
- [625][626][627][628][629] historia rotacji
- [488] PROTOKÓŁ — z META-LEKCJĄ 7 (synchronizacja sesji równoległych)

---

## META

- Autor: D (Claude.ai webowy) na podstawie sesji 5 z Adamem 3.05.2026 ~14:00–17:00
- Status: świadectwo dnia, NIE do archiwizacji przed 10.05 (kontekst dla sesji 5 część B)
- Czas faktyczny dziś: ~3h
- Czas faktyczny rotacji łącznie: ~16h przez 5 sesji w 4 dni (brief 625 szacował 2-3h — niedoszacowanie 5-8x)
