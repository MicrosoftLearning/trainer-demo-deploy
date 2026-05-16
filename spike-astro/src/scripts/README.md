# Orchestrator Preview Scripts (`.opx.yaml`)

This folder holds **OPX scripts** — declarative YAML files that drive the
"fake Copilot chat" panel on the spike's homepage (the `OrchestratorPreview`
component). One file = one self-contained transcript that can be played in
the hero carousel.

> **TL;DR for authoring a new script:** copy [`byod-azure-aca.opx.yaml`](./byod-azure-aca.opx.yaml),
> change the `meta` block, rewrite the `steps`, make sure the `advances`
> counters sum to the `meta.diff` / `meta.task.progress` totals, save as
> `<your-id>.opx.yaml`, and refresh — the carousel picks it up automatically.

---

## How files are discovered

| Thing                | Value                                                                |
| -------------------- | -------------------------------------------------------------------- |
| Location             | `spike-astro/src/scripts/`                                           |
| Filename pattern     | `*.opx.yaml` or `*.opx.yml`                                          |
| Auto-load function   | [`loadAllScripts()`](../lib/opx.ts) — used by the homepage carousel  |
| Single-load function | `loadScript("<id>")` — used when you want one specific script        |
| Ordering             | Alphabetical by filename                                             |
| Carousel inclusion   | Every file in this folder is included automatically                  |
| Validation           | Strict (Zod). A malformed file fails the build with a precise error. |

To exclude a script from the carousel, either delete it or move it out of
this folder. There is no opt-out flag.

---

## Top-level shape

```yaml
meta:
  # …header fields…
steps:
  - # …step 1…
  - # …step 2…
```

The schema is enforced by [`src/lib/opx.ts`](../lib/opx.ts) (Zod). Anything
not listed below is rejected.

---

## `meta` — required header

```yaml
meta:
  id: my-script                                 # required — must be unique; matches filename stem
  title: "Trainer Demo Deploy — My scaffold"    # required — shown in the chat panel header
  agent: orchestrator                           # default: "orchestrator"
  model: "Claude Opus 4.7"                      # default: "Claude Opus 4.7"
  context: "Trainer Demo Deploy — Demos, r…"    # default: ""  — italic chip above composer
  task:
    label: "Build my thing"                     # required
    progress: [12, 12]                          # required — [done, total]; done ≤ total
  diff:
    files: 12                                   # required — total file count for the final summary
    added: 481                                  # required — total + lines
    removed: 12                                 # required — total − lines
  speed: 1.0                                    # default: 1.0  — global multiplier (2.0 = twice as fast)
  mode: player                                  # default: "marquee" — see below
  loop: true                                    # default: true — only relevant in player mode
  startDelay: 500                               # default: 400 ms — pause before the first step
  loopPause: 2600                               # default: 2200 ms — gap between loop iterations
```

### `mode: marquee` vs `mode: player`

| Aspect                | `marquee`                                                | `player`                                                                  |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Visibility of steps   | All steps rendered statically; CSS scrolls them          | Steps revealed one at a time, driven by `timing`                          |
| `task`/`diff` counters | Render their final meta values immediately               | Start at **0** and tick up as each step's `advances` fires                |
| Composer input        | Static placeholder ("Describe what to build")            | User steps type their `body` into the composer letter-by-letter           |
| `loop` / `startDelay` / `loopPause` | Ignored                                  | Honored                                                                   |
| Use case              | Background eye-candy                                     | Hero scripted walkthroughs (this is what the homepage carousel uses)      |

**Use `player` for anything in the carousel.** The runtime driver lives in
[`Transcript.astro`](../components/orchestrator-preview/Transcript.astro).

---

## `steps` — the transcript

`steps` is an array of step objects. There are **six step kinds**. Every
step object must contain exactly one of these top-level keys, and may also
include the optional `timing` and `advances` siblings:

| Kind     | Key       | Renders as                                                  |
| -------- | --------- | ----------------------------------------------------------- |
| user     | `user:`   | Bubble with avatar (initials + gradient) and a typed prompt |
| agent    | `agent:`  | Copilot reply, optional fenced code block                   |
| tool     | `tool:`   | "Tool ran" card with kind icon, title, optional result      |
| files    | `files:`  | List of file rows with op glyphs (`+ ~ − →`) and line counts |
| summary  | `summary:`| Highlighted recap card with title/lead/bullets              |
| status   | `status:` | Single-line status pill (green/amber/red dot)               |

### Shared siblings on every step

