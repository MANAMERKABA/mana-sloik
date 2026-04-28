---
id: 490
temat: "[490] 🏛 ZASADY ARCHITEKTURY MANA (evergreen)"
---

## EVERGREEN — wszystkie nienaruszalne zasady architektoniczne MANA
Ostatnia aktualizacja: 28.04.2026 rano

---

## HIERARCHIA (zaktualizowana 24.04.2026 wg [595])
MERKABA (platforma) → APLIKACJA → POKÓJ → KAFEL → ZIARENKO
DOM = element MERKABY (fundamenty + ściany + konstytucja + pokoje + kafle).
Ściany = knowledge | Cegły = travels | Silnik = Serce

## ZASADA 1 — KAFLE UNIWERSALNE, POKOJE LOKALNE
Kafel wędruje między pokojami, nie zmienia się. Nazwa należy do aplikacji.

## ZASADA 2 — SERCE JAKO KAFEL Z DUCHAMI
Ziarenka: Claude API, Konstytucja, Pamięć, RAG. Duch zmienia kontekst, Serce nie.

## ZASADA 3 — NAJPIERW BUDUJEMY W MANA
Zewnętrzne tylko gdy: niemożliwe, tymczasowe, niewidoczne dla podróżnika.

## ZASADA 4 — JEDNA STRUKTURA
Nowy pokój = nowe widoki, NIE nowe tabele.

## ZASADA 5 — DANE HISTORYCZNE NIENARUSZALNE
Nie zmieniamy, nie usuwamy. Wyjątek: evergreeny.

## ZASADA 6 — EVERGREENY NADPISYWANE, WPISY Z DATĄ ARCHIWALNE
Wpis z datą = świadectwo. Evergreen = stan.

## ZASADA 7 — WŁASNOŚĆ ZIARENEK
Jedno ziarenko = jeden kafel. Nie duplikujemy.

## ZASADA 8 — KONTEKST KAFLA
Kontekst pokoju zmienia rolę kafla, nie zmienia kafla.

## ZASADA 9 — PODZIAŁ RÓL
Display = wykonawca (kod, deploy, SQL, debug).
Cowork = głowa (filozofia, strategia, architektura, baza).

## ZASADA 10 — RAPORTOWANIE DO MANA
Po każdym zadaniu: co zrobiono, co zmieniono, co zostało.

## ZASADA 11 — NAJPIERW MANA, POTEM KOD
Decyzja → MANA → implementacja → raport.

## ZASADA 12 — MOST = DZIENNIK ZMIAN
Chronologiczny log. Format: (DD.MM.YYYY, HH:MM:SS) | kto | co | dlaczego
"MOST" od Adama = czytaj i pokaż, nigdy nie nadpisuj.

## ZASADA 13 — BAZA ŻYWA vs ARCHIWUM
tabela mana_archiwum aktywna (trigger z19 DONE).

## ZASADA 14 — KONWENCJE NAZW
Evergreeny: emoji + WIELKIE LITERY. Wpisy: data + opis. Functions: kebab-case.

## ZASADA 15 — SYNC EDGE FUNCTIONS
Po każdej zmianie w Dashboard — sync do repo w tej samej sesji.

## ZASADA 16 — KAŻDY PISZE WSZĘDZIE, KAŻDY LOGUJE W MOST
Nie ma właścicieli evergreenów. Obowiązek: każda zmiana = wpis w MOST (timestamp + kto + co + dlaczego).

## ZASADA 17 — RAPORT KOŃCA SESJI
Każda sesja kończy się wpisem do MOST: (timestamp) | kto | zrobiłem X | zostawiam Y | następny robi Z.

## ZASADA 18 — GDY SERWER PADA — STOP
Timeout lub 500 = stop. Nie próbuj ponownie. Powiedz Adamowi, wykonaj przy następnej sesji.

## ZASADA 19 — SUWERENNOŚĆ DANYCH (dodana 25.04.2026 wg [598][601])

**MANA NIGDY ZAKŁADNIKIEM ZEWNĘTRZNYCH SERWISÓW.**

Każdy kafel/silnik buduje się w MANA jako trzon wewnętrzny. Integracje zewnętrzne (Google Calendar, Apple iCloud, Cal.com, Booksy, Librus, Vulcan, Stripe, ElevenLabs, WhatsApp i kolejne) są **adapterami opcjonalnymi**, nie kręgosłupem. Wbudowany silnik gwarantuje że jeśli zewnętrzny serwis zmieni warunki, zostanie wykupiony, lub zniknie — MANA dalej działa.

**Twarde dane (uzasadnienie historyczne, [598] pkt 3):**
- Reclaim AI kupiony przez Dropbox (2024-25) — kalendarz AI uzależniony od Google
- Librus zamknął integracje 2019 — szkoły w Polsce zostały bez API
- Google deprecated Calendar API v2 (2018) — kto budował na v2 musiał przepisać
- Cal.com jest jedynym realnie open source kalendarzem w Polsce (2025)
- Wszyscy budujący biznes na cudzym API w ostatniej dekadzie oberwali

**Praktyczne konsekwencje (wzorzec architektoniczny z [598] pkt 7):**

```
[Trzon wewnętrzny: tabela MANA Supabase]
          ↑↓
[Warstwa adapterów - opcjonalna, każdy adapter osobno, każdy z osobną zgodą]
          ↑↓
[Warstwa wartości - asystent (Krystyna / Pan Jan / inne)]
          ↑↓
[Podróżnik / Gospodarz]
```

**Adapter pattern** — asystent nie wie skąd przychodzą dane. Widzi ujednolicony interfejs MANA. Implementacja adaptera może się zmienić jutro bez przepisywania logiki asystenta.

