import React, { createContext, useContext } from 'react';
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { tween } from './motion';
import timing from '../videoF/timing.json';
export type Line = { s: number; e: number; t: string; w: [string, number, number][] };
export const LINES = timing as unknown as Line[];
export const fr = (sec: number) => Math.round(sec * 30);
export const cueAbs = (line: number, word = 0, edge: 's' | 'e' = 's') => {
  const L = LINES[line]; const i = word < 0 ? L.w.length + word : word;
  const w = L.w[Math.max(0, Math.min(L.w.length - 1, i))];
  return fr(edge === 's' ? w[1] : w[2]);
};
const SceneCtx = createContext({ start: 0, dur: 1 });
export const useScene = () => useContext(SceneCtx);
export const useCue = () => { const { start } = useScene(); return (line: number, word = 0, edge: 's' | 'e' = 's') => cueAbs(line, word, edge) - start; };
export const SceneProvider: React.FC<{ start: number; dur: number; children: React.ReactNode }> = ({ start, dur, children }) => <SceneCtx.Provider value={{ start, dur }}>{children}</SceneCtx.Provider>;
const POSES = new Set(['serious', 'explaining', 'laughing', 'worried', 'coin', 'thumbsup', 'wave', 'shocked', 'thinking', 'pointup', 'pointing']);
const ALIAS: Record<string, string> = { gavel: 'serious', skeptical: 'serious', celebrate: 'laughing', main: 'pointup' };
export const Tal: React.FC<{ pose: string; at?: number; side?: 'right' | 'left'; height?: number; x?: number; flip?: boolean }> = ({ pose, at = 0, side = 'right', height = 360, x = 200, flip }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p0 = POSES.has(pose) ? pose : ALIAS[pose] ?? 'pointup';
  const p = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 110, mass: 0.8 } });
  const breathe = 1 + 0.012 * Math.sin((frame / fps) * 2 * Math.PI * 0.3);
  const sway = 1.2 * Math.sin((frame / fps) * 2 * Math.PI * 0.18);
  return (
    <div style={{ position: 'absolute', [side]: x, bottom: 0, height, opacity: tween(frame, at, at + 8), transform: `translateY(${(1 - p) * 140}px)`, transformOrigin: '50% 100%' }}>
      <div style={{ position: 'absolute', left: '50%', top: '42%', width: height * 1.05, height: height * 1.05, marginLeft: -height * 0.525, marginTop: -height * 0.525, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(231,201,135,0.28) 0%, rgba(201,164,92,0.10) 38%, rgba(14,31,58,0) 68%)' }} />
      <Img src={staticFile(`poses/${p0}.png`)} style={{ position: 'relative', height: '100%', transform: `${flip ? 'scaleX(-1) ' : ''}scale(${breathe}) rotate(${sway}deg)`, transformOrigin: '50% 100%',
        filter: 'drop-shadow(0 0 2px rgba(231,201,135,0.55)) drop-shadow(0 24px 40px rgba(0,0,0,0.5))' }} />
    </div>
  );
};