```yaml
- agent:
    body: "…"
  timing:    { appearAfter: 0, holdFor: 1400, typing: 0 }   # optional, see below
  advances:  { task: 0, files: 0, added: 0, removed: 0 }    # optional, see below
```

---

## Step kind reference

### `user`

```yaml
- user:
    handle: jsmith
    avatar:
      initials: js                              # 1–3 chars
      gradient: ["#0078D4", "#8661C5"]          # optional [start, end] hex pair
    body: |
      @workspace Build me an Azure Container Apps demo…
    when: now                                   # default: "now"
  timing: { appearAfter: 0, holdFor: 1600, typing: 3200 }
```

In `player` mode, the user's `body` is flattened to a single line and
**typed into the composer** char-by-char over the `typing` duration. Then
the bubble appears in the transcript.

### `agent`

```yaml
- agent:
    body: |
      Got it — I'll scaffold an azd template…
    code:                                       # optional fenced block
      lang: csharp                              # see "Supported code languages" below
      source: |
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddAzureClients(c => …);
  timing: { appearAfter: 300, holdFor: 2400, typing: 600 }
```

In `player` mode, a `typing` value > 0 shows the bouncing "…" typing
indicator for that many ms **before** the body fades in.

### `tool`

```yaml
- tool:
    kind: search                                # search | run | read | edit  (default: search)
    title: "searched template catalog"          # required
    detail: 'catalog filtered by tag `"aca"`'   # optional — markdown allowed
    result: 'Found 4 templates · using `aca-keda-servicebus`'  # optional — markdown allowed
  timing: { appearAfter: 250, holdFor: 1700 }
```

`kind` only affects the small icon on the left of the card.

### `files`

```yaml
- files:
    - { path: "infra/main.bicep",       op: add,    lines: 82 }
    - { path: "infra/modules/aca.bicep", op: edit,   lines: 12 }
    - { path: "old/legacy.cs",          op: delete, lines: 30 }
    - { path: "src/Foo.cs",             op: rename, lines: 0 }
  timing:   { appearAfter: 250, holdFor: 1800 }
  advances: { task: 4, files: 4, added: 158, removed: 30 }
```

Field rules:

- `op` ∈ `add` | `edit` | `delete` | `rename` (default: `add`).
- `op` controls only the row glyph (`+ ~ − →`) and color.
- `lines` is shown on the right of the row. `0` hides the line count.
- **`lines` is decorative.** The composer counters are driven by `advances`
  on the step (see below), not by summing the `lines` fields.

### `summary`

```yaml
- summary:
    title: "Generated 12 files across infra, app, and demo guide"
    lead: "Your demo includes:"                 # optional
    bullets:                                    # default: []
      - "Container Apps env with KEDA Service Bus scaler"
      - "Service Bus namespace + queue, managed identity (no keys)"
  timing: { appearAfter: 300, holdFor: 2200 }
```

### `status`

```yaml
- status:
    kind: done                                  # done | running | error  (default: done)
    text: "Agent finished · 12 files · 1 search · 0 errors"
  timing: { appearAfter: 200, holdFor: 2000 }
```

| `kind`  | Dot color | Pulses? |
| ------- | --------- | ------- |
| done    | green     | yes     |
| running | amber     | yes     |
| error   | red       | no      |

---

## `timing` — player-mode pacing

```yaml
timing:
  appearAfter: 250        # ms to wait AFTER the previous step finished, before starting this one
  holdFor:     1400       # ms this step stays "current" before the loop moves on
  typing:      0          # ms of typing animation (user: composer types; agent: "…" indicator)
```

All three are scaled by `meta.speed` at runtime (`actual = configured / speed`).
Defaults: `appearAfter: 0`, `holdFor: 1400`, `typing: 0`.

`typing` semantics depend on the step kind:

| Step kind     | `typing > 0` effect                                                        |
| ------------- | --------------------------------------------------------------------------- |
| `user`        | The `body` is typed into the composer (chars/sec ≈ `body.length / typing`) |
| `agent`       | The "…" typing indicator pulses for that long before `body` appears        |
| anything else | Ignored                                                                    |

Char rate is clamped to **≥14 ms/char** so very short prompts still feel
human, regardless of `typing`.

---

## `advances` — counter ticks

```yaml
advances:
  task:    4    # add to "X / Y" task counter (X)
  files:   4    # add to "N files changed"
  added:   225  # add to "+NNN"
  removed: 12   # add to "−NNN"
```

