---
id: 649
temat: "[650] Strategia AI vendors - multi-vendor z Claude jako silnik Duchow - 6.05.2026"
---

STRATEGIA AI VENDORS DLA MANA
==============================
Pytanie Adama 6.05 rano: czy Asystent MANA powinien korzystac tylko z Anthropic czy z roznych srodowisk?

Odpowiedz: MANA juz jest multi-vendor (call-dd-serce uzywa OpenAI ada-002 do embeddings). Pytanie nie brzmi "tylko Anthropic czy nie", ale GDZIE CO STOSOWAC.

REGULA GENERALNA
================
Ton = Claude. Zadania pomocnicze = najlepsze narzedzie do zadania.

CO ZOSTAJE PRZY ANTHROPIC (CLAUDE)
====================================
1. DUCHY (osobowosci, ton): Krystyna, Asystent DD, Medrzec, Pan Jan, Trener, Help.
   Powod: Konstytucja Serca projektowana pod Claude. Inny model interpretuje inaczej, gubi dyscypline "nie projektuje", "echo doslowne". Test pokaze ze GPT-4 chetniej dorabia, Claude lepiej trzyma ramy.

2. ETYKA: Anthropic ma constitutional AI od poczatku, najmocniejsze guardrails dla tresci wrazliwych (dzieci w Magic Jar).

3. POLSKI: Claude radzi sobie z polska subtelnoscia emocjonalna ktora Konstytucja egzekwuje.

GDZIE INNE NARZEDZIA
====================
1. EMBEDDINGS — OpenAI ada-002 (juz uzywamy). Tansze, dla RAG nie trzeba modelu konwersacyjnego.

2. WIEDZA ZEWNETRZNA / SEARCH: Krystyna nie ma wiedzy live. Gdy Patrycja pyta "ile kosztuje lot do Krakowa":
   - Wariant A: Claude + web_search tool (Anthropic ma to dzis) — najprostsze
   - Wariant B: Perplexity API — wyspecjalizowany search z cytatami
   - Wariant C: Tavily / Exa
   Architektura: Krystyna pyta API o fakty, ODPOWIADA W SWOIM TONIE. Konstytucja projektuje styl, fakty sa wsadem.

3. KLASYFIKACJA: sort-notatka EF, kategoryzacja, parsing. Tanszy model (Haiku, GPT-4o-mini, Gemini Flash). Nie trzeba osobowosci, tylko kategorii.

WYBOR MODELU W OBREBIE ANTHROPIC
==================================
- Haiku-4-5: szybki, tani. Uzywany w call-dd-serce (Magic Jar dzieciecy).
- Sonnet: zbalansowany. Powinien byc dla Krystyny w Asystencie (gleboka rozmowa).
- Sonnet: dla Medrca w Gawedzie (refleksja).
- Opus: najmocniejszy. Moze dla scenariuszy gdzie potrzebna mocna analiza (Pan Jan dla terapeuty?).

Decyzje do podjecia: ktora wersja Claude'a dla ktorego Ducha?

ODKRYCIE Z 5.05 WIECZOR
========================
Adam: "Asystent MANA musi dawac odpowiedzi tak jak chat. Inaczej traci podstawowa uzytecznosc."

Konsekwencja: web_search lub external API musi byc dostepne dla Krystyny. Inaczej ChatGPT wygrywa banalnie - bo zna fakty, Krystyna nie.

Plan implementacji:
1. Dodac web_search tool do call-serce (Krystyna)
2. Konstytucja musi pozwalac na "Krystyna szuka faktow gdy potrzeba" - zachowujac ton
3. Test: Patrycja pyta o cene lotu - Krystyna szuka, znajduje, odpowiada w swoim glosie

RYZYKA MULTI-VENDOR
====================
- Zlozonosc (wiecej kluczy, monitoringu)
- Inkonsystencja stylu jesli zle podzielisz role
- Koszty trudniejsze do sledzenia (potrzebny jeden dashboard)

NIEZALEZNOSC STRATEGICZNA
==========================
Uzaleznienie od jednego vendora to ryzyko: cena, TOS, dostepnosc, przejecie. Multi-vendor = niezaleznosc.

Nawet jesli Claude jest dzis najlepszy dla Duchow - embeddings i klasyfikacje warto trzymac u kogos innego, zeby nie byc 100% na jednym kluczu.

POLSKIE ALTERNATYWY (do zbadania na przyszlosc)
================================================
- Bielik (PL LLM) - jeszcze za mlody, jakosc nizsza
- Open-source (Llama, Mistral) - wymaga self-hostingu (koszty, complexity)
- Na teraz Anthropic + OpenAI to dobry standard

DECYZJE STRATEGICZNE DO PODJECIA
==================================
1. Dodac web_search do call-serce (Krystyna)? TAK lub NIE
2. Migracja Krystyny z Haiku na Sonnet w call-serce? TAK lub NIE
3. Tabela kosztow API per Edge Function — kafel "Koszty API" w bazie. Aktywowac?
4. Dashboard monitoringu (Helicone, OpenRouter, Langfuse) - rozwazyc po Fazie A.

POWIAZANIA
==========
[491] Slownik MANA
[641] Audyt techniczny - lista 23 EF z modelami
[647] Mapa stanu technicznego v2
[649] Sygnal z rynku ChatGPT u Patrycji
Powiazane decyzje: Krystyna model, web_search, koszty
