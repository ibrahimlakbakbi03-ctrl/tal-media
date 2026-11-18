import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { F } from '../kit/brand';
import { Camera, tween } from '../kit/motion';
import { useScene } from '../kit/storyF';
import { Sfx } from '../kit/sfx';

/** VIDEO F · Bravos-style kit (charcoal stage, one gold accent, pill titles, source line, logo top-right, subscribe bottom-right). */
export const K = {
  bg: '#14171D', panel: '#1C2028', panel2: '#232833', grid: 'rgba(255,255,255,0.06)',
  gold: '#D8B25E', goldHi: '#F0CF7E', ink: '#F2F2F0', mute: '#9AA1AD', dim: '#5E6572',
  red: '#E0584B', green: '#4FB286', cn: '#E5484D', us: '#3E7BE0',
};

export const Stage: React.FC<{ glow?: [number, number] }> = ({ glow = [0.5, 0.45] }) => {
  const f = useCurrentFrame();
  const d = (f * 0.25) % 80;
  return (
    <AbsoluteFill style={{ background: K.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 65% 70% at ${glow[0] * 100}% ${glow[1] * 100}%, #20252E 0%, ${K.bg} 60%, #0C0E12 100%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${K.grid} 1px, transparent 1px), linear-gradient(90deg, ${K.grid} 1px, transparent 1px)`,
        backgroundSize: '80px 80px', backgroundPosition: `${d}px ${d * 0.5}px`, opacity: 0.35,
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 75%)' }} />
      <AbsoluteFill style={{ boxShadow: 'inset 0 0 260px rgba(0,0,0,0.75)' }} />
    </AbsoluteFill>
  );
};

/** Logo top-right (TAL) + subscribe icon bottom-right. */
export const Brand: React.FC = () => (
  <>
    <div style={{ position: 'absolute', right: 60, top: 44, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ height: 34, padding: '0 9px', borderRadius: 8, background: K.gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.serif, fontWeight: 900, fontSize: 20, color: K.bg, letterSpacing: '0.02em' }}>TAL</div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 20, letterSpacing: '0.14em', color: 'rgba(242,242,240,0.7)' }}>THE ARAB LEDGER</div>
    </div>
    <div style={{ position: 'absolute', right: 60, bottom: 44, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px 8px 10px',
      borderRadius: 30, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
      <div style={{ width: 26, height: 26, borderRadius: 13, background: K.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 0, height: 0, borderLeft: '9px solid white', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', marginLeft: 3 }} />
      </div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 18, letterSpacing: '0.1em', color: 'rgba(242,242,240,0.75)' }}>SUBSCRIBE</div>
    </div>
  </>
);

export const ShellF: React.FC<{ children: React.ReactNode; glow?: [number, number]; zoom?: [number, number] }> = ({ children, glow, zoom = [1.0, 1.05] }) => {
  const f = useCurrentFrame();
  const { dur } = useScene();
  const fin = tween(f, 0, 10, 0, 1, Easing.out(Easing.quad));
  return (
    <AbsoluteFill style={{ opacity: fin }}>
      <Sfx at={2} s="whoosh" v={0.8} />
      <Stage glow={glow} />
      <Camera dur={dur + 12} zoom={zoom}>{children}</Camera>
      <Brand />
    </AbsoluteFill>
  );
};

export const At: React.FC<{ x: number; y: number; w?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, ...style }}>{children}</div>
);

export const In: React.FC<{ at: number; children: React.ReactNode; dy?: number; pop?: boolean; style?: React.CSSProperties }> = ({ at, children, dy = 24, pop, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = tween(f, at, at + 10);
  if (pop) {
    const s = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 150, mass: 0.7 } });
    return <><Sfx at={at} s="pop" v={0.7} /><div style={{ opacity: o, transform: `scale(${0.7 + 0.3 * s})`, ...style }}>{children}</div></>;
  }
  const p = tween(f, at, at + 16);
  return <div style={{ opacity: o, transform: `translateY(${(1 - p) * dy}px)`, ...style }}>{children}</div>;
};

/** Gentle continuous float (keeps a hold from feeling frozen). */
export const Float: React.FC<{ children: React.ReactNode; amp?: number; speed?: number; phase?: number }> = ({ children, amp = 6, speed = 1, phase = 0 }) => {
  const f = useCurrentFrame();
  return <div style={{ transform: `translateY(${amp * Math.sin(f / (28 / speed) + phase)}px)` }}>{children}</div>;
};

/** Fade-out at frame `at` (to swap content inside a long scene). */
export const Out: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const o = 1 - tween(f, at, at + 10);
  if (o <= 0) return null;
  return <div style={{ opacity: o, transform: `translateY(${(1 - o) * -20}px)` }}>{children}</div>;
};

