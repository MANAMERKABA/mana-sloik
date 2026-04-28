---
id: 618
temat: "BENCHMARK Trzy persony biznesowe MANA — ekosystemy email-kalendarz w 2026 (terapeuci PL, twórcy, szkoleniowcy)"
---

## CO USTALONE (zweryfikowane 28.04.2026)

### TERAPEUCI POLSKA — stan rynku

**Booksy** (lider): 145 zł netto/mc Booksy Biz + 50 zł netto/mc Booksy Med (dokumentacja medyczna integrowana z **Platformą P1 Ministerstwa Zdrowia** + ICD-9/ICD-10/ICF). SMS, email, push notyfikacje wbudowane. Kalendarz + płatności + marketing + reviews.

**ZnanyLekarz**: 499 zł netto/mc Plus + **opłata za każdą zarejestrowaną wizytę**. Najwyżej cenowo. Marketing + recenzje + widoczność medyczna.

**Zencal** (PL): tańsza alternatywa typu Calendly, integracje z polskimi systemami płatności i księgowymi (Pro plan). Ograniczona w opiniach/marketingu vs Booksy.

**Cal.com**: open source, popularny u tech-savvy gospodarzy. Cytat z [598] — closed source kwiecień 2026 (sprawdzić dokładnie).

**Konfiguracja typowego polskiego terapeuty 2026:**
1. Booksy lub ZnanyLekarz — rezerwacja
2. Gmail / własna skrzynka — komunikacja
3. Mizzox / iFirma / Fakturownia — księgowość/JPK
4. Papier lub Excel — notatki sesji
5. Telefon — potwierdzanie wizyt

**Cztery silosy, zero AI, zero pamięci pacjenta między wizytami.** Booksy Med jest najbliżej "integracji" ale tylko dla fizjoterapii i tylko z P1 (regulacja, nie troska).

### TWÓRCY I ARTYŚCI (globalnie)

**Kit** (dawniej ConvertKit) $39-119/mc: lider creator-economy, automatyzacje, landing pages, sprzedaż produktów cyfrowych, embed Calendly w mailach.

**Substack**: free + 10% z paid subscriptions (+ Stripe 2.9%). Najprostszy, ale "platform tax" przy skali.

**beehiiv**: rośnie najszybciej (+450% YoY 2026), wyprzedza Substack i Kit. Newsletter + 0% commission na produktach + growth tools.

**MailerLite**: najtańszy, podstawowy.

**Mighty Networks**: community + newsletter $49/mc, embeds Calendly/Notion/Loom.

**Konfiguracja typowego twórcy 2026:**
1. Kit/Substack/beehiiv — newsletter
2. Calendly — 1:1 sesje
3. Stripe/Gumroad — płatności
4. Linktree — bio
5. Instagram/YouTube/TikTok — dystrybucja

Email i kalendarz **nadal osobno** ale Kit pozwala embed Calendly w mailu jako półintegrację.

### SZKOLENIOWCY I COACHE

Stack ≈ twórcy + Zoom (sesje grupowe) + LinkedIn (marka B2B) + Eventbrite (wydarzenia). Jeszcze większa fragmentacja niż u terapeutów. Wielu używa Notion jako "centrum" — co prowadzi prosto pod Notion Custom Agents (24.02.2026 launch, patrz [615]).

## INSIGHTY DLA MANA

**1. Polski rynek terapeutów ma unikalną lukę.** Booksy/ZnanyLekarz są operacyjne, nie towarzyszące. Pan Jan z B.1 + Karta Pacjenta z B.2 + krążenie zaleceń z [596] pkt 6 = pole które dziś NIKT nie zajmuje w PL.

**2. Booksy Med + Platforma P1 = blocker prawny.** Polski fizjoterapeuta z certyfikacją musi mieć dokumentację zgodną z P1 (Ministerstwo Zdrowia). Psychoterapeuta — luźniej (brak ustawowej regulacji jak u fizjo). **Propozycja:** dopisać do z5.B.2 podzadanie "Adapter P1 dla Karty Pacjenta przed pierwszym płacącym fizjoterapeutą" lub osobny task. Dla psychoterapii — odłożyć.

