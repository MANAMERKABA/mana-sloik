---
id: 614
temat: "[614] DECYZJE ADAMA 28.04 — D1 Mędrzec parking + D6 Zasada 22 + korekta nazewnictwa Asystenta"
---

⭐ ŚWIADECTWO DECYZJI — 28.04.2026 rano

**Uwaga numeracji:** w pierwszej wersji świadectwo było planowane jako [612], ale [612] i [613] zostały już zajęte (test webhook z31 + raport DONE z31). Świadectwo dostało faktyczne ID **614**. W [497] MOST i innych odniesieniach używamy **[614]**.

## KONTEKST

Po sesji 27.04 (refaktor Konstytucji + dialog C↔D "po 1" / "po 2") C wyeskalowała Adamowi 3 decyzje (D1, D3, D6). D3 (Typebot) zamknięte 27.04 ~11:45. D1 + D6 zostały otwarte do następnej sesji.

28.04 rano Adam:
> "d1 i d6 zaakceptowane ale do doprecyzowania w pozniejszym czasie"

Tryb decyzji: **KIERUNKOWO TAK** — szczegóły do dopracowania w późniejszej sesji. To pierwszy formalny wpis tego trybu (zostaje legalnym wzorcem na przyszłość).

---

## D1 — MĘDRZEC PARKING ARCHITEKTONICZNY

**Decyzja:** TAK kierunkowo. Pokój Gawęda zostaje w roadmapie A.3 (kolejne pokoje po Asystencie). `duch_medrzec` dziś **nie piszemy** — koncepcyjnie zostaje w MERKABIE jako parking, technicznie nie startuje implementacja.

**Co to odblokowuje:**
- D może ruszyć refaktor Konstytucji + `duch_asystent_prywatny` bez konieczności równoczesnego pisania `duch_medrzec`
- Wariant minimum z `BRIEF_C_D_po2_27042026.md` jest formalnie zatwierdzony co do scope
- Architektura "fundament + Duchy" z [611] zostaje walidowana przez pierwszy realny Duch (Asystent Prywatny), Mędrzec dojdzie dopiero po doświadczeniu z pierwszym

**Doprecyzowanie później:**
- Kiedy `duch_medrzec` faktycznie wraca do pisania (po którym pokoju z A.3? po jakim sygnale?)
- Jaki ma być format Mędrca jako Ducha (vs format obecny w Typebot Konstytucji)
- Czy Mędrzec dziedziczy fundament czy ma swoje osobne ziarenka

---

## D6 — ZASADA 22 DO [490]

**Decyzja:** TAK kierunkowo. Formalizujemy Zasadę 22 z dwiema kategoriami. Draft v0.1 dodany do [490] w tej samej sesji.

**Brzmienie kierunkowe:**
> "Zewnętrzny SaaS jako most do natywnego LUB adapter standardowy regulacyjny — nigdy destynacja."

**Dwie kategorie:**
1. **MOST DO NATYWNEGO** — zewnętrzny SaaS używany TYMCZASOWO, dopóki nie zbudujemy własnego silnika. Cel: zastąpienie. Przykład: Cal.com pod Panem Janem (z5.B.1 → zastąpienie przez z5.E.1 Booking Engine MANA Public).
2. **ADAPTER STANDARDOWY REGULACYJNY** — zewnętrzny SaaS używany NA STAŁE, bo regulacja/standard branżowy/sieć efektów sieciowych czyni budowanie własnego niesensownym. Cel: utrzymanie integracji. Przykład: Mizzox dla VAT/JPK (z5.B.4) — 80% terapeutów, regulacyjny obowiązek, MANA nie ma sensu budować własnej księgowości od zera.

