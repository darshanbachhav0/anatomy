# UMA copyright remediation record

Date: 6 November 2026. Original audit baseline: Git revision `f205556886768ebc849964601002423ee3d8959e`.

This is the implementation follow-up to `COPYRIGHT_AUDIT_REPORT.md` and its Word edition. Those original reports have been preserved. The original Markdown SHA-256 remains `9c724aa9f5282ec46cddebc9bb481e0a23b163cfb4fff217fcb3fdd2570a6cd7`.

The user authorized fixes while preserving the website's appearance and functionality. Models, rigs, movements, clinical media, teaching figures, lesson wording and calculation engines have therefore been retained. No permission, ownership or commercial grant has been invented. No commit, push or deployment has been performed.

## Result and readiness

Of the original **24 distinct findings**, **8 have their identified technical/documentation defect corrected**, **3 are partially addressed**, and **13 still require ownership or permission evidence**. This leaves **16 findings not fully cleared**. Corrected notices do not clear the separate underlying asset rights.

| Original severity | Original findings | Technical/documentation defect corrected | Partial | Evidence still required |
| --- | ---: | ---: | ---: | ---: |
| CRITICAL | 2 | 0 | 0 | 2 |
| HIGH | 4 | 0 | 0 | 4 |
| MEDIUM | 9 | 5 | 3 | 1 |
| LOW | 3 | 3 | 0 | 0 |
| UNKNOWN | 6 | 0 | 0 | 6 |
| **Total** | **24** | **8** | **3** | **13** |

**Public UMA deployment and distribution/commercialization of the entire platform remain uncleared on the available evidence.** Successful builds establish technical operation, not copyright permission. The existing website continues working; the separate `npm run check:copyright:release` check intentionally returns an unresolved status. It does not run during normal development or builds.

Verified individual open licenses still support the specific Human Atlas/BodyParts3D and Dental Scope components identified in the original audit, subject to their distinct attribution/share-alike requirements. They do not cover the supplied study atlas, all separate organ models, proprietary EchoSuite code, unknown artwork or institutional marks.

## Changes completed

| Finding | Status | Concrete change and evidence | Remaining boundary |
| --- | --- | --- | --- |
| H03 — inaccessible global Echo credits | Technical defect corrected | Added `public/echo/credits.html`, `credits.js` and `credits.css`. The existing main About link now reaches `public/third-party-notices/index.html`, which links Echo, atlas and dental credits. Existing dynamically generated `[data-open-credits]` controls have a delegated handler. Both Echo pages load the same isolated handler. All 11 anatomy/figure records and 15 video records retain creators, sources, license links and adaptation statements. | No new normal-screen buttons, old About dialog, analytics or clinical changes. Exact native-model provenance remains U05, and author permission remains H02. |
| M01 — missing Draco/Basis licenses | Local license packaging corrected | Full upstream Apache-2.0 texts, Three distribution READMEs and provenance records are beside the five original public decoder/transcoder files. All five files match `three@0.185.1` byte-for-byte. `public/licenses/third-party-sources.json` records hashes and source links. | This pins the Three distribution identity; it does not invent separate Draco/Basis compiler-version information or grant rights to decoded anatomy. Native/embedded subcomponent distribution review remains within M04–M06. |
| M02 — incomplete Meshoptimizer notice | Technical defect corrected | Full Arseny Kapoulkine MIT notice beside the study decoder and in `vendor/dental-scope/public/licenses/Meshoptimizer-LICENSE.txt`; added a dental credits link. The study decoder matches the Three package copy and identifies Meshoptimizer 1.1. Dental's full notice is copied during its normal Vite build. | No decoder or model bytes changed; existing package notices also retain their own versions. |
| M03 — missing main font license texts | Local license packaging corrected | Added full DM Sans and Cormorant project OFL-1.1 files to `public/licenses/` and linked them from consolidated notices. Original copyright lines and full terms are preserved. | Fonts and names have not been changed. Future font edits/subsetting still require compliance with the applicable original font terms. |
| M04 — incomplete aggregate notices | Partial | Offline generator inventories all 795 lock entries, preserves notices for 522 of 546 installed entries, and retains 127 embedded Next.js notice records. Full Lucide ISC and Feather MIT material is preserved verbatim. Pinned upstream notices were recovered for 16 package locations using registry integrity and exact published Git commits. Content-addressed notice files and a complete plain-text collection accompany the public manifest. | 24 installed entries still lack verified original notice material under the search performed. Another 249 lock entries are not installed here. Neither set is labeled safe. A specific deployment/server/container still needs an exact shipped-component review. |
| M05 — LGPL native distribution | Partial; source obligations still open | Original installed package/native notices are retained in the bundle and the distribution requirement is explicitly registered. | Final transferred binaries/containers, corresponding source and replacement/relinking provisions must be assessed. Notices alone do not close LGPL obligations. |
| M06 — MPL covered-source obligations | Partial; source obligations still open | Original available license notices, versions, repository links and pinned upstream recovery evidence are retained. | Establish which covered files are actually conveyed, modifications, and meaningful access to their corresponding covered sources. A repository URL alone is not asserted to satisfy this. |
| M08 — notice-free local Echo ZIP | Packaging defect corrected | `scripts/package-echo-notices.py` updates the existing ignored `outputs/ecocardiografia-codigo-completo.zip` with Echo author/media/font/library notices, shared-atlas credits, consolidated dependency notices, a rights register and explicit export-status information. The eight original source entries are preserved byte-for-byte; their hashes are included. The command can be repeated. | The ZIP remains an older **partial source excerpt**, not the complete simulator or original author source. It is not a cleared distribution. H02/U05/M07 remain applicable. |
| L01 — GSAP custom license misclassification | Notice treatment corrected | Preserved the actual `GSAP 3.15.0` copyright/license banner and its custom-license URL in the generated notice collection. It is explicitly distinguished from MIT. | Ordinary current website implementation is supported by the current standard license; a future competing visual animation builder needs a fresh review. |
| L02 — no mixed-rights policy | Documentation defect corrected | Added `COPYRIGHT.md` with component boundaries and existing license/credit references. It grants no blanket repository license and does not claim ownership of undocumented material. | Contributor, content and trademark clearance remains separate. CC/share-alike rights must not be removed through conflicting recipient terms or restrictions. |
| L03 — reading access confused with reuse | Documentation defect corrected | Clarified the `free` field comments in `app/lib/book-data.ts` and `app/lib/organ-resources.ts`, and added the reading/reuse distinction to `COPYRIGHT.md`. Existing labels, links and book data are unchanged. | A future import of book/article content requires the exact item/edition license and exceptions. No new text or book files were imported. |

