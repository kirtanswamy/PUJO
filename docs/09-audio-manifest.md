# Audio manifest

Nothing is recorded yet. This is the shopping list. Status: `missing` until a real file exists in `public/audio/` and is logged in `public/audio/CREDITS.md`.
Priority: P0 = needed to make the first scenes feel real, P1 = rituals, P2 = later phases.
Source plan: **REC** = record at a real pandal, **COM** = commission, **CC** = Freesound CC0 / CC-BY (check each licence; avoid NonCommercial), **SYN** = generate in code (no file).

## Crowd bus (ambience)
| ID | What | Loop | Pri | Source |
|---|---|---|---|---|
| amb_ghor_dawn | 4 AM room tone: ceiling fan, far-off dogs and crows, quiet | yes, 60s+ | P0 | REC / CC |
| amb_pandal_crowd | Pandal crowd murmur, kids, announcements far off | yes, 90s | P0 | REC |
| amb_street_night | Pandal-para street: vendors, rickshaw, footsteps | yes, 90s | P0 | REC / CC |
| amb_river | River water, early morning (Saptami) and dusk (Dashami) | yes, 60s | P2 | REC / CC |
| amb_loudspeaker | Loudspeaker hiss and crackle, short announcements | yes + one-shots | P1 | REC |

## Dhaak bus
| ID | What | Loop | Pri | Source |
|---|---|---|---|---|
| dhaak_close | Dhaak close mic, steady festive rhythm | yes | P0 | REC / COM |
| dhaak_far | Same rhythm recorded 30 to 50 m away (for distance mixing) | yes | P0 | REC |
| dhaak_aarti | Aarti rhythm | yes | P1 | COM |
| dhaak_dhunuchi | Fast dhunuchi-dance rhythm | yes | P1 | COM |
| dhaak_slow | Slow, sombre rhythm for Bishorjon | yes | P2 | COM |
| dhaak_hits_1..6 | Single strokes for the tap-to-play dhaak pad | no | P1 | COM |

## Bells bus (ritual)
| ID | What | Loop | Pri | Source |
|---|---|---|---|---|
| kansor_loop | Kanshor / ghonta rhythm | yes | P1 | REC / COM |
| shankh_1, shankh_2 | Conch blow, long and short | no | P1 | REC / CC |
| ulu_1..3 | Ululation (ulu dhwani), different voices | no | P1 | COM / REC |
| aarti_bells | Aarti bell and cymbal layer | yes | P1 | REC |
| dhunuchi_crackle | Burning coconut husk crackle | yes | P1 | REC / CC |

## Music bus (owned compositions)
| ID | What | Loop | Pri | Source |
|---|---|---|---|---|
| mahalaya_recital | Original recitation of the Chandi texts, Mahalaya-style, for the 4 AM radio | no | P1 | COM |
| agomoni | Welcome song, public-domain composition (e.g. Tagore), fresh recording | no | P2 | COM |
| bishorjon | Farewell song, fresh recording | no | P2 | COM |

Licensed famous recordings (the original Mahalaya broadcast, retro songs) are not files here; they play through official embeds on the CRT TV in Phase 6 (see docs/06-licensing.md).

## Interface sounds
| ID | What | Pri | Source |
|---|---|---|---|
| radio_static | Radio tuning static | P0 | SYN |
| crt_static | CRT channel-change static burst | P2 | SYN |
| dial_click, tape_click | Radio dial and cassette button clicks | P1 | CC / REC |

## Specs for delivery
- Record or deliver WAV, 48 kHz, 24-bit. Keep raw files out of git (folder `audio-src/`, gitignored).
- Ambience loops: even level, no sudden events, loopable. One-shots: peak around -3 dBFS.
- Encode for the web as AAC (.m4a, 128 kbps) plus Opus (.ogg, ~96 kbps); both listed in the manifest loader.
- Always test loops on a real phone for clicks at the seam.

## Where to get it
- **Record:** if you can reach a Bengali Pujo pandal on Navami or Dashami this year, that is the best source (checklist in docs/02-sound-bible.md). Ask the dhaaki or committee for a quick OK to use the recording; log place, date and person.
- **Freesound.org:** search "dhak", "dhaak", "dhol", "conch", "shankh", "ululation", "temple bell", "aarti", "crowd India", "Kolkata street". Filter to CC0 or CC-BY. Skip CC-BY-NC. For CC-BY, add the credit line to CREDITS.md.
- **Commission:** a dhaaki and a small band (kansor, ghonta), a reciter for the Mahalaya text, singers for the songs. Bengali cultural associations and Pujo committees are good places to ask for introductions.
