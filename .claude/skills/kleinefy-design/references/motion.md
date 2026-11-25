# Motion

The techniques that make a page feel built rather than assembled, with the numbers to use. Everything here is
hand-written CSS and JavaScript in the Kleinefy tokens. No GSAP, Lenis, Three.js or other library is needed. Each
technique says where it came from; NOTICE.md has the licences.

The look comes from restraint applied precisely. That means one authored entrance, strong curves, type that rises out
of its own line, media that wipes into place, stages that hold while the reader scrolls, and hovers that follow the
pointer. It does not come from moving everything, from idle loops, or from effects that run without the reader.

## Curves and durations

| Token | Value | Use |
|---|---|---|
| `--out` | `cubic-bezier(.23,1,.32,1)` | Interface feedback, hovers, menus |
| `--expo` | `cubic-bezier(.16,1,.3,1)` | Entrances, reveals, anything arriving |
| `--io` | `cubic-bezier(.77,0,.175,1)` | Wipes and clip-path reveals that travel across a box |
| `--ease` | from `site.css` | Existing site motion |

Never use ease-in for something arriving. Press feedback takes 100–160ms. Hovers take 150–250ms. Menus and dropdowns take
150–250ms. Sheets and drawers take 200–500ms. Focal entrances and reveals take 0.6–1.2s. Exits run at about 70% of the
entrance and leave together, with no reverse stagger. Use the numbers in this table rather than mixing timing systems
from other skills. Sources: Emil Kowalski's `animate` and `choreograph` skills; Impeccable's `animate.md`.

## The entrance

There is one entrance, for the opening screen only, and it is over in about 1.5 seconds. Each element gets a role and
its own timing rather than a uniform delay.

| Role | Starts | Duration | Travel |
|---|---|---|---|
| Headline, by word inside its line mask | 0ms, 35–45ms apart | 0.9–1.1s `--expo` | translateY 105–110% to 0 |
| Supporting line | about 350ms | 0.8s `--expo` | 12–18px rise and fade |
| Actions | about 470ms | 0.8s `--expo` | 8–12px rise and fade |
| Hero visual | about 550ms | 1–1.3s `--expo` | clip-path or rise, decoration fades only |

The hidden starting state lives only behind the `motion` class, so the page is complete at rest without script or under
reduced motion. Sources: Emil Kowalski `choreograph`; juliobsz `engine.md`; Motionsites `craft.md`.

## Text

A masked line rise wraps each word or line in an element with `overflow: clip` and moves the inner span from
translateY 105–110% to 0. Lines take 1.2s with 80ms between them, words 1.1s with 35ms, and characters 0.9s with 18ms. Use
it for headings, never for body copy. Put the full text in `aria-label` on the heading and mark the pieces
`aria-hidden`. Source: juliobsz `engine.md`.

Scroll-lit text sets every word of one statement paragraph to opacity 0.15 and lights each word as the paragraph moves
through the reader's view. Progress runs from the paragraph's top at 80% of the viewport to its bottom at 20%, and each
word lights across its own window of about `[i/N - 0.1, i/N + 0.05]`. Use it once per page, on a sentence worth
reading slowly. Source: Motionsites `type-and-text-motion` §10.

A letter roll on a link or button stacks an `aria-hidden` copy of the label below the original inside a clipped box. On
hover both move up by 105%, letter by letter, over 0.5s `cubic-bezier(.165,.84,.44,1)` with 20ms between letters.
Source: juliobsz `motion.md`.

## Media

A clip-path reveal moves `inset(100% 0 0 0)` (or `inset(0 0 100% 0)`) to `inset(0)` over 1–1.2s on `--io`, while the
image inside eases from scale 1.12–1.15 to 1. It fires once, when the media enters the view. Sources: Emil Kowalski
`RECIPES.md`; juliobsz `engine.md`.

Product visuals are sharp screenshots of the live product. A tour is a sticky browser frame whose screen changes as the
reader scrolls the points beside it. A screen change crossfades with a short rise or a `--io` wipe, never a video.

## Scroll stages

