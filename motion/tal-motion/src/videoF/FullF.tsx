import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { F } from '../kit/brand';
import { tween } from '../kit/motion';
import { cueAbs, LINES, SceneProvider, Tal, useCue } from '../kit/storyF';
import { SfxScope } from '../kit/sfx';
import { At, Big, Card, Count, Dash, Face, FlagNode, Float, In, K, Pill, QuoteCard, Score, ShellF, Src, StampF, Tile, Txt, Gold } from './kitF';
import { S2 } from './FullF2';

/** VIDEO F · "China's Sneaky Plan to Win AI (Nvidia Just Exposed It)" · narration v7 (VoxCPM2 Voice 5), Bravos style.
 *  Line index = script line − 1 up to 67; 67 = 68, 68 = 68b, 69 = 68c, 70 = 69, 71 = 70, 72 = 71. */
const AUDIO_SEC = LINES[LINES.length - 1].e + 1.0;
const END_SEC = 16;
export const FULLF_LEN = Math.ceil((AUDIO_SEC + END_SEC) * 30);

/* ================= COLD OPEN ================= */
const Box: React.FC<{ x: number; y: number; w: number; h: number; at: number }> = ({ x, y, w, h, at }) => {
  const f = useCurrentFrame();
  const p = tween(f, at, at + 12);
  return (
    <div style={{ position: 'absolute', left: x, top: y - (1 - p) * 60, width: w, height: h, opacity: p, background: 'linear-gradient(160deg,#3A3F4A,#2A2E37)',
      border: '2px solid #4A505C', borderRadius: 6, boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.42, height: 14, background: K.gold, opacity: 0.85 }} />
      <div style={{ position: 'absolute', left: 14, top: 10, fontFamily: F.sans, fontWeight: 800, fontSize: 18, color: K.mute, letterSpacing: '0.1em' }}>AI GPU · SEALED</div>
    </div>
  );
};
const S_Boxes: React.FC = () => {
  const q = useCue();
  const boxes: [number, number, number, number][] = [[150, 640, 300, 190], [470, 640, 300, 190], [300, 450, 300, 190], [790, 640, 300, 190], [620, 450, 300, 190], [460, 260, 300, 190]];
  return (
    <ShellF glow={[0.35, 0.55]} zoom={[1.08, 1.0]}>
      {boxes.map(([x, y, w, h], i) => <Box key={i} x={x} y={y} w={w} h={h} at={q(0, 3) + i * 5} />)}
      <At x={1180} y={540}><In at={q(0, 30)}><div style={{ display: 'flex', gap: 30, fontSize: 120, opacity: 0.8 }}>🪑🪑</div><Txt size={30} color={K.mute}>2 employees found</Txt></In></At>
      <At x={1180} y={230}><In at={q(0, 14)}><Pill text="Bought by one of Nvidia's biggest customers" at={q(0, 14)} size={28} /></In>
        <div style={{ marginTop: 26 }}><Count at={q(0, 18)} to={5} pre="~$" suf="B" size={150} /></div>
        <In at={q(0, 22)}><Txt size={30} color={K.mute}>of the most powerful AI chips</Txt></In></At>
      <At x={150} y={800}><In at={q(0, 40)}><StampF at={q(0, 40)} text="NEVER OPENED" size={64} color={K.red} /></In></At>
      <Src text="New York Times reporting on Megaspeed (2025); CBS (~$5B)" at={q(0, 18)} />
    </ShellF>
  );
};
const S_Stepped: React.FC = () => {
  const q = useCue();
  return (
    <ShellF glow={[0.4, 0.45]}>
      <At x={170} y={200}><Face file="jensen.jpg" size={460} at={q(1, 2)} pos="60% 14%" /></At>
      <At x={720} y={230} w={1000}>
        <In at={q(1, 8)}><Txt size={34} color={K.mute} weight={600}>The man who sold those chips</Txt></In>
        <In at={q(1, 10)}><Big size={84}>Jensen Huang</Big></In>
        <In at={q(1, 16)}><Txt size={32} color={K.mute}>CEO of Nvidia, the world's most important chip company</Txt></In>
        <div style={{ marginTop: 40 }}><StampF at={q(1, 20)} text="STEPPED DOWN" size={74} color={K.red} /></div>
        <In at={q(1, 26)} style={{ marginTop: 40 }}><div style={{ display: 'inline-block', border: `2px solid ${K.red}`, color: K.red, borderRadius: 30, padding: '8px 20px', fontFamily: F.sans, fontWeight: 700, fontSize: 26 }}>
          ALLEGED · US officials: a Chinese intelligence operation</div></In>
      </At>
      <Src text="Nvidia 8-K (12 Nov 2026); CNBC; TechCrunch timeline" at={q(1, 20)} />
    </ShellF>
  );
};
export const Door: React.FC<{ at: number; label: string; cross?: number }> = ({ at, label, cross }) => {
  const f = useCurrentFrame();
  const c = cross !== undefined ? tween(f, cross, cross + 10) : 0;
  return (
    <In at={at} pop>
      <div style={{ position: 'relative', width: 360, height: 520, borderRadius: '180px 180px 12px 12px', background: K.panel2, border: `5px solid ${K.gold}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 70px rgba(0,0,0,0.55)' }}>
        <div style={{ fontFamily: F.serif, fontWeight: 900, fontSize: 64, color: K.ink }}>{label}</div>
        <div style={{ position: 'absolute', right: 34, top: 400, width: 22, height: 22, borderRadius: 11, background: K.gold }} />
        {c > 0 && <svg width={360} height={520} style={{ position: 'absolute', left: 0, top: 0 }}>
          <line x1={40} y1={60} x2={40 + 280 * c} y2={60 + 400 * c} stroke={K.red} strokeWidth={16} strokeLinecap="round" />
          <line x1={320} y1={60} x2={320 - 280 * c} y2={60 + 400 * c} stroke={K.red} strokeWidth={16} strokeLinecap="round" /></svg>}
      </div>
    </In>
  );
};
const S_Wrong: React.FC = () => {
  const q = useCue();
  return (
    <ShellF glow={[0.5, 0.5]}>
      <At x={300} y={150}><Door at={q(2, 4)} label="VICTIM?" cross={q(2, 15)} /></At>
      <At x={900} y={150}><Door at={q(2, 9)} label="SETUP?" cross={q(2, 16)} /></At>
      <At x={120} y={760} w={1300}><div style={{ display: 'flex', justifyContent: 'center' }}><StampF at={q(2, 17)} text="THE WRONG QUESTION" size={70} rot={-3} /></div></At>
    </ShellF>
  );
};
const S_Plan: React.FC = () => {
  const q = useCue();
  const f = useCurrentFrame();
  const drip = (f % 30) / 30;
  return (
    <ShellF glow={[0.5, 0.45]}>
      <At x={340} y={170}><FlagNode at={q(3, 0)} flag="🇨🇳" label="China" size={190} color={K.cn} /></At>
      <At x={1000} y={170}><FlagNode at={q(3, 0)} flag="🇺🇸" label="America" size={190} color={K.us} /></At>
      <At x={170} y={500} w={640}><In at={q(3, 34)}>
        <Card w={600} border={K.goldHi}><Txt size={30} color={K.mute} weight={600}>CHINA'S PLAN</Txt><Big size={88} color={K.goldHi}>AI = FREE</Big>
          <div style={{ fontSize: 80, marginTop: 6 }}>🚰<span style={{ display: 'inline-block', transform: `translateY(${drip * 30}px)`, opacity: 1 - drip }}>💧</span></div></Card></In></At>
      <At x={830} y={500} w={640}><In at={q(3, 26)}>
        <Card w={600}><Txt size={30} color={K.mute} weight={600}>THE WEST'S MODEL</Txt><Big size={80}>$20/month</Big><div style={{ fontSize: 80, marginTop: 6 }}>🧾</div></Card></In></At>
      <At x={0} y={110} w={1920}><div style={{ display: 'flex', justifyContent: 'center' }}><Pill text="Not the best AI. The cheapest AI." at={q(3, 26)} /></div></At>
    </ShellF>
  );
};
const S_Lineup: React.FC = () => {
  const q = useCue();
  const people: [string, string, string][] = [['jensen.jpg', 'Jensen Huang', '60% 14%'], ['musk.jpg', 'Elon Musk', '50% 25%'], ['jiang.jpg', 'Professor Jiang', '50% 25%'], ['hassabis.jpg', 'Demis Hassabis', '50% 20%'], ['zuckerberg.jpg', 'Mark Zuckerberg', '50% 15%']];
  const f = useCurrentFrame();
  const title = q(4, 32);
  return (
    <ShellF glow={[0.5, 0.4]}>
      {f < title + 6 ? (<>
        <At x={0} y={140} w={1920}><div style={{ display: 'flex', justifyContent: 'center', gap: 50 }}>
          {people.map(([file, name, pos], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Float phase={i}><Face file={file} size={250} at={q(4, 12 + i * 2)} pos={pos} /></Float>
              <In at={q(4, 12 + i * 2)}><Txt size={28} weight={700}>{name}</Txt></In>
            </div>))}
        </div></At>
        <At x={0} y={490} w={1920}><div style={{ display: 'flex', justifyContent: 'center' }}><In at={q(4, 26)}><Pill text="6 rounds · every claim checked" /></In></div></At>
        <Score free={0} paid={0} dock={false} at={q(4, 2)} />
      </>) : (
        <At x={0} y={300} w={1920}><div style={{ textAlign: 'center' }}>
          <In at={title}><Txt size={36} color={K.goldHi} weight={700} style={{ letterSpacing: '0.2em' }}>THE TWIST AT THE END</Txt></In>
          <In at={title + 4}><Big size={130}>China can win the AI race</Big></In>
          <In at={title + 30}><Big size={130} color={K.goldHi}>and still lose the money race</Big></In>
        </div></At>
      )}
    </ShellF>
  );
};

/* ================= 1 · WHAT HAPPENED ================= */
const S_Mega: React.FC = () => {
  const q = useCue();
  return (
    <ShellF glow={[0.5, 0.5]}>
      <Score free={0} paid={0} />
      <At x={0} y={140} w={1920}><div style={{ display: 'flex', justifyContent: 'center' }}><Pill text="Megaspeed: one of Nvidia's biggest foreign customers" at={q(5, 0)} /></div></At>
      <At x={180} y={330} w={1560}><div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tile at={q(5, 6)} icon="🇸🇬" label="Cloud company" sub="Singapore" size={180} />
        <Tile at={q(5, 30)} icon="👥" label="2 staff" sub="couldn't explain the business" size={180} />
        <Tile at={q(5, 38)} icon="🏪" label="A storefront" sub="Malaysia · no engineers" size={180} />
        <Tile at={q(5, 46)} icon="📦" label="Still in boxes" sub="Nvidia hardware" size={180} color={K.red} />
      </div></At>
      <Src text="New York Times (Oct 2025); CBS News" at={q(5, 6)} />
    </ShellF>
  );
};
const S_Kiriakou: React.FC = () => {
  const q = useCue();
  return (
    <ShellF glow={[0.45, 0.45]}>
      <Score free={0} paid={0} />
      <At x={170} y={220}><QuoteCard at={q(6, 0)} file="kiriakou.jpg" name="John Kiriakou" role="Former CIA officer" quote="bad tradecraft" src="The Diary Of A CEO, Nov 2026" pos="50% 20%" qsize={70} /></At>
      <At x={170} y={760} w={1150}><In at={q(6, 16)}><Txt size={30} color={K.mute}>A real cover company has <Gold>a website, an office and an annual report.</Gold></Txt></In></At>
    </ShellF>
  );
};
const S_Timeline: React.FC = () => {
  const q = useCue();
  const steps: [number, string, string, string?][] = [[q(7, 0), 'A Megaspeed executive', 'relationship with Huang'], [q(7, 10), 'US officials allege', 'she worked for Chinese intelligence', K.red], [q(7, 20), 'Huang admits the affair', 'board opens an investigation'], [q(7, 30), '4 days later', 'he steps down', K.red]];
  return (
    <ShellF glow={[0.5, 0.5]}>
      <Score free={0} paid={0} />
      <At x={0} y={150} w={1920}><div style={{ display: 'flex', justifyContent: 'center' }}><Pill text="How it unfolded" at={q(7, 0)} /></div></At>
      <At x={120} y={300} w={1680}><div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {steps.map(([at, a, b, c], i) => (
          <In key={i} at={at} pop><Card w={350} border={c ?? 'rgba(255,255,255,0.08)'} style={{ minHeight: 300 }}>
            <Big size={70} color={c ?? K.goldHi}>{i + 1}</Big><Txt size={38} weight={700} style={{ marginTop: 10 }}>{a}</Txt><Txt size={32} color={K.mute}>{b}</Txt></Card></In>))}
      </div></At>
      {[0, 1, 2].map((i) => <Dash key={i} at={steps[i + 1][0]} from={[120 + i * 443 + 412, 450]} to={[120 + (i + 1) * 443 + 8, 450]} color={K.dim} />)}
      <At x={120} y={720} w={1300}><In at={q(7, 10)}><Txt size={26} color={K.red} weight={600}>Allegation: the woman is not named or shown in this video.</Txt></In></At>
      <Src text="TechCrunch timeline; Financial Times; Nvidia 8-K (12 Nov 2026)" at={q(7, 10)} />
    </ShellF>
  );
};
const S_Earnings: React.FC = () => {
  const q = useCue();
  const f = useCurrentFrame();
  const W = 1240, H = W * 735 / 1620;
  const lv = (y: number, at: number, t: string, c: string) => (
    <div style={{ position: 'absolute', left: 0, top: y * H, width: W * 0.935, opacity: tween(f, at, at + 12) }}>
      <div style={{ borderTop: `4px dashed ${c}` }} />
      <div style={{ position: 'absolute', left: 16, top: -50, background: c, color: K.bg, borderRadius: 24, padding: '4px 16px', fontFamily: F.sans, fontWeight: 700, fontSize: 24 }}>{t}</div>
    </div>
  );
  return (
    <ShellF glow={[0.5, 0.5]} zoom={[1.0, 1.04]}>
      <Score free={0} paid={0} />
      <At x={70} y={130}><Pill text="NVDA weekly · Lak's levels" at={q(8, 0)} /></At>
      <At x={70} y={220}><In at={q(8, 0)}><div style={{ position: 'relative', width: W, height: H, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Img src={staticFile('srcF/nvda_chart.jpg')} style={{ width: W, height: H }} />
        {lv(0.459, q(8, 20), '~$150 · the dip zone if it holds', K.green)}
        {lv(0.691, q(8, 26), 'Break → 2025 low ~$87', K.red)}
      </div></In></At>
      <At x={1400} y={220} w={440}><In at={q(8, 10)}><Card w={400}>
        <Txt size={24} color={K.mute} weight={700}>Q3 REVENUE · 17 NOV</Txt>
        <Count at={q(8, 14)} to={115.8} dec={1} pre="$" suf="B" size={86} />
        <Txt size={26} color={K.mute} style={{ marginTop: 8 }}>vs <span style={{ color: K.ink, fontWeight: 700 }}>~$109B</span> expected</Txt>
        <div style={{ marginTop: 18, display: 'inline-block', background: K.green, color: K.bg, borderRadius: 24, padding: '4px 16px', fontFamily: F.sans, fontWeight: 700, fontSize: 24 }}>BEAT</div>
      </Card></In></At>
      <Src text="Nvidia Q3 FY27 results (8-K, 17 Nov 2026); consensus via MarketBeat/CoinDesk. Chart: Lak's levels, not financial advice." at={q(8, 10)} />
    </ShellF>
  );
};
const S_Loop1: React.FC = () => {
  const q = useCue();
  return (
    <ShellF glow={[0.5, 0.5]}>
      <Score free={0} paid={0} />
      <At x={300} y={170}><Door at={q(9, 2)} label="SPY?" /></At>
      <At x={900} y={170}><Door at={q(9, 6)} label="SETUP?" /></At>
      <At x={120} y={780} w={1300}><div style={{ display: 'flex', justifyContent: 'center' }}><In at={q(9, 14)}><Pill text="Answer in the FINAL ROUND →" size={34} /></In></div></At>
    </ShellF>
  );
};

const S_End: React.FC = () => (
  <AbsoluteFill><ShellF>
    <At x={0} y={110} w={1920}><div style={{ display: 'flex', justifyContent: 'center' }}><Pill text="WATCH NEXT" size={34} /></div></At>
    <At x={260} y={260}><div style={{ width: 880, height: 495, borderRadius: 18, border: `3px dashed ${K.gold}`, background: 'rgba(255,255,255,0.03)' }} /></At>
    <At x={1300} y={340}><div style={{ width: 340, height: 340, borderRadius: 170, border: `3px dashed ${K.gold}`, background: 'rgba(255,255,255,0.03)' }} /></At>
    <At x={0} y={840} w={1920}><div style={{ display: 'flex', justifyContent: 'center' }}><Txt size={34} color={K.mute}>Same world. <Gold>Different lens.</Gold></Txt></div></At>
  </ShellF></AbsoluteFill>
);

/* ================= SCENES ================= */
type SceneDef = { line: number; el: React.ReactNode; tal?: { pose: string; h?: number; side?: 'left' | 'right' } };
export const SCENES_F: SceneDef[] = [
  { line: 0, el: <S_Boxes />, tal: { pose: 'shocked' } },
  { line: 1, el: <S_Stepped />, tal: { pose: 'worried' } },
  { line: 2, el: <S_Wrong />, tal: { pose: 'serious' } },
  { line: 3, el: <S_Plan />, tal: { pose: 'pointup' } },
  { line: 4, el: <S_Lineup />, tal: { pose: 'explaining' } },
  { line: 5, el: <S_Mega />, tal: { pose: 'explaining' } },
  { line: 6, el: <S_Kiriakou />, tal: { pose: 'thinking' } },
  { line: 7, el: <S_Timeline />, tal: { pose: 'serious' } },
  { line: 8, el: <S_Earnings />, tal: { pose: 'pointing' } },
  { line: 9, el: <S_Loop1 />, tal: { pose: 'pointing' } },
  ...S2,
];

const starts = SCENES_F.map((s) => Math.max(0, cueAbs(s.line) - 6));
export const END_AT = Math.ceil(AUDIO_SEC * 30) + 10;
const ranges = SCENES_F.map((s, i) => [starts[i], i < SCENES_F.length - 1 ? starts[i + 1] : END_AT] as [number, number]);

export const FullF: React.FC<{ audio?: boolean }> = ({ audio = true }) => (
  <AbsoluteFill style={{ background: K.bg }}>
    {SCENES_F.map((s, i) => {
      const [a, b] = ranges[i];
      return (
        <Sequence key={i} from={a} durationInFrames={Math.max(1, b - a + 12)} name={`S${i} L${s.line}`}>
          <SceneProvider start={a} dur={b - a}><SfxScope dur={b - a}>
            {s.el}
            {s.tal && <Tal pose={s.tal.pose} height={Math.min(s.tal.h ?? 360, 360)} at={4} side={s.tal.side} x={s.tal.side === 'left' ? 30 : 200} />}
          </SfxScope></SceneProvider>
        </Sequence>
      );
    })}
    <Sequence from={END_AT} durationInFrames={FULLF_LEN - END_AT}><SceneProvider start={END_AT} dur={FULLF_LEN - END_AT}><S_End /><Tal pose="wave" height={300} at={4} side="left" x={60} /></SceneProvider></Sequence>
    {audio && <Audio src={staticFile('voiceF.wav')} />}
  </AbsoluteFill>
);
