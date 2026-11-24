# Accessibility floor

The target is WCAG 2.2 AA. Adapted from the accessibility checklist in agent-skills, Copyright (c) 2025 Addy Osmani,
MIT, https://github.com/addyosmani/agent-skills. Kleinefy changes: the JSX examples became plain HTML, and the automated
scanners are optional. They run through npx, so ask the user before running them.

## Keyboard and focus

Every interactive element can be reached with Tab, in the same order as it appears on screen. Focus is always visible.
Custom widgets respond to Enter, Space and Escape. Nothing traps focus except an open modal or sheet. A modal holds
focus while open and returns it to the opener when it closes. A skip link to the main content appears at least on
focus. Never use a `tabindex` above 0.

## Structure and names

Each page has one `h1`, and heading levels do not skip. Use landmarks: `header`, `nav` with an `aria-label` when there
is more than one, `main` and `footer`. Images have `alt` text, or `alt=""` when they are decorative. Video has no sound
on autoplay, and it pauses off screen and under reduced motion. Buttons and links say what they do. Icon-only controls
have an `aria-label`. Use `<button>` for actions and `<a href>` for navigation, never a clickable `div`. The `html`
element declares `lang`, and every page has a descriptive `<title>`.

## Forms

Every input has a visible label tied to it. Required fields are marked by more than colour. Errors are specific, sit
next to their field, are linked with `aria-describedby`, and are summarised and focusable on submit. Known fields use
`autocomplete`, for example `type="email" autocomplete="email"`.

## Contrast and colour

| Element | Minimum |
|---|---|
| Body text | 4.5:1 |
| Large text (24px, or 18.67px bold) | 3:1 |
| UI component edges and icons | 3:1 against what is next to them |
| Focus indicator | 3:1, at least 2px |

Check every pair in both modes, and do not round a failing ratio up. Brass on `--bg` needs checking for small text in
each mode. Colour is never the only signal. Text can be resized to 200% without breaking the layout. Nothing flashes
more than three times a second.

## Targets and motion

Touch targets are at least 24 by 24 CSS pixels including spacing, and 44 is better for primary actions on phones.
Under `prefers-reduced-motion: reduce`, everything rests in its final state. `assets/site.css` has the global block, and
new effects add their own overrides to it.

## Live regions

Use `role="status"` (polite) for saved and updated messages, and `role="alert"` (assertive) only for errors that need
attention now. A loading region gets `aria-busy="true"` and a label.

## Checking

Test the page with a keyboard alone and with VoiceOver (Cmd+F5 on macOS). An automated scan finds only a part of the
issues. If the user agrees, these pinned commands can run against a local server:

```bash
npx --yes @axe-core/cli@4.13.0 http://localhost:8000 --exit
```

```bash
npx --yes pa11y@9.1.1 http://localhost:8000
```
