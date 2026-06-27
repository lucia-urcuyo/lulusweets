# Lulusweets Agent Decision Log

## 2026-06-27 - Use GitHub Pages for static PWA deployment

Decision:
Deploy the generated static PWA with GitHub Pages from a GitHub Actions workflow. The workflow builds
the project with `npm run check`, uploads `dist/`, and publishes that artifact to Pages on pushes to
`main`.

Reason:
The app is already a static PWA generated into `dist/`, so GitHub Pages is the smallest hosting setup:
no server, database, or extra deployment service.

Implications:
Recipe/content changes become: edit Markdown, commit, push, GitHub builds, GitHub Pages publishes.
The first GitHub-side run and phone install/update behavior still need verification.

Status:
Applied. GitHub Pages is enabled for the repo, the workflow deploys successfully, and hosted smoke
passes at `https://lucia-urcuyo.github.io/lulusweets/`.

## 2026-06-27 - Add Ginger Molasses Chewy Cookies

Decision:
Add `Ginger Molasses Chewy Cookies` as a new Cookies recipe in the canonical vault, using the
user-provided ingredient list and shorter Lulusweets-style instructions.

Reason:
Lucia provided a new recipe to add to the cookbook and asked for the instructions to be shorter and
consistent with the existing recipe style.

Implications:
The canonical vault now has 99 recipes. Validation and smoke-test expectations were updated from 98
to 99 recipes.

Status:
Applied. `npm run check` and `npm run smoke` pass.

## 2026-06-27 - Add missing crust and choux component links

Decision:
Add component wikilinks from New York Style Cheesecake to Graham Cracker Crust, from Caramel Eclairs
and Pumpkin Spice Eclairs to Pate a Choux, and from composed tart recipes to Tart Crust.

Reason:
These recipes already referenced the components in plain language. Linking them makes Obsidian
backlinks and the generated PWA relationship graph reflect the actual recipe structure.

Implications:
Relationship count increases from 87 to 94 with no unresolved links.

Status:
Applied. `npm run check` passes.

## 2026-06-27 - Split buttercream categories and simplify American buttercream names

Decision:
Replace the former `Frostings` recipe category with `American Buttercreams` plus a new `Buttercream
Variations` category. Move Swiss Meringue Buttercream, Ermine Buttercream, and French Buttercream into
`Buttercream Variations`. Keep the remaining buttercream recipes under `American Buttercreams` and
remove the trailing `Buttercream` word from their recipe titles. Also remove the search helper hint and
hide the browser-native search cancel control so the search field does not show two clear buttons.

Reason:
Lucia requested clearer buttercream organization and cleaner recipe names inside the American
Buttercreams category. The duplicate search clear affordance came from the native `type="search"`
cancel button showing next to the app's own clear button.

Implications:
The canonical vault now has 15 categories instead of 14. Wikilinks were retargeted to the shortened
American buttercream titles, and the generated PWA category order/test expectations were updated.
Phase 3 remains open until Lucia approves the final visual/search direction.

Status:
Applied. `npm run check` and `npm run smoke` pass.

## 2026-06-27 - Phase 3 Wave 3 sharpens active search and recipe reading

Decision:
Add focused Phase 3 interaction polish without starting final PWA/release work: active search summaries,
category counts in filter chips, clearer match labels on recipe cards, category-grid collapse while a
search/filter is active, and recipe-page jump chips for Ingredients, Instructions, Pairings, and
Related sections.

Reason:
The visual shell was improved, but the active workflows still needed to feel easier: search results
should appear immediately after typing, matches should explain why a recipe was returned, and mobile
recipe pages should provide quick section navigation while cooking.

Implications:
Wave 3 improves the current exploratory PWA's reviewability and everyday ergonomics. Phase 3 remains
open until Lucia approves the visual/search direction. No watcher, image copying, hosting,
deployment, release hardening, or recipe source migration work was started.

Status:
Applied. `npm run check`, `npm run smoke`, Chrome layout diagnostics, and recipe jump-button scroll
checks pass.

## 2026-06-27 - Remove invented initials and use real logo install icons

Decision:
Remove the visible `Ck`/`Cp`/similar monogram boxes from category cards, recipe cards, recipe pages,
and related recipe cards. Use real category labels, recipe names, metadata, and color strips instead.
Simplify the header logo by removing the extra black CSS ring, make the logo larger, and generate PNG
PWA icons from `logo.jpg` for the manifest, favicon, Apple touch icon, and service-worker asset list.
A follow-up fix creates `site/logo-mark.png`, a tighter PNG crop of the original logo, and uses it for
the header plus regenerated install icons. The crop was then re-centered after Lucia spotted that the
first tight crop was still optically high/off-center.

