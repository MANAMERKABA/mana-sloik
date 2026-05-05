---
id: 647
temat: "[647] MAPA STANU TECHNICZNEGO MANA v2 - z POZIOM 0 PODROZNIK - 5.05.2026 wieczor"
---

MAPA STANU TECHNICZNEGO MANA v2 - dokument zywy
==================================================
Wersja 2: dodany POZIOM 0 PODROZNIK (zauwazenie Adama 5.05 wieczor — to bylo brakujace ogniwo, fundament wszystkiego). Aktualizacja stanu po sesji 5.05.

Cel: Adam ma WIDOK aktualnego stanu technicznego vs zalozenia. Aktualizowane po kazdej zmianie. Zrodlo prawdy o tym co JEST w bazie i co MIALO BYC.

Powod powstania v1 ([645]): Adam 5.05 wieczor: "robimy i robimy a ja nie widze efektu bo tylko polegam na tobie - a to blad". Mapa daje samodzielnosc widoku.
Powod powstania v2: zauwazenie ze brakuje POZIOMU 0 PODROZNIK. Adam: "w mapie stanu technicznego brakuje mi podroznika, profilu podroznika".

PROTOKOL AKTUALIZACJI
=====================
Po kazdej zmianie strukturalnej (schema, prompts, EF, rejestry):
1. Asystent AI lub Adam tworzy nowy wpis w knowledge oraz archiwizuje poprzednia wersje przez mana_archive
2. Nowy wpis ma temat "[NowyID] MAPA STANU... vX - YYYY-MM-DD"
3. Markery: ✅ zgodne z planem | 🟡 do decyzji | 🔴 brak/zombie | ⏳ czeka na dane

══════════════════════════════════════════════
POZIOM 0: PODROZNIK + PROFIL (fundament)
══════════════════════════════════════════════
Tabela travels = HUB CENTRALNY
- BIGINT id (auto-increment)
- 13 podroznikow whitelist wg [624] (audyt: ⏳ CZEKA - Krok 0 z [646])

