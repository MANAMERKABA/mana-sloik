---
id: 639
temat: "Świadectwo sesji 6 D — DONE rotacji 3.05 + MCP padł (dług #18) — STOP po 30h"
---

Restart Claude Desktop, test.

### Krok 3 — alternatywa

Jeśli powyższe nie pomoże, rozważyć:
- Zrobić nowy projekt MCP od zera z aktualnym SDK
- Lub używać Supabase Dashboard SQL Editor jako głównego interfejsu (MCP pomocniczy)

## STAN APLIKACJI MANA (po DONE rotacji 3.05)

✅ Działa:
- Magic Jar iskierka.html (logowanie, Dobry Dzień, Spokojna Noc)
- MANA Asystent — Krystyna z pamięcią, RAG, kamieniami
- MANA Horyzont — render + event-create
- Triggery Postgres (auto-embed, auto-sync)
- Wyciekły JWT MARTWY
- Legacy API keys DISABLED

🔴 Nie działa:
- MCP mana_v2.cjs w Claude Desktop (dług #18)
- MCP Cowork — ten sam dług #18 (potwierdzone 3.05 ~21:40 przy próbie zapisu tego świadectwa)
- 13 Edge Functions z verify_jwt=ON (preexisting bug, dług osobny)

## DŁUGI TECHNICZNE — STAN NA 3.05 ~21:35

(z [632] + nowe)

1. ⏳ MCP w Claude Desktop + Cowork padają (dług #18, krytyczny dla pracy z C/D — dotyczy obu klientów MCP po Revoke + Legacy disable)
2. Migracja na SUPABASE_PUBLISHABLE_KEYS / SUPABASE_SECRET_KEYS JSON (dług #19)
3. Refaktor 13 EF z verify_jwt=ON (~2-3h)
4. Skasowanie SERCE_* zombie secrets
5. Refinement promptu duch_dd
6. UX iskierka.html — komunikat „Na dziś koniec!" w ddEnter()
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

## DECYZJA ADAMA 3.05 ~21:35

Po 7h dzisiaj + 30h przez 4 dni = stop. Nowa sesja D z świeżą głową naprawi MCP w 30-60 min. Świadectwo zapisane przez SQL Editor (MCP padło u D i C jednocześnie).

## POWIĄZANE

[633-DONE] rotacja KOMPLETNIE ZAKOŃCZONA, [632] checkpoint przed Revoke, [631] brief sesji 5, [624] audyt fundament

## META

Autor: D (Claude Desktop) sesja 6 częściowa, 3.05.2026 ~14:00-21:35.
Świadectwo zapisane przez Supabase Dashboard SQL Editor (MCP padło u D i C jednocześnie, dług #18). Adam wykonał INSERT bezpośrednio w SQL Editor. C pomylił nazwę kolumny przy pierwszej próbie (tresc zamiast treść) — META-LEKCJA z [622] potwierdzona empirycznie po raz kolejny: kolumny MANA po polsku, GREP przed pisaniem.
