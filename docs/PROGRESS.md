# Progress log

Newest first. Read at the start of every session; append at the end.

## 2026-10-19
- Phase 1.5 complete: replaced the live clock with edition-owned in-world tithi/time, moved Ghor's time out of its caption, and recorded live-time mode as future work.
- Stage is now a full-viewport camera: sky and foreground bleed edge to edge while the 4:5 safe area and caption scale to viewport height. Verified at 390px, 1280px, and 1920×1080 (16:9).
- Restyled the closed-by-default mixer with a printed native range control (ink track/ticks, alta square thumb, visible focus) and renamed its opener to “mixer”.
- Added a test guard that rejects Devanagari characters from all chrome and edition user-facing strings.
- Phase 1 complete: an accessible, reduced-motion-aware entry gate resumes Web Audio after user interaction; the shell includes a persisted four-channel mixer and master mute.
- Implemented four Web Audio buses (crowd, dhaak, bells, music), master gain/mute, crossfade helper, Phase 6 spatial-audio stub, and dev-only generated debug sounds behind `?debug=audio`; no audio files committed.
- Caption now reads edition-owned caption copy plus a tithi/local-time Pujo clock. Off-season countdown remains in `usePujoClock`.
- Corrected Phase 0 palette tokens to the art bible and moved chrome copy to `src/copy.ts` with Bengali review flags.
- Verified Phase 1 with 12 Playwright checks/screenshots across 390px and 1280px, plus a production build.
- Repo created (public, was empty).
- Brief, art/sound/copy bibles, feature list, phases, licensing notes and decisions written into `docs/`.
