import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const tween = (f: number, a: number, b: number, from = 0, to = 1, easing: (t: number) => number = ease) =>
  interpolate(f, [a, Math.max(a + 1, b)], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });
/** Slow camera push (zoom from→to over dur) with a gentle sideways drift. */
export const Camera: React.FC<{ children: React.ReactNode; zoom?: [number, number]; pan?: [number, number]; dur: number; origin?: string }> = ({ children, zoom = [1, 1.04], pan = [0, 0], dur, origin = '50% 50%' }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, Math.max(1, dur)], zoom, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
  const px = interpolate(f, [0, Math.max(1, dur)], [pan[0], pan[1]], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) + 6 * Math.sin(f / 70);
  const py = 4 * Math.sin(f / 90);
  return <AbsoluteFill style={{ transform: `translate(${px}px, ${py}px) scale(${z})`, transformOrigin: origin }}>{children}</AbsoluteFill>;
};
