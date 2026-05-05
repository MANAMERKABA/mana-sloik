---
id: 646
temat: "[646] PLAN ORGANIZACYJNY - droga do poprawnej struktury technicznej MANA - 5.05.2026"
---

PLAN ORGANIZACYJNY MANA - droga JEST → MA BYC
================================================
Cel: Adam ma plan do wydrukowania, sekwencyjny, jak przejsc od stanu obecnego (mapa [645]) do poprawnej struktury technicznej zgodnej z zalozeniami [624] [491].

ZASADA: 9 krokow od fundamentu (Podroznik) do walidacji. Kazdy krok = 4 fazy: A) Audyt B) Diff C) Decyzje D) Implementacja+walidacja.

══════════════════════════════════════════════
KROK 0: PODROZNIK + PROFIL (fundament wszystkiego)
══════════════════════════════════════════════
Tabela: travels (HUB, BIGINT id, 13 podroznikow whitelist [624])

A) Audyt: SELECT id, nick, birth_year, consent, jar_type, last_visit, dd_state, sn_items_cloud, pamiec FROM travels;
B) Diff vs [624]: czy 13 podroznikow zgadza sie z lista whitelist
C) Decyzje: dla kazdego podroznika - aktywny / archiwum / test
D) Implementacja: oznaczenie statusu, ujednolicenie pol profilu

KOLUMNY PROFILU:
- nick, birth_year, pin (auth)
- consent (zgoda na DD)
- jar_type (preferencja Sloika)
- pamiec (skondensowana wiedza Serca - Asystent + Gaweda dolewaja)
- dd_state (stan Dobrego Dnia w MJ)
- sn_items_cloud (kamienie Spokojnej Nocy)
- last_visit
- source (mana_app | magic_jar | terapeuta)

DLUG: dd_entries dla DD nie dolewa do travels.pamiec [643]

══════════════════════════════════════════════
KROK 1: APLIKACJE (5-6 zaplanowanych)
══════════════════════════════════════════════
A) Audyt DONE 5.05: 7 wpisow w aplikacje
B) Diff DONE: 3 OK, 2 BRAK, 3 ZOMBIE, 1 do decyzji
C) Decyzje:
   - DELETE: Sloik JAR, Horyzont, Gaweda (to pokoje)
   - INSERT: MANA (glowna), Panel Admina
   - DECYZJA: MANA Help → aplikacja czy pokoj?
D) Implementacja: 3x DELETE + 2x INSERT + decyzja

══════════════════════════════════════════════
KROK 2: POKOJE
══════════════════════════════════════════════
A) Audyt: SELECT * FROM pokoje; (czeka)
B) Diff vs [624]:
   - W MANA (9): Asystent, Horyzont, Sloik, Gaweda, Cisza, Puls, Trzos, Pamietnik, Rod
   - W Magic Jar (3): Spokojna Noc, Dobry Dzien, Ksiezycowy Czas
   - W Panel Terapeuty (5): Asystent, Organizator, Karta, Rozliczenia, Notatki sesji
   - W Panel Trenera: do okreslenia
C) Decyzje: dla kazdego pokoju - app_id, status (aktywny/zaplanowany/zombie)
D) Implementacja: pokoje + pokoje_kafle (relacja)

══════════════════════════════════════════════
KROK 3: KAFLE (6 wg [491], PDF kafle_mana_v20)
══════════════════════════════════════════════
A) Audyt DONE 5.05: 8 wpisow w kafle
B) Diff DONE:
   ✅ Serce, Sloik
   ❌ Zle: Dziennik Dobrego Dnia, Horyzont (to pokoje)
   🟡 Notatnik Trenera (instancja zamiast kafla bazowego)
   ❌ Niez nieznane: Konstelacje, Koszty API, Baza Wiedzy
   ❌ Brak: Notatnik (uniwersalny), Interfejs, Zdjecie, EVENT
C) Decyzje: ujednolicic do 6 kafli bazowych z [491], przeniesc instancje na poziom pokoi
D) Implementacja: DELETE zle + INSERT 4 brakujace

══════════════════════════════════════════════
KROK 4: ZIARENKA (atomy)
══════════════════════════════════════════════
A) Audyt: brak osobnego rejestru. Lista 23 EF + 14 triggerow z [641]
B) Diff: kazde EF/trigger = ziarenko, mapowanie na kafel
C) Decyzje: czy stworzyc tabele `ziarenka` + relacje z kafle? Albo zostawic w kodzie z dokumentacja.
D) Implementacja: dokumentacja mapowania EF→kafel→pokoj→aplikacja