**3. Trzy persony, jeden problem fragmentacji, jeden reuse-pattern.** Po B.1-B.4 dla terapeutów MANA może w Fazie F lub osobnej fazie (po Fazie E) zaadaptować silnik dla:
- **Trenera/coacha** (B-prim?): Pan Jan + Karta Klienta + integracja Zoom + sprzedaż kursu
- **Twórcy/artysty** (C?): Pan Jan + lista subs + integracja newsletter + sprzedaż wydarzeń

Możliwe że to nie osobne fazy, a **różne Duchy biznesowe** w tym samym silniku Asystent z [607] — wtedy reuse jest praktycznie 1:1.

**4. Argument suwerenności wzmocniony.** Każda z trzech grup boli się platform tax (Booksy widoczność, Substack 10%, Calendly subskrypcja). Argumentacja MANA "platforma która oddaje Ci klienta i markę" trafia w 2026 mocniej niż w 2025 — bo wszyscy widzą wzrost. Wzmacnia [490] Zasadę 19 i [608] Fazę 3.

**5. Trend usage-based pricing potwierdzony.** Notion Credits, Kit per-subscriber, Substack 10%, ZnanyLekarz per-wizyta — cały rynek idzie w usage-based. To samo planujemy dla Stripe Connect z5.E.2. Konsumenci 2026 są oswojeni z modelem.

**6. Email = nadal luka w MANIE i nadal otwarte pytanie.** Żadna z trzech grup nie ma dziś "email + kalendarz + AI" w jednym (Notion próbuje, Gemini próbuje). MANA może świadomie pominąć email (suwerenność, prostota) lub świadomie wejść (więcej sygnałów dla Krystyny/Pana Jana) — decyzja architektoniczna na Fazę F lub odrzucenie.

## REKOMENDACJA

Nie zmieniać planu A.1-A.5/B.1-B.4. Wzmocnić argumentację (DNA, sales pages, briefy wewnętrzne) o:
- "Cztery silosy w gabinecie terapeuty PL = nasza struktura przewagi"
- "Reuse silnika Asystent dla 3 person biznesowych po B" — kolejna odsłona [607]
- "Adapter P1 jako wymóg prawny przed płacącym fizjoterapeutą" — nowy podzadanie

## PYTANIA OTWARTE DLA ADAMA

1. Czy fizjoterapeuci są w docelowej grupie B.1-B.4, czy zaczynamy od psychoterapeutów (mniej regulacji)? Decyzja wpływa na P1 jako blocker.
2. Po B.4 — kolejna persona (twórca? coach?) jako osobna faza, czy jako kolejny Duch w istniejącym silniku?
3. Czy wpisujemy "email integration" jako pytanie do Fazy F, czy świadomie odrzucamy (MANA bez maila — jako wybór)?

## ŹRÓDŁA

- biz.booksy.com/pl-pl + biz.booksy.com/pl-pl/funkcje/booksy-med (cennik, P1, ICD)
- znanylekarz.pl, zencal.io (cennik)
- produbee.pl/jak-w-latwy-sposob-zastapic-booksy-i-znanylekarz-pl (porównanie)
- kit.com, substack.com, beehiiv.com (cennik creator)
- mailtoolfinder.com/blog/convertkit-vs-substack (porównanie)
- mightynetworks.com/resources/substack-alternatives

## META

- Autor: D (Claude Desktop), 28.04.2026 ~10:50. Wpisany do knowledge przez C.
- Trigger: Adam zapytał o trend kalendarz-email w kontekście pytania o Notion Custom Agents (patrz [615]).
- Powiązane: [43] Szkoleniowiec i artysta, [490] Zasada 19 + Z22 v0.1 [614], [596] Krainy + asystenci, [598] Kalendarz hybryda, [600] MANA indywidualne, [607] Jeden silnik wiele Duchów, [608] Trzy fazy biznesowe, [615] Notion Custom Agents, [617] Suwerenność decyzji (zapisane przez D dziś).
- Status: research strategiczny dla Toru Biznesowego B + wzmocnienie [608]. Zostawia trzy otwarte pytania dla Adama (do osobnej sesji, nie dziś — dziś temat = agent osobisty).
- typ_wpisu: lekcja
- topic: KIERUNEK_STRATEGICZNY
