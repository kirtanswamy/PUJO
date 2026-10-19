Phase 0. Read CLAUDE.md, docs/PROGRESS.md and docs/05-phases.md first. Plan first, then build.

1. Scaffold Vite + React + TypeScript + Tailwind; add motion, zustand, howler.
2. Add design tokens (alta, haldi, brass, indigo, paper, ink) and load Anek Bangla + Fraunces.
3. Create src/editions/2026.ts with the Scene and TrackSource types
   (owned | youtube | spotify) and six scenes: ghor, shashthi, saptami,
   ashtami, navami, dashami.
4. Build a <Stage/> component: fixed 4:5 composition scaled to fit, with named
   layers (sky, structure, protima, lights, fx, foreground, smoke, tone, grain).
5. Build a <Caption/> strip: small, quiet, one line under the stage, plus a
   Pujo-clock readout.
6. Build an audio engine interface with an adapter per TrackSource kind.
   Stub youtube and spotify; implement owned with Howler.
7. Render a greybox ghor scene and verify with Playwright screenshots
   at 390px and 1280px.

Do not add art, effects, or extra dependencies. Ask before deviating.
When done: update docs/PROGRESS.md and tick docs/05-phases.md.
