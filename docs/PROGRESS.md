# Progress log

Newest first. Read at the start of every session; append at the end.

## 2026-10-19
- Phase 1 complete: an accessible, reduced-motion-aware entry gate resumes Web Audio after user interaction; the shell includes a persisted four-channel mixer and master mute.
- Implemented four Web Audio buses (crowd, dhaak, bells, music), master gain/mute, crossfade helper, Phase 6 spatial-audio stub, and dev-only generated debug sounds behind `?debug=audio`; no audio files committed.
- Caption now reads edition-owned caption copy plus a tithi/local-time Pujo clock. Off-season countdown remains in `usePujoClock`.
- Corrected Phase 0 palette tokens to the art bible and moved chrome copy to `src/copy.ts` with Bengali review flags.
- Verified Phase 1 with 12 Playwright checks/screenshots across 390px and 1280px, plus a production build.
- Repo created (public, was empty).
- Brief, art/sound/copy bibles, feature list, phases, licensing notes and decisions written into `docs/`.
