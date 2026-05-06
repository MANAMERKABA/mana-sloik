---
id: 653
temat: "KARTA SESJI 06.05.2026 — porządkowanie MERKABA punkt po punkcie (Adam+D)"
---

## CZYSTA KARTA SESJI 06.05.2026

**Autor:** D (Claude Desktop), karta robocza prowadzona w trakcie sesji z Adamem
**Metoda:** atomowo, rozdzielać przed łączeniem, jedno pytanie naraz
**Mapa:** rysunek MERKABA Adama z 8 punktami — idziemy 1→2→3→4→5→6, centrum 7+8 na końcu

---

## ⭐ ZASADA NACZELNA SESJI (DUŻYMI LITERAMI)

**KAŻDY TESTER MANA = POTENCJALNY PODRÓŻNIK + POTENCJALNY GOSPODARZ BIZNESOWY.**

Konsekwencja: budujemy rozszerzalnie, nie pod obecne 57, tylko pod 10 mln + 1000-10000 terapeutów.

---

## PUNKT 1.P — PODRÓŻNIK

### Definicja słowna (Adam, dziś)
Osoba korzystająca prywatnie z bazy, zarejestrowana, zalogowana, zidentyfikowana. Skala docelowa: 10 mln. Każdy z osobna prywatnie + wspólna wiedza ogólna jako osobny wymiar.

### Drzewko podróżnika (12 tabel + kolumny + embeddings)
```
travels (rdzeń tożsamości)
├─ conversations
├─ stones
├─ dd_entries
├─ events
├─ event_participants
├─ przypomnienia
├─ zdjecia
├─ nagrania
├─ consent_codes
├─ login_history
└─ trainer_notes (notatki trenera w roli)
```

### Decyzje 1.P z dziś

**D1.** `therapist_clients` + `therapist_notes` → wychodzą z PODRÓŻNIKA, należą do APLIKACJI gospodarza (punkt 3). Usuwamy teraz, odbudujemy w Panelu Terapeuty. SQL DROP gotowy.

**D2.** Trener = nakładka na podróżnika, nie osobny człowiek. Jedno `travels.id`. Flag `is_trainer` BOOLEAN już istnieje w bazie. Notatki trenera w `trainer_notes` na osobnej warstwie niewidocznej dla Serca.

**D3.** WIEDZA OGÓLNA (`knowledge`) NIE należy do podróżnika — to obszar punktu 2 DOM. Test własności: usuwam podróżnika, knowledge zostaje. Usuwam knowledge, podróżnik zostaje. Niezależne cykle życia.

---

## PUNKT 1.P.A — LOGOWANIE

### Decyzja 06.05.2026
Zostajemy przy obecnym systemie (MVP), budujemy rozszerzalnie. 5/23 atomów rynkowych = wystarczy do plemienia/testerów, do ujawnienia rynkowi potrzeba pełnego pakietu.

### CO MAMY (atomowo)
- `travels.email` TEXT
- `travels.nick` TEXT
- `travels.birth_year` INTEGER
- `travels.pin` TEXT (4 cyfry, **PLAINTEXT — dług bezpieczeństwa**)
- `travels.consent` BOOLEAN + `consent_timestamp` + `consent_method` + `consent_hash` (audit zgody)
- `travels.created_at`, `last_visit`, `visit_count` (audit aktywności)
- `travels.is_trainer` BOOLEAN (rola)
- `travels.dd_state` JSONB (stan DD per podróżnik)
- `travels.sn_items_cloud` JSONB (stan Spokojnej Nocy?)
- tabela `consent_codes` (kody zgody DD <16 lat)
- tabela `login_history` (audit logowań)
- Edge Functions: `send-consent-code`, `verify-consent-code`
- HTTPS (Vercel default)
- Supabase Auth schema istnieje, **0 użytkowników, NIEUŻYWANY**

### CZEGO NIE MA
- hasło hashowane (`pin` w plaintext, kolumna nazwana `pin`)
- captcha
- rate limiting
- 2FA / MFA
- reset hasła (samodzielny przez użytkownika)
- account recovery
- wylogowanie wszystkich urządzeń
- eksport danych RODO (samodzielny)
- usunięcie konta RODO (samodzielne)
- polityka prywatności w UI
- Terms of Service w UI
- OAuth (Google / Apple)
- passkey / WebAuthn

### LOGOWANIE — STAN UI
- **Magic Jar:** form `nick + birth_year + PIN(4)` → bez emaila, bez weryfikacji
- **DD <16 lat:** dodatkowo parental consent email przez `consent_codes`
- **mana-app:** "auto-zalogowany" — **niejasne, dług dokumentacyjny do sprawdzenia w kodzie frontendu**

### LOGOWANIE — DŁUGI DO ROZSZERZALNOŚCI
1. PIN plaintext → migracja do hash (bcrypt/argon2)
2. Aktywacja Supabase Auth → linkowanie `auth.users` ↔ `travels`
3. Migracja 57 obecnych podróżników (komunikat email + okres przejściowy)
4. Polityka prywatności + Terms of Service (prawnik RODO)
5. Captcha + rate limiting (przed pierwszym terapeutą zewnętrznym)
6. 2FA + OAuth (przed pierwszym płacącym)
7. Eksport + usunięcie konta RODO (przed pierwszym płacącym)

---

## OTWARTE PYTANIA SESJI (do zamknięcia w trakcie)

- Czy zamknięcie 1.P.A wymaga sprawdzenia mana-app auto-login w kodzie frontendu (computer use), czy zostawiamy jako dług?
- Co zawiera `dd_state` JSONB dla aktywnego konta (np. id=51 Adam)?
- Co zawiera `sn_items_cloud` JSONB?
- Czy `consent_codes` zawiera tylko kody DD <16, czy też inne mechanizmy zgody?

---

## CO DALEJ W SESJI

Po zamknięciu 1.P.A LOGOWANIE → 1.P.B kolejny element podróżnika (PROFIL? TREŚĆ? PAMIĘĆ?). Po zamknięciu całego punktu 1.P PODRÓŻNIK → 2.D DOM.

---

## META

- typ_wpisu: brief
- topic: ARCHITEKTURA
- karta robocza, aktualizowana w trakcie sesji
- po zamknięciu sesji → C jutro spisuje pełne świadectwo + aktualizuje [491] SŁOWNIK + [624] audyt fundament + xlsx HIERARCHIA
