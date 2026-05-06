---
id: 652
temat: "AUDYT KROK 0 PODROŻNIK — mapa słowo↔technika 06.05.2026"
---

## AUDYT — KROK 0 planu [646]

**Data:** 06.05.2026 sesja Adam+D
**Cel:** sprawdzić spójność słowa "podróżnik" z faktycznym stanem bazy.

## METODA

3× SQL na `information_schema` + 1× dane realne plemienia (id 51, 53, 61, 70).

## STAN — SŁOWO

[491] mówi: PODRÓŻNIK = użytkownik MANY, cegła w ścianie. TRAVELER_UUID = uniwersalny identyfikator.
Inne ([3][5][8][23][26]): konsekwentnie "podróżnik", bez synonimów.
**Werdykt semantyczny:** czysty.

## STAN — TECHNIKA (faktyczny stan bazy)

`travels` ma 4 kolumny tożsamości:
- `id` BIGINT — primary key, FK target z events/consent_codes/event_participants
- `traveler_id` TEXT — format `nick+id` (Adam51, Patrycja53), używany w 9 tabelach satelickich
- `traveler_uuid` UUID — **NULL u całego plemienia, martwa kolumna**
- `nick` TEXT — przyjazna nazwa

FK constraints: 3 tabele (events, consent_codes, event_participants).
Bez FK ale z `traveler_id`/`traveler_uuid`: 9 tabel (stones, conversations, nagrania, przypomnienia, zdjecia, therapist_clients, therapist_notes, dd_entries, trainer_notes).

## DŁUGI ZNALEZIONE (4)

**D1.** `event_participants.user_id` zamiast `traveler_id` — jedyna niespójność nazewnicza FK.
**D2.** `traveler_uuid` martwa — plan KROK 7 master_id UUID nie wykonany. SŁOWNIK [491] mówi "uniwersalny identyfikator", faktycznie NULL.
**D3.** 4 tabele NIEZAREJESTROWANE w xlsx [641]: `event_participants`, `therapist_clients`, `therapist_notes`, `trainers`. Baza ma min. 22 tabele, xlsx wymienia 18.
**D4.** 9 tabel z kolumną `traveler_id`/`traveler_uuid` bez FK constraint = ryzyko osieroconych wpisów. Plan KROK 7 to adresuje.

## DECYZJA SŁOWO↔TECHNIKA

**Aktualny faktyczny "podróżnik" technicznie =** `travels.id` BIGINT (primary, FK target).
**Tekstowy alias =** `travels.traveler_id` TEXT format `nick+id` (dla satelitów textowych).
**Plan migracyjny =** KROK 7 master_id UUID po LOGOWANIU.

## TODO C (po sesji)

1. Aktualizacja [491] SŁOWNIK — sekcja PODRÓŻNIK + TRAVELER_UUID:
   - Zaznaczyć że TRAVELER_UUID jest **planowany** (KROK 7), nie aktualny
   - Dodać definicję `traveler_id` TEXT format `nick+id`
   - Dodać definicję `id` BIGINT jako aktualnego primary

2. Aktualizacja xlsx HIERARCHIA o:
   - 4 brakujące tabele (event_participants, therapist_clients, therapist_notes, trainers)
   - Korekta wiersza 0.2 PROFIL — kolumny `id, traveler_id, traveler_uuid, nick` plus reszta po SQL A

3. Aktualizacja [646] PLAN 9 KROKÓW:
   - KROK 0 status: wynik audytu zapisany, 4 długi do tracker
   - D1 (`user_id` rename) — task techniczny do naprawy w przyszłej sesji D
   - D2 (`traveler_uuid` martwa) — czeka na KROK 7
   - D3 (4 tabele dokumentacyjne) — następny krok C lub Adam
   - D4 (FK missing) — KROK 7

## OTWARTE — DLA ADAMA

Czy zatrzymujemy audyt PODRÓŻNIKA tu (zamknięty na poziomie tożsamości) i idziemy do KROK 1 APLIKACJE — czy najpierw audyt PROFILU (kolumny `nick, birth_year, pin, consent, jar_type, last_visit, dd_state, sn_items_cloud, pamiec, source` — co znaczą, co wypełniają, co martwe)?

typ_wpisu: raport_zadania
topic: ARCHITEKTURA
