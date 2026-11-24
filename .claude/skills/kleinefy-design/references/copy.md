# Copy

Adapted from the taste-ux-copy skill in design-taste, Copyright (c) 2026 Mustafa, MIT,
https://github.com/madebymustafa/design-taste, and from the writing section of Anthropic's frontend-design skill,
Apache-2.0, https://github.com/anthropics/skills. Kleinefy changes: the conversion headline formulas and the
"tiny win" timing line in empty states were removed, because they invite invented numbers.

Words on a page exist to make it easier to understand and use. Decide what the page has to say, then say it in plain
verbs, sentence case and the reader's vocabulary. Name a thing by what the reader does with it, not by how the system is
built. A reader manages notifications, not webhook config. Describe what something is and does instead of selling it.
Being specific and legible is better than being clever.

Be concrete ("42 rows", not "some data") and honest. Avoid "just", "simply" and "easily", because they insult the
reader's situation. Use no exclamation marks. Do not use filler such as leverage, streamline, robust, seamless, unlock,
supercharge or cutting-edge. Write in prose on pages and in replies, and use a table when the content really is data.

A headline carries one idea in about twelve words or fewer, in this product's own nouns. Do not open with "The future of
X". A headline that still works when another product's name is swapped in has not been written yet.

A button says what happens, so "Save changes" rather than "Submit", and "Delete project" rather than "OK". An action
keeps its name through the whole flow, so the button that says "Publish" leads to a confirmation that says "Published".
A loading label describes what is happening ("Saving"). It does not promise anything ("Almost done"). An icon-only
button has an accessible name.

An error has three parts in order: what happened, why in one clause, and the fix as a verb or a link. Errors do not
apologise, blame the reader or stay vague. Field errors sit beside their field rather than in a toast across the screen.

An empty state names the emptiness, says in one line why it is empty, and offers the one next action. An empty screen
with no way forward is a dead end.

Completion says what changed ("8 files uploaded to Reports"), not only "Done". Notifications stay under about twenty
words.

Write for translation. Do not nest variables mid-sentence or rely on idioms, and spell out dates wherever the order could
be read two ways. Never use emoji, including in commit messages and replies.
