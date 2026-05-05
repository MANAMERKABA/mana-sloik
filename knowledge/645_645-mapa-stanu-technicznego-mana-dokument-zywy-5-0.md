---
id: 645
temat: "[645] MAPA STANU TECHNICZNEGO MANA - dokument zywy - 5.05.2026"
---

MAPA STANU TECHNICZNEGO MANA - dokument zywy
==============================================
Cel: Adam ma WIDOK aktualnego stanu technicznego vs zalozenia. Aktualizowane po kazdej zmianie. Zrodlo prawdy o tym co JEST w bazie i co MIALO BYC.

Powod powstania: Adam 5.05 wieczor: "robimy i robimy a ja nie widze efektu bo tylko polegam na tobie - a to blad". Mapa daje samodzielnosc widoku.

PROTOKOL AKTUALIZACJI
=====================
Po kazdej zmianie strukturalnej w bazie (schema, prompts, EF, rejestry):
1. Asystent AI lub Adam aktualizuje ten wpis przez SQL Editor: UPDATE knowledge SET tresc = '...' WHERE id = 645
2. Lub przez archiwizacje + nowy wpis (mana_archive + mana_add) - wtedy nowy ID, zaktualizowac referencje
3. Markery: ✅ zgodne z planem | 🟡 do decyzji | 🔴 brak/zombie | ⏳ czeka na dane

POZIOM 1: APLIKACJE (5-6 zaplanowanych wg [624])
=================================================
Stan rejestru `aplikacje` na 5.05.2026 (7 wpisow):

✅ JEST poprawnie:
- Magic Jar (id ecf8b0d4-a276-426c-8a44-17ba0382c46e) - mana-sloik
- Panel Terapeuty (id d40e3170-af76-4363-bb2b-e011cf0128a4) - planowany
- Panel Trenera (id 1d995c85-c2a8-4980-a77a-c12dbc220551) - planowany

🔴 BRAK w rejestrze (do INSERT):
- MANA (glowna) - mana-app, najwazniejsza aplikacja
- Panel Admina - admin.html w mana-sloik

🔴 ZOMBIE w rejestrze (to pokoje/kafle, nie aplikacje - do DELETE):
- Sloik JAR (id 868eb964-54aa-41cb-a480-0dd9027a2d42) - pokoj/kafel w MANA
- Horyzont (id 52ecc860-a24f-4474-83d6-b4f2518c0b03) - pokoj w MANA
- Gaweda (id 0460a633-a160-4dff-af5b-348bafde7cde) - pokoj w MANA

🟡 DO DECYZJI:
- MANA Help (id da735607-0b71-4199-bc60-408f3b17b6bc) - aplikacja samodzielna czy pokoj w MANA? Wg [624] mialo byc samodzielne wsparcie kryzysowe.

POZIOM 2: POKOJE
================
Zalozenia z [624]:
- W MANA glownej (9): Asystent, Horyzont, Sloik, Gaweda, Cisza, Puls, Trzos, Pamietnik, Rod
- W Magic Jar (3): Spokojna Noc, Dobry Dzien, Ksiezycowy Czas
- W Panel Terapeuty (5): Asystent, Organizator, Karta, Rozliczenia, Notatki sesji
- W Panel Trenera: nieznane (do okreslenia)

Stan: ⏳ CZEKA na SELECT * FROM pokoje;

POZIOM 3: KAFLE
================
Zalozenia (6 wg [491], PDF kafle_mana_v20):
1. Serce - silnik AI (Claude API + Konstytucja + Pamiec + RAG)
2. Notatnik - tekst rozmow
3. Interfejs - UI components
4. Sloik - kamienie podroznika
5. Zdjecie - obraz/foto
6. EVENT/Organizator - wydarzenia, kalendarz

Stan: ⏳ CZEKA na SELECT * FROM kafle;

