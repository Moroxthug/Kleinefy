# Component libraries in the same spirit as poulo.site

A working reference for future Kleinefy sites. Everything here is React + Tailwind unless noted, and most of it is
copy-the-source rather than install-a-package, which is how we want it: the code lives in our repo and we can
rewrite it. Licences are noted where the site states one; check before shipping client work.

## The original

**Poulo component library** — https://components.poulo.site · npm `@poulo2/ai-components` · zinc palette, system font,
SF-style restraint. Weather Sky, Aurora, Light Rays, Vapor Text, Text Scramble, Morph-in Text, Handwritten Quote,
Floating Nav, Expandable Action Bar, Section Rail, Metallic Link, Expanding Arrow Button, Theme Toggle (circle reveal),
Cylinder Carousel, Infinite Masonry, Pixel Reveal, Reveal Image, Hover Accordion, Frame Rule, Progressive Blur,
Project Showcase, Footer, ASCII Art. Every page has Preview, Usage, Props and full source (Code tab).

## Registries and large collections

**21st.dev** — https://21st.dev · A community registry built around the shadcn CLI. Many authors, many styles; browsing
is free, copies are rationed without a membership. Useful as a search engine for a specific pattern (glass dock,
toolbar expandable, dock morph, theme toggle). Licence varies per author; the page says which.

**React Bits** — https://reactbits.dev · 110+ components, mostly CSS with GSAP / Three.js only where needed.
Closest equivalents to Poulo: Dock (magnifying glass dock), DecryptedText and SplitText (scramble and letter reveals),
Aurora, LightRays, Particles, Dither and Noise backgrounds, GlassSurface, ScrollReveal, Masonry, Carousel. MIT.

**Magic UI** — https://magicui.design · 150+ components in Tailwind + Motion, built to sit next to shadcn/ui. Dock,
Text Reveal, Word Rotate, Blur Fade, Border Beam, Shine Border, Marquee, Globe, Meteors, Animated Beam (wiring diagrams),
Bento Grid. MIT.

**Aceternity UI** — https://ui.aceternity.com · The showpiece library (Framer Motion). Floating Navbar, Floating Dock,
Text Generate Effect, Aurora Background, Background Beams, Lamp, Spotlight, Sparkles, 3D Card, Hero Parallax, Macbook
Scroll, Sticky Scroll Reveal, Tracing Beam. Free components MIT; Pro blocks paid.

