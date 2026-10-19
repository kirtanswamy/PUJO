# Pujo — project brief for Claude Code

Interactive ambient Bengali Durga Pujo site. Era: 90s–early-2000s Kolkata.
UI is made of period props (radio, thali, cassette, CRT TV), never generic controls.

## Every session
1. Read `docs/PROGRESS.md` and the current phase in `docs/05-phases.md`.
2. Work in plan mode first, one phase at a time, small commits per feature.
3. At the end, append to `docs/PROGRESS.md` and tick finished items in `docs/05-phases.md`.

## Hard rules
- No AI-generated imagery. Art is hand-made SVG following the layer-ID contract in `docs/01-art-bible.md`.
- Warm, retro, atmospheric. Palette tokens only (alta, haldi, brass, indigo, paper, ink). No default gradients or glassy SaaS styling.
- Bengali script is first-class: Anek Bangla / Noto Serif Bengali. Mark any Bengali copy not reviewed by a native speaker as `NEEDS-NATIVE-REVIEW`.
- Reverent depiction of the deity: slow, glowing, alive. No flicker, jump-scares or distortion on the protima.
- Max five visible controls per scene.
- **Never remove, weaken or skip a required ID, test or check to make something pass. If a check fails, fix the cause, or stop and ask.**

## Engineering
- Vite + React + TypeScript + Tailwind + Motion + Zustand + Howler. Ask before adding any dependency.
- Canvas for particles; SVG + CSS for scene art. No Three.js.
- Everything year-specific lives in `src/editions/<year>.ts`.
- Perf budget: 60fps on a mid-range Android phone; scale particle counts by device.
- Honor `prefers-reduced-motion`. Audio starts only after the entry-gate tap.
- Audio: every track is an `owned`, `youtube` or `spotify` source (see `docs/06-licensing.md`). Never commit audio we do not own or have licensed. Log provenance in `public/audio/CREDITS.md`.

## Verification
- Check visually with Playwright screenshots (390px mobile + 1280px desktop) before calling anything done.