POZIOM 4: ZIARENKA (atomy funkcjonalnosci)
============================================
Brak osobnego rejestru. Ziarenka zyja w kodzie:
- Edge Functions (23) - operacyjne ziarenka
- Triggery Postgres (14) - automatyczne ziarenka
- Frontendy (mana-app, mana-sloik) - UI ziarenka

POZIOM 5: STUDNIA + WIADRA (prompts table)
===========================================
✅ serce_konstytucja (5763 znakow, 16.03.2026) - aktywna w call-dd-serce, call-serce, Typebot Gawedy
✅ duch_asystent_prywatny (10793 znakow, 28.04.2026) - Krystyna w MANA mana-app
✅ duch_dd (2626 znakow, 2.05.2026) - Asystent Dobrego Dnia w Magic Jar (refinement 4.05)

🔴 BRAK:
- duch_medrzec - Gaweda uzywa samej Konstytucji bez nakladki Mędrca

🟡 DUPLIKATY/ZOMBIE (do uporzadkowania):
- serce_konstytucja_fundament (4458 znakow, 28.04.2026) - nieaktywna alternatywa dla Konstytucji, decyzja: zostawic vs zarchiwizowac
- magic_jar_kontekst (1251 znakow, 31.03.2026) - poprzednik duch_dd
- magic_jar_kontekst_backup_2_05 (1251 znakow, 2.05.2026) - backup przed refactorem

POZIOM 6: BACKEND (Edge Functions, 23 sztuki)
===============================================
Stan z [641] audytu technicznego:
✅ Triggery → Edge (5): embed-knowledge, embed-conversation, embed-dd-entry, sync-knowledge-to-repo, sync-prompt-to-repo
✅ Frontend publiczne verify_jwt=OFF (4): call-dd-serce, send-consent-code, verify-consent-code, event-create
✅ User JWT verify_jwt=ON dziala (1): call-serce
🔴 verify_jwt=ON preexisting bug 401 (13): check-trainer, event-update, event-delete, get-pamiec, update-pamiec, get-stones, mana-rag-search, summarize-conversation, get-plan, update-plan, get-prompt, sort-notatka, iskierka-eval

POZIOM 7: BAZA DANYCH (27 tabel public schema)
================================================
Hub: travels (BIGINT id, 13 podroznikow whitelist [624])
Glowne tabele danych: dd_entries, conversations, stones, knowledge, events
Wsparcie: prompts, consent_codes, login_history, mana_archiwum_tematyczne (838 wpisow)
Inne: rejestry (aplikacje, pokoje, kafle, pokoje_kafle), itd.

Trzy grupy spojne wewnetrznie wg [641] dlug #10:
- BIGINT-FK (4): travels (HUB) + events + consent_codes + login_history
- TEXT-no-FK (5): stones, conversations, zdjecia (aktywne) + nagrania, przypomnienia (puste)
- UUID-only (2): dd_entries, trainer_notes

DLUGI TECHNICZNE OTWARTE (z [641] + 5.05)
==========================================
17 dlugow z [641] + 2 nowe wykryte 5.05:

Z [641]:
1. ✅ MCP w Claude Desktop (DONE 4.05)
2-17. Pozostaje (refaktor 13 EF, indeksy, RLS, etc.)

Nowe (5.05) - z [644]:
18. INSERT do dd_entries pada cicho - blokuje produkcje Magic Jar Dobry Dzien
19. Sync ddDone miedzy urzadzeniami dziurawy - rozjazd komputer/telefon

POWIAZANIA
==========
[624] audyt fundament logiczny 30.04
[641] audyt techniczny 4.05 + PDF
[491] slownik MANA
[642] sesja 7B - call-dd-serce fallback + refinement Ducha DD
[643] dlug architektoniczny migracja MJ→mana-app
[644] dlugi #19, #20 wykryte 5.05

OSTATNIA AKTUALIZACJA: 5.05.2026 wieczor
Nastepna planowana: po wkleeniu SELECT * FROM pokoje + kafle
