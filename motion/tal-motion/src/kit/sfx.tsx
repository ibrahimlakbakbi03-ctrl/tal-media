import React, { createContext, useContext } from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
export type SfxName = 'whoosh' | 'pop' | 'tick' | 'paper' | 'thud' | 'zip';
const LEVEL: Record<SfxName, number> = { whoosh: 0.32, pop: 0.38, tick: 0.3, paper: 0.42, thud: 0.55, zip: 0.22 };
const LEN: Record<SfxName, number> = { whoosh: 16, pop: 3, tick: 2, paper: 6, thud: 9, zip: 11 };
const SfxCtx = createContext<{ dur: number } | null>(null);
export const SfxScope: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => <SfxCtx.Provider value={{ dur }}>{children}</SfxCtx.Provider>;
export const Sfx: React.FC<{ at: number; s: SfxName; v?: number }> = ({ at, s, v = 1 }) => {
  const scope = useContext(SfxCtx);
  if (!scope || !Number.isFinite(at)) return null;
  const f = Math.round(at);
  if (f < 0 || f >= scope.dur) return null;
  return <Sequence from={f} durationInFrames={LEN[s] + 8} layout="none" name={`sfx ${s}`}><Audio src={staticFile(`sfx/${s}.wav`)} volume={LEVEL[s] * v} /></Sequence>;
};