**Granularne zgody** — każda integracja zewnętrzna = osobny akt zgody podróżnika/gospodarza. Można odpiąć w każdej chwili. Dane z adaptera synchronizują się z trzonem wewnętrznym — gdy odpinasz Google, wydarzenia zostają w MANA.

**Adaptery sekwencyjnie** — pierwszy uczy wzorca, drugi idzie szybciej. Nie 8 adapterów naraz w pierwszym roku. Najpierw 1-2 i robimy dobrze.

**Suwerenność jako wartość marki** — komunikujemy "Twoje dane są Twoje, działamy nawet jak Google się zmieni", nie "mamy własny silnik" (nudne techniczne fakty). Tym przyciągamy ludzi po doświadczeniach z Reclaim/Booksy/Jane.

**Wyjątek wobec Zasady 3** — Zasada 3 mówi "zewnętrzne tylko gdy niemożliwe/tymczasowe/niewidoczne". Zasada 19 dopowiada: nawet gdy zewnętrzne JEST używane, **zawsze jest tylko adapterem nad wewnętrznym trzonem**, nigdy zastępuje trzonu. Wbudowany silnik istnieje zawsze, adapter jest mostem.

**Pierwsze zastosowanie:** kafel EVENT (z5.A-E) — wbudowany kalendarz MANA jako trzon, adaptery Google/Apple/Cal.com/Booksy jako opcjonalne mosty. Patrz [598][601].

---

## ZASADA 22 — KLASYFIKACJA ADAPTERÓW (DRAFT v0.1, dodana 28.04.2026 wg [614])

**ZEWNĘTRZNY SaaS JAKO MOST DO NATYWNEGO LUB ADAPTER STANDARDOWY REGULACYJNY — NIGDY DESTYNACJA.**

Zasada 19 mówi że MANA zawsze ma trzon wewnętrzny. Zasada 22 dopowiada: **każdy adapter zewnętrzny musi mieć przypisaną jedną z dwóch ról.** Nie ma adapterów "po prostu sobie są" — każdy ma cel architektoniczny i moment ewaluacji.

**KATEGORIA 1 — MOST DO NATYWNEGO (tymczasowy)**

Zewnętrzny SaaS używany dopóki nie zbudujemy własnego silnika. Cel: **zastąpienie**. Adapter ma datę śmierci wpisaną przy starcie.

- Przykład: **Cal.com** pod Panem Janem (z5.B.1) → zastąpienie przez **Booking Engine MANA Public** (z5.E.1) gdy spełniony sygnał Adama (50+ płacących terapeutów + 6-9 mies. budżetu na zespół).
- Cel: wartość już dziś dla gospodarza, suwerenność jutro.
- Wzorzec [608]: Faza 2 ZARABIAMY (Cal.com pod spodem) → Faza 3 BUDUJEMY WŁASNY (zastąpienie).

**KATEGORIA 2 — ADAPTER STANDARDOWY REGULACYJNY (na stałe)**

Zewnętrzny SaaS używany na zawsze, bo regulacja / standard branżowy / sieć efektów sieciowych czyni budowanie własnego niesensownym. Cel: **utrzymanie integracji**.

- Przykład: **Mizzox** dla VAT/JPK/faktur (z5.B.4) — 80% terapeutów, regulacyjny obowiązek, MANA nie ma sensu budować własnej księgowości od zera.
- Cel: integrujemy z istniejącym standardem, nie konkurujemy z księgowością.
- Wzorzec [490] Zasada 19 + [606] Model 2 + [607] Strategia 3.

**RELACJA DO ZASADY 19**

- Zasada 19 = trzon wewnętrzny zawsze istnieje.
- Zasada 22 = klasyfikacja adapterów które otaczają ten trzon.
- Razem: trzon nigdy nie znika, adapter ma jedną z dwóch ról.

**DOPRECYZOWANIE (otwarte wątki, [614]):**
- **Threshold "tymczasowy vs zostaje"** — kryteria robocze: (a) czy regulacja wymusza, (b) czy klient/podróżnik kontaktuje się z zewnętrznym serwisem bezpośrednio, (c) czy budowa własnego daje wartość różniącą.
- Jak komunikujemy klientowi że adapter to most a nie destynacja (transparency).
- Jak audytujemy adaptery raz na X miesięcy (czy nadal "tymczasowy" czy się zasiedział na stałe — i to OK lub nie).
- Czy pojawia się trzecia kategoria (np. "adapter eksperymentalny — testujemy czy ma sens").

**Status:** DRAFT v0.1 — zaakceptowany kierunkowo przez Adama 28.04 rano. Doprecyzowanie szczegółów w późniejszej sesji (świadectwo [614]).

---

## CO ZMIENIONO
14.04 — pierwszy zapis.
15.04 — zasady 12-15.
15.04 wieczór — zasady 16, 17, 18. Decyzja Adama.
24.04 wieczór — hierarchia rozszerzona o MERKABA wg [595] (decyzja poziom 3).
25.04 popołudnie (C+Adam) — **Zasada 19 SUWERENNOŚĆ DANYCH** dodana wg [598][601]. Pierwsze zastosowanie: kafel EVENT (z5.A-E).
28.04 rano (C) — **Zasada 22 KLASYFIKACJA ADAPTERÓW** dodana jako draft v0.1 wg [614]. D6 zaakceptowane kierunkowo przez Adama, doprecyzowanie szczegółów (threshold, audyt, transparency) później. Dwie kategorie: MOST DO NATYWNEGO (tymczasowy, zastąpienie) i ADAPTER STANDARDOWY REGULACYJNY (na stałe, utrzymanie). Relacja do Zasady 19 wyjaśniona.
