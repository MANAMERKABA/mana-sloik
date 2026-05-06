---
id: 654
temat: "KOREKTA TERMINOLOGICZNA 06.05.2026 — wykreślenie Panel Terapeuty + Panel Trenera, doprecyzowanie Słoik = KAFEL"
---

## DECYZJA ADAMA 06.05.2026 — natychmiastowa korekta

### WYKREŚLONE (nie istnieją w MANA)
- **Panel Terapeuty** — wykreślony
- **Panel Trenera** — wykreślony

Konsekwencja: usunąć z [491] SŁOWNIK + xlsx HIERARCHIA + karty sesji [653] + całej dokumentacji.

### KOREKTA NAZEWNICZA
- **"mana-sloik"** = nazwa REPO technicznego w git (zostaje technicznie). NIE używać jako nazwy produktu / aplikacji w mowie ani dokumentach.
- **"Słoik"** = KAFEL (nie aplikacja, nie pokój). Jest używany w pokoju Spokojna Noc w Magic Jar.

### Hierarchia poprawiona
```
APLIKACJA: Magic Jar (frontend w repo mana-sloik, plik iskierka.html)
POKÓJ:     Spokojna Noc (jeden z pokoi Magic Jar)
KAFEL:     Słoik (używany w pokoju Spokojna Noc)
```

### Co zostaje z aplikacji MERKABA
- mana-app (główna, www.mana.app)
- Magic Jar (mana-sloik / iskierka.html)
- Panel Admina (admin.html)

### TODO po sesji (C jutro)
1. [491] SŁOWNIK — usunąć "Panel Terapeuty", "Panel Trenera". Doprecyzować "Słoik = kafel".
2. xlsx HIERARCHIA — usunąć wiersze 1.3 (Panel Terapeuty), 1.4 (Panel Trenera) i wszystkie powiązane (2.13-2.18 pokoje paneli, therapist_clients, therapist_notes, trainer_notes — uwaga: trainer_notes zostaje wg wcześniejszej decyzji o roli trenera).
3. Karta sesji [653] — korekta listy aplikacji.
4. Plan MANA — usunąć z5.B (Panel Terapeuty był częścią B).
5. Architektura logowania — JEDEN system, nie rozdzielony A/B.

### REWIZJA WCZEŚNIEJSZYCH DECYZJI Z DZIŚ
- Decyzja o "rozdzielenie System A (Magic Jar legacy) vs System B (MANA główna nowa)" — **REWIZJA**: jeden system dla wszystkiego, bo Magic Jar ma 2-3 realne osoby (nie 57), nic do migracji.
- Decyzja o therapist_clients/therapist_notes należących do "aplikacji gospodarza" — **REWIZJA**: aplikacja gospodarza nie istnieje, te tabele wykreślone (zgodnie z wcześniejszą decyzją Adama z dziś), nie wracają.

typ_wpisu: decyzja
topic: ARCHITEKTURA