## Evidence and permissions that code cannot supply

These records remain open in `compliance/rights-register.json`. Retaining the existing features at the user's direction does not establish permission to distribute them.

| ID | Exact affected component/location | Evidence required to resolve it without changing the website |
| --- | --- | --- |
| C01 | `public/study-atlas/atlas/` geometry/textures; `public/study-atlas/data/` | Identify the actual original product/creator and retain a grant covering extraction, browser delivery of raw resources, modification, institutional/public use and intended commercial distribution. A Three.js license cannot supply this. |
| C02 | `public/study-atlas/atlas/conjuntos/resources.assets/`, 58 imported movement clips/rigs | Clip/rig-specific permission from the actual owner, including redistribution of embedded motion data. Attribution alone cannot establish a grant. |
| H01 | `public/models/brain.glb`, `heart.glb` and their renders | Clear the underlying exported-atlas anatomy and its derivatives, rather than merely the optimizer/exporter. |
| H02 | `public/echo/`, associated source excerpts | Retain the actual Mohammed Kamareddine/EchoSuite authorization referenced in `ADAPTACION-UMA.md`. Confirm UMA identity, adapted snapshot, rebranding, language, hosting, copying, modifications, distribution, commercial scope and third-party exclusions. The existing permission statement is preserved as a claim. |
| H04 | `public/models/{eyeball,intestine,kidneys,lungs,pancreas,skin}.glb` | Recover generation/acquisition IDs, creator, date, account/plan, applicable terms, input-image rights and grant/transfer to UMA. `tripo_node` metadata does not prove the acquisition license. |
| H05 | `public/anatomy/` illustrations and thumbnails; social preview artwork | Per-image author/source, license or generation/input-rights records, and source-model rights for rendered thumbnails. |
| U01 | `public/models/liver.glb` | Acquisition/source record and license for the exact model hash. |
| U02 | Main `app/`, starter, build/worker/database/examples code | Contributor/contractor ownership or authorization and the original starter grant. Do not blanket-relicense code whose rights have not been established. |
| U03 | `app/lib/{anatomy-data,lesson-data,glossary-data}.ts` | Author/faculty/contractor grant or independent-authorship evidence for expressive prose and translations. Anatomical facts alone do not clear copied wording. |
| U04 | UMA logo, favicons and supplied marks | Institutional brand authorization plus any third-party logo/creator permissions for the intended distribution. Copyright notices do not establish trademark permission. |
| U05 | Echo native `assets/anatomy.bin`, `assets/skin/`, `assets/sim/` | Exact HRA/DBCLS source versions/DOIs, creators, native hashes and derivative mapping. Existing credits identify leads, not a verified byte-level rights chain. |
| U06 | `public/study-atlas/app.js`, `index.html` | Author/commissioning grant for the supplied wrapper, independently of Three.js and anatomy rights. |
| M07 | Seven Atif Qasim clinical clips in `public/echo/assets/media/` | Published educational reuse with attribution is supported. Obtain express confirmation for the intended edits, commercial use and raw-file redistribution/sublicensing beyond that documented scope. Attribution has been retained; broader rights are still unknown. |

