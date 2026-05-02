---
id: 634
temat: "[629] BRIEF SESJA 4 — wyodrębnienie Ducha MJ Dobry Dzień + dokończenie rotacji"
---

# [629] BRIEF SESJA 4 — Duch MJ + domknięcie rotacji

**Data:** 2.05.2026 wieczór
**Autor:** D (Claude Desktop)
**Adresat:** nowa sesja Claude Desktop
**Cel:** wyodrębnić Ducha MJ Dobry Dzień jako osobny prompt + naprawić Spokojną Noc INSERT + Revoke
**Czas:** 1.5h

---

## ZASADA NUMER ZERO

Magic Jar produkcyjnie od 29.03 z 8 testerami. **NIE psuć więcej niż jest zepsute.** Każdy krok z DoD i smoke testem.

---

## STAN PRZED SESJĄ 4

**OK:**
- Triggery + 9 Edge Functions + 4 frontendy + MCP używają nowych kluczy
- Krystyna w MANA Asystencie odpowiada
- Spokojna Noc HISTORYCZNIE zapisywała (Adasko ma stary wpis "Jestem zły na zosie" w `travels.sn_items_cloud`)

**Złamane:**
- Magic Jar Dobry Dzień — Duch DD nie odpowiada koherentnie. Frontend wysyła do `call-dd-serce`, funkcja czyta `prompts.magic_jar_kontekst` (1 251 znaków — sama mechanika produktu, brak tożsamości Ducha)
- Spokojna Noc — nowe wpisy nie lądują w `travels.sn_items_cloud` (regresja po rotacji 1.05; stare wpisy są)
- W `prompts` brakuje wpisu `duch_mj` jako osobnej tożsamości Ducha DD

**Wyciekły JWT** `...bHfqI1SXX7dL...` nadal aktywny.

---

## TODO — 6 KROKÓW

### KROK 1 — wstaw nowy prompt `duch_mj` do bazy (~5 min)

W Supabase SQL Editor wykonaj:

```sql
-- Backup obecnego magic_jar_kontekst (na wypadek rollback)
INSERT INTO prompts (nazwa, tresc)
VALUES ('magic_jar_kontekst_backup_2_05', (SELECT tresc FROM prompts WHERE nazwa = 'magic_jar_kontekst'));

-- Wstaw nowy duch_mj jako osobny prompt
INSERT INTO prompts (nazwa, tresc) VALUES ('duch_mj', $$
SCENA: Magic Jar — Dobry Dzień. Przestrzeń dziecka i nastolatka, gdzie codziennie pojawia się jedna myśl o czymś dobrym. Każda dobra myśl odkrywa kawałek puzzla z prawdziwym zdjęciem.

KIM JESTEM W TYM POKOJU:
Jestem Duchem Dobrego Dnia. To inny ton niż Krystyna w MANA — bo tu jest dziecko, nastolatek, ktoś kto uczy się dostrzegać dobro. Mówię prosto, ciepło, krótko. Nie analizuję psychologicznie. Nie zadaję pytań egzystencjalnych. Nie projektuję trudności.

CO ROBIĘ:
- Przyjmuję myśl podróżnika
- Wzmacniam to co dobre w niej — zauważając konkretny szczegół
- Delikatnie zwracam uwagę gdy myśl jeszcze nie dotknęła dobra
- Nigdy nie krytykuję, nie pouczam, nie tłumaczę co jest dobrem

CZEGO NIGDY NIE ROBIĘ:
- Nie pytam o trudne tematy ("a co Cię niepokoi?", "czy coś Cię smuci?")
- Nie projektuję ("to musiało być trudne", "rozumiem że Ci ciężko")
- Nie analizuję psychologicznie ("czujesz się odrzucony")
- Nie używam pustych fraz ("to piękne", "wspaniale", "super", "niesamowite", "jak cudownie")
- Nie powtarzam słów podróżnika
- Nie używam myślników jako separatorów
- Nie używam emotek, gwiazdek, podkreśleń

TYPY MYŚLI — rozpoznaj i odpowiedz odpowiednio:

**osobista pozytywna** (coś co podróżnik przeżył, lubi, ceni)
→ ciepło, zauważ konkretny szczegół z myśli, dodaj coś prawdziwego
→ BLOKADA:NIE

**ogólna obserwacja** (np. "pada deszcz", "jest ładnie")
→ potraktuj życzliwie, może być pozytywna, krótka odpowiedź
→ BLOKADA:NIE

**trudna lub negatywna** (np. "smutno mi", "kłótnia z mamą")
→ towarzysz ciepło, BEZ analiz, BEZ pytań głębokich, krótkie ciepłe zauważenie
→ BLOKADA:TAK (puzzle nie otwiera się — to nie była dobra myśl, ale nie krytykuj)

**krzywdząca innych** (np. "wszyscy są durni", obraźliwa)
→ zapytaj spokojnie co się stało, bez oceny
→ BLOKADA:TAK

**kulturowa, cytat, ogólnik** (np. "czas to pieniądz")
→ krótka odpowiedź, zachęć do osobistej myśli następnym razem
→ BLOKADA:NIE jeśli neutralna

OCENA — dopisz cicho BEZ SPACJI na końcu odpowiedzi (podróżnik tego nie widzi):
BLOKADA:NIE — myśl ma pozytywny ładunek (puzzle się otwiera)
BLOKADA:TAK — myśl negatywna, krzywdząca lub obraźliwa (puzzle nie otwiera się)

ZASADY ODPOWIEDZI:
- Maksymalnie 1-2 zdania
- Zauważ konkretny szczegół z myśli
- Pytanie zwrotne tylko gdy naprawdę wzbogaca
- Używaj słowa "może" zamiast nakazów
- Mów w pierwszej osobie
- Zawsze po polsku

Gdy podróżnik pyta "czy ktoś to czyta?" → "To co piszesz widzę tylko ja. Tylko my tu jesteśmy."
Gdy podróżnik pyta "czy to człowiek?" → "Jestem AI. Jestem przy Tobie kiedy chcesz coś dobrego zauważyć."
$$);
```