**Doprecyzowanie później:**
- **Threshold "tymczasowy vs zostaje"** — jakie kryterium decyduje? Zaproponowane robocze: (a) czy regulacja wymusza, (b) czy klient/podróżnik kontaktuje się z zewnętrznym serwisem bezpośrednio, (c) czy budowa własnego daje wartość różniącą.
- Jak komunikujemy klientowi że adapter to most a nie destynacja (transparency)
- Jak audytujemy adaptery raz na X miesięcy (czy nadal "tymczasowy" czy się zasiedział)
- Relacja Zasady 22 do Zasady 19 (Suwerenność danych) — Zasada 19 mówi "MANA zawsze ma trzon wewnętrzny", Zasada 22 dopowiada "zewnętrzne adaptery mają jedną z dwóch ról". Razem: Zasada 19 = trzon, Zasada 22 = klasyfikacja adapterów.

---

## KOREKTA NAZEWNICTWA ASYSTENTA (POTWIERDZONA)

**Tło:** 27.04 ~11:50 Adam ustalił "Krystyna → asystent osobisty" jako default produkcyjny. Dziś świadectwo formalizuje tę zmianę razem z D1+D6.

**Stan:**
- Default produkcyjny w MANA: **"asystent osobisty"** (czyt. dla podróżników w aplikacji, w marketingu, w UI)
- "Krystyna" = robocza nazwa zespołowa MANA (czyt. między C/D/Adam, w MOST, w briefach, w komentarzach kodu)
- Plik Ducha: `duch_asystent_prywatny.md` (nie `duch_krystyny.md`)
- W tabeli `prompts`: nazwa techniczna ducha do ustalenia w refaktorze (D decyduje przy implementacji)

**Konsekwencje dla refaktoru Konstytucji:**
- D pisze `duch_asystent_prywatny.md` jako pierwszy realny Duch
- W tekście Ducha można zachować "Krystyna" jako wewnętrzne imię które asystent może nadać sobie albo które podróżnik może ustawić, ale technicznie i marketingowo Asystent Osobisty
- Spójność z [610] (UI A.2) i z [611] (architektura fundament + Duchy)

---

## METADANE

- **Autor:** C, 28.04.2026 rano
- **Pochodzenie:** wiadomość Adama "d1 i d6 zaakceptowane ale do doprecyzowania w pozniejszym czasie" w sesji porannej 28.04
- **Powiązane:**
  - [490] Zasady architektury MANA (gdzie ląduje draft Zasady 22)
  - [497] MOST (przeniesienie D1+D6 z INBOX do ZAMKNIĘTE 28.04)
  - [488] DECYZJE ADAMA (poziomy 1-3, kontekst gdzie D1/D6 to poziom 2-3)
  - [563] Responsibility Lanes C/D + flagi MOST (proces eskalacji decyzji)
  - [596] Krainy + asystenci + 6 nakładek (kontekst architektury Asystenta)
  - [607] Asystent jeden silnik wiele Duchów (kontekst pliku Ducha)
  - [608] Trzy fazy biznesowe (kontekst Cal.com → Booking Engine MANA Public dla D6)
  - [610] Świadectwo dyskusji UI A.2 (kontekst korekty nazewnictwa)
  - [611] JAK UCZY SIĘ MANA — fundament + Duchy (kontekst architektoniczny)
  - `BRIEF_C_D_po2_27042026.md` (brief zawierający D1, D3, D6)

- **Co odblokowuje:**
  - D rusza refaktor Konstytucji + `duch_asystent_prywatny` (zielone światło, czeka tylko na sektor: kod call-serce + tekst monolitu)
  - C może pisać brief A.2 część 2 (UI mana-app) po DONE refaktoru

- **Tryb decyzji "kierunkowo TAK + doprecyzowanie później":**
  Pierwszy formalny wpis tego trybu. Wzorzec: Adam akceptuje kierunek, szczegóły wracają jako otwarte wątki w INBOX 🟡 (nie 🔴 — nie blokują pracy, ale wymagają powrotu). Ten tryb pozwala na ruch bez paraliżu szczegółowego, gdy główny kierunek jest jasny ale parametryzacja wymaga doświadczenia.

  **Zasada wynikowa (do skilla `mana-start` META-LEKCJA 9 lub do [490] jako Zasada 23 — do decyzji Adama):** "Decyzje strategiczne mogą być przyjęte jako kierunkowe — wystarczy do odblokowania pracy. Doprecyzowanie zostaje w INBOX 🟡 jako otwarty wątek do dojrzewania."