export const Pill: React.FC<{ text: string; at?: number; color?: string; ink?: string; size?: number }> = ({ text, at = 0, color = K.gold, ink = K.bg, size = 30 }) => {
  const f = useCurrentFrame();
  const p = tween(f, at, at + 14, 0, 1, Easing.out(Easing.exp));
  return (<><Sfx at={at} s="zip" v={0.8} />
    <div style={{ display: 'inline-block', overflow: 'hidden', borderRadius: 40, clipPath: `inset(0 ${(1 - p) * 100}% 0 0 round 40px)` }}>
      <div style={{ background: color, color: ink, padding: '10px 28px', fontFamily: F.sans, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap' }}>{text}</div>
    </div></>
  );
};

export const Src: React.FC<{ text: string; at?: number }> = ({ text, at = 0 }) => {
  const f = useCurrentFrame();
  return <div style={{ position: 'absolute', left: 70, bottom: 50, opacity: tween(f, at, at + 12) * 0.85, fontFamily: F.sans, fontWeight: 500, fontSize: 21, color: K.mute, maxWidth: 1250 }}>Source: {text}</div>;
};

export const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 96, color = K.ink, style }) => (
  <div style={{ fontFamily: F.serif, fontWeight: 900, fontSize: size, lineHeight: 1.05, color, letterSpacing: '-0.02em', ...style }}>{children}</div>
);
export const Txt: React.FC<{ children: React.ReactNode; size?: number; color?: string; w?: number; weight?: number; style?: React.CSSProperties }> = ({ children, size = 34, color = K.ink, w, weight = 500, style }) => (
  <div style={{ fontFamily: F.sans, fontWeight: weight, fontSize: size, lineHeight: 1.3, color, width: w, ...style }}>{children}</div>
);
export const Gold: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: K.goldHi }}>{children}</span>;

export const Face: React.FC<{ file: string; size?: number; ring?: string; pos?: string; at?: number }> = ({ file, size = 220, ring = K.gold, pos = '50% 22%', at = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 140 } });
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', border: `5px solid ${ring}`, boxShadow: '0 14px 40px rgba(0,0,0,0.5)',
      transform: `scale(${0.6 + 0.4 * s})`, opacity: tween(f, at, at + 8), background: K.panel }}>
      <Img src={staticFile(`srcF/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: 'scale(1.35)', transformOrigin: pos }} />
    </div>
  );
};

export const QuoteCard: React.FC<{ at: number; file: string; name: string; role: string; quote: string; src: string; w?: number; pos?: string; color?: string; qsize?: number; para?: boolean }> = ({
  at, file, name, role, quote, src, w = 1180, pos = '50% 25%', color = K.gold, qsize = 46, para,
}) => {
  const f = useCurrentFrame();
  const p = tween(f, at, at + 16);
  const z = 1 + Math.min(0.06, Math.max(0, f - at) * 0.0003);
  const big = w >= 1000;
  return (<><Sfx at={at} s="paper" />
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)`, width: w, display: 'flex', gap: big ? 40 : 24, alignItems: 'stretch', boxSizing: 'border-box',
      background: K.panel, borderRadius: 22, padding: 26, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)' }}>
      <div style={{ width: big ? 420 : 250, height: big ? 420 : 330, borderRadius: 16, overflow: 'hidden', flexShrink: 0, border: `3px solid ${color}` }}>
        <Img src={staticFile(`srcF/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${z})` }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 16 }}>
        <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', color, textTransform: 'uppercase' }}>{name}</div>
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 24, color: K.mute, marginTop: 4 }}>{role}</div>
        <div style={{ fontFamily: F.serif, fontWeight: 700, fontStyle: 'italic', fontSize: qsize, lineHeight: 1.18, color: K.ink, marginTop: 22 }}>{para ? quote : `“${quote}”`}</div>
        <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 20, color: K.dim, marginTop: 22 }}>{src}</div>
      </div>
    </div></>
  );
};