**DoD KROK 1:** SQL przeszedł, wpis istnieje:
```sql
SELECT nazwa, length(tresc) FROM prompts WHERE nazwa IN ('duch_mj','magic_jar_kontekst_backup_2_05');
```
Powinno zwrócić 2 wiersze, `duch_mj` powyżej 2500 znaków.

---

### KROK 2 — update kod `call-dd-serce` żeby czytał `duch_mj` (~10 min)

W Supabase Dashboard → Edge Functions → `call-dd-serce` → Code:

Znajdź linię (~62):
```typescript
supabase.from('prompts').select('tresc').eq('nazwa', 'magic_jar_kontekst').single()
```

Zamień na:
```typescript
supabase.from('prompts').select('tresc').eq('nazwa', 'duch_mj').single()
```

Plus zaktualizuj komentarz `FALLBACK_KONTEKST` (~10) żeby był spójny z nową tożsamością — ale to opcjonalne, fallback działa tylko gdy baza milczy.

Deploy.

**Smoke test:**
```
W iskierka.html (incognito, jako tester):
Dobry Dzień → wpisz myśl: "ugotowałam zupę z mamą"
Duch DD odpowiada krótko, ciepło, zauważa konkret (zupa? mama? razem?)
Bez pustych fraz "to piękne!"
Puzzle się otwiera (BLOKADA:NIE)
```

Jeśli odpowiada źle (puste frazy, długie zdania, projekcje) → wróć do prompta `duch_mj`, dopracuj, retry.

**DoD KROK 2:** Duch DD odpowiada koherentnie, krótko, bez pustych fraz, puzzle się otwiera.

---

### KROK 3 — diagnoza Spokojna Noc INSERT (~10 min)

Adam wpisuje myśl w MJ Spokojna Noc → wpis nie ląduje w `travels.sn_items_cloud`.

**Adam wykonuje:**
1. F12 Network włączony
2. Spokojna Noc → wpisz myśl `"test SN sesja 4"` → kliknij "Wrzuć do słoika"
3. W Network szukaj request typu **PATCH** do `/rest/v1/travels?id=eq.X`
4. Wklej w sesję 4:
   - **Status code** (200 / 401 / 403 / 404 / inny)
   - **Response body**

**Możliwe scenariusze:**

| Status | Diagnoza | Naprawa |
|---|---|---|
| 200 | OK technicznie | Sprawdź czy `S.travelerId` jest poprawnie ustawiony przed PATCH (console.log) |
| 401 | Klucz publishable nie pasuje | Sprawdź `SB_KEY` w iskierka.html vs `SUPABASE_ANON_KEY` env Edge Functions |
| 403 | RLS blokuje | Sprawdź policy `travels` UPDATE — czy `qual=true`? |
| 404 | `S.travelerId` nieprawidłowy | Adam usuń localStorage, zaloguj ponownie |
| Brak requestu | JS error w iskierka.html | F12 Console — sprawdź błąd |

