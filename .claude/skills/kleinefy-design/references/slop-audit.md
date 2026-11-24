# Slop audit

Go through every group and record each sign you find, along with where it is. Each row pairs a sign with its Kleinefy
fix. When a fix here differs from the upstream list, the house rules in SKILL.md and CLAUDE.md decided it.

Adapted from "Signs of slop" in unslop by Damir Sokolovsky (@heydamir), CC BY 4.0,
https://github.com/heydamir/unslop. Kleinefy changes: the fixes were rewritten for the Kleinefy tokens, the system type
face and 600-weight headings. "Plausible numbers" became "real numbers or nothing". Motion on load was removed entirely.
The right-to-left group was dropped because no Kleinefy page uses it yet. Rows were added for eyebrows, numbered pillars
and status badges.

## Surfaces and colour

| Sign | Fix |
|---|---|
| Gradients on backgrounds, cards, buttons or the active nav item | Use one flat surface token and keep brass for where it means something |
| Gradient text in headings, numbers or the logo | Use solid `--fg` |
| Coloured glows, glowing pills, drop-shadow on icons | Remove them and get depth from surface steps and `--hair` |
| Radial washes, aurora, blurred blobs behind content | Remove them |
| Visible grid or dot-grid background | Remove it |
| Neon or heavy coloured borders | Use a `--hair` or `--border` hairline |
| Several near-identical greys for text | Use the two text roles, `--fg` and `--muted-fg` |
| Accent on everything, so nothing stands out | Keep brass once or twice per screen |
| Raw hex or `rgba(brand, .1)` tints in a component | Use a token, and add one to both modes in `site.css` if needed |

## Type

| Sign | Fix |
|---|---|
| An imported webfont, or a second display family | Use the system stack in `--sans` |
| Headings at 800 or 900 | Use 600 and size for hierarchy |
| Uppercase tracked-out labels, or eyebrows above headings | Remove them, or use sentence case at body tracking if the label carries information |
| One word in italic serif, another colour or a gradient | Set the whole headline the same |
| Too many sizes and weights on one screen | Use a few steps from the scale |
| Numbers in mixed formats side by side | Use one format and `font-variant-numeric: tabular-nums` |
| Italic used for emphasis in interface text | Use weight or position instead |
| A monospace face used for small labels as decoration | Use `--sans`, keeping mono for code and data |

## Icons

| Sign | Fix |
|---|---|
| Emoji anywhere: nav, labels, status, counts, copy, commits | Use one line icon drawn as inline SVG, or nothing |
| A sparkle for anything AI | Remove it |
| Icons in many sizes, strokes and colours | Use one size, one stroke and the text colour |
| Icons off the column | Use the same icon box width in every row |

## Spacing and layout

| Sign | Fix |
|---|---|
| Arbitrary values such as 13px or 31px | Use steps on a 4px scale |
| Rows in one list with different heights or gaps | Use one height and one gap |
| Groups closer to their neighbours than to their own items | Use smaller gaps inside groups and larger ones between them |
| Uneven padding in sibling cards | Use one padding |
| Content chopped into identical rounded cards with the same soft shadow | Drop the cards and let space and hairlines group the content |
| One radius on everything regardless of size | Set the radius by size, so a nested radius equals the outer radius minus the padding |
| Everything stacked and centred | Use a left-aligned column or a split with the real product view |

## Copy

| Sign | Fix |
|---|---|
| Hype words: supercharge, seamless, unlock, magic, leverage, streamline, robust | Say what the thing does |
| A headline that could fit any product | Use this product's own nouns |
| Exclamation marks | Use a plain statement |
| A change without a reference, such as "+12%" | Give the reference, or drop the figure |
| Trailing periods on labels and buttons | Remove them |
| Any figure, name, quote or date not taken from the live product | Remove it and tell the user what is missing |
| "Submit", "OK", "Click here" | Use the verb for what happens |

## Components

| Sign | Fix |
|---|---|
| "New", "Beta", "Live", "Soon", "Pro" or "AI-powered" badges | Remove them, since the link proves something is live |
| A pill badge above the hero headline | Remove it |
| Every element a full pill | Set the radius by size |
| A stat band, logo wall, star row, avatar row or "Trusted by 10,000+" | Remove it |
| Testimonials | Remove them unless the user supplies the real, attributed text |
| Numbered "01 / 02 / 03" pillars on content that is not a sequence | Remove the numbers |
| Feature cards with an icon, a bold title and a vague line each | Use fewer features and concrete prose |
| Three or more buttons together | Use one primary action and at most one secondary action |
| Sparklines or mini bars on every stat | Show the number, its label and its reference |
| A chart in rainbow colours | Use neutral steps with brass on the one series that matters |

## Visuals

| Sign | Fix |
|---|---|
| 3D blobs, orbs, chrome shapes, nebulae, robots, circuit lines | Use the product itself |
| Invented dashboards or a "terminal" printing marketing copy | Use a real screenshot or real output |
| Text, buttons or a logo baked into an image | Put real text in the page |
| An image with a hard edge and a different black from the page | Match it to `--bg`, or set it on `--secondary` as a plate |
| A visual in every section | Use one visual where it helps |

## Motion

| Sign | Fix |
|---|---|
| Anything that animates on page load beyond the opening screen's one entrance, or an entrance over about 1.5 seconds | Keep one short entrance for the hero and let the rest wait for the reader |
| Identical fade-and-rise on every element at once | Stagger siblings and keep reveals for blocks that enter the screen |
| Screen recordings that play by themselves | Use sharp screenshots in a sticky frame that changes as the reader scrolls |
| Pulse, ping or breathing glow on something that is not live | Make it static |
| A loop that keeps running off screen | Pause it with an IntersectionObserver |
| Missing `prefers-reduced-motion` handling | Make everything rest under reduce |
| `transition: all`, or hover scale on cards | Transition the named properties and change surface by one step |
| Springs, overshoot, free-running parallax, smooth-scroll hijacking | Use the house curves and native scrolling |
| Animating width, height, top or left | Animate transform and opacity |
| An effect library pulled in | Write it by hand in our tokens |

## Template look

These are not mistakes in themselves. They are what a page falls back to when nobody made a decision, so check for them
last.

| Sign | Fix |
|---|---|
| A tinted near-black page with white text and the accent on one button, on a product whose world is warm | Check whether the product's own screens suggest a reason to differ, and if they do, say so before changing tokens |
| A hero visual that is an empty box or a generic picture | Use the product's real screen or recording |
| A headline that would still work with another product's name swapped in | Rewrite it with this product's nouns |
| Meta strings joined with middle dots, or an arrow appended to every link | Remove them unless they carry information |
