---
name: kleinefy-design
description: House design rules for Kleinefy pages and products. Use before building, restyling or reviewing any page, section, component, copy or motion in a Kleinefy project, and when the user asks for a design review or a cleanup of something that looks generated.
---

# Kleinefy design

This skill makes CLAUDE.md usable while building. CLAUDE.md wins over everything here, and the reader's own words in the
current request win over both. The references in this folder were adapted from published skills, with their authors'
licences kept in NOTICE.md. Where an upstream rule contradicted the house rules, it was cut, not softened.

## What a Kleinefy page is

A Kleinefy page looks like a working tool, not a pitch. The reference for taste is poulo.site and its component library:
the system type face, one grey scale, one accent and a lot of quiet. Motion only ever answers the reader. The page shows
the real product, the real numbers and the real wording. When something interesting is happening, the product is doing
it, not the decoration.

Make one element the memorable thing on a page and keep everything around it disciplined. Before calling a page
finished, take one thing away.

## Tokens

The live tokens are in `assets/site.css`. Use those custom properties in components and never write raw hex into one.
Dark is the default on `:root`, and light is `.light` or `:root[data-theme="light"]`. When a new token is needed, add it
to both blocks in `site.css` so the two modes stay a pair.

| Role | Token | Notes |
|---|---|---|
| Page and surfaces | `--bg`, `--secondary`, `--muted`, `--card` | One grey scale. A raised surface is one step lighter in dark and one step darker in light. |
| Text | `--fg`, `--muted-fg` | Two text roles. Do not add a third grey for text. |
| Lines | `--hair`, `--border`, `--border-strong` | Warm hairlines carry structure, so reach for one before reaching for a shadow. |
| Accent | `--brass` | The only accent. It is `#b5652d` in light and `#d9a06b` in dark. |
| Focus | `--ring` | Used for `:focus-visible` outlines. |
| Type | `--sans`, `--mono` | `--sans` is the system stack. `--mono` is for code and tabular data only, never for labels. |
| Motion | `--ease` | One curve for interface motion. |

Type is the system face at 16px/24px with letter-spacing -0.02em, and headings are 600. Build hierarchy from size, weight
and space, never from extra families. Do not import a webfont to make a page feel more designed. Keep lines under about
75 characters.

Use the brass accent once or twice per screen, on the thing that matters most there, such as the primary action, the
active item or the single highlighted series. When it appears everywhere it stops pointing at anything.

Dark mode is a second design of the same system, not an inversion. Every token is re-derived for dark, every contrast
pair is checked again in both modes, and the accent keeps its hue. In dark, elevation comes from a lighter surface or an
inset hairline rather than a drop shadow, because a drop shadow on dark reads as a glow. A card is always lighter than
the canvas it sits on. Never use `filter: invert()` on images.

## What never appears

The banned list lives in CLAUDE.md. In practice it covers anything that would look the same on any agency template:

| Category | Banned |
|---|---|
| Icons and labels | Emoji, used anywhere. Status badges such as "New", "Beta", "Live", "Soon" or "AI-powered". Eyebrow labels above headings. Uppercase tracked-out labels. |
| Headlines | One word in a headline set in italic serif, another colour or a gradient. Gradient text of any kind. |
| Backgrounds | Gradient glows, aurora washes, blurred blobs and visible grid backgrounds. |
| Sections | "01 / 02 / 03" numbered pillars, unless the content really is a sequence. Stock stat bands. Logo walls. Testimonials. Star rows. |
| Copy | Hype words: seamless, supercharge, unlock, leverage, streamline, robust, cutting-edge, revolutionize. Exclamation marks. |

Before you add a structural device such as a border, number, label or divider, check that it tells the reader something
about the content. If it only decorates, leave it out.

## Facts

Never invent numbers, testimonials, clients, team members or dates. "Plausible" mock data is not allowed. Use real copy
from the live product or leave the slot out and tell the user in the reply what is missing. Product visuals are the
product: screenshots, recordings and output formats come from the real thing, with its real labels, ordering and
truncation. Never put a "soon" label on something that already ships. See `references/honesty.md`.

## Motion

Motion responds to the reader, through hover, press, focus, pointer movement, scrolling a thing into view, or scroll
position. The one exception is a single entrance sequence for the opening screen on load: the headline, its supporting
line and the hero visual arrive in order, all of it finished in about 1.5 seconds and never repeated. Nothing loops
unless it is live and on screen. Every loop or effect stops when it leaves the viewport, using an IntersectionObserver
as `assets/site.js` already does, and rests under `prefers-reduced-motion: reduce`. The page is complete at rest: a
hidden starting state exists only behind the `motion` class that the page sets when reduced motion is off.

Product visuals are sharp screenshots of the live product, not screen recordings. A product tour is a sticky frame whose
screen changes as the reader scrolls through the points beside it, so the reader sets the pace.

Before adding an animation, you should be able to say in one sentence what it tells the reader. If you can't, delete it.
Animate only `transform`, `opacity` and `filter`, never width, height, top or left. Interface feedback takes 80–150ms on
`--ease`. A press can scale to 0.97–0.98. Hover changes colour or surface by one step rather than scaling a card.
Reveals and entrances use a long out-curve such as `cubic-bezier(.16,1,.3,1)` over 0.8–1.3 seconds. Springs, overshoot
and free-running parallax are not used; scroll-linked movement is fine when it follows the reader's own scrolling.

The effects already ported into `assets/site.js` and `site.css` are the approved vocabulary. They include the sky, the
handwritten quote, the cylinder carousel, the pixel reveal, the theme reveal and the glass panels. A new effect must be
hand-written in our tokens, pause off screen, respect reduced motion and keep the original author's licence notice. Never
install GSAP, Framer Motion, Lenis, Lottie or any other effect library.

## Code

Write HTML, CSS and JavaScript by hand, with no framework, UI kit, Tailwind, CDN script or build step that the project
does not already have. Use semantic elements, so a `<button>` handles actions and an `<a>` handles navigation. Keep CSS
specificity flat so section and component rules do not cancel each other out.

## How to work

Start with a short plan before you write code. Say what the page is for and who reads it, which token roles it uses, what
the one memorable thing is, and where the real content comes from. Then compare the plan with this file and with
`references/slop-audit.md`. If any part of it is the default you would produce for any similar page, change that part
and say why.

Build to a floor without announcing it. The page works at 320px with a 16px gutter and no horizontal scroll. Keyboard
focus is visible. Reduced motion is respected. Contrast passes in both modes. Empty, loading and error states exist.
`references/accessibility.md` and `references/states-and-surfaces.md` hold the details.

Write copy by `references/copy.md`.

When you review, whether on request or before you hand work over, go through `references/slop-audit.md` group by group.
Fix what it finds, then report in prose what you changed and anything you could not fix. If the environment allows
screenshots, take one in each mode at phone and desktop width and look at them.

## References

| File | Use it for |
|---|---|
| `references/slop-audit.md` | Signs that a page looks generated, each with its fix. This is the review pass. |
| `references/states-and-surfaces.md` | Interactive states, focus, surface separation, opacity and status colours. |
| `references/copy.md` | Interface writing: actions, errors, empty states and headlines. |
| `references/honesty.md` | Real content, real product visuals and staging honestly. |
| `references/accessibility.md` | The WCAG 2.2 AA floor and the manual checks. |
| `NOTICE.md` | Sources and licences. Keep it with any copy of this skill. |