Profil podroznika (kolumny travels):
- nick, birth_year, pin (auth) ✅
- consent (zgoda na DD) ✅
- jar_type (preferencja Sloika) ✅
- pamiec (skondensowana wiedza Serca) ✅ — ALE: tylko Asystent + Gaweda dolewaja [643]
- dd_state (stan Dobrego Dnia) 🟡 — sync miedzy urzadzeniami dziurawy [644 #20]
- sn_items_cloud (Sloik Spokojnej Nocy) ✅
- last_visit ✅
- source (mana_app | magic_jar | terapeuta) ✅

DLUGI POZIOMU 0:
- [643] DD nie dolewa do travels.pamiec — blokuje migracje MJ→mana-app
- [644 #20] Sync ddDone miedzy komputer/telefon dziurawy

══════════════════════════════════════════════
POZIOM 1: APLIKACJE (5-6 zaplanowanych wg [624])
══════════════════════════════════════════════
Stan rejestru `aplikacje` na 5.05.2026 (7 wpisow):

✅ JEST poprawnie:
- Magic Jar (id ecf8b0d4-a276-426c-8a44-17ba0382c46e)
- Panel Terapeuty (id d40e3170-af76-4363-bb2b-e011cf0128a4)
- Panel Trenera (id 1d995c85-c2a8-4980-a77a-c12dbc220551)

🔴 BRAK w rejestrze (do INSERT):
- MANA (glowna) — mana-app, najwazniejsza
- Panel Admina — admin.html w mana-sloik

🔴 ZOMBIE w rejestrze (to pokoje/kafle, do DELETE):
- Sloik JAR (id 868eb964-54aa-41cb-a480-0dd9027a2d42)
- Horyzont (id 52ecc860-a24f-4474-83d6-b4f2518c0b03)
- Gaweda (id 0460a633-a160-4dff-af5b-348bafde7cde)

🟡 DO DECYZJI:
- MANA Help (id da735607-0b71-4199-bc60-408f3b17b6bc) — aplikacja samodzielna czy pokoj w MANA

══════════════════════════════════════════════
POZIOM 2: POKOJE
══════════════════════════════════════════════
Zalozenia z [624]:
- W MANA glownej (9): Asystent, Horyzont, Sloik, Gaweda, Cisza, Puls, Trzos, Pamietnik, Rod
- W Magic Jar (3): Spokojna Noc, Dobry Dzien, Ksiezycowy Czas
- W Panel Terapeuty (5): Asystent, Organizator, Karta klienta, Rozliczenia, Notatki sesji
- W Panel Trenera: nieznane (do okreslenia)

Stan: ⏳ CZEKA na SELECT * FROM pokoje;

══════════════════════════════════════════════
POZIOM 3: KAFLE (6 bazowych wg [491])
══════════════════════════════════════════════
Stan rejestru `kafle` na 5.05.2026 (8 wpisow):

✅ JEST poprawnie (2):
- Serce
- Sloik

🔴 ZLE — to pokoje, nie kafle (do DELETE):
- Dziennik Dobrego Dnia (to pokoj 'Dobry Dzien' w Magic Jar)
- Horyzont (to pokoj w MANA)

🟡 INSTANCJA zamiast bazowego (do reklasyfikacji):
- Notatnik Trenera (powinien byc 'Notatnik' uniwersalny)

🟡 DECYZJA — co to za kafle (nie z [491]):
- Konstelacje (mapa polaczen podroznika)
- Koszty API (admin/operacyjne)
- Baza Wiedzy (knowledge infrastructure)

🔴 BRAK z [491] (do INSERT):
- Notatnik (uniwersalny)
- Interfejs (UI components)
- Zdjecie (obraz/foto)
- EVENT/Organizator (wydarzenia)

══════════════════════════════════════════════
POZIOM 4: ZIARENKA (atomy funkcjonalnosci)
══════════════════════════════════════════════
Brak osobnego rejestru. Ziarenka zyja w kodzie:
- 23 Edge Functions (z [641])
- 14 Triggery Postgres
- UI components mana-app
- UI components mana-sloik (iskierka.html, terapeuta.html, trener.html, admin.html)

══════════════════════════════════════════════
POZIOM 5: STUDNIA + WIADRA (prompts)
══════════════════════════════════════════════
✅ AKTYWNE:
- serce_konstytucja (5763 znakow, 16.03.2026) — Studnia, jedyna aktywna w EF + Typebot
- duch_asystent_prywatny (10793 znakow, 28.04.2026) — Krystyna w MANA
- duch_dd (2626 znakow, 2.05.2026) — Asystent Dobrego Dnia w MJ (refinement 4.05)

🔴 BRAK:
- duch_medrzec — Gaweda uzywa samej Konstytucji bez nakladki
- duch_pana_jana — Asystent Terapeuty
- duch_help — wsparcie kryzysowe
- duch_trenera — Asystent Trenera

🟡 DO DECYZJI:
- serce_konstytucja_fundament (4458 znakow, 28.04.2026) — nieaktywna, zachowac vs archiwizowac

🔴 ZOMBIE (do DELETE):
- magic_jar_kontekst (1251 znakow) — poprzednik duch_dd
- magic_jar_kontekst_backup_2_05 (1251 znakow) — backup przed refactorem 2.05

══════════════════════════════════════════════
POZIOM 6: BACKEND (23 Edge Functions)
══════════════════════════════════════════════
Stan z [641] audytu:

✅ Triggery → Edge (5):
- embed-knowledge, embed-conversation, embed-dd-entry
- sync-knowledge-to-repo, sync-prompt-to-repo

✅ Frontend publiczne verify_jwt=OFF (4):
- call-dd-serce ⚠ #19 INSERT pada cicho [644]
- send-consent-code, verify-consent-code, event-create

✅ User JWT verify_jwt=ON dziala (1):
- call-serce

🔴 verify_jwt=ON preexisting bug 401 (13):
- check-trainer, event-update, event-delete
- get-pamiec, update-pamiec, get-stones
- mana-rag-search, summarize-conversation
- get-plan, update-plan, get-prompt
- sort-notatka, iskierka-eval

══════════════════════════════════════════════
POZIOM 7: BAZA DANYCH (27 tabel)
══════════════════════════════════════════════
Hub: travels (BIGINT id)

Glowne tabele danych:
- dd_entries (UUID) — wpisy DD ⚠ #19 INSERT cicho
- conversations (TEXT) — rozmowy Asystenta + Gawedy
- stones (TEXT) — kamienie Sloika
- knowledge — baza wiedzy MANA
- events (BIGINT-FK) — wydarzenia

Wsparcie:
- prompts, consent_codes (BIGINT-FK), login_history (BIGINT-FK)
- mana_archiwum_tematyczne (838 wpisow)

Rejestry (do porzadku):
- aplikacje, pokoje, kafle, pokoje_kafle

Trzy grupy spojne wewnetrznie wg [641 dlug #10]:
- BIGINT-FK (4): travels (HUB) + events + consent_codes + login_history
- TEXT-no-FK (5): stones, conversations, zdjecia (aktywne) + nagrania, przypomnienia (puste)
- UUID-only (2): dd_entries, trainer_notes

══════════════════════════════════════════════
DLUGI TECHNICZNE (19 otwartych)
══════════════════════════════════════════════
17 z [641] + 2 z [644]:

[641] dlugi:
1. ✅ MCP w Claude Desktop (DONE 4.05)
2-17. Pozostaja: refaktor 13 EF, indeksy, RLS, rotacja kluczy, etc.

[644] nowe (5.05):
18. INSERT do dd_entries pada cicho — blokuje produkcje MJ Dobry Dzien
19. Sync ddDone miedzy urzadzeniami dziurawy

══════════════════════════════════════════════
POWIAZANIA
══════════════════════════════════════════════
[491] Slownik MANA — definicje
[624] Audyt fundament logiczny 30.04
[641] Audyt techniczny 4.05 + PDF
[642] Sesja 7B refinement DD
[643] Dlug architektoniczny migracja MJ→mana-app
[644] Dlugi #19 #20
[645] MAPA v1 (zarchiwizowana, zastapiona przez [647])
[646] PLAN ORGANIZACYJNY 9 krokow

OSTATNIA AKTUALIZACJA: 5.05.2026 wieczor
NASTEPNA AKTUALIZACJA: po Fazie A z [646] (porzadek rejestrow)

PLIK XLSX TOWARZYSZACY
=======================
MANA_HIERARCHIA_5_05_2026.xlsx — wyslany Adamowi 5.05 wieczor.
Adam edytuje offline → wraca z poprawkami → wprowadzamy do bazy.
3 arkusze: HIERARCHIA (wszystko poziomami), PLAN_9_KROKOW, LEGENDA.
