# Product interaction and layout standard

## Hierarchy and adaptable layout

Use reading order to put the primary outcome first, align related controls, group with space before decoration, and progressively disclose secondary details. Compact layouts collapse columns only when the regular layout no longer fits. Interactive targets are at least 44×44 CSS pixels on touch surfaces, keyboard focus remains visible, text scales without clipping, and color is never the only status signal.

## Loading and perceived control

- Under one second: show no loader.
- Short unknown action: show a small indicator beside the action and keep its label specific.
- Known page shape: show a skeleton matching the content; never a blank screen.
- Measurable work: show percentage or named steps.
- Extended work: explain what is happening, preserve state, and offer retry, cancel, or background completion.

Use stale-while-refresh for safe read views. Cache the most recent route and bookmarks locally, label stale/offline data, and refresh when online. Optimistic updates are appropriate for reversible bookmarks and drafts; credentials, admin changes, account deletion, billing, and route publication require server confirmation. Offline writes use an explicit outbox with idempotency keys and visible queued/failed/sent states.

## Motion and feedback

Buttons have pressed, disabled, focus, success, and error states. Tab indicators animate briefly without delaying content. Respect `prefers-reduced-motion`. Motion explains a state change; it does not make the user wait.

## Trust patterns

No preselected marketing consent, fake scarcity, fake reviews, hidden fees, or unsupported accuracy claims. Accept and reject choices have equal visual weight. Forms explain purpose, collect only necessary fields, and separate required acceptance from optional marketing. Images have useful alt text; decorative images are ignored by assistive technology.

