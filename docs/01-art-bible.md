# Art bible

## Direction
Flat vector in the **Kalighat pat** and **Kumartuli** tradition, with **daaker saaj** (silver-foil) detail. On top: the texture of cheap 90s offset printing: Pujo-sankhya covers, hand-painted signboards, banner lettering. Warm, slightly retro, atmospheric. **No generic or AI-generated art.**

## Who draws what
- Final protima, thakurdalan, dhunuchi dancers, street figures: a human illustrator (see `docs/07-open-questions.md`).
- Code side: greybox art with named layers, animation, FX, textures.

## Palette (tokens)
| Token | Hex | Use |
|---|---|---|
| alta | #c8321f | Laal-paar red, accents |
| haldi | #e9a82f | Light, marigold, active states |
| brass | #c9973a | Lamps, metalwork |
| indigo | #14122b | Night, backgrounds |
| paper | #f4e9d3 | Text, print texture |
| ink | #2a1a12 | Dark text on light |

## Type
Bengali: Anek Bangla (UI), Noto Serif Bengali (display). Latin: Fraunces. UI text tiny and quiet; the scene carries the emotion.

## Texture
Film grain, halftone, slight misregistration, paper fibre. Grain is a shared overlay layer.

## Reverence
The deity is shown slow, glowing and alive. Eyes glow gently; no flicker, glitch or jump scares on the protima.

## Layer-ID contract (artist ⇄ code)
Every scene SVG uses stable IDs so art can be swapped without touching animation code:
`#sky`, `#structure`, `#chalchitra`, `#protima`, `#eye-l`, `#eye-r`, `#lights`, `#lamp-pradip`, `#dhunuchi-1..n`, `#foreground`, `#crowd`, `#alpona`.
Layers are separate groups, flat fills, no embedded raster, text converted to outlines.
