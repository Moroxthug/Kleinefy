# Launch notes

## Booking
`assets/site.js` starts with `KLEINEFY = { bookingUrl, formEndpoint, email }`.

Set `bookingUrl` to a Cal.com or Calendly event link (for example `https://cal.com/kleinefy/intro`) and every
"Book a call" opens that calendar inside the sheet, themed light or dark to match the page.

Leave it empty and the sheet shows a short form. Set `formEndpoint` to a Formspree, Basin or own route and the form
posts JSON `{name, email, company, idea, when, page}`. Leave that empty too and the form opens the visitor's mail app
with everything filled in, addressed to `email`.

## Pages
`index.html` is the home. `work/alimun.html`, `work/quoteai.html`, `work/prevai.html` are the cases; they share
`assets/site.css` and `assets/site.js`. Screens live in `assets/` as WebP; recapture them when the products change.

## Before going live
Confirm the domain and `hello@kleinefy.com`. Add a favicon and an Open Graph image at `assets/og.png`
(1200×630) and point the `og:image` tags at it. Add `sitemap.xml` and `robots.txt`. Connect Search Console and a
privacy-respecting analytics (Plausible or Umami). Host on Vercel or Cloudflare Pages with the repository as source.

## Product clips
`assets/{alimun,quoteai,prevai}.mp4` and `.webm` are scripted scroll-throughs of the live sites, recorded headless at
1440×900, 24fps, 22 seconds, no audio. Re-record with `scratchpad/record.js` (Playwright + ffmpeg) after a product
changes its homepage. They play muted in the stage cards, the case heroes and the Work menu preview, fetch nothing
until near the screen, and pause off screen, in a hidden tab, and under reduced motion.