Reason:
Lucia found the invented initials confusing and did not like the black circle treatment around the
logo. The smallest correct design change is to remove the artificial shorthand and make the real logo
carry the brand signal, including when the PWA is installed. The full `logo.jpg` source is a tall image
with substantial white padding, which made the header logo appear small and softer when downscaled.
The visible logo mark also needs centered artwork bounds, not only a tighter crop.

Implications:
The current exploratory PWA is clearer and closer to Lucia's preference, but Phase 3 remains open
until Lucia approves the visual/search direction. This does not start watcher, hosting, deployment,
image-copying, or final release hardening work.

Status:
Applied. `npm run check`, `npm run smoke`, and Chrome layout diagnostics pass.

## 2026-06-26 - Phase 3 wave 2 strengthens logo-derived visual/search polish

Decision:
Continue Phase 3 with focused header/logo treatment, logo-derived brand accents, recipe-card metadata,
search/filter state polish, and recipe-page reading accents. Keep this as exploratory Phase 3 design
work and do not start Phase 4 release hardening, hosting, watcher, image-copying, or deployment work.

Reason:
After wave 1 fixed mobile layout correctness, the remaining design risk was that the PWA still felt
clean but not distinctively Lulusweets. The logo supports stronger use of circular badge treatment,
black outline, frosting pink/lilac, warm custard, cherry accent, and pastel blue.

Implications:
The PWA is visually closer to the logo and ready for another Lucia review pass. The Phase 3 approval
gate is still open until Lucia approves the visual brief, core screens, and search behavior.

Status:
Applied. `npm run check` and `npm run smoke` pass.

## 2026-06-26 - Phase 3 wave 1 is CSS-only mobile overflow containment

Decision:
Fix the approved Phase 3 wave 1 mobile clipping issue with targeted CSS containment, shrink rules,
mobile title sizing, and local scroll wrappers. Do not redesign brand colors/header treatment, change
components, add dependencies, or alter the final PWA/release pipeline in this wave.

Reason:
Lucia approved only the horizontal overflow/clipping fix. The smallest correct implementation is in
`site/styles.css`; the app already has the necessary semantic structure and table wrappers.

Implications:
Future Phase 3 work can evaluate header/logo treatment and brand accents separately. Ingredient
tables may still scroll horizontally inside `.table-scroll` on mobile, but they should no longer widen
the whole page.

Status:
Applied and validated with `npm run check` plus Chrome layout diagnostics.

## 2026-06-26 - Repo-local context is first for coding-agent work

Decision:
Use `AGENTS.md` and `docs/agent-context/` as the first source of truth for coding-agent work in this
repo.

Reason:
Coding agents need concise, local, current operating context without rereading the full Brain on every
task.

Implications:
Brain remains the long-term project memory and should be updated for meaningful changes. If repo docs
and Brain conflict, agents must document the conflict and verify before acting.

Status:
Approved by Lucia and being applied.

## 2026-06-21 - Phase 2 complete; Phase 3 visual/search design in progress

Decision:
The canonical vault is validated and promoted. Phase 3 focuses on Lucia's approval of the logo-derived
visual/search direction before final PWA work.

Reason:
Content parity and source validation must precede final interface implementation.

Implications:
Do not treat the current PWA design as final until Lucia approves it.

Status:
Applied.

## 2026-06-21 - iCloud sync abandoned for the vault

Decision:
Stop using iCloud as the primary Obsidian vault sync path. Keep the vault local and use the PWA for
phone access unless another sync system is chosen later.

Reason:
macOS File Provider limitations prevented reliable upload of Mac-created vault files into Obsidian's
iCloud container.

Implications:
Do not restart iCloud sync work without a new strategy and explicit approval.

Status:
Applied.

## 2026-06-20 - Markdown is canonical; HTML is generated

Decision:
Recipe Markdown and assets are the permanent source of truth. The website is generated and disposable.

Reason:
A single canonical source prevents drift and keeps the cookbook portable.

Implications:
Do not edit generated `dist/` output by hand.

Status:
Applied.

## 2026-06-20 - Use a static PWA as the browsing layer

Decision:
Generate a static PWA from the canonical Markdown recipe files.

Reason:
The cookbook needs polished search, mobile access, installability, and offline use without a backend
or separate recipe database.

Implications:
The build must remain reproducible from the vault, and cache/update behavior must be tested before
release.

Status:
Selected; final implementation waits on Phase 3 approval.