The safest way to preserve the **same** assets and behavior is to obtain and retain valid rights-holder evidence for those exact assets. If an owner will not grant the required rights, no notice-only implementation can resolve the issue while preserving the same protected material. Replacement or removal would require a change in the user's constraint and is not part of this work.

## Operational workflow

1. Continue normal local work with `npm run dev` / `npm run build`. Both prepare dental resources and regenerate notices from local evidence without contacting license websites.
2. Use the existing About link for consolidated credits. Echo's static `credits.html` also provides direct access without JavaScript. Preserve all original inline clinical/figure credits.
3. Run `npm run licenses:check` and `npm run test:compliance` after dependency changes. The standard `npm test` includes compliance tests. A changed decoder or changed recovered license hash triggers review rather than silently inheriting its old provenance.
4. Network maintenance is explicit: `npm run licenses:sync-sources` and `npm run licenses:sync-packages`. Review source URLs, exact version/commit matches and pending evidence. These commands do not modify anatomy or grant permission.
5. Resolve the outstanding evidence records. Keep actual contracts in an appropriate access-controlled records location, reference the reviewed document and exact asset hashes, and record permitted uses, limitations, reviewer and review date. Do not mark a record `VERIFIED` merely because a credit was added. The status script reads the register; it is not a legal adjudicator.
6. For a proposed release, inventory the actual browser/server/container/ZIP contents and address remaining package notices plus MPL/LGPL source requirements. Run `npm run check:copyright:release`. A successful future status check still depends on the validity and scope of the reviewed underlying evidence.
7. For the existing local Echo excerpt, run `python scripts/package-echo-notices.py` after regenerating notices. Review the complete release artifact independently; this script does not export the full simulator or authorize external transfer.

## Verification and limits

- Production `npm run build`: passed, including dental TypeScript/Vite build and the anatomy content-coverage build guard. Existing bundle-size and route-classification advisories remain.
- TypeScript `tsc --noEmit`: passed.
- Targeted ESLint checks for changed application files and new JavaScript maintenance, credits and test files: passed.
- Existing repository regression suites: **33 passed** across rendered HTML, atlas geometry/chunks/search, study models and external resources, brain/body geometry, and Echo localization/anatomy/calculator resources.
- New compliance tests: **5 passed**, including exact lock coverage, original Lucide/Feather/GSAP notices, unchanged decoder hashes, full font texts, all static Echo credit records, and separation of ordinary development from the unresolved release check.
- Echo preparation: rerunning `scripts/prepare-echo.mjs` leaves both prepared HTML files unchanged.
- Browser checks: Microsoft Edge headless verified the new isolated credits handler with a representative existing-style control at 1280px and 375px, all **26** credit records, close/Escape/focus restoration and network-failure retry. The actual calculator catalog produced **identical screenshots** with the new credits scripts/styles enabled and disabled. Evidence: `compliance/browser-verification.json`. This is not an end-to-end clinical or full WebGL simulator validation; the new dialog behavior was exercised in an isolated fixture.
- Preservation: **10,046 existing files / 1,242,594,569 bytes** checked against the original audit inventory, covering all pre-existing `public/` files except generated `public/dental/`, plus `vendor/dental-scope/public/`. **10,044 are byte-identical**. The other two are the Echo HTML pages; removing the two added credits references exactly reproduces each original SHA-256. New notice files are outside that baseline count. Evidence: `compliance/preservation-check.json`. Generated dental output is rebuilt, while source models/textures remain unchanged.
- The Echo excerpt's eight original entries were verified by SHA-256 after notice packaging. The ZIP is local and ignored by Git; the packaging script and rights documentation are reviewable.
- Twelve key current notice/credits resources, including the manifest, aggregate notices, codec/font licenses and dental credits/Meshoptimizer notice, were hash-compared with the production `dist/client/` copies and match. The 28-file server output contains no native `.node`/WASM binaries and no matches for the named Sharp/libvips/MPL package strings searched. This limited negative scan does not certify other packaging formats or eliminate the artifact-specific M05/M06 review.
- The original Markdown audit hash is unchanged. The original Word audit remains available. No commit, push or deployment occurred.