In `player` mode the composer counters start at **0** and tick up as each
step with `advances` becomes visible. By the end of one pass they should
match the `meta` totals exactly.

**Rule of thumb when authoring:**

- `sum(advances.task)`    must equal `meta.task.progress[0]`
- `sum(advances.files)`   must equal `meta.diff.files`
- `sum(advances.added)`   must equal `meta.diff.added`
- `sum(advances.removed)` must equal `meta.diff.removed`

These aren't enforced by the schema (you can have ghost counters or
sandbagged ones if you want), but a mismatch looks broken on screen and is
the most common authoring bug.

---

## Markdown and code

### Body strings (`user.body`, `agent.body`, `tool.detail`, `tool.result`)

Tiny safe subset of inline markdown — see
[`src/lib/markdown.ts`](../lib/markdown.ts):

| Syntax              | Renders as                                |
| ------------------- | ----------------------------------------- |
| `` `code` ``        | inline `code` chip                        |
| `**bold**`          | **bold**                                  |
| `_italic_`          | _italic_  (single underscores)            |
| `[text](url)`       | blue underlined link                      |
| `@mention`          | blue `@mention` chip (e.g. `@workspace`)  |
| blank line          | new paragraph                             |
| single newline      | `<br/>`                                   |

No headings, no lists, no fenced code (use `agent.code` for code blocks),
no images, no tables. HTML is escaped.

### Supported code languages

`agent.code.lang` is passed to a tiny built-in highlighter. Recognized:

- `csharp` — keywords + PascalCase types + strings + `//` and `#` comments
- `bicep`  — keywords + types + strings + comments
- `json`   — `true/false/null` keywords + strings
- `yaml`   — `true/false/null` keywords + strings + `#` comments
- `bash`   — common control keywords + strings + `#` comments
- anything else — plain monospace (still escaped safely)

---

## Validation and common mistakes

If a script fails to parse, the dev server / build prints something like:

```
OPX script "my-script" failed validation:
- meta.task.progress: Expected tuple, received array
- steps.3.files.0.op: Invalid enum value. Expected 'add' | 'edit' | …
```

Common gotchas:

- **`task.progress` must be a 2-tuple of integers** (`[done, total]`),
  with `done ≤ total` and `total ≥ 1`.
- **Step kinds are mutually exclusive.** A step object with both `agent`
  and `tool` keys will fail. One step = one kind.
- **`files` arrays need ≥1 entry.** Empty file batches are rejected.
- **`avatar.initials`** must be 1–3 characters. Emoji counts as more than
  one character — use letters.
- **YAML literal blocks** (`|`) preserve newlines; **folded blocks** (`>`)
  collapse them. For multi-paragraph bodies, prefer `|` and use blank
  lines to mark paragraph breaks.
- **Counters out of sync** — if your composer numbers don't reach the meta
  totals at the end of a pass, your `advances` sums are wrong.

---

## Authoring checklist

When adding a new script, work through this:

- [ ] Filename ends in `.opx.yaml` and the `meta.id` matches its stem.
- [ ] `meta.mode: player` (otherwise it won't behave in the carousel).
- [ ] `meta.task.progress[1]` equals the total files the user will see created.
- [ ] `meta.diff.files / added / removed` match the sum of `advances` across all `files` steps.
- [ ] First step is a `user` step with a `typing` value long enough to feel real (≈30–50 ms per character of `body`).
- [ ] At least one `agent` step has `code:` (gives the panel visual variety).
- [ ] Last step is a `status` step (`done` for happy-path scripts).
- [ ] `loopPause` is comfortable (≥2000 ms); the carousel adds its own breath, so don't make this too small.
- [ ] Saved file, refreshed homepage, watched a full pass to confirm counters land on the meta totals.

---

## Examples in this folder

- [`byod-azure-aca.opx.yaml`](./byod-azure-aca.opx.yaml) — a 12-file Azure
  Container Apps scaffold with `azd`, Service Bus, KEDA, and a demo guide.
  Good template for "scaffold an Azure thing" scripts.
- [`byod-copilot-studio.opx.yaml`](./byod-copilot-studio.opx.yaml) — a
  14-file Copilot Studio solution with topics, knowledge sources, and a
  Teams connector. Good template for "agent / config-pack" scripts.
- [`stress.opx.yaml`](./stress.opx.yaml) — exercises every step kind, every
  `tool.kind`, every file `op`, every `status.kind`, and the markdown +
  syntax highlighter. Use this when modifying the runtime or step renderers
  to confirm nothing regressed visually.
