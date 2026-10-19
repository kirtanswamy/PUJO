export type ReviewStatus = 'NEEDS-NATIVE-REVIEW' | 'ok';

export interface CopyEntry {
  text: string;
  review: ReviewStatus;
}

const copy = (text: string, review: ReviewStatus = 'NEEDS-NATIVE-REVIEW'): CopyEntry => ({
  text,
  review,
});

export const GATE = {
  enter: copy('পুজোয় প্রবেশ করুন'),
} as const;

export const CLOCK = {
  ongoing: copy('চলছে'),
} as const;

export const SLATE = {
  offSeason: copy('আসছে বছর আবার'),
} as const;

export const MIXER = {
  open: copy('mixer', 'ok'),
  mute: copy('mute', 'ok'),
  unmute: copy('unmute', 'ok'),
  crowd: copy('crowd', 'ok'),
  dhaak: copy('dhaak', 'ok'),
  bells: copy('bells', 'ok'),
  music: copy('music', 'ok'),
} as const;