Jeśli widać 200 ale wpis nie ląduje → sprawdź body PATCH (czy `sn_items_cloud` jest tablicą?). Możliwe że `snJarItems` nie zawiera tej nowej myśli.

**DoD KROK 3:** Diagnoza w ręku, naprawa zaplanowana.

---

### KROK 4 — naprawa Spokojnej Nocy (~10-30 min, zależne od diagnozy)

Wykonaj wg scenariusza z KROKU 3.

**Smoke test:**
```
F5 → loguj jako Adasko → Spokojna Noc → myśl "test sesji 4" → Wrzuć do słoika
SQL: SELECT id, nick, sn_items_cloud FROM travels WHERE nick = 'Adasko';
→ widzi nową myśl "test sesji 4" w tablicy ✅
```

**DoD KROK 4:** Nowa myśl ze Spokojnej Nocy ląduje w `travels.sn_items_cloud`.

---

### KROK 5 — pełen smoke test E2E (~10 min)

5 testów, wszystkie PASS:

1. **MJ onboarding RODO** — incognito → mana-sloik.vercel.app → tryb dziecka → email → kod → konto
2. **MJ Dobry Dzień** — myśl ląduje w `dd_entries`, Duch DD odpowiada koherentnie, puzzle otwiera
3. **MJ Spokojna Noc** — myśl ląduje w `travels.sn_items_cloud`
4. **MANA Asystent (Krystyna)** — odpowiada koherentnie
5. **MCP Claude Desktop** — `mana_get(624)` zwraca wpis

Jeśli któryś FAIL → wróć do diagnozy. **NIE rób Revoke z FAILem.**

---

### KROK 6 — Revoke PREVIOUS KEY + świadectwo DONE (~10 min)

`https://supabase.com/dashboard/project/kkxhqtfxvgxdqpnzaufu/settings/jwt`

JWT Signing Keys → PREVIOUS KEY (8BCD6A3B-...) → menu trzech kropek → **Revoke** → Confirm.

**Smoke test po Revoke** (incognito):
- Krystyna odpowiada ✅
- Magic Jar onboarding działa ✅
- MCP odpowiada w Claude Desktop ✅

Jeśli FAIL — gdzieś nadal jest stary klucz. Generuj **Standby Key** w JWT Keys, znajdź miejsce, napraw, retry.

**Świadectwo:**
```
mana_add temat: "[630-DONE] Rotacja kluczy Supabase MANA — ZAKOŃCZONA 2.05.2026"
tresc:
- Wszystkie 4 sesje DONE (1+2+3+3.5+4)
- Wyciekły JWT bHfqI1SXX7dL martwy
- Duch MJ Dobry Dzień wyodrębniony jako prompts.duch_mj
- Spokojna Noc INSERT naprawiony
- E2E 5/5 PASS
- Czas faktyczny: ~10-12h (brief 625 szacował 2-3h, niedoszacowanie 4-5x)
- Długi: Krystyna nie czyta events, memory→travels.dd_state, mana-app klucz w kodzie zamiast Vercel ENV, traveler_uuid NULL w dd_entries, mana-sloik.vercel.app zombie deploy
- Powiązane: 624, 625, 626, 627, 628, 629
```

---

## ROLLBACK

**Krok 1:** jeśli prompt `duch_mj` zły, ROLLBACK przez:
```sql
UPDATE prompts SET tresc = (SELECT tresc FROM prompts WHERE nazwa = 'magic_jar_kontekst_backup_2_05')
WHERE nazwa = 'duch_mj';
```
Plus rollback Edge Function `call-dd-serce` (zmień z powrotem `duch_mj` → `magic_jar_kontekst`).

**Krok 6 Revoke** — bez rollbacku. Robisz dopiero po PASS smoke testów.

---

## NIE WCHODZI W SCOPE

- Krystyna nie czyta events (osobny dług)
- memory→travels.dd_state migracja (osobny dług)
- mana-app na Vercel ENV (osobny dług)
- traveler_uuid NULL w dd_entries (preexisting bug, osobny dług)
- mana-sloik.vercel.app zombie deploy (osobny dług)

---

## META

- Autor: D (Claude Desktop) na podstawie [626][628] checkpointów
- Cel: 1.5h skupione, mechaniczne
- Po DONE [630]: Adam wraca do D dokończyć audyt techniczny (KROK 8: Edge Functions list, KROK 9: schema niespójności, KROK 10: finalny PDF audytu technicznego)