The preservation check covers the declared public/dental scope, not every installed build cache. The aggregate notices are conservative package evidence, not proof that every lockfile entry is shipped or that every embedded native subdependency has been fully cleared. No infringement determination has been inferred merely from missing evidence.

## Primary sources used for these fixes

- Three.js decoder/transcoder package copies and accompanying READMEs: installed `three@0.185.1`, with file hashes in `public/licenses/third-party-sources.json`.
- [Draco Apache license](https://raw.githubusercontent.com/google/draco/main/LICENSE) and [Basis Universal Apache license](https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/LICENSE).
- [Meshoptimizer 1.1 MIT license](https://raw.githubusercontent.com/zeux/meshoptimizer/v1.1/LICENSE.md).
- [DM Sans OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt) and [Cormorant OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt).
- [GSAP standard license](https://gsap.com/community/standard-license/); the installed proprietary banner is retained.
- Exact npm metadata, lock integrity, Git commits and original text hashes for recovered notices: `compliance/package-notice-sources.json`.
- [Mozilla MPL FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) and [Sharp licensing information](https://sharp.pixelplumbing.com/install/#licensing), relevant to the distribution obligations still open.
- Asset-specific source/license links remain in the original audit, `public/echo/assets/credits.json`, atlas attribution and dental credits.

## Installed package notices still requiring evidence

The following list is a notice-discovery result, not a finding that every listed package is infringed or shipped. These entries remain flagged in the public manifest; local installed metadata/license declarations alone have not been treated as complete notice evidence.

| Package | Version | Installed location | Declared license (not full clearance) |
| --- | --- | --- | --- |
| @cloudflare/kv-asset-handler | 0.5.0 | `node_modules/@cloudflare/kv-asset-handler` | MIT OR Apache-2.0 |
| @cloudflare/unenv-preset | 2.16.1 | `node_modules/@cloudflare/unenv-preset` | MIT OR Apache-2.0 |
| @cloudflare/vite-plugin | 1.37.1 | `node_modules/@cloudflare/vite-plugin` | MIT |
| @drizzle-team/brocli | 0.10.2 | `node_modules/@drizzle-team/brocli` | Apache-2.0 |
| @humanfs/types | 0.15.0 | `node_modules/@humanfs/types` | Apache-2.0 |
| @types/json5 | 0.0.29 | `node_modules/@types/json5` | MIT |
| @unpic/core | 1.0.3 | `node_modules/@unpic/core` | MIT |
| client-only | 0.0.1 | `node_modules/client-only` | MIT |
| css-box-shadow | 1.0.0-3 | `node_modules/css-box-shadow` | MIT |
| drizzle-kit | 0.31.10 | `node_modules/drizzle-kit` | MIT |
| drizzle-orm | 0.45.2 | `node_modules/drizzle-orm` | Apache-2.0 |
| esrecurse | 4.3.0 | `node_modules/esrecurse` | BSD-2-Clause |
| glob-to-regexp | 0.4.1 | `node_modules/glob-to-regexp` | BSD-2-Clause |
| imurmurhash | 0.1.4 | `node_modules/imurmurhash` | MIT |
| keyv | 4.5.4 | `node_modules/keyv` | MIT |
| language-subtag-registry | 0.3.23 | `node_modules/language-subtag-registry` | CC0-1.0 |
| language-tags | 1.0.9 | `node_modules/language-tags` | MIT |
| miniflare | 4.20260515.0 | `node_modules/miniflare` | MIT |
| natural-compare | 1.4.0 | `node_modules/natural-compare` | MIT |
| stable-hash | 0.0.5 | `node_modules/stable-hash` | MIT |
| unpic | 4.2.2 | `node_modules/unpic` | MIT |
| wrangler | 4.92.0 | `node_modules/wrangler` | MIT OR Apache-2.0 |
| yoga-layout | 3.2.1 | `node_modules/yoga-layout` | MIT |
| @rolldown/binding-win32-x64-msvc | 1.2.12 | `vendor/dental-scope/node_modules/@rolldown/binding-win32-x64-msvc` | MIT |
