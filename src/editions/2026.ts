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

export type ReviewStatus = 'NEEDS-NATIVE-REVIEW' | 'ok';

export interface ReviewedText {
  text: string;
  review: ReviewStatus;
}

export interface Scene {
  id: string;
  title: string;
  tithi: ReviewedText;
  inWorldTime: ReviewedText;
  caption: ReviewedText;
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
    tithi: { text: 'মহালয়া', review: 'NEEDS-NATIVE-REVIEW' },
    inWorldTime: { text: '4:12 am', review: 'ok' },
    caption: { text: "radio on. everyone's awake.", review: 'ok' },
    layers: greybox('#2a1a12'),
    pujoTime: '2026-10-14T06:00:00+05:30',
  },
  {
    id: 'shashthi',
    title: 'Shashthi',
    tithi: { text: 'ষষ্ঠী', review: 'NEEDS-NATIVE-REVIEW' },
    inWorldTime: { text: '7:40 pm', review: 'ok' },
    caption: { text: 'bodhon. the face is uncovered.', review: 'ok' },
    layers: greybox('#2a1a12'),
    pujoTime: '2026-10-18T06:00:00+05:30',
  },
  {
    id: 'saptami',
    title: 'Saptami',
    tithi: { text: 'সপ্তমী', review: 'NEEDS-NATIVE-REVIEW' },
    inWorldTime: { text: '5:18 am', review: 'ok' },
    caption: { text: 'kola bou. the river. dawn.', review: 'ok' },
    layers: greybox('#2a1a12'),
    pujoTime: '2026-10-19T06:00:00+05:30',
  },
  {
    id: 'ashtami',
    title: 'Ashtami',
    tithi: { text: 'অষ্টমী', review: 'NEEDS-NATIVE-REVIEW' },
    inWorldTime: { text: '8:30 am', review: 'ok' },
    caption: { text: "pushpanjali before you've eaten anything.", review: 'ok' },
    layers: greybox('#2a1a12'),
    pujoTime: '2026-10-20T06:00:00+05:30',
  },
  {
    id: 'navami',
    title: 'Navami',
    tithi: { text: 'নবমী', review: 'NEEDS-NATIVE-REVIEW' },
    inWorldTime: { text: '9:15 pm', review: 'ok' },
    caption: { text: "the smoke is thick. you can't find your friends.", review: 'ok' },
    layers: greybox('#2a1a12'),
    pujoTime: '2026-10-21T06:00:00+05:30',
  },
  {
    id: 'dashami',
    title: 'Dashami',
    tithi: { text: 'দশমী', review: 'NEEDS-NATIVE-REVIEW' },
    inWorldTime: { text: '4:45 pm', review: 'ok' },
    caption: { text: 'the dhaak is slower today.', review: 'ok' },
    layers: greybox('#2a1a12'),
    pujoTime: '2026-10-22T06:00:00+05:30',
  },
];