export const Headline: React.FC<{ at: number; outlet: string; date: string; text: string; w?: number; tilt?: number; accent?: string }> = ({ at, outlet, date, text, w = 820, tilt = -1.5, accent = K.ink }) => {
  const f = useCurrentFrame();
  const p = tween(f, at, at + 14);
  return (<><Sfx at={at} s="paper" />
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(${tilt}deg)`, width: w, background: '#F4F2EC', borderRadius: 10, padding: '26px 34px',
      boxShadow: '0 30px 70px rgba(0,0,0,0.6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1A1A1A', paddingBottom: 10 }}>
        <div style={{ fontFamily: F.serif, fontWeight: 900, fontSize: 30, color: '#111' }}>{outlet}</div>
        <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 20, color: '#555', alignSelf: 'flex-end' }}>{date}</div>
      </div>
      <div style={{ fontFamily: F.serif, fontWeight: 800, fontSize: 40, lineHeight: 1.15, color: '#111', marginTop: 16 }}>{text}</div>
      <div style={{ height: 6, width: 90, background: accent === K.ink ? K.gold : accent, marginTop: 16, borderRadius: 3 }} />
    </div></>
  );
};

export const FlagNode: React.FC<{ at: number; flag: string; label?: string; size?: number; color?: string }> = ({ at, flag, label, size = 150, color = K.gold }) => (
  <In at={at} pop style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
    <div style={{ width: size, height: size, borderRadius: size / 2, background: K.panel2, border: `4px solid ${color}`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size * 0.56, boxShadow: '0 14px 40px rgba(0,0,0,0.5)' }}>{flag}</div>
    {label && <div style={{ background: color, color: K.bg, borderRadius: 30, padding: '6px 18px', fontFamily: F.sans, fontWeight: 700, fontSize: 22, whiteSpace: 'nowrap' }}>{label}</div>}
  </In>
);

export const Tile: React.FC<{ at: number; icon: string; label: string; size?: number; color?: string; sub?: string }> = ({ at, icon, label, size = 150, color = K.gold, sub }) => (
  <In at={at} pop style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: size + 70 }}>
    <div style={{ width: size, height: size, borderRadius: 28, background: K.panel2, border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.48, boxShadow: '0 14px 40px rgba(0,0,0,0.5)' }}>{icon}</div>
    <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 26, color: K.ink, textAlign: 'center' }}>{label}</div>
    {sub && <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 21, color: K.mute, textAlign: 'center', marginTop: -6 }}>{sub}</div>}
  </In>
);

export const Dash: React.FC<{ at: number; from: [number, number]; to: [number, number]; color?: string; label?: string; curve?: number; dur?: number }> = ({
  at, from, to, color = K.gold, label, curve = 0, dur = 16,
}) => {
  const f = useCurrentFrame();
  const p = tween(f, at, at + dur, 0, 1, Easing.out(Easing.cubic));
  const [x1, y1] = from, [x2, y2] = to;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - curve;
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.15;
  const id = `m${x1}_${y1}_${x2}_${y2}`;
  const flow = -(f * 1.2) % 26;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <defs><mask id={id}><path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} stroke="white" strokeWidth={14} fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - p)} /></mask></defs>
      <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} stroke={color} strokeWidth={4} fill="none" strokeDasharray="14 12" strokeDashoffset={flow} mask={`url(#${id})`} />
      {p > 0.95 && <circle cx={x2} cy={y2} r={8} fill={color} />}
      {label && p > 0.6 && (
        <foreignObject x={mx - 200} y={my - 34} width={400} height={60}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: K.bg, border: `2px solid ${color}`, color, borderRadius: 24, padding: '4px 16px', fontFamily: F.sans, fontWeight: 700, fontSize: 22, opacity: tween(f, at + dur * 0.6, at + dur) }}>{label}</div>
          </div>
        </foreignObject>
      )}
    </svg>
  );
};

export const HBarsF: React.FC<{ at: number; rows: { label: string; value: number; text: string; color?: string; flag?: string }[]; max: number; w?: number; h?: number }> = ({ at, rows, max, w = 1100, h = 74 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      {rows.map((r, i) => {
        const s = spring({ frame: f - at - i * 8, fps, config: { damping: 18, stiffness: 90 } });
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: tween(f, at + i * 8, at + i * 8 + 8) }}>
            <div style={{ width: 300, fontFamily: F.sans, fontWeight: 700, fontSize: 32, color: K.ink, textAlign: 'right' }}>{r.flag ? r.flag + ' ' : ''}{r.label}</div>
            <div style={{ width: w * (r.value / max) * s, height: h, borderRadius: 10, background: r.color ?? K.gold }} />
            <div style={{ fontFamily: F.serif, fontWeight: 900, fontSize: 52, color: r.color ?? K.goldHi, opacity: s }}>{r.text}</div>
          </div>
        );
      })}
    </div>
  );
};

