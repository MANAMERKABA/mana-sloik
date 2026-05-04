---
id: 643
temat: "[643] DLUG ARCHITEKTONICZNY — DD nie dolewa do travels.pamiec, blokuje migracje MJ→mana-app — 4.05.2026"
---

FLAGA ADAMA, sesja 7B (4.05.2026 popoludnie). Powiazane: [62], [595], [83], [596], call-dd-serce, prompts.serce_konstytucja.

PROBLEM
=======
Pokoj Dobry Dzien (Magic Jar) NIE dolewa wiedzy o podrozniku do wspolnej studni pamieci travels.pamiec. Ma osobny silos dd_entries z embeddingami, ale Krystyna (Asystent w mana-app) ani Gaweda nie widza tego co podroznik wpisal w Dobrym Dniu.

ASYMETRIA TRZECH DUCHOW (stan 4.05.2026):
- Asystent prywatny (Krystyna) → dolewa do travels.pamiec przez tag [PAMIEC] (Konstytucja blok 7)
- Gaweda (Mędrzec via Typebot) → dolewa do travels.pamiec przez tag [PAMIEC]
- DD (Dobry Dzien) → NIE dolewa, INSERT tylko do dd_entries

KONSEKWENCJE
============
Trzy scenariusze migracji ktore dzis nie zadzialaja:

1. Dziecko z MJ wchodzi do mana-app jako dorosly podroznik. Krystyna nie wie nic o jego historii w Dobrym Dniu — 50 mysli o psie, mamie, rysowaniu przepada. Obietnica "Serce pamieta podroznika" (DNA MANA) zlamana.

2. Adam testuje Dobry Dzien osobiscie. Krystyna w mana-app nie wie o tych myslach. Dwie pamieci o tym samym podrozniku, niepolaczone. Lamie zasade [62] "wszystko polaczone ze wszystkim — nie metafora, architektura".

3. Patrycja jako terapeutka — gdy MJ dziecka jej klientki migruje do mana-app, Pan Jan nie ma kontekstu psychoterapeutycznego z lat dzieciecych.

ZGODNOSC Z DECYZJAMI ADAMA
==========================
[595] 24.04: Magic Jar = aplikacja w MERKABIE obok mana-app. Implikuje migracje podroznika miedzy aplikacjami w przyszlosci ("Magic Jar znajduje swoje miejsce" — cytat Adama z [569]).

[62] Mapa MANA: "wszystko polaczone i wspoldzialajace ze wszystkim — nie metafora, architektura".

[83] Konstytucja Serca blok 7 (PAMIEC): mechanizm tag-owania zaprojektowany dla wszystkich Duchow. DD nie korzysta — luka w implementacji, nie w designie.

ROZWIAZANIE (do projektu w osobnej sesji)
==========================================
Wariant A (lekki, najszybszy): Duch DD w prompcie dostaje instrukcje wystawiania tagu [PAMIEC: ...] gdy podroznik powie cos znaczacego (imie, wydarzenie, relacja). Kod call-dd-serce parsuje tag, robi update-pamiec do travels jak istniejacy mechanizm (Asystent + Gaweda).

Wariant B (sredni): osobny EF "kondensator-dd" dziala periodycznie (np. raz dziennie po 22:00 zamykaniu MJ) — czyta dd_entries z ostatniego dnia, syntetyzuje 1-2 zdania kondensatu, dopisuje do travels.pamiec.

Wariant C (ciezki, docelowy): unified memory layer — wszystkie Duchy widza pelna historie podroznika z wszystkich aplikacji przez jeden RAG (knowledge + conversations + dd_entries + przyszle stones+notatki+sesje terapeutyczne). Wymaga decyzji Kroku 2 LOGOWANIE (Supabase Auth + master_id UUID — wariant C z [641]).

D rekomenduje Wariant A teraz + Wariant C docelowo po Kroku 2 LOGOWANIE. Wariant B nie wnosi nic czego A nie da prosciej.

PRIORYTET
=========
Wyzszy niz refinement promptu DD nad ktorym pracujemy w sesji 7B. Refinement DD bez naprawy migracji pamieci = poprawiamy jakosc rozmowy w silosie ktory i tak jest odciety.

Sugestia D: w nastepnej sesji najpierw Wariant A (DD dolewa do travels.pamiec jak Asystent/Gaweda), potem refinement promptu DD juz na poprawnym fundamencie.

NIE BLOKUJE
===========
Refinement promptu DD ktory robimy teraz w sesji 7B moze isc dalej — uczy mechaniki transformacji, dziala lokalnie w sesji DD. Po dodaniu Wariantu A te same zasady transformacji + counter beda dzialac, plus tag PAMIEC dolaczy do studni.

META
====
Flaga Adama 4.05 cytat: "to nie jest docelowa architektura bo jezeli kiedys MJ bedziemy adeptowac do mana.app lub podroznik bedzie migrowac do mana.app to wiedza tez powinna migrowac".

D rozszerzyl o trzy scenariusze migracji + analize zgodnosci z [595][62][83]. Wariant A wybrany jako rekomendacja krotkoterminowa, C jako docelowy po Kroku 2 LOGOWANIE.

Status: do projektu w osobnej sesji. Nie blokuje refinementu DD w sesji 7B.
