Audio pipeline. Read CLAUDE.md, docs/PROGRESS.md, docs/02-sound-bible.md,
docs/06-licensing.md and docs/09-audio-manifest.md first. Plan first.
Commit after each item.

1. src/audio/manifest.ts: a typed list of every asset in docs/09-audio-manifest.md
   (id, bus, loop, scenes it plays in, status: 'missing' | 'placeholder' | 'final',
   credit key). This is the single source of truth.
2. Make OwnedAdapter load from the manifest with Howler, passing sources
   [.ogg, .m4a]. A missing file must never crash: fall back to the dev synthetic
   placeholder and warn in the console in dev only.
3. Scene audio: sceneAudio(sceneId) returns which loops start when a scene is
   entered and which fade out when it is left, using the crossfade helper.
   Ghor: amb_ghor_dawn + radio static. Pandal scenes: amb_pandal_crowd +
   dhaak_far (+ dhaak_close when near). Fade times are constants in one place.
4. scripts/encode-audio.ps1 and `npm run audio:encode`: reads WAVs from
   audio-src/ (gitignored), writes .m4a (AAC 128k) and .ogg (Opus ~96k) to
   public/audio/ via ffmpeg. Fail with a clear message if ffmpeg is missing
   (on Windows: winget install Gyan.FFmpeg). Normalise ambience loops to one
   consistent loudness target and keep one-shots peaking about -3 dBFS.
5. `npm run check:credits` fails if any file in public/audio lacks a row in
   public/audio/CREDITS.md.
6. Dev page ?debug=loops plays each loop twice back to back so I can listen for
   clicks at the seam on a real phone.
7. Do not add dependencies without asking. Do not commit raw audio.
8. Update docs/PROGRESS.md and push to origin main.
