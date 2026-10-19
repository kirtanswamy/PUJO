# Vision

**One Pujo night, told through props.** The site is not a page with a music player; it is a walk through a Pujo, with every control being an object from a Bengali childhood.

## References
- saloon.wtf: atmosphere, a curated soundtrack, a place you sit inside.
- schoolkebaad.fun: the interface is one prop (a TV remote: vol up, vol down, prev, next, all songs), a tiny caption ("in front of the TV"), a time readout, copy in the voice of the era.
- Also in the trend: truckdrivermusic.in, busdriver.wtf, heartin.in.

## Flow
Home (Mahalaya, 4 AM) → Shashthi → Saptami → Ashtami → Navami → Dashami. Each day has its own pandal. The user **walks** from pandal to pandal along a side-scrolling street; a caption line sits under the scene; a Pujo clock sits where schoolkebaad has `--:--`.

## Props → functions
| Prop | Role |
|---|---|
| Valve radio, 4 AM | Opening scene (Ghor). Dial tunes into the Mahalaya chant; static between tracks |
| Puja thali | Ritual dock. Slides up like the remote: flowers (Pushpanjali), Pancha Pradip (Aarti), dhunuchi, shankh, ghonta |
| Cassette deck / bamboo-pole loudspeaker | Player in pandal scenes. Reels spin; the cassette J-card is the track list |
| CRT TV | Plays licensed songs via official embeds; prev/next flips "channels" (song eras) with a static burst |
| Doordarshan-style slate | Loading, errors, off-season: "আসছে বছর আবার" (until next year) |
| Pujo sankhya magazine | Yearly archive; each past edition is a magazine on the shelf |
| The street | Walking between pandals; sound sources fade with distance |

## Signature moments
Chokkhu Daan (the eyes are painted at the start), Bodhon, Sandhi Pujo (108 lamps), Sindoor Khela, Bishorjon.

## Scope
Full build, no deadline, phased. A new edition every year (`src/editions/<year>.ts`).