A sticky stage is a tall section, 160–200svh on desktop and about 150svh on phones, holding a `position: sticky` stage
of 100svh. One `requestAnimationFrame` loop reads the section's progress from its bounding box, writes it to a CSS custom
property, and lets CSS own the transforms. The loop runs only while the section is on screen, and the IntersectionObserver
stops it otherwise. Under reduced motion, show the final state. Sources: juliobsz `patterns.md` §2; Motionsites
`scroll.md` §2.

A horizontal track pins a section and moves its row of panels by `translateX(-progress * (scrollWidth - clientWidth))`
with linear mapping. The section is as tall as the track is wide plus one viewport. Below 960px it becomes a normal
vertical list. Source: GSAP ScrollTrigger skill, rebuilt with sticky positioning.

A media window that expands to the stage scales a framed screenshot from its card size to the full stage as the section
progresses. Its radius and border fade toward the end. Source: oil-motion pattern 03.

Scroll-driven CSS, `animation-timeline: view()` with `animation-range: entry 10% cover 40%`, can replace the observer
where supported. Keep it inside `@supports (animation-timeline: view())` and make the finished state the default.
Source: auteur `scroll-cinema.md`; genjutsu `css-native`.

## Pointer

Pointer motion uses a frame-rate-independent follow, `x += (target - x) * (1 - Math.exp(-k * dt))` with k about 10–14,
so it feels the same at 60Hz and 120Hz. Input events only set targets. One rAF loop writes once per frame and stops when
it settles or leaves the screen. Sources: feitangyuan motion-web `handfeel.md` (an idea only, since that repo is CC BY-NC);
oil-motion runtime.

A magnetic action has a zone of its box plus 40–80px. It moves a third of the pointer's offset, tracks over about 0.3s and
releases over 0.6s `--expo`. Use it on one or two main actions, not on every button. Source: Motionsites
`depth-and-interaction` §2.

A button fill from the pointer's entry point grows a `clip-path: circle()` from the point where the pointer entered,
from 0% to 150% over 0.5–0.6s, and shrinks back toward the exit point. Source: juliobsz `motion.md`.

A hover tilt leans a card or stack 2–6 degrees toward the pointer through a spring and settles to rest when the pointer
leaves.

Gate all hover motion inside `@media (hover: hover) and (pointer: fine)`. Move a child of the hovered element, not the
element itself, so the edge does not flicker. Source: Emil Kowalski `STANDARDS.md`.

## Built, not assembled

Theme the browser's own surfaces: `::selection` in brass, `caret-color`, focus rings in `--ring`, `text-underline-offset`,
`accent-color`, and thin scrollbars in the grey scale. Use `text-wrap: balance` on headings and `pretty` on body text, and
`font-variant-numeric: tabular-nums` wherever figures line up. Display tracking sits between -0.02em and -0.045em, with
display line-height about 1.0–1.05. Source: Impeccable `craft-floor.md` and `typeset.md`.

## WebGL

Three.js is allowed for WebGL scenes, from `assets/vendor/three` at the pinned version there, imported as an ES module
only on pages that have a scene. A scene earns its place by showing something real, such as the products' own screens,
in a way a flat page cannot. It is never ambient decoration.

The HTML version of the content is always in the page, and the scene replaces it only after WebGL starts, so reduced
motion and browsers without WebGL keep the HTML. The loop renders only while the scene is on screen and the tab is
visible, stops when every value has settled, and restarts on scroll, pointer or resize. Cap the device pixel ratio at 2
on desktop and 1.5 on phones. Textures use `SRGBColorSpace` and shaders end with `#include <colorspace_fragment>`.
Colours come from the page tokens through `getComputedStyle` and are refreshed when the theme changes. Hover is found by
raycasting, and shader effects stay small: a zoom of about 0.06, an RGB split of about 0.004, a mouse lerp of about 0.08
and a hover tween of about 0.9s on `--expo` (juliobsz `webgl.md`). Dragging uses pointer events with
`touch-action: pan-y` so the page still scrolls vertically on phones. Every clickable object in a scene also has a real
link in the HTML.

## Not used

Some effects stay out: smooth-scroll hijacking such as Lenis, idle loops and autonomous "alive" motion, blinking or
glancing cursors, pulsing dots, a loader in front of the content, difference-blend fixed UI (it destroys the brass), grain
overlays, glows, AI-generated product footage, and WebGL used as decoration.