export const VBars: React.FC<{ at: number; bars: { label: string; value: number; text: string; color?: string; at?: number }[]; max: number; h?: number; bw?: number; gap?: number }> = ({ at, bars, max, h = 520, bw = 170, gap = 60 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap, height: h + 120, borderBottom: `2px solid ${K.dim}` }}>
      {bars.map((b, i) => {
        const a = b.at ?? at + i * 10;
        const s = spring({ frame: f - a, fps, config: { damping: 18, stiffness: 90 } });
        return (
          <div key={i} style={{ width: bw, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' }}>
            <div style={{ fontFamily: F.serif, fontWeight: 900, fontSize: 44, color: b.color ?? K.goldHi, opacity: s, marginBottom: 10 }}>{b.text}</div>
            <div style={{ width: bw, height: h * (b.value / max) * s, background: b.color ?? K.gold, borderRadius: '10px 10px 0 0' }} />
            <div style={{ position: 'absolute', bottom: -58, fontFamily: F.sans, fontWeight: 700, fontSize: 24, color: K.mute, whiteSpace: 'nowrap', opacity: tween(f, a, a + 10) }}>{b.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Ring: React.FC<{ at: number; pct: number; label: string; size?: number; color?: string; text?: string }> = ({ at, pct, label, size = 360, color = K.gold, text }) => {
  const f = useCurrentFrame();
  const p = tween(f, at, at + 30, 0, 1, Easing.out(Easing.cubic));
  const r = size / 2 - 22, c = 2 * Math.PI * r;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: tween(f, at, at + 8) }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} stroke={K.panel2} strokeWidth={34} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={34} fill="none" strokeDasharray={c} strokeDashoffset={c * (1 - (pct / 100) * p)} strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.serif, fontWeight: 900, fontSize: size * 0.24, color: K.ink }}>
          {text ?? `${Math.round(pct * p)}%`}
        </div>
      </div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 28, color: K.ink, textAlign: 'center', maxWidth: size + 80 }}>{label}</div>
    </div>
  );
};

export const LineF: React.FC<{ at: number; pts: number[]; w?: number; h?: number; min: number; max: number; color?: string; dur?: number;
  xLabels?: { i: number; t: string }[]; yTicks?: { v: number; t: string }[]; marks?: { i: number; t: string; color?: string; above?: boolean }[]; hlines?: { v: number; t: string; color?: string }[] }> = ({
  at, pts, w = 1300, h = 560, min, max, color = K.gold, dur = 50, xLabels = [], yTicks = [], marks = [], hlines = [],
}) => {
  const f = useCurrentFrame();
  const p = tween(f, at, at + dur, 0, 1, Easing.inOut(Easing.quad));
  const X = (i: number) => (i / (pts.length - 1)) * w;
  const Y = (v: number) => h - ((v - min) / (max - min)) * h;
  const n = Math.max(2, Math.ceil(p * pts.length));
  const d = pts.slice(0, n).map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  return (
    <div style={{ position: 'relative', width: w + 140, height: h + 80, background: K.panel, borderRadius: 18, padding: '30px 30px 50px 110px', boxSizing: 'content-box', marginLeft: -110 }}>
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {yTicks.map((t, i) => (
          <g key={i}><line x1={0} x2={w} y1={Y(t.v)} y2={Y(t.v)} stroke={K.grid} strokeWidth={2} />
            <text x={-16} y={Y(t.v) + 8} textAnchor="end" fill={K.mute} fontFamily="IBM Plex Sans" fontSize={22}>{t.t}</text></g>
        ))}
        {hlines.map((l, i) => {
          const o = tween(f, at + dur * 0.6 + i * 10, at + dur * 0.6 + i * 10 + 12);
          return (<g key={i} opacity={o}><line x1={0} x2={w} y1={Y(l.v)} y2={Y(l.v)} stroke={l.color ?? K.red} strokeWidth={3} strokeDasharray="12 10" />
            <text x={w - 6} y={Y(l.v) - 12} textAnchor="end" fill={l.color ?? K.red} fontFamily="IBM Plex Sans" fontWeight={700} fontSize={24}>{l.t}</text></g>);
        })}
        <path d={d} stroke={color} strokeWidth={5} fill="none" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${color}66)` }} />
        {xLabels.map((l, i) => <text key={i} x={X(l.i)} y={h + 40} textAnchor="middle" fill={K.mute} fontFamily="IBM Plex Sans" fontSize={22}>{l.t}</text>)}
        {marks.map((m, i) => {
          const o = p * pts.length >= m.i ? tween(f, at + (m.i / pts.length) * dur, at + (m.i / pts.length) * dur + 10) : 0;
          const y = Y(pts[m.i]);
          return (<g key={i} opacity={o}><circle cx={X(m.i)} cy={y} r={10} fill={m.color ?? K.goldHi} />
            <foreignObject x={X(m.i) - 160} y={m.above === false ? y + 18 : y - 70} width={320} height={52}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ background: m.color ?? K.gold, color: K.bg, borderRadius: 24, padding: '4px 14px', fontFamily: F.sans, fontWeight: 700, fontSize: 22, whiteSpace: 'nowrap' }}>{m.t}</div></div>
            </foreignObject></g>);
        })}
      </svg>
    </div>
  );
};

export const StampF: React.FC<{ at: number; text: string; color?: string; size?: number; rot?: number }> = ({ at, text, color = K.gold, size = 90, rot = -8 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 180, mass: 0.6 } });
  return (<><Sfx at={at} s="thud" />{f >= at && (
    <div style={{ transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * s})`, opacity: Math.min(1, (f - at) / 4), display: 'inline-block',
      border: `8px solid ${color}`, borderRadius: 16, padding: '10px 34px', fontFamily: F.sans, fontWeight: 800, fontSize: size, letterSpacing: '0.06em', color,
      background: 'rgba(20,23,29,0.75)', boxShadow: `0 0 40px ${color}55`, whiteSpace: 'nowrap' }}>{text}</div>)}</>
  );
};

