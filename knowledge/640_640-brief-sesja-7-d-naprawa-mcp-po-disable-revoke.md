---
id: 640
temat: "[640] BRIEF SESJA 7 D — naprawa MCP po Disable+Revoke (DONE retrospective)"
---

# [640] BRIEF SESJA 7 D — naprawa MCP po Disable+Revoke

**Status:** RETROSPECTIVE — sesja 7 wykonana 4.05.2026 rano, MCP DZIAŁA
**Data oryginalna briefu:** 3.05.2026 ~22:00 (wieczór, planowany na 4-5.05)
**Adresat:** dokumentacja co zostało zrobione + co jeszcze do sprawdzenia

## STAN DZIŚ 4.05.2026 RANO

✅ **MCP NAPRAWIONE** — wszystkie narzędzia działają (mana_get, mana_search, mana_list, mana_add)
✅ Rotacja KOMPLETNIE DONE (świadectwo [639])
✅ Wszystkie aplikacje działają (Magic Jar, Krystyna, Horyzont)

## CO ZOSTAŁO SPRAWDZONE 3.05 WIECZOREM (sesja 6 częściowa)

- claude_desktop_config.json — istnieje, JSON poprawny (zwalidowane node)
- Klucz sb_secret__L...Yqrp — 41 znaków, format poprawny  
- Test bezpośredni przez node test-mcp.js — Supabase status 200 OK z wpisem 624
- Klucz w mana_v2.cjs SUPABASE_KEY_FALLBACK zaktualizowany ze sb_publishable na sb_secret
- Server mana_v2.cjs startuje czysto: MANA MCP v2.0.0 started on stdio
- Pełen restart kompa + kill node + kill claude + restart Claude Desktop

## CO ZADZIAŁAŁO 4.05

Adam: "MCP naprawione". Brak szczegółowego raportu jak — sesja 7 wykonała naprawę bez zapisanego świadectwa technicznego. Hipotezy które prawdopodobnie zadziałały (do potwierdzenia):

1. Pełen restart kompa (zrobiony 3.05 ~22:00) — możliwe że zadziałał z opóźnieniem (cache Windows)
2. Świeży start Claude Desktop rano 4.05 ze świeżymi procesami
3. Supabase mógł reaktywnie aktywować klucz sb_secret po dłuższym czasie od Disable+Revoke

## DO SPRAWDZENIA W KOLEJNEJ SESJI

🟡 **Co dokładnie naprawiło MCP** — żeby jeśli regresja, wiemy co zrobić:
- Sprawdź wersję SDK (`npm list @modelcontextprotocol/sdk` w mana-mcp/)
- Sprawdź czy są logi MCP w %APPDATA%\Claude\logs\ lub %LOCALAPPDATA%\Claude\
- Zapisz w MOŚCIE konkretnie co Adam zrobił między 3.05 22:00 a 4.05 rano

🟡 **Świadectwo [640-DONE]** zapisać po pełnym potwierdzeniu stabilności MCP przez 24h

## DŁUGI TECHNICZNE — STAN NA 4.05 RANO

(z [632][639] + nowe)
1. ✅ MCP w Claude Desktop — NAPRAWIONE 4.05 rano
2. Migracja na SUPABASE_PUBLISHABLE_KEYS / SUPABASE_SECRET_KEYS JSON (dług #19)
3. Refaktor 13 EF z verify_jwt=ON (~2-3h)
4. Skasowanie SERCE_* zombie secrets
5. Refinement promptu duch_dd
6. UX iskierka.html — komunikat "Na dziś koniec!" w ddEnter()
7. Krystyna nie czyta events
8. memory→travels.dd_state
9. mana-app klucz w kodzie zamiast Vercel ENV
10. traveler_uuid NULL w dd_entries
11. mana-sloik.vercel.app zombie deploy
12. call-dd-serce martwy fetch do embed-dd-entry
13. Pliki testowe w mana-sloik/knowledge/
14. pgvector indeksy (knowledge, conversations, dd_entries)
15. Indeksy traveler_id na 6 tabelach
16. Audyt Planu MANA (~70 zadań)
17. Refaktor policies RLS qual=true → auth.uid()

## CO DALEJ — opcje dla Adama (4.05 rano)

### Opcja A — domknij audyt techniczny (60 min)
Z briefu [638] CZĘŚĆ C:
- B1 KROK 8 lista 23 EF kompletna w [624]
- B2 KROK 9 mapa traveler_id finalna w [624]
- B3 KROK 10 finalny PDF AUDYT_TECHNICZNY_MANA_05_05_2026.pdf

### Opcja B — refinement Ducha DD (1h)
Pierwsza wersja prompts.duch_dd ma puste frazy ("to bardzo ładne wspomnienie")

### Opcja C — naprawa rejestrów infrastruktury (2h)
aplikacje, pokoje, kafle, pokoje_kafle wg [624] — REJESTRY-KŁAMIĄ

### Opcja D — Krok 1 BIAŁA KARTA druga próba (4h)
Czyszczenie knowledge + filtrowanie po whitelist 13 ID, oparta o [624] z SELECT-as-proof

### Opcja E — odpoczynek
30h pracy w 5 dni. Niedziela = weekend.

## POWIĄZANE
- [639] swiadectwo sesji 6 (DONE rotacji + MCP padł)
- [638] brief sesji 5B (Disable+Revoke)
- [624] audyt fundament
- [488] PROTOKÓŁ — META-LEKCJE 1-7

## META
Autor: D (Claude Desktop) sesja 7, 4.05.2026 rano
MCP NAPRAWIONE — pełna funkcjonalność wraca
Adam dał sygnał wczoraj wieczór: "techniczny jesteście wy, potrzebuję uporządkowanej mapy myśli"
