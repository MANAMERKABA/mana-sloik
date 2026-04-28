---
id: 619
temat: "z26.5.1 REOPENED 28.04 — v2 fail end-to-end + brief naprawy dla D"
---

## RAPORT M — 28.04.2026, sesja Claude Code z Adamem

**Autor:** M (Claude Code, terminal CLI w `C:\Users\adamdev\mana-mcp`)
**Kontekst:** Adam zlecił audyt holistyczny projektu, w trakcie znaleziono niespójność: Plan twierdzi z26.5.1 DONE 23.04 (server.js v2.0.0), ale na dysku v1.2.1 wciąż aktywny.

## TEST LIVE — wynik

1. **Sanity check standalone PASS:**
   - `node --check server.js.v2-working.js` → exit=0 (składnia OK)
   - `node_modules/@modelcontextprotocol/sdk` v1.27.1 zainstalowany
   - 14 toolów zdefiniowanych zgodnie z planem (13 v1 + nowe `mana_archive_delete`)

2. **Wdrożenie: KOPIA do `server.js` (prawdziwa nazwa, bez `.js.js`) + zmiana `server.js.js` → `server.js.v1-OLD.js`. Adam zrestartował Claude Desktop.**

3. **FAIL end-to-end** w logu `mcp-server-mana.log` po restarcie:
```
13:11:10.777 [info] Server started and connected successfully
13:11:11.036 [info] Message from client: {"method":"initialize","params":{"protocolVersion":"2025-11-25",...}}
13:11:13.261 [info] Server transport closed
13:11:13.261 [info] Server transport closed unexpectedly, this is likely due to the process exiting early.
13:11:13.262 [error] Server disconnected.
```

V2 startuje, dostaje initialize z `protocolVersion: 2025-11-25`, **umiera 2 sekundy później bez odpowiedzi**. Brak stack trace w stderr (SDK nie loguje błędów inicjalizacji).

4. **Rollback PASS:** usunąłem `server.js`, przywróciłem `server.js.js`, Adam zrestartował Claude Desktop, MCP wrócił do pełnej sprawności (v1.2.1).

## KONSEKWENCJA DLA PLANU

z26.5.1 ("Refactor server.js na oficjalny StdioServerTransport MCP SDK") oznaczony DONE 23.04 [586] **nigdy nie był testowany end-to-end z Claude Desktop**. Code "gotowy" w `server.js.v2-working.js` ≠ kod działający. Rollover z26.5.1 → REOPENED.

**Drugorzędne konsekwencje:**
- z26.5.3 (pagination) DONE 24.04 — kod istnieje w v2-working, ale nigdy nie wszedł do prod, więc **NIE LIVE**. Plan kłamie.
- z26.5.4 (search dedup) DONE 24.04 — to samo.
- z26.5.6 (protocolVersion fix) DONE 23.04 — komentarz w kodzie mówi "SDK zarządza" ale faktycznie initialize handshake pada. Hipoteza: SDK nie obsługuje `protocolVersion: 2025-11-25` z Claude Desktop, lub handler initialize nie został zarejestrowany.
- t10 ("Memory/RAG") sub kłamie: "MCP v2.0.0 oficjalny StdioServerTransport SDK" — w rzeczywistości v1.2.1 dalej obsługuje produkcję.

## BRIEF DLA D — jak naprawić v2

**Krok 1 — diagnostyka stderr.** Dodaj `console.error()` na każdym etapie startu w `server.js.v2-working.js`:
```javascript
console.error('[v2-debug] Loading SDK modules...');
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
console.error('[v2-debug] Server class loaded');
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
console.error('[v2-debug] StdioServerTransport loaded');
// ... po każdym require
// ... po new Server(...)
// ... po server.setRequestHandler(...)
// ... po await server.connect(transport) — to jest podejrzewany pkt failure
console.error('[v2-debug] Connect successful, awaiting requests');
```

**Krok 2 — replay initialize standalone.** Stwórz `test-init.json`:
```json
{"jsonrpc":"2.0","id":0,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}
```

I uruchom: `node server.js.v2-working.js < test-init.json` (PowerShell). Powinno **pokazać błąd na stderr** zanim proces umrze.

**Krok 3 — porównaj z v1.2.1.** v1 ręcznie obsługuje method `initialize` z hardcoded `protocolVersion: "2025-11-25"`. v2 polega na SDK który negocjuje wersję. Sprawdź:
- Czy `Server` w SDK wymaga konkretnego `serverInfo` w konstruktorze?
- Czy `setRequestHandler(InitializeRequestSchema, ...)` jest potrzebny ręcznie? (W v2-working brak — SDK ma to robić sam, ale może nie robi.)
- Czy SDK 1.27.1 obsługuje `protocolVersion: 2025-11-25` od klienta? (Może wymaga nowszego: `2025-06-18` lub `2024-11-05`.)

**Krok 4 — minimal repro.** Zbuduj 20-linijkowy MCP server z SDK z 1 toolem dummy. Jeśli on też pada — problem w SDK/Node/Windows. Jeśli działa — problem w v2-working code.

**Krok 5 — po fix:** `node --check` + `node test-init.json` PASS, dopiero potem deploy live do Claude Desktop.

## OGRANICZENIE D — uwaga dla Adama

D (Claude Desktop chat) ma 4-min hardcoded timeout klient-side ([592]). **Nie wykonuj tej naprawy w sesji D bezpośrednio na MCP** — debug na żywo wymaga restartów Claude Desktop, a D może padać przy operacjach mana_add/mana_update na własnym progresie. **Brief do wykonania przez D w sesji D + Adam jako router do C/M dla zapisu**, lub bezpośrednio przez M w terminalu.

## STAN POLE PRACY

Folder `C:\Users\adamdev\mana-mcp\`:
- `server.js.js` (v1.2.1, AKTYWNY)
- `server.js.v2-working.js` (v2.0.0, do diagnozy)
- `.git/` z 3 commitami: snapshot (e121870), wdrożenie v2 (8cbe8d2), rollback (9cde0fb)
- `README.md` z mapą plików i znanymi ograniczeniami
- 4 backupy historyczne

Po naprawie v2: skopiować `server.js.v2-working.js` → `server.js` (prawdziwa nazwa), zmienić `server.js.js` → `server.js.v1-OLD.js`, restart Claude Desktop, test sanity (`mana_get(1)`) + paginacja (`mana_list limit:5 metadata_only:true`).

Powiązane: [592] (asymetria klient-side), [586] (oryginał z26.5.1 wdrożenia), [563] (Responsibility Lanes C/D/M).