══════════════════════════════════════════════
KROK 5: STUDNIA + WIADRA (prompts table)
══════════════════════════════════════════════
A) Audyt DONE 5.05: 6 wpisow
B) Diff DONE:
   ✅ serce_konstytucja, duch_asystent_prywatny, duch_dd
   🟡 serce_konstytucja_fundament (decyzja: zachowac vs archiwizowac)
   🔴 magic_jar_kontekst, magic_jar_kontekst_backup_2_05 (zombie)
   ❌ Brak: duch_medrzec dla Gawedy
C) Decyzje:
   - serce_konstytucja_fundament → zachowac jako rezerwa albo archiwizowac
   - magic_jar_kontekst* → DELETE (zombie)
   - duch_medrzec → zaprojektowac przy okazji refaktoru Gawedy z Typebot
D) Implementacja: SQL DELETE + decyzja o fundament + plan duch_medrzec

══════════════════════════════════════════════
KROK 6: BACKEND (Edge Functions)
══════════════════════════════════════════════
A) Audyt DONE [641]: 23 EF, 14 triggerow, 9 wbudowanych zaplanowanych przed deploy
B) Diff DONE: 13 EF z verify_jwt=ON pada 401 (preexisting bug)
C) Decyzje: dlug #3 z [641] - rozdzielic na pakiety
D) Implementacja: rozne pakiety bezpieczenstwa (anon vs user JWT vs service_role)

══════════════════════════════════════════════
KROK 7: BAZA DANYCH (typy ID)
══════════════════════════════════════════════
A) Audyt DONE [641]: 27 tabel, 3 grupy spojne wewnetrznie
B) Diff DONE: BIGINT-FK (4) vs TEXT-no-FK (5) vs UUID-only (2)
C) Decyzje: dlug #10 z [641] - migracja do master_id UUID po Kroku 2 LOGOWANIE
D) Implementacja: po Kroku 2 LOGOWANIE - migracja typow + FK constraints

══════════════════════════════════════════════
KROK 8: WALIDACJA E2E
══════════════════════════════════════════════
A) Smoke testy kazdego pokoju (Asystent, DD, SN, Gaweda, Sloik, Horyzont)
B) Test profil podroznika - migracja MJ→mana-app
C) Test sync miedzy urzadzeniami (komputer + telefon)
D) Test calego flow: onboarding → pierwszy pokoj → pamiec → drugi pokoj

══════════════════════════════════════════════
KOLEJNOSC IMPLEMENTACJI
══════════════════════════════════════════════
Faza A (porzadek rejestrow - 1-2 godziny):
1. Krok 1 Aplikacje (DELETE/INSERT)
2. Krok 2 Pokoje (uzupelnienie)
3. Krok 3 Kafle (uzupelnienie)
4. Krok 5 Studnia (DELETE zombie, decyzja fundament)

Faza B (operacyjna - kilka dni):
5. Krok 0 Podroznik (audyt 13 podroznikow)
6. Naprawa #19 INSERT do dd_entries [644]
7. Naprawa #20 sync miedzy urzadzeniami [644]
8. Refaktor Gawedy z Typebot → call-gaweda + duch_medrzec

Faza C (strategiczna - tygodnie):
9. Krok 2 LOGOWANIE (Supabase Auth + master_id UUID)
10. Krok 7 migracja typow ID
11. Krok 4 rejestr ziarenek (opcjonalne)
12. Krok 8 walidacja E2E

PROTOKOL AKTUALIZACJI
=====================
Po zakonczeniu kazdego kroku - aktualizacja mapy [645] z markerami:
✅ DONE | 🟡 W TOKU | 🔴 BLOKADA | ⏳ CZEKA

Adam moze drukowac ten plan + mape [645] obok siebie. Plan = JAK isc, mapa = GDZIE jestesmy.

POWIAZANIA
==========
[491] Slownik MANA - definicje
[624] Audyt fundament logiczny 30.04
[641] Audyt techniczny 4.05 + PDF
[642] Sesja 7B refinement DD
[643] Dlug architektoniczny migracja MJ→mana-app
[644] Dlugi #19 #20 - INSERT pada cicho, sync dziurawy
[645] MAPA STANU TECHNICZNEGO MANA (zywy dokument)

OSTATNIA AKTUALIZACJA: 5.05.2026 wieczor
NASTEPNA AKTUALIZACJA: po wykonaniu Fazy A (porzadek rejestrow)
