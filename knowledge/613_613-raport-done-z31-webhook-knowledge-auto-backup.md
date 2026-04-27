---
id: 613
temat: "[613] RAPORT DONE z31 — webhook knowledge auto-backup → repo"
---

## RAPORT DONE — z31 webhook auto-backup knowledge → GitHub repo

**Autor:** D, 27.04.2026 ~18:45
**Estymata briefu:** 2-3h. **Faktyczny czas:** ~4h (z dyskusją techniczną z C i Adamem).
**Brief:** [briefu C 27.04 ~11:45 — z31 webhook auto-backup knowledge → repo]

### CO ZROBIONE

1. Edge Function `sync-knowledge-to-repo` deployed (Supabase). Kod = adaptacja `sync-prompt-to-repo` z [561] z trzema zmianami:
   - `record["treść"]` zamiast `record.tresc` (bracket notation, polski ć)
   - Path `knowledge/${id}_${slug}.md` (slug z polskich znaków na ASCII)
   - Frontmatter `id` + `temat` (bez dat — git log historię trzyma)
2. Webhook `knowledge_auto_sync` aktywny (INSERT + UPDATE, Delete nie obsługiwane świadomie).
3. Reuse `GITHUB_PAT` z [561] — jeden token dla obu webhooków.
4. Test E2E INSERT PASS — wpis [612] utworzony przez `mana_add`, plik `knowledge/612_test-webhook-z31...md` w repo, commit ff56dc7.
5. Test E2E UPDATE PASS — edit wiersza [612] przez Supabase Dashboard, commit 383cf3c, treść zaktualizowana w repo.

### FINDINGS (do rozważenia jako z32)

1. **Anomalia kolumny `treść` (polski ć) vs `tresc` (ASCII) w `prompts`** — różne konwencje między tabelami MANA. Kandydat na rename `ALTER TABLE knowledge RENAME COLUMN "treść" TO tresc` w z32. Niski priorytet, nieblokujące.

2. **Kolumna `warstwa` istnieje w schemacie `knowledge`** — odkryta przy okazji z31, niewykorzystana w refaktorze. Zawiera wartość `podroznik` dla wszystkich wpisów (zaobserwowane w Table Editor). Kandydat na rozszerzenie kategoryzacyjne w z32 (proponowane przez C: `evergreen`, `swiadectwo`, `ziarenko`, `decyzja`, `brief`, `raport_zadania`, `lekcja`).

3. **Asymetria [592] zachowuje się niedeterministycznie przy `knowledge`:**
   - `mana_add [612]` — timeout MCP 4 min, ale INSERT przeszedł do bazy (potwierdzone `mana_get`)
   - `mana_update [612]` — timeout MCP 4 min, UPDATE NIE przeszedł do bazy (treść w bazie pozostała stara)
   - Workaround dla UPDATE: edit przez Supabase Dashboard → Table Editor → wiersz → Save. Webhook reaguje normalnie.
   - To wzorzec inny niż w `prompts` gdzie [550] obejście (file local → C wkleja) działało spójnie. Do dorzucenia do META-LEKCJI w skill `mana-start`.

4. **Backfill 611 starych wpisów: ZANIECHANY (decyzja Adama 27.04 ~18:40, podążenie za rekomendacją D).** Folder `knowledge/` w repo narasta naturalnie z każdym INSERT/UPDATE. Backfill 611 commitów = spam historii GitHuba bez wartości operacyjnej. Awaryjny backfill możliwy ręcznym skryptem gdy konieczne.

5. **Wpis testowy [612]: ZACHOWANY** jako świadectwo testu z31 (decyzja Adama 27.04 ~18:43). Kandydat na archiwizację `mana_archive` jako `topic: TECHNIKA, typ_wpisu: raport_zadania` po DONE z31. Można skasować w każdej chwili.

6. **DELETE w bazie nie kasuje pliku w GitHubie** (świadomie — webhook nie ma eventu Delete). Plik osierocony w repo trzeba kasować ręcznie. To bezpieczniejsze niż auto-delete (nie ryzykujemy utraty historii przez błędne `mana_delete`). Dorzucamy jako finding architektoniczny do MOST.

### OBSERWACJE LUKI Z16 (eksport edge functions do repo)

`sync-prompt-to-repo` i pewnie inne funkcje deployed w Supabase były niewyeksportowane do `supabase/functions/` w repo (kod znalazłem w Dashboard, nie w repo). Z16 nie objął wszystkich funkcji. Niski priorytet, ale warto kiedyś zsynchronizować ręcznie.

### LINIA DO MOST [497]

`27.04 18:45 (D via Adam→C) 🟢 — z31 DONE [613]. Webhook knowledge_auto_sync live. Edge Function sync-knowledge-to-repo deployed. Test E2E INSERT+UPDATE PASS. Backfill: zaniechany (folder narasta naturalnie). Findings 1-6 do ewentualnego z32.`

### CO DALEJ

z31 zamknięty. Następny w kolejce: **refactor Konstytucji + duch_asystent_prywatny** (po decyzji Adama D1 + D6 z briefu PO 2 oraz po sektorze: kod call-serce + obecny tekst monolitu serce_konstytucja).

— D, 27.04.2026 ~18:45