**Motion Primitives** — https://motion-primitives.com · Julien Thibeaut. Composable primitives in Motion rather than
finished sections: Toolbar Expandable (Poulo's action bar), Text Scramble, Text Morph, Text Shimmer, Text Loop
(Poulo's vapor text, plainer), Dock, Cursor, Progressive Blur, Tilt, In View, Animated Number, Dialog, Morphing Dialog,
Disclosure (hover accordion). MIT.

**Fancy Components** — https://fancycomponents.dev · Daniel Petho. Typography-led and playful: Scramble Hover,
Scramble In, Letter Swap, Variable Font Hover, Typewriter, Vertical Cut Reveal, Text Rotate, Marquee Along SVG Path,
Gravity, Elastic Line, Pixel Trail, Screensaver, Stacking Cards, Circling Elements, Float. MIT.

**Cult UI** — https://cult-ui.com · Fewer, more opinionated pieces: Dynamic Island, Texture Card, Shift Card,
Family Button, Direction Aware Tabs, Text Animate, Popover Form, Side Panel, Bg Media, Dock. MIT.

**Origin UI** — https://originui.com · 500+ shadcn-styled primitives (inputs, selects, tables, dialogs) with little
motion; the calm counterpart to the above for the forms and app screens inside a product. MIT.

**Kibo UI** — https://kibo-ui.com · Hayden Bleasel. Composable shadcn blocks: Gantt, Kanban, Calendar, Code Block,
Announcement, Banner, Marquee, Theme Switcher, Dropzone, Editor. Good for CRM and ERP interfaces. MIT.

**Animata** — https://animata.design · Hand-crafted interaction snippets in categories (Text, Card, Background,
Bento, Button, Widget, Skeleton). MIT.

**Skiper UI** — https://skiper-ui.com · Theme toggles with view-transition reveals, image trails, scroll-driven
text, carousels. Free and paid tiers; check each.

**Uiverse** — https://uiverse.io · Thousands of CSS/Tailwind snippets (buttons, loaders, toggles). Mixed quality,
MIT. Good for a single detail, not a system.

## Backgrounds and shaders

**Paper Shaders** — https://shaders.paper.design · npm `@paper-design/shaders-react` · GPU shaders as React
components: Mesh Gradient, Grain Gradient, Dithering, Image Dithering, Dot Grid, Metaballs, Warp, Water, Smoke Ring,
Liquid Metal, Pulsing Border, Static Mesh. The closest thing to Poulo's liquid-metal and dither looks. MIT.

**Shader Gradient** — https://shadergradient.co · npm `@shader-gradient/react` · Aurora-style gradients with grain
post-processing, configured in a visual editor. Free for most use; see licence.

**OGL / Three.js / R3F** — https://github.com/oframe/ogl · https://threejs.org · https://r3f.docs.pmnd.rs · When a
shader has to be ours. OGL is tiny and what React Bits uses for Aurora and LightRays.

**Codrops (Tympanus)** — https://tympanus.net/codrops · Not a library, a weekly archive of effect demos with source:
scroll-driven image sequences, text reveals, distortion, page transitions. Source is MIT unless stated; the
design is theirs, so rebuild rather than lift.

## Motion engines and helpers

**Motion** — https://motion.dev · Formerly Framer Motion. Springs, layout animation, in-view, scroll progress.
**GSAP** — https://gsap.com · Now free for all use including ScrollTrigger, SplitText, Flip, MorphSVG.
**Lenis** — https://lenis.darkroom.engineering · Smooth scroll that stays native-feeling.
**View Transitions API** — https://developer.chrome.com/docs/web-platform/view-transitions · What Poulo's theme toggle
uses for the circle reveal; no library needed.

## Map from Poulo's element to the nearest ready-made

| Poulo element | Nearest equivalents |
| --- | --- |
| Floating Nav / Expandable Action Bar | Motion Primitives Toolbar Expandable; Aceternity Floating Dock; Magic UI Dock; React Bits Dock |
| Metallic Link | Paper Shaders Liquid Metal / Pulsing Border; Magic UI Shine Border; Aceternity Moving Border |
| Expanding Arrow Button | Cult UI Family Button; Aceternity Hover Border Gradient; write it in CSS (ours is 40 lines) |
| Theme Toggle, circle reveal | Skiper UI theme toggles; Motion Primitives Theme Toggle; View Transitions API directly |
| Vapor Text / Text Scramble / Morph-in | Fancy Components Scramble Hover, Text Rotate, Vertical Cut Reveal; Motion Primitives Text Scramble, Text Loop, Text Morph; React Bits DecryptedText, SplitText, BlurText |
| Handwritten Quote | None ready-made; SVG stroke-dashoffset or clip-path per word with a handwriting font (ours) |
| Weather Sky / Aurora / Light Rays | React Bits Aurora, LightRays, Particles; Paper Shaders Mesh Gradient, Smoke Ring; Shader Gradient; Aceternity Aurora Background |
| Progressive Blur | Motion Primitives Progressive Blur; stacked backdrop-filter layers (ours) |
| Section Rail | None ready-made; IntersectionObserver with rootMargin -30% 0 -60% (ours) |
| Pixel Reveal / Reveal Image | Paper Shaders Image Dithering; Magic UI Blur Fade; React Bits Dither + PixelTransition |
| Cylinder Carousel | React Bits Carousel / CircularGallery; Fancy Components Circling Elements; Aceternity 3D Marquee |
| Infinite Masonry | React Bits Masonry; Motion Primitives Infinite Slider |
| Hover Accordion | Motion Primitives Disclosure; Cult UI Direction Aware Tabs |
| Frame Rule | Pure CSS (ours) |
| Project Showcase / Highlight cards | Magic UI Bento Grid + Magic Card; Aceternity Hero Parallax; Cult UI Texture Card |
| Footer wordmark, scramble links | Fancy Components Scramble Hover; Magic UI Marquee for a strip |
| ASCII Art hands | React Bits ASCIIText; Paper Shaders Image Dithering as a stand-in |

## How we use them

Copy the source into `components/` and rewrite it into our tokens and our names. Keep the author's licence header.
Never ship a demo's palette or copy. One motion engine per site, Motion or GSAP, not both. Every effect pauses off
screen, in a hidden tab, and with `prefers-reduced-motion`; if a borrowed component does not, we add it.
