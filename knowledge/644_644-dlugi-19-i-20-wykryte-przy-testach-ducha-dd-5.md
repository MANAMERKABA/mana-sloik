---
id: 644
temat: "[644] DLUGI #19 i #20 wykryte przy testach Ducha DD - 5.05.2026"
---

DWA DLUGI techniczne wykryte 5.05.2026 popoludnie przy probie testowania refinementu Ducha DD na produkcji.

DLUG #19 - INSERT do dd_entries pada cicho
==========================================
Symptom: Adam wpisuje mysli w Magic Jar Dobry Dzien, Asystent zwraca odpowiedz, puzzle otwiera sie lokalnie, ALE w bazie dd_entries brak wpisow od 4.05.

Obserwacje:
- Ostatni dzialajacy wpis 3.05 21:53 (gitara) - sprzed dodania traveler_uuid do INSERT
- Edge Function call-dd-serce dziala (zwraca odpowiedzi swieze, nie z cache)
- Logi EF puste w "Last hour" (moze zakres za waski albo invocations idzie inna sciezka)
- Schemat dd_entries: traveler_uuid UUID nullable, session_id TEXT NOT NULL, mysl TEXT NOT NULL

Hipotezy:
1. iskierka.html wysyla traveler_uuid: S.travelerId (BIGINT z travels.id), kolumna w bazie UUID. Type mismatch. INSERT bez .error check w call-dd-serce - pada cicho.
2. Service Worker serwuje stara wersje iskierka.html z cache (sw.js cachuje statyczne pliki)
3. Inny problem w EF (np. RLS, niesprawdzony przed deploy)

Patch zaproponowany ale niezaweryfikowany:
- Usunac traveler_uuid z body fetch w iskierka.html (linia ~690 ddSubmit)
- Albo dodac .error check po INSERT w call-dd-serce + zwracanie 500 do frontendu

Status: nie naprawione 5.05. Do naprawy w osobnej sesji - zaplanowac dedykowane testy bez halucynacji "naprawmy przy okazji".

Powiazane: [641] dlug #10 (traveler_uuid asymetria), [643] dlug architektoniczny migracja MJ→mana-app.

DLUG #20 - sync ddDone miedzy urzadzeniami dziurawy
====================================================
Symptom: Adam ma Adasko na komputerze (5 mysli wykorzystane dzis) i Adasko na telefonie (5 mysli pozostalych). Nie sa zsynchronizowane.

Przyczyna: w iskierka.html syncDdDebounced wywolywane TYLKO z revealTile (po BLOKADA:NIE i puzzle sie otwiera). Plus telefon przy onboardingu laduje cloud raz, dalej trzyma localStorage. Sync jednokierunkowy z opoznieniem 2s, brak wymuszonego pull przy openDD.

Naprawa - kierunek:
- W openDD wywolac fetch travels?id+select=dd_state i applyCloudDd PRZED ddEnter
- Plus syncDdDebounced rowniez przy zmianie ddDone (nie tylko po revealTile)

Status: do naprawy w osobnej sesji - polaczyc z naprawa #19 bo dotyka tej samej warstwy.

META
====
Wykryte podczas zlej sesji 5.05 popoludnie - mialo byc kontynuacje refinementu Ducha DD + naprawa rejestrow C, weszlismy w spirale debugowania na produkcji. D powinien byl zatrzymac od razu i zanotowac bug, nie naprawiac przy okazji. Lekcja operacyjna: kazdy "drobny bug znaleziony przy okazji" wymaga osobnej decyzji "naprawiamy teraz/notujemy" - nigdy nie wpadac z marszu w naprawe.

Status DONE oznacza zatrzymanie spirali, NIE naprawe. Do naprawy w dedykowanych sesjach z wlasnymi testami.
