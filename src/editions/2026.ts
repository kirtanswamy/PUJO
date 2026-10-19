export type OwnedTrack = { kind: 'owned'; src: string };
export type YoutubeTrack = { kind: 'youtube'; id: string };
export type SpotifyTrack = { kind: 'spotify'; uri: string };
export type TrackSource = OwnedTrack | YoutubeTrack | SpotifyTrack;

export const LAYER_NAMES = [
  'sky',
  'structure',
  'protima',
  'lights',
  'fx',
  'foreground',
  'smoke',
  'tone',
  'grain',
] as const;

export type LayerName = (typeof LAYER_NAMES)[number];

export interface LayerDef {
  name: LayerName;
  color: string;
  opacity?: number;
}

export interface Scene {
  id: string;
  title: string;
  bengaliTitle?: string;
  layers: LayerDef[];
  track?: TrackSource;
  /** ISO date-time string when this scene's pujo phase begins */
  pujoTime?: string;
}

function greybox(color: string): LayerDef[] {
  return LAYER_NAMES.map((name) => ({ name, color }));
}

export const scenes: Scene[] = [
  {
    id: 'ghor',
    title: 'Ghor',
    bengaliTitle: 'ঘর',
    layers: greybox('#555555'),
    pujoTime: '2026-10-14T06:00:00+05:30',
  },
  {
    id: 'shashthi',
    title: 'Shashthi',
    bengaliTitle: 'ষষ্ঠী',
    layers: greybox('#666666'),
    pujoTime: '2026-10-18T06:00:00+05:30',
  },
  {
    id: 'saptami',
    title: 'Saptami',
    bengaliTitle: 'সপ্তমী',
    layers: greybox('#777777'),
    pujoTime: '2026-10-19T06:00:00+05:30',
  },
  {
    id: 'ashtami',
    title: 'Ashtami',
    bengaliTitle: 'অষ্টমী',
    layers: greybox('#888888'),
    pujoTime: '2026-10-20T06:00:00+05:30',
  },
  {
    id: 'navami',
    title: 'Navami',
    bengaliTitle: 'নবমী',
    layers: greybox('#999999'),
    pujoTime: '2026-10-21T06:00:00+05:30',
  },
  {
    id: 'dashami',
    title: 'Dashami',
    bengaliTitle: 'দশমী',
    layers: greybox('#aaaaaa'),
    pujoTime: '2026-10-22T06:00:00+05:30',
  },
];