export const Score: React.FC<{ free: number; paid: number; bumpAt?: number; bump?: 'free' | 'paid'; dock?: boolean; at?: number }> = ({ free, paid, bumpAt, bump, dock = true, at = 0 }) => {
  const f = useCurrentFrame();
  const o = tween(f, at, at + 10);
  const fv = bump === 'free' && bumpAt !== undefined && f < bumpAt ? free - 1 : free;
  const pv = bump === 'paid' && bumpAt !== undefined && f < bumpAt ? paid - 1 : paid;
  const pulse = bumpAt !== undefined ? 1 + 0.25 * Math.max(0, 1 - Math.abs(f - bumpAt - 4) / 8) : 1;
  const sc = dock ? 0.55 : 1;
  const hit = bumpAt !== undefined && f >= bumpAt;
  return (<>{bumpAt !== undefined && <Sfx at={bumpAt} s="pop" v={1.2} />}
    <div style={{ position: 'absolute', left: dock ? 60 : '50%', top: dock ? 34 : 600, transform: `translateX(${dock ? 0 : -50}%) scale(${sc})`, transformOrigin: 'left top', opacity: o,
      display: 'flex', alignItems: 'stretch', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ background: K.cn, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 44 }}>🇨🇳</span><span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: '#fff' }}>FREE AI</span>
      </div>
      <div style={{ background: K.panel2, padding: '6px 30px', display: 'flex', alignItems: 'center', gap: 18, fontFamily: F.serif, fontWeight: 900, fontSize: 64, color: K.ink }}>
        <span style={{ display: 'inline-block', transform: `scale(${bump === 'free' ? pulse : 1})`, color: bump === 'free' && hit ? K.goldHi : K.ink }}>{fv}</span>
        <span style={{ color: K.dim, fontSize: 48 }}>–</span>
        <span style={{ display: 'inline-block', transform: `scale(${bump === 'paid' ? pulse : 1})`, color: bump === 'paid' && hit ? K.goldHi : K.ink }}>{pv}</span>
      </div>
      <div style={{ background: K.us, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: '#fff' }}>PAID AI</span><span style={{ fontSize: 44 }}>🇺🇸</span>
      </div>
    </div></>
  );
};

export const RoundChip: React.FC<{ n: string; title: string }> = ({ n, title }) => (
  <div style={{ position: 'absolute', left: '50%', top: 40, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ background: K.gold, color: K.bg, borderRadius: 8, padding: '6px 14px', fontFamily: F.sans, fontWeight: 800, fontSize: 22, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{n}</div>
    {title && <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.08em', color: K.ink, whiteSpace: 'nowrap' }}>{title}</div>}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; w?: number; style?: React.CSSProperties; border?: string }> = ({ children, w, style, border = 'rgba(255,255,255,0.08)' }) => (
  <div style={{ width: w, background: K.panel, borderRadius: 20, padding: 30, border: `1px solid ${border}`, boxShadow: '0 24px 60px rgba(0,0,0,0.45)', ...style }}>{children}</div>
);

export const Count: React.FC<{ at: number; to: number; from?: number; dur?: number; dec?: number; pre?: string; suf?: string; size?: number; color?: string }> = ({ at, to, from = 0, dur = 40, dec = 0, pre = '', suf = '', size = 120, color = K.goldHi }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return <Big size={size} color={color} style={{ opacity: tween(f, at - 2, at + 6) }}>{pre}{v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suf}</Big>;
};
