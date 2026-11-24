# States, surfaces and status colour

Adapted from the button-states, surface-separation and status-colors-and-errors skills in dembrandt-skills,
Copyright (c) 2026 Dembrandt, MIT, https://github.com/dembrandt/dembrandt-skills. Kleinefy changes: the examples were
rewritten for our tokens, the React and Tailwind material was removed, and the status palette was reduced so that brass
is never a status colour.

## Every interactive element has six states

| State | Trigger | Signal |
|---|---|---|
| Rest | Default | Base token, `cursor: pointer` on anything you can act on |
| Hover | Pointer over | One surface or colour step, with no scale on cards |
| Active | Press | One more step, plus an optional `scale(.97)` |
| Focus | Keyboard | A `:focus-visible` outline in `--ring` with a 2–3px offset and no fill change |
| Disabled | Unavailable | Opacity around .4 with `cursor: not-allowed`, and shape and size unchanged |
| Loading | Work in progress | Non-interactive with stable width, and a status message if the wait is long |

Derive the hover and active colours from the base by stepping lightness, not by picking new colours. In dark mode,
lighten on hover instead of darkening. Use `outline` for focus rather than `box-shadow`, and never set `outline: none`
without a replacement. The cursor does not change while something loads. The element shows the progress itself.

```css
.btn{background:var(--primary);color:var(--primary-fg);border:1px solid var(--btn-border);
  transition:background-color 120ms var(--ease),transform 80ms var(--ease)}
.btn:hover{background:var(--chip)}
.btn:active{transform:scale(.97)}
.btn:focus-visible{outline:2px solid var(--ring);outline-offset:3px}
.btn:disabled,.btn[aria-disabled="true"]{opacity:.4;cursor:not-allowed;pointer-events:none}
.btn.is-loading{opacity:.7;pointer-events:none}
```

## One means of separation per surface

A surface can be set apart from its background by a border, by elevation or by a fill. Use one of them. A border shows
where the surface ends, which suits dense interfaces, tables and forms. Elevation shows that something floats above the
page, which suits sheets, popovers and menus. A fill shows that something belongs together, which suits sections and
sidebars. A card with a border, a shadow and a distinct fill all at once states its edge three times, and that is the
usual reason a screen feels heavy.

Kleinefy leans on hairlines (`--hair`, `--border`) and surface steps. A nested surface changes strategy instead of
repeating it, so a bordered panel holds rows separated by space or a fill step, not more borders. Beyond two levels of
visible nesting, flatten the structure.

Opacity communicates state, as in disabled, loading or dragging. It never tints a colour. A tint is a real token in both
modes, because a translucent colour has no fixed value and its contrast cannot be checked. Never set `opacity` on an
element whose background already has alpha. The glass panels are the deliberate exception, and text on glass needs a
contrast guarantee that holds against the worst backdrop.

## Status colour

| Meaning | Colour | Always means |
|---|---|---|
| Error, destructive | Red | Something failed, or this cannot be undone |
| Warning | Amber | The reader must act before continuing |
| Success | Green | Done, or healthy |
| Neutral | `--muted-fg` | Pending, waiting, inactive, nothing to act on |

Each colour means one thing everywhere. Brass is the brand accent, not a status, so do not use it for warnings. When in
doubt, use neutral. A neutral state is better than a misused colour. Never signal status by colour alone. Pair it with
text, and with an icon or shape where that helps.

An error says what happened, why if the cause is known and useful, and what to do next. Transient failures get a retry.
A validation error sits next to its field. Destructive actions are confirmed, and the confirmation states the consequence
before the reader acts ("Delete this project and its 12 files? This cannot be undone.").
