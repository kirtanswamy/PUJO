import { useState } from 'react';

export type EyeState = 'closed' | 'opening' | 'open' | 'closing';

export function useEyesAnimation(): { eyeState: EyeState; setEyeState: (state: EyeState) => void } {
  const [eyeState, setEyeState] = useState<EyeState>('open');
  return { eyeState, setEyeState };
}