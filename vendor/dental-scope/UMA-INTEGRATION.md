# Dental Scope in UMA

Upstream: https://github.com/Yoosseph/dental-scope
Revision: 422409c5b5cff384e4560f4ba3e14dea783bddea
Imported: 2026-10-05

The UMA Odontología tab hosts this application locally in an iframe to keep its
viewer, styles, routes and dependencies separate from the existing organ atlas.
The viewer is fixed to Spanish, ignoring legacy language preferences and URL overrides.
Language controls, the viewer heading and its author subline are removed; attribution remains
in the footer, information page and license files. All dental models
are included locally, including the 32 tooth models and their internal layers.

UMA modifications: pink theme overrides, removal of the viewer heading,
Spanish HTML shell and canvas accessibility label, host loading/error messages,
React and Three.js versions aligned with the host, removal of Vercel analytics,
and a build output directed to
`public/dental/`. The upstream anatomy, educational content, review status, source
citations and license notices are retained. No new anatomical claims were added.
Asset-generation tooling is not included; consult the pinned upstream revision
for that pipeline. Source code remains under MIT, models retain the licenses
specified in CREDITS.md and docs/assets.md, and educational text remains CC BY-SA 4.0.

Run `npm ci` from the UMA project root to install both workspaces. `npm run dev`,
`npm run build` and `npm run build:next` build the dental app automatically.
`npm run build:dental` rebuilds it after editing this source. `npm run test:dental`
runs the upstream dental unit tests. Do not edit the generated `public/dental/`
or `dist/client/dental/` directories.
