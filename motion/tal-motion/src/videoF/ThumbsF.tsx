import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { F } from '../kit/brand';
import { K } from './kitF';
const Bg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 80% at 50% 45%, #262C37 0%, ${K.bg} 60%, #08090C 100%)`, overflow: 'hidden' }}>{children}</AbsoluteFill>
);
const Pic: React.FC<{ file: string; size: number; x: number; y: number; ring?: string; pos?: string }> = ({ file, size, x, y, ring = K.gold, pos = '50% 20%' }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, overflow: 'hidden', border: `8px solid ${ring}`, boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
    <Img src={staticFile(`srcF/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: 'scale(1.35)', transformOrigin: pos }} />
  </div>
);
const Tall: React.FC<{ pose: string; h: number; x: number }> = ({ pose, h, x }) => (
  <Img src={staticFile(`poses/${pose}.png`)} style={{ position: 'absolute', right: x, bottom: -10, height: h, filter: 'drop-shadow(0 0 3px rgba(240,207,126,0.7)) drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }} />
);
const T: React.FC<{ children: React.ReactNode; size: number; color?: string }> = ({ children, size, color = K.ink }) => (
  <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: size, lineHeight: 0.95, color, letterSpacing: '-0.02em', textTransform: 'uppercase', textShadow: '0 6px 0 rgba(0,0,0,0.6), 0 0 30px rgba(0,0,0,0.6)' }}>{children}</div>
);
export const ThumbVF_A: React.FC = () => (
  <Bg>
    <div style={{ position: 'absolute', left: 280, top: 40, fontSize: 130 }}>🇺🇸</div>
    <div style={{ position: 'absolute', left: 920, top: 50, fontSize: 120 }}>🇨🇳</div>
    <Pic file="jensen.jpg" size={420} x={470} y={110} pos="60% 14%" />
    <Pic file="musk.jpg" size={180} x={60} y={30} ring={K.us} />
    <Pic file="jiang.jpg" size={180} x={1060} y={30} ring={K.cn} pos="50% 25%" />
    <div style={{ position: 'absolute', left: 40, bottom: 30 }}><T size={130} color={K.goldHi}>SNEAKY</T><T size={130}>PLAN</T></div>
    <Tall pose="shocked" h={420} x={10} />
  </Bg>
);
export const ThumbVF_B: React.FC = () => (
  <Bg>
    <div style={{ position: 'absolute', left: 40, top: 60 }}><T size={170}>FREE AI</T><T size={170} color={K.goldHi}>= TRAP?</T></div>
    <div style={{ position: 'absolute', left: 60, bottom: 50, display: 'flex', gap: 24, alignItems: 'center' }}>
      <div style={{ background: K.cn, color: '#fff', borderRadius: 16, padding: '10px 24px', fontFamily: F.sans, fontWeight: 700, fontSize: 56 }}>🇨🇳 $0</div>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 56, color: K.mute }}>vs</div>
      <div style={{ background: K.us, color: '#fff', borderRadius: 16, padding: '10px 24px', fontFamily: F.sans, fontWeight: 700, fontSize: 56 }}>🇺🇸 $20/mo</div>
    </div>
    <Tall pose="serious" h={480} x={10} />
  </Bg>
);
export const ThumbVF_C: React.FC = () => (
  <Bg>
    <Pic file="jensen.jpg" size={330} x={70} y={70} pos="60% 14%" ring={K.red} />
    <div style={{ position: 'absolute', left: 430, top: 60 }}><T size={160}>SPY</T><T size={100} color={K.mute}>OR</T><T size={150} color={K.goldHi}>SETUP?</T></div>
    <div style={{ position: 'absolute', left: 70, bottom: 50, border: `6px solid ${K.red}`, color: K.red, borderRadius: 14, padding: '6px 22px', transform: 'rotate(-6deg)',
      fontFamily: F.sans, fontWeight: 700, fontSize: 54, background: 'rgba(20,23,29,0.8)' }}>NVIDIA</div>
    <Tall pose="thinking" h={360} x={0} />
  </Bg>
);
