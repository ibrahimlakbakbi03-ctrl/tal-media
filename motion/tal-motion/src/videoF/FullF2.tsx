import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { F } from '../kit/brand';
import { tween } from '../kit/motion';
import { useCue } from '../kit/storyF';
import { At, Big, Card, Count, Dash, Face, Float, Gold, Headline, HBarsF, In, K, LineF, Out, Pill, QuoteCard, Ring, RoundChip, Score, ShellF, Src, StampF, Tile, Txt, VBars } from './kitF';

type SceneDef = { line: number; el: React.ReactNode; tal?: { pose: string; h?: number; side?: 'left' | 'right' } };
const Center: React.FC<{ y: number; children: React.ReactNode; w?: number }> = ({ y, children, w = 1400 }) => (
  <At x={(1920 - w) / 2 - 120} y={y} w={w}><div style={{ display: 'flex', justifyContent: 'center' }}>{children}</div></At>
);
const Versus: React.FC<{ at: number; a: [string, string, string, string?]; b: [string, string, string, string?]; ca?: string; cb?: string }> = ({ at, a, b, ca = K.gold, cb = K.gold }) => (
  <At x={120} y={150} w={1300}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}><Float><Face file={a[0]} size={250} at={at} pos={a[3]} ring={ca} /></Float>
      <In at={at}><Txt size={34} weight={800} style={{ textAlign: 'center' }}>{a[1]}</Txt></In><In at={at}><Txt size={24} color={K.mute} style={{ textAlign: 'center' }}>{a[2]}</Txt></In></div>
    <In at={at + 6} pop><Big size={110} color={K.goldHi}>VS</Big></In>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}><Float phase={2}><Face file={b[0]} size={250} at={at + 8} pos={b[3]} ring={cb} /></Float>
      <In at={at + 8}><Txt size={34} weight={800} style={{ textAlign: 'center' }}>{b[1]}</Txt></In><In at={at + 8}><Txt size={24} color={K.mute} style={{ textAlign: 'center' }}>{b[2]}</Txt></In></div>
  </div></At>
);
const ClaimBox: React.FC<{ at: number; text: string; color?: string; w?: number; size?: number }> = ({ at, text, color = K.gold, w = 560, size = 40 }) => (
  <In at={at}><div style={{ width: w, borderLeft: `8px solid ${color}`, background: K.panel, borderRadius: '0 16px 16px 0', padding: '20px 26px',
    fontFamily: F.serif, fontWeight: 700, fontStyle: 'italic', fontSize: size, lineHeight: 1.2, color: K.ink }}>{text}</div></In>
);
const Chip: React.FC<{ at: number; text: string; color?: string; size?: number }> = ({ at, text, color = K.gold, size = 28 }) => (
  <In at={at} pop><div style={{ display: 'inline-block', background: K.panel2, border: `2px solid ${color}`, borderRadius: 14, padding: '10px 22px', fontFamily: F.sans, fontWeight: 800, fontSize: size, color: K.ink, whiteSpace: 'nowrap' }}>{text}</div></In>
);

/* ================= ROUND 1 ================= */
const R1a: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={0} paid={0} /><RoundChip n="ROUND 1" title="JENSEN VS JENSEN" />
      <At x={120} y={160}><In at={q(10, 0)}><Pill text="Same man · same day · 5 Nov 2025" /></In></At>
      <At x={130} y={290}><Headline at={q(10, 9)} outlet="FINANCIAL TIMES" date="MORNING · 5 Nov 2025" text="Jensen Huang: “China is going to win the AI race”" w={620} tilt={-2} /></At>
      <At x={800} y={330}><Headline at={q(11, 4)} outlet="NVIDIA on X" date="SAME NIGHT" text="“China is nanoseconds behind America in AI… vital that America wins by racing ahead”" w={620} tilt={1.5} /></At>
      <At x={130} y={820} w={1300}><In at={q(12, 16)}><Txt size={36} weight={700}>Why? He wanted to <Gold>sell chips to China</Gold>, and Washington had banned it.</Txt></In></At>
      <Src text="Financial Times via Reuters/Yahoo Finance (5 Nov 2025); Nvidia statement on X; Quartz" at={q(10, 9)} />
    </ShellF>
  );
};
const R1b: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={0} paid={1} bump="paid" bumpAt={q(14, 0)} /><RoundChip n="ROUND 1" title="JENSEN VS JENSEN" />
      <At x={120} y={160}><Pill text="Notable AI models, 2025" at={q(13, 0)} /></At>
      <At x={300} y={250}><VBars at={q(13, 16)} max={50} h={430} bw={220} gap={160} bars={[
        { label: '🇺🇸 United States', value: 50, text: '50', color: K.us, at: q(13, 16) }, { label: '🇨🇳 China', value: 30, text: '30', color: K.cn, at: q(13, 22) }]} /></At>
      <At x={1000} y={330}><StampF at={q(14, 0)} text="PARTLY" size={96} /><In at={q(14, 2)} style={{ marginTop: 40 }}><Txt size={34} w={420}>America wins the <Gold>frontier</Gold>, but that's not China's race.</Txt></In></At>
      <Src text="Stanford HAI, AI Index Report 2026" at={q(13, 11)} />
    </ShellF>
  );
};
/* ================= ROUND 2 ================= */
const R2a: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={0} paid={1} /><RoundChip n="ROUND 2" title="FREE VS RENTED · THE SNEAKY PLAN" />
      <At x={120} y={160}><Pill text="China's “AI Plus” plan · Aug 2025" at={q(15, 0)} /></At>
      <At x={130} y={300} w={1300}><div style={{ display: 'flex', gap: 60 }}>
        <Ring at={q(15, 20)} pct={70} label="of devices & services by 2027" size={330} color={K.cn} />
        <Ring at={q(15, 28)} pct={90} label="by 2030" size={330} color={K.cn} />
        <In at={q(15, 32)}><Card w={420} border={K.goldHi}><Txt size={26} color={K.mute} weight={700}>IN OTHER WORDS</Txt><Big size={64} color={K.goldHi}>AI as a utility</Big><div style={{ fontSize: 70 }}>⚡💧</div><Txt size={28} color={K.mute}>like electricity or water</Txt></Card></In>
      </div></At>
      <Src text="State Council AI+ guideline (Aug 2025) via Yicai; CSET translation" at={q(15, 9)} />
    </ShellF>
  );
};
const R2b: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={0} paid={1} /><RoundChip n="ROUND 2" title="FREE VS RENTED · THE SNEAKY PLAN" />
      <At x={130} y={170} w={600}><In at={q(16, 0)}><Card w={560} border={K.cn}><Txt size={26} color={K.mute} weight={700}>🇨🇳 CHINA · OPEN & FREE</Txt>
        <div style={{ display: 'flex', gap: 14, marginTop: 20, flexWrap: 'wrap' }}>{['DeepSeek', 'Qwen (Alibaba)', 'Kimi'].map((t, i) => (
          <In key={i} at={q(16, 13 + i * 2)} pop><div style={{ background: K.panel2, border: `2px solid ${K.cn}`, borderRadius: 14, padding: '10px 20px', fontFamily: F.sans, fontWeight: 700, fontSize: 32, color: K.ink }}>{t}</div></In>))}</div>
        <Txt size={30} style={{ marginTop: 22 }}>Anyone can <Gold>download for $0</Gold></Txt></Card></In></At>
      <At x={790} y={170} w={600}><In at={q(17, 0)}><Card w={560} border={K.us}><Txt size={26} color={K.mute} weight={700}>🇺🇸 AMERICA · CLOSED & RENTED</Txt>
        <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>{['per month', 'per question'].map((t, i) => (
          <In key={i} at={q(17, 14 + i * 4)} pop><div style={{ background: K.panel2, border: `2px solid ${K.us}`, borderRadius: 14, padding: '10px 20px', fontFamily: F.sans, fontWeight: 700, fontSize: 32, color: K.ink }}>💳 {t}</div></In>))}</div>
        <Txt size={30} style={{ marginTop: 22 }}>Costs <Gold>tens of billions</Gold> to build</Txt></Card></In></At>
      <At x={130} y={640} w={1300}><In at={q(17, 24)}><Txt size={34} color={K.mute}>Two opposite business models for the same technology.</Txt></In></At>
    </ShellF>
  );
};
const R2c: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={0} paid={1} /><RoundChip n="ROUND 2" title="SO WHO'S WINNING?" />
      <At x={120} y={160}><Pill text="Share of open-model downloads · Hugging Face" at={q(18, 3)} /></At>
      <At x={130} y={280}><HBarsF at={q(18, 8)} max={45} w={520} rows={[{ label: 'China', flag: '🇨🇳', value: 41, text: '41%', color: K.cn }, { label: 'USA', flag: '🇺🇸', value: 36.5, text: '36.5%', color: K.us }]} /></At>
      <At x={1130} y={230}><Ring at={q(18, 28)} pct={61} label="Chinese models' share of usage on OpenRouter" size={320} color={K.cn} text="~61%" /></At>
      <At x={130} y={660} w={900}><In at={q(19, 0)}><Card w={860}><Txt size={24} color={K.mute} weight={700}>TO BE FAIR</Txt><Txt size={32}>A top China analyst calls the 90% target <Gold>“unbelievably optimistic”</Gold>, but China only needs to become <Gold>the default</Gold>.</Txt></Card></In></At>
      <At x={520} y={540}><StampF at={q(19, 16)} text="90%? NOT NEEDED" size={34} color={K.mute} rot={-5} /></At>
      <At x={130} y={560}><In at={q(19, 26)} pop><Pill text="DEFAULT = WIN" at={q(19, 26)} size={32} /></In></At>
      <Src text="Wing VC, “China's open-weight takeover”; OpenRouter; Jeffrey Ding, ChinAI #327" at={q(18, 14)} />
    </ShellF>
  );
};
const R2d: React.FC = () => {
  const q = useCue();
  const hub: [number, number] = [430, 520];
  const nodes: [string, string, number, number][] = [['🔌', 'Chips', 900, 250], ['⚡', 'Power', 1150, 420], ['📱', 'Phones', 900, 600], ['🏭', 'Factories', 1150, 760]];
  return (
    <ShellF><Score free={0} paid={1} bump="free" bumpAt={q(21, 40)} /><RoundChip n="ROUND 2" title="THE TRICK" />
      <At x={hub[0] - 150} y={hub[1] - 150}><In at={q(20, 8)} pop><div style={{ width: 300, height: 300, borderRadius: 150, background: K.panel2, border: `5px solid ${K.goldHi}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Big size={60} color={K.goldHi}>FREE AI</Big><Txt size={28} color={K.mute}>$0</Txt></div></In></At>
      {nodes.map(([ic, t, x, y], i) => (<React.Fragment key={i}>
        <Dash at={q(20, 18 + i * 4)} from={[hub[0] + 150, hub[1]]} to={[x - 60, y]} label={i === 0 ? 'the money goes →' : undefined} />
        <At x={x - 60} y={y - 75}><Tile at={q(20, 20 + i * 4)} icon={ic} label={t} size={130} /></At></React.Fragment>))}
      <At x={120} y={850} w={700}><In at={q(21, 0)}><Txt size={28} color={K.mute}>Even Jiang: the chip seller wants AI <Gold>open & free</Gold>; the renters need a <Gold>closed market</Gold>.</Txt></In></At>
      <At x={130} y={170}><StampF at={q(21, 40)} text="TRUE" size={80} color={K.green} /></At>
      <Src text="Jiang lecture, 17 Nov 2026 (paraphrased)" at={q(21, 0)} />
    </ShellF>
  );
};
/* ================= ROUND 3 ================= */
const R3a: React.FC = () => {
  const q = useCue();
  const pts: [string, number, number][] = [['NVIDIA', 330, 420], ['OpenAI', 1050, 420], ['Oracle', 690, 820]];
  return (
    <ShellF><Score free={1} paid={1} /><RoundChip n="ROUND 3" title="“IT'S A BUBBLE” VS “IT'S THE BEGINNING”" />
      <At x={120} y={150} w={1300}><div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
        <Face file="jiang.jpg" size={150} at={q(22, 0)} /><In at={q(22, 0)}><Txt size={34} weight={800}>Professor Jiang:</Txt><Txt size={32} color={K.goldHi} weight={700}>“definitely a bubble”</Txt></In>
      </div></At>
      {pts.map(([t, x, y], i) => (<At key={i} x={x - 120} y={y - 60}><In at={q(23, [3, 14, 29][i])} pop><div style={{ width: 240, height: 120, borderRadius: 20, background: K.panel2, border: `4px solid ${K.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, fontWeight: 800, fontSize: 38, color: K.ink }}>{t}</div></In></At>))}
      <Dash at={q(23, 8)} from={[450, 420]} to={[930, 420]} label="up to $100B" />
      <Dash at={q(23, 22)} from={[1050, 480]} to={[810, 780]} label="$300B deal" curve={-40} />
      <Dash at={q(23, 32)} from={[570, 780]} to={[330, 480]} label="buys chips" curve={-40} />
      <At x={1120} y={230}><StampF at={q(23, 44)} text="PAYDAY?" size={60} color={K.red} /></At>
      <Src text="Nvidia–OpenAI LOI (22 Sep 2025); OpenAI–Oracle deal (WSJ); The Register" at={q(23, 3)} />
    </ShellF>
  );
};
const R3b: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={1} paid={1} /><RoundChip n="ROUND 3" title="THE CIRCLE IS REAL" />
      <At x={120} y={150} w={1300}><div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
        <Face file="jensen.jpg" size={130} at={q(24, 0)} pos="60% 14%" /><In at={q(24, 0)}><Txt size={34} weight={800}>Huang:</Txt><Txt size={32} color={K.goldHi} weight={700}>“we're still early”</Txt></In></div></At>
      <At x={120} y={340}><Pill text="Bain: the AI revenue gap" at={q(25, 5)} /></At>
      <At x={200} y={380}><VBars at={q(25, 14)} max={2000} h={380} bw={240} gap={180} bars={[
        { label: 'Spent per year', value: 500, text: '$500B', color: K.mute, at: q(25, 14) }, { label: 'Revenue needed per year', value: 2000, text: '$2T', color: K.gold, at: q(25, 26) }]} /></At>
      <At x={1020} y={560}><In at={q(25, 36)}><Big size={90} color={K.red}>4×</Big><Txt size={30} color={K.mute}>and nowhere near it today</Txt></In></At>
      <Src text="Bain & Company, Technology Report 2025" at={q(25, 5)} />
    </ShellF>
  );
};
const R3c: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={1} paid={1} /><RoundChip n="ROUND 3" title="WHAT THE NUMBERS SAY · 17 NOV" />
      <At x={120} y={160}><Pill text="Nvidia quarterly revenue" at={q(26, 0)} /></At>
      <At x={200} y={240}><VBars at={q(26, 8)} max={134} h={430} bw={200} gap={110} bars={[
        { label: 'Q3 2025', value: 57, text: '$57B', color: K.mute, at: q(26, 8) }, { label: 'Q3 2026', value: 115.8, text: '$115.8B', color: K.gold, at: q(26, 12) },
        { label: 'Next quarter (guide)', value: 134, text: 'up to $134B', color: K.goldHi, at: q(26, 20) }]} /></At>
      <At x={1150} y={300}><In at={q(26, 12)} pop><Big size={110} color={K.green}>+103%</Big><Txt size={28} color={K.mute}>in one year</Txt></In></At>
      <At x={130} y={860} w={1300}><In at={q(26, 32)}><Txt size={32}>But that money comes from the same AI companies <Gold>inside Jiang's circle</Gold>.</Txt></In></At>
      <Src text="Nvidia Q3 FY27 results (8-K, 17 Nov 2026)" at={q(26, 8)} />
    </ShellF>
  );
};
const R3d: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={1} paid={1} /><RoundChip n="ROUND 3" title="OUR TAKE" />
      <At x={120} y={160}><Pill text="2000: the dot-com crash" at={q(27, 8)} /></At>
      <At x={130} y={290} w={1300}><div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <Tile at={q(27, 14)} icon="💥" label="Crash" sub="2000–2002" size={160} color={K.red} />
        <Tile at={q(27, 20)} icon="🧵" label="Cheap fibre" sub="left in the ground" size={160} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{['Google', 'YouTube', 'Facebook'].map((t, i) => (
          <In key={i} at={q(27, 31 + i * 2)} pop><div style={{ background: K.panel2, border: `2px solid ${K.gold}`, borderRadius: 14, padding: '10px 26px', fontFamily: F.sans, fontWeight: 800, fontSize: 36, color: K.ink }}>{t}</div></In>))}</div>
      </div></At>
      <At x={130} y={700} w={1300}><In at={q(27, 36)}><Txt size={40} weight={700}>A pop wouldn't kill American AI. <Gold>It would make it cheaper.</Gold></Txt></In></At>
      <At x={600} y={830}><StampF at={q(27, 48)} text="UNPROVEN · DRAW" size={56} color={K.mute} /></At>
      <Src text="NYT (18 Jun 2001): ~5% of US fibre in use" at={q(27, 20)} />
    </ShellF>
  );
};
/* ================= ROUND 4 ================= */
const R4a: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={1} paid={1} /><RoundChip n="ROUND 4" title="“JUST A DATABASE” VS “A NOBEL PRIZE”" />
      <Versus at={q(28, 0)} a={['jiang.jpg', 'Professor Jiang', 'Predictive History', '50% 25%']} b={['hassabis.jpg', 'Demis Hassabis', 'CEO, Google DeepMind', '50% 20%']} />
      <At x={120} y={620} w={580}><ClaimBox at={q(28, 13)} text="“brute force… a giant database with a lot of computers”" w={560} size={34} /></At>
      <At x={820} y={620} w={600}><In at={q(29, 12)}><Card w={560} border={K.goldHi}><Txt size={26} color={K.mute} weight={700}>ALPHAFOLD</Txt>
        <Count at={q(29, 20)} to={200} suf="M" size={86} /><Txt size={28}>protein shapes predicted</Txt><Txt size={28} color={K.goldHi} weight={700} style={{ marginTop: 10 }}>🏅 Nobel Prize in Chemistry 2024</Txt></Card></In></At>
      <Src text="Jiang interview (Erhardt), 2026; Nobel Prize press release (9 Oct 2024)" at={q(28, 13)} />
    </ShellF>
  );
};
const R4b: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={2} paid={1} bump="free" bumpAt={q(31, 26)} /><RoundChip n="ROUND 4" title="VERDICT" />
      <At x={130} y={200} w={600}><Card w={560}><Txt size={26} color={K.mute} weight={700}>ON THE TECHNOLOGY</Txt><Txt size={34} style={{ marginTop: 10 }}>No database search has ever won a Nobel Prize.</Txt>
        <div style={{ marginTop: 26 }}><StampF at={q(30, 4)} text="FALSE" size={70} color={K.red} rot={-4} /></div></Card></At>
      <At x={780} y={200} w={600}><Card w={560}><Txt size={26} color={K.mute} weight={700}>ON THE MONEY</Txt><Txt size={34} style={{ marginTop: 10 }}>Easy to copy = hard to charge for. That's <Gold>America's business model.</Gold></Txt>
        <div style={{ marginTop: 26 }}><StampF at={q(31, 12)} text="TRUE" size={70} color={K.green} rot={-4} /></div></Card></At>
      <At x={130} y={720} w={1300}><In at={q(32, 0)}><div style={{ display: 'flex', alignItems: 'center', gap: 26 }}><div style={{ fontSize: 80 }}>📦</div>
        <Txt size={36} weight={700}>Back to the boxes: China isn't short of ideas, it's <Gold>short of hardware</Gold>.</Txt></div></In></At>
      <At x={130} y={860}><In at={q(32, 20)}><Pill text="Next: the real weapon in this race →" at={q(32, 20)} size={30} /></In></At>
    </ShellF>
  );
};
/* ================= ROUND 5 ================= */
const R5a: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={2} paid={1} /><RoundChip n="ROUND 5" title="“CHIPS DECIDE” VS “POWER DECIDES”" />
      <At x={120} y={170} w={600}><In at={q(33, 0)}><Card w={560} border={K.us}><div style={{ fontSize: 70 }}>🏛️</div><Txt size={34} weight={800}>Washington</Txt><Txt size={28} color={K.mute}>Best Nvidia chips blocked from China</Txt><Big size={64} color={K.goldHi} style={{ marginTop: 8 }}>since 2022</Big></Card></In></At>
      <At x={790} y={170} w={620}><QuoteCard at={q(34, 0)} file="musk.jpg" name="Elon Musk" role="Moonshots podcast, Jan 2026" quote="China's going to have more power than anyone else" src="via Business Insider, 6 Jan 2026" w={620} pos="50% 20%" qsize={32} /></At>
      <Src text="US export controls (Oct 2022–); Moonshots with Peter Diamandis #220" at={q(33, 8)} />
    </ShellF>
  );
};
const R5b: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={2} paid={1} /><RoundChip n="ROUND 5" title="POWER & MINERALS" />
      <At x={120} y={160}><Pill text="Electricity generated, 2024 (TWh)" at={q(35, 0)} /></At>
      <At x={130} y={280}><HBarsF at={q(35, 3)} max={10100} w={560} h={64} rows={[{ label: 'China', flag: '🇨🇳', value: 10070, text: '~10,000', color: K.cn }, { label: 'USA', flag: '🇺🇸', value: 4400, text: '~4,400', color: K.us }]} /></At>
      <At x={130} y={560} w={1300}><div style={{ display: 'flex', gap: 80 }}>
        <Ring at={q(36, 12)} pct={98} label="of the world's low-purity gallium" size={280} color={K.cn} />
        <Ring at={q(36, 20)} pct={60} label="of germanium (approx.)" size={280} color={K.cn} text="~60%" />
        <In at={q(36, 26)}><Card w={360} border={K.red}><Txt size={26} color={K.red} weight={800}>EXPORTS RESTRICTED</Txt><Big size={80}>2023</Big><Txt size={26} color={K.mute}>both metals</Txt></Card></In>
      </div></At>
      <Src text="Ember Global Electricity Review 2025; USGS via ORF America; IEEE Spectrum" at={q(35, 3)} />
    </ShellF>
  );
};
const R5c: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={2} paid={1} /><RoundChip n="ROUND 5" title="THIS WEEK, THEY COLLIDED" />
      <At x={130} y={170} w={560}><In at={q(37, 12)}><Card w={540} border={K.goldHi}><Txt size={26} color={K.goldHi} weight={800}>#STANDWITHJENSEN</Txt>
        <Count at={q(37, 24)} to={175000} size={84} /><Txt size={28}>signatures</Txt><div style={{ marginTop: 16 }}><Count at={q(37, 36)} to={7500} suf="+" size={64} color={K.ink} /></div><Txt size={26} color={K.mute}>say they work at Nvidia</Txt></Card></In></At>
      <At x={740} y={160}><Face file="musk.jpg" size={170} at={q(37, 10)} /></At>
      <At x={930} y={190} w={480}><ClaimBox at={q(37, 46)} text="Without Huang, “critical deals will be lost”" w={460} size={32} /></At>
      <At x={740} y={520} w={680}><QuoteCard at={q(38, 0)} file="bessent.jpg" name="Scott Bessent" role="US Treasury Secretary" quote="Wants an outsider to run Nvidia" src="as reported by Quartz · photo: White House (public domain)" w={680} pos="50% 20%" qsize={30} para /></At>
      <Src text="CNBC via Quartz (13–14 Nov 2026); WSJ (16 Nov); The Guardian; Musk on X (14 Nov)" at={q(37, 12)} />
    </ShellF>
  );
};
/* --- 8:08 · Why does Musk care? (line 39) --- */
const R5d1: React.FC = () => {
  const q = useCue();
  const hub: [number, number] = [330, 560];
  const bets: [string, string, string, number, number, number][] = [
    ['⚡', 'Power plants', 'xAI turbines', 860, 330, q(39, 33)], ['🖥️', 'Data centres', 'Colossus, Memphis', 1140, 560, q(39, 36)], ['🚀', 'Rockets', 'SpaceX', 860, 790, q(39, 40)]];
  return (
    <ShellF><Score free={2} paid={1} /><RoundChip n="ROUND 5" title="OUR TAKE · WHY DOES MUSK CARE?" />
      <At x={hub[0] - 150} y={hub[1] - 150}><Float><Face file="musk.jpg" size={300} at={q(39, 0)} /></Float></At>
      <At x={120} y={150}><In at={q(39, 0)}><Big size={64}>Why does <Gold>Musk</Gold> care?</Big></In></At>
      <At x={560} y={250}><Out at={q(39, 28)}>
        <In at={q(39, 7)}><Card w={560}><Txt size={24} color={K.mute} weight={700}>OFFICIALLY</Txt><Txt size={34} weight={700}>Huang is the <Gold>best builder</Gold> in tech</Txt></Card></In>
        <In at={q(39, 18)} style={{ marginTop: 26 }}><Card w={560} border={K.goldHi}><Txt size={24} color={K.goldHi} weight={700}>BUT ALSO</Txt><Txt size={34} weight={700}>One of <Gold>Nvidia's biggest customers</Gold></Txt><Txt size={26} color={K.mute}>xAI runs on Nvidia chips</Txt></Card></In>
      </Out></At>
      {bets.map(([ic, t, s, x, y, a], i) => (<React.Fragment key={i}>
        <Dash at={a - 4} from={[hub[0] + 150, hub[1]]} to={[x - 20, y]} label={i === 0 ? 'betting everything on infrastructure' : undefined} />
        <At x={x - 20} y={y - 90}><Float phase={i * 1.7} amp={5}><Tile at={a} icon={ic} label={t} sub={s} size={130} /></Float></At></React.Fragment>))}
      <Src text="Musk on X (14 Nov 2026); xAI Colossus (Memphis); our analysis (opinion)" at={q(39, 18)} />
    </ShellF>
  );
};
/* --- 8:23 · Our take: state vs billionaires (line 40) --- */
const R5d2: React.FC = () => {
  const q = useCue();
  const f = useCurrentFrame();
  const fight = q(40, 48);
  const shake = f > fight + 20 ? 3 * Math.sin(f / 2.5) : 0;
  return (
    <ShellF><Score free={2} paid={1} /><RoundChip n="ROUND 5" title="OUR TAKE" />
      <At x={120} y={150}><In at={q(40, 0)}><div style={{ display: 'inline-block', border: `2px solid ${K.goldHi}`, color: K.goldHi, borderRadius: 30, padding: '6px 20px', fontFamily: F.sans, fontWeight: 800, fontSize: 24 }}>OPINION</div></In></At>
      {f < fight - 4 ? (<>
        <At x={130} y={240} w={1300}><In at={q(40, 4)}><Txt size={40} weight={800}>Musk wants what China has…</Txt></In>
          <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
            <Chip at={q(40, 12)} text="⚡ the speed of a country that builds" color={K.cn} />
          </div>
          <In at={q(40, 16)} style={{ marginTop: 26 }}><Txt size={40} weight={800}>…but <Gold>private</Gold>.</Txt></In>
          <div style={{ display: 'flex', gap: 24, marginTop: 24 }}><Chip at={q(40, 20)} text="🏢 private" color={K.us} /><Chip at={q(40, 24)} text="👤 run by founders" color={K.us} /><Chip at={q(40, 27)} text="🚫 not the state" color={K.red} /></div>
        </At>
        <At x={130} y={700} w={1300}><div style={{ display: 'flex', gap: 30 }}>
          <In at={q(40, 33)}><Card w={560} border={K.cn}><Txt size={24} color={K.mute} weight={700}>🇨🇳 CHINA BUILDS AI INFRASTRUCTURE THROUGH</Txt><Big size={64} color={K.cn}>the state</Big></Card></In>
          <In at={q(40, 42)}><Card w={560} border={K.us}><Txt size={24} color={K.mute} weight={700}>🇺🇸 AMERICA BUILDS IT THROUGH</Txt><Big size={64} color={K.us}>billionaires</Big></Card></In>
        </div></At>
      </>) : (<>
        <At x={130} y={250} w={1300}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: `translateX(${shake}px)` }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}><Face file="musk.jpg" size={240} at={fight} ring={K.us} /><Txt size={30} weight={800}>The billionaires</Txt></div>
          <In at={fight + 8} pop><div style={{ width: 300, height: 300, borderRadius: 30, background: K.panel2, border: `5px solid ${K.goldHi}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${K.gold}55` }}>
            <div style={{ fontSize: 110 }}>🔌</div><Big size={48} color={K.goldHi}>NVIDIA</Big></div></In>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}><Face file="bessent.jpg" size={240} at={fight + 4} ring={K.red} pos="50% 20%" /><Txt size={30} weight={800}>Washington</Txt></div>
        </div></At>
        <Dash at={fight + 10} from={[400, 380]} to={[620, 380]} color={K.us} />
        <Dash at={fight + 12} from={[1160, 380]} to={[940, 380]} color={K.red} />
        <At x={130} y={720} w={1300}><In at={fight + 14}><Txt size={40} weight={800} style={{ textAlign: 'center' }}>Fighting over who controls <Gold>the most important chip company on Earth</Gold></Txt></In></At>
      </>)}
    </ShellF>
  );
};
/* --- line 41 · they need each other + verdict --- */
const R5d3: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} bump="free" bumpAt={q(41, 30)} /><RoundChip n="ROUND 5" title="VERDICT" />
      <At x={130} y={230} w={1300}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <In at={q(41, 0)}><Card w={460} border={K.us}><div style={{ fontSize: 80 }}>🇺🇸🔌</div><Txt size={36} weight={800}>The best chips</Txt></Card></In>
        <In at={q(41, 18)} pop><Float amp={8}><Big size={130} color={K.goldHi}>⇄</Big></Float></In>
        <In at={q(41, 7)}><Card w={460} border={K.cn}><div style={{ fontSize: 80 }}>🇨🇳⚡⛏️</div><Txt size={36} weight={800}>Power + minerals</Txt></Card></In>
      </div></At>
      <Center y={600}><In at={q(41, 18)}><Txt size={44} weight={800}>They <Gold>need each other</Gold>.</Txt></In></Center>
      <Center y={720}><StampF at={q(41, 30)} text="PARTLY" size={70} /></Center>
    </ShellF>
  );
};
/* ================= ROUND 6 (8:57–9:30) ================= */
const Dots: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const pts = Array.from({ length: 26 }, (_, i) => [(i * 137) % 1100, ((i * 251) % 300)]);
  return (<svg width={1150} height={320} style={{ position: 'absolute', left: 0, top: 0 }}>
    {pts.map(([x, y], i) => { const o = tween(f, at + i * 2, at + i * 2 + 8); const pulse = 6 + 3 * Math.sin(f / 6 + i);
      return <g key={i} opacity={o}><circle cx={x + 20} cy={y + 10} r={pulse} fill={K.red} /><circle cx={x + 20} cy={y + 10} r={pulse * 2.4} fill="none" stroke={K.red} strokeOpacity={0.35} /></g>; })}
    {pts.slice(0, 25).map(([x, y], i) => { const [x2, y2] = pts[i + 1]; return <line key={'l' + i} x1={x + 20} y1={y + 10} x2={x2 + 20} y2={y2 + 10} stroke={K.red} strokeOpacity={0.18 * tween(f, at + i * 2 + 6, at + i * 2 + 14)} strokeWidth={2} />; })}
  </svg>);
};
const R6a: React.FC = () => {
  const q = useCue();
  return (
    <ShellF glow={[0.5, 0.6]}><Score free={3} paid={1} /><RoundChip n="ROUND 6" title="“CONTROL GRID” VS “AI FOR EVERYONE”" />
      <At x={120} y={150} w={1300}><div style={{ display: 'flex', gap: 34, alignItems: 'center' }}>
        <Float><Face file="jiang.jpg" size={200} at={q(42, 0)} pos="50% 25%" ring={K.red} /></Float>
        <div><In at={q(42, 0)}><Txt size={34} weight={800}>Professor Jiang's darkest claim</Txt></In>
          <In at={q(42, 8)}><Big size={60}>AI isn't about chatbots.<br /><span style={{ color: K.red }}>It's about control.</span></Big></In></div>
      </div></At>
      <At x={130} y={480} w={1150} style={{ height: 320 }}><Dots at={q(42, 20)} /></At>
      <At x={130} y={520} w={1300}><div style={{ display: 'flex', gap: 40 }}>
        <Tile at={q(42, 18)} icon="🪪" label="Digital ID" size={140} color={K.red} /><Tile at={q(42, 20)} icon="💳" label="Digital money" size={140} color={K.red} />
        <Tile at={q(42, 24)} icon="📍" label="Every purchase tracked" size={140} color={K.red} /><Tile at={q(42, 28)} icon="🔮" label="…and predicted" size={140} color={K.red} />
      </div></At>
      <Src text="Professor Jiang, Predictive History lectures (2026)" at={q(42, 8)} />
    </ShellF>
  );
};
const R6b: React.FC = () => {
  const q = useCue();
  const f = useCurrentFrame();
  const pick = tween(f, q(43, 26), q(43, 30));
  return (
    <ShellF glow={[0.5, 0.5]}><Score free={3} paid={1} /><RoundChip n="ROUND 6" title="“CONTROL GRID” VS “AI FOR EVERYONE”" />
      <At x={120} y={150} w={1300}><div style={{ display: 'flex', gap: 34, alignItems: 'center' }}>
        <Float><Face file="zuckerberg.jpg" size={200} at={q(43, 0)} pos="50% 15%" ring={K.us} /></Float>
        <div><In at={q(43, 0)}><Txt size={34} weight={800}>Mark Zuckerberg says the opposite</Txt></In>
          <In at={q(43, 5)}><Txt size={30} color={K.mute}>“Personal Superintelligence”, July 2025</Txt></In></div>
      </div></At>
      <At x={130} y={460} w={1300}><div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <In at={q(43, 8)}><div style={{ opacity: 1 - 0.6 * pick, transform: `scale(${1 - 0.06 * pick})` }}><Card w={540} border={K.red}><div style={{ fontSize: 70 }}>🏛️</div><Txt size={34} weight={800}>Centralized</Txt><Txt size={28} color={K.mute}>restricted to a few institutions</Txt>
          {pick > 0.5 && <div style={{ marginTop: 12 }}><StampF at={q(43, 28)} text="NO" size={50} color={K.red} rot={-6} /></div>}</Card></div></In>
        <In at={q(43, 14)} pop><Big size={60} color={K.mute}>or</Big></In>
        <In at={q(43, 20)}><div style={{ transform: `scale(${1 + 0.08 * pick})`, boxShadow: pick > 0 ? `0 0 ${60 * pick}px ${K.gold}66` : undefined, borderRadius: 20 }}><Card w={540} border={K.goldHi}><div style={{ fontSize: 70 }}>🌍</div><Txt size={34} weight={800}>A tool that <Gold>empowers everyone</Gold></Txt>
          {pick > 0.5 && <div style={{ marginTop: 12 }}><StampF at={q(43, 28)} text="HIS ANSWER" size={44} color={K.green} rot={-4} /></div>}</Card></div></In>
      </div></At>
      <Src text="Mark Zuckerberg, “Personal Superintelligence” (Jul 2025), via Techstrong.ai · frame: Meta, LlamaCon 2025" at={q(43, 5)} />
    </ShellF>
  );
};
const R6c: React.FC = () => {
  const q = useCue();
  const f = useCurrentFrame();
  const rot = 4 * Math.sin(f / 18);
  return (
    <ShellF glow={[0.5, 0.6]}><Score free={3} paid={1} /><RoundChip n="ROUND 6" title="VERDICT" />
      <At x={130} y={180} w={1300}><div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        <In at={q(44, 0)}><Card w={540}><Txt size={24} color={K.mute} weight={700}>A CONTROL PLAN?</Txt><Big size={56} style={{ marginTop: 6 }}>No public evidence</Big></Card></In>
        <In at={q(44, 8)}><Card w={600} border={K.red}><Txt size={24} color={K.red} weight={800}>BUT NOTICE THE IRONY</Txt>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 14 }}>
            <Face file="zuckerberg.jpg" size={120} at={q(44, 10)} pos="50% 15%" ring={K.red} />
            <Txt size={30}>“AI for everyone” comes from the biggest <Gold>data-for-ads</Gold> business on Earth.</Txt></div></Card></In>
      </div></At>
      <At x={180} y={560} w={1100}><div style={{ display: 'flex', gap: 46, alignItems: 'center' }}>
        {['👤', '📊', '🎯', '💰'].map((ic, i) => (<React.Fragment key={i}>
          <In at={q(44, 14 + i * 3)} pop><div style={{ fontSize: 86, transform: `rotate(${i % 2 ? rot : -rot}deg)` }}>{ic}</div></In>
          {i < 3 && <In at={q(44, 15 + i * 3)}><Big size={60} color={K.gold}>→</Big></In>}</React.Fragment>))}
        <In at={q(44, 24)}><Txt size={28} color={K.mute} w={260}>your data → targeted ads → revenue</Txt></In>
      </div></At>
      <At x={560} y={850}><StampF at={q(44, 0) + 40} text="UNPROVEN · DRAW" size={50} color={K.mute} /></At>
      <Src text="Meta annual report: advertising is ~98% of revenue" at={q(44, 14)} />
    </ShellF>
  );
};
/* ================= FINAL ROUND ================= */
const Fa: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="FINAL ROUND" title="SPY OR SETUP?" />
      <At x={130} y={170} w={600}><In at={q(46, 0)}><Card w={570} border={K.red}><Txt size={30} color={K.red} weight={800}>THE CASE FOR “SPY”</Txt>
        {[[q(46, 7), 'US officials (via FT, NYT) allege recruitment by China\'s Ministry of State Security'], [q(46, 30), 'Huang admitted the relationship'], [q(46, 36), 'The board investigated; he stepped down']].map(([a, t], i) =>
          <In key={i} at={a as number}><Txt size={28} style={{ marginTop: 14 }}>• {t}</Txt></In>)}</Card></In></At>
      <At x={790} y={170} w={600}><In at={q(47, 0)}><Card w={570} border={K.us}><Txt size={30} color={K.us} weight={800}>THE CASE FOR “SETUP”</Txt>
        {[[q(47, 7), 'Beijing calls it “a smear”'], [q(47, 15), 'Nvidia\'s board: no reason to believe any secrets were compromised']].map(([a, t], i) =>
          <In key={i} at={a as number}><Txt size={28} style={{ marginTop: 14 }}>• {t}</Txt></In>)}</Card></In></At>
      <Out at={q(46, 0) - 4}><In at={q(45, 0)}><Center y={400} w={1300}><Big size={110}>Spy… <Gold>or setup?</Gold></Big></Center></In></Out>
      <Src text="Financial Times; New York Times; Fox Business; 24/7 Wall St (11 Nov 2026)" at={q(46, 7)} />
    </ShellF>
  );
};
const Fb: React.FC = () => {
  const q = useCue();
  const f = useCurrentFrame();
  const second = f >= q(49, 0);
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="FINAL ROUND" title="SPY OR SETUP?" />
      <At x={130} y={190}>{!second
        ? <QuoteCard at={q(48, 0)} file="agent.jpg" name="Former Russian intelligence agent" role="on The Diary Of A CEO" quote="who profits?" src="The Diary Of A CEO, Nov 2026" w={1180} pos="50% 20%" qsize={80} />
        : <QuoteCard at={q(49, 0)} file="kiriakou2.jpg" name="John Kiriakou" role="Former CIA officer" quote="The prize wasn't a chip. It was access to a CEO." src="The Diary Of A CEO, Nov 2026 · paraphrased" w={1180} pos="50% 20%" qsize={52} para />}</At>
      {second && <At x={130} y={760} w={1200}><In at={q(49, 20)}><Txt size={32} color={K.mute}>…a CEO who talks to <Gold>the White House</Gold> about China and trade.</Txt></In></At>}
    </ShellF>
  );
};
const Fc: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="FINAL ROUND" title="WHAT WE CAN SAY" />
      <At x={130} y={170} w={1300}><div style={{ display: 'flex', gap: 30 }}>
        {[[q(50, 6), '✓', 'Relationship', 'admitted', K.green], [q(50, 12), '✓', 'Investigation', 'real', K.green], [q(50, 18), '?', 'Spy part', 'intelligence not public', K.red]].map(([a, ic, t, s, c], i) => (
          <In key={i} at={a as number} pop><Card w={380} border={c as string}><Big size={70} color={c as string}>{ic as string}</Big><Txt size={34} weight={800}>{t as string}</Txt><Txt size={28} color={K.mute}>{s as string}</Txt></Card></In>))}
      </div></At>
      <At x={130} y={560} w={1300}><In at={q(51, 0)}><div style={{ display: 'flex', alignItems: 'center', gap: 30 }}><Float><div style={{ fontSize: 110 }}>📦</div></Float>
        <div><Txt size={36} weight={800}>Why buy billions of chips and never open them?</Txt><Txt size={30} color={K.mute} style={{ marginTop: 8 }}>US officials are investigating whether they were <Gold>meant for China all along</Gold>.</Txt></div></div></In></At>
      <At x={130} y={840}><StampF at={q(51, 36)} text="LIKELY, NOT PROVEN" size={60} /></At>
      <Src text="US officials via NYT; investigation ongoing, not proven" at={q(51, 27)} />
    </ShellF>
  );
};
const Fd: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="FINAL ROUND" title="WILL HUANG COME BACK?" />
      <At x={130} y={170}><Headline at={q(52, 18)} outlet="NVIDIA · EARNINGS NIGHT" date="17 Nov 2026" text="Chairman: board has “no intention” of bringing Huang back as CEO" w={640} tilt={-1.5} /></At>
      <At x={830} y={170} w={600}><QuoteCard at={q(53, 0)} file="jiang.jpg" name="Professor Jiang" role="Lecture, 17 Nov 2026" quote="Huang will not come back" src="Predictive History, Geo-Strategy Update #11 · paraphrased" w={590} pos="50% 25%" qsize={34} para /></At>
      <At x={130} y={600} w={1300}><In at={q(54, 9)}><Card w={1260} border={K.goldHi}><Txt size={26} color={K.goldHi} weight={800}>📒 PREDICTION LEDGER #007 · JIANG'S CALLS, ON THE RECORD</Txt>
        <In at={q(54, 14)}><Txt size={32} style={{ marginTop: 10 }}>a) Huang is <Gold>not back</Gold> as Nvidia CEO by <Gold>31 March 2027</Gold></Txt></In>
        <In at={q(54, 28)}><Txt size={32}>b) Nasdaq 100 falls <Gold>20% from its record</Gold> (≤ 24,980) before <Gold>end of Feb 2027</Gold></Txt></In></Card></In></At>
      <At x={130} y={860}><StampF at={q(54, 38)} text="WE'LL SCORE BOTH" size={40} rot={-4} /></At>
      <Src text="Yahoo Finance / CoinDesk (17 Nov 2026); Jiang lecture 25:54–26:38" at={q(52, 18)} />
    </ShellF>
  );
};
const Fe: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="FINAL ROUND" title="WHAT NVIDIA'S SCANDAL EXPOSED" />
      <Center y={300}><div style={{ display: 'flex', gap: 70 }}>
        <Float><Tile at={q(55, 32)} icon="🔌" label="Chips" size={200} /></Float><Float phase={1}><Tile at={q(55, 34)} icon="⚡" label="Power" size={200} /></Float><Float phase={2}><Tile at={q(55, 35)} icon="⛏️" label="Minerals" size={200} /></Float>
      </div></Center>
      <Center y={170}><In at={q(55, 8)}><Pill text="Free AI still runs on hardware China can't fully make" /></In></Center>
      <Center y={720}><In at={q(55, 28)}><Txt size={40} weight={700}>This war isn't over chatbots.</Txt></In></Center>
    </ShellF>
  );
};
/* ================= FROM OUR SIDE ================= */
const Gulf: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="FROM OUR SIDE" title="THE GULF & AI" />
      <At x={130} y={180} w={1300}><div style={{ display: 'flex', gap: 40 }}>
        <Tile at={q(56, 23)} icon="🇦🇪" label="MGX" sub="Abu Dhabi" size={170} /><Tile at={q(56, 26)} icon="🇦🇪" label="Stargate UAE" sub="campus" size={170} /><Tile at={q(56, 31)} icon="🇸🇦" label="Humain" sub="Saudi Arabia" size={170} />
        <In at={q(56, 36)}><Card w={360} border={K.us}><Txt size={26} color={K.mute} weight={700}>A BIG BET ON</Txt><Big size={64} color={K.us}>paid AI</Big></Card></In>
      </div></At>
      <At x={130} y={620} w={1300}><In at={q(57, 0)}><Card w={1220} border={K.goldHi}><Txt size={26} color={K.goldHi} weight={800}>FOR COUNTRIES LIKE OURS</Txt>
        <Txt size={34} style={{ marginTop: 8 }}>Free models = a chance to build our own tools <Gold>without paying rent to Silicon Valley</Gold>.</Txt></Card></In></At>
      <Src text="MGX; Stargate UAE (May 2025); Humain (PIF, 2025)" at={q(56, 23)} />
    </ShellF>
  );
};
/* ================= TWIST ================= */
const T1: React.FC = () => {
  const q = useCue();
  const f = useCurrentFrame();
  const twist = q(59, 0);
  return (
    <ShellF>
      {f < twist + 4 ? (<>
        <Score free={3} paid={1} dock={false} at={q(58, 0)} />
        <Center y={300}><In at={q(58, 0)}><Txt size={40} color={K.goldHi} weight={800} style={{ letterSpacing: '0.2em' }}>FINAL SCORE</Txt></In></Center>
        <Center y={760}><In at={q(58, 14)}><Txt size={40} weight={700}>China is winning the AI race.</Txt></In></Center>
      </>) : (<>
        <At x={130} y={200} w={1300}>
          <In at={twist}><Card w={1240} border={K.cn}><Txt size={28} color={K.mute} weight={700}>🏁 THE AI RACE</Txt><Big size={80} color={K.cn}>China ahead</Big></Card></In>
          <In at={twist + 30} style={{ marginTop: 30 }}><Card w={1240} border={K.us}><Txt size={28} color={K.mute} weight={700}>💰 THE MONEY RACE</Txt><Big size={80} color={K.us}>America ahead</Big></Card></In>
        </At>
      </>)}
    </ShellF>
  );
};
const T2: React.FC = () => {
  const q = useCue();
  const hub: [number, number] = [380, 470];
  const nodes: [string, string, number, number, number][] = [['🔌', 'Chips', 900, 300, q(60, 8)], ['⚡', 'Power', 900, 540, q(60, 10)], ['🏭', 'Factories', 900, 780, q(60, 13)]];
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="THE TWIST" title="WHO GETS PAID WHEN AI IS FREE?" />
      <At x={hub[0] - 140} y={hub[1] - 140}><In at={q(60, 0)} pop><div style={{ width: 280, height: 280, borderRadius: 140, background: K.panel2, border: `5px solid ${K.goldHi}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Big size={58} color={K.goldHi}>FREE AI</Big></div></In></At>
      {nodes.map(([ic, t, x, y, a], i) => (<React.Fragment key={i}><Dash at={a} from={[hub[0] + 140, hub[1]]} to={[x - 50, y]} /><At x={x - 50} y={y - 75}><Tile at={a} icon={ic} label={t} size={120} /></At></React.Fragment>))}
      <At x={1150} y={300} w={300}><In at={q(60, 30)}><Card w={280} border={K.us}><Txt size={24} color={K.mute} weight={700}>SHAREHOLDERS</Txt><Txt size={28} weight={700}>Paid AI pays them. <Gold>Money flows to America.</Gold></Txt></Card></In></At>
    </ShellF>
  );
};

const T2b: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="THE TWIST" title="IS FREE AI A TRAP?" />
      <Center y={150} w={1300}><In at={q(61, 0)}><Big size={90}>Free AI = <span style={{ color: K.red }}>trap?</span></Big></In></Center>
      <At x={130} y={330} w={1300}><div style={{ display: 'flex', gap: 40 }}>
        <In at={q(61, 6)}><Card w={560} border={K.us}><Txt size={26} color={K.mute} weight={700}>🇺🇸 FOR AMERICA'S AI COMPANIES</Txt><Big size={80} color={K.red}>Yes</Big><Txt size={28}>it kills their prices</Txt></Card></In>
        <In at={q(61, 16)}><Card w={560} border={K.green}><Txt size={26} color={K.mute} weight={700}>🌍 FOR THE REST OF THE WORLD</Txt><Big size={80} color={K.green}>A gift</Big><Txt size={28}>world-class AI for $0</Txt></Card></In>
      </div></At>
      <At x={130} y={720} w={1300}><In at={q(61, 26)}><div style={{ display: 'flex', alignItems: 'center', gap: 30 }}><Float><div style={{ fontSize: 100 }}>🔌</div></Float>
        <div><Txt size={30} color={K.red} weight={800}>THE REAL TRAP IS UNDERNEATH</Txt><Txt size={40} weight={800}>Whoever owns <Gold>the hardware</Gold> owns the future.</Txt></div></div></In></At>
    </ShellF>
  );
};
const T3: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="THE TWIST" title="WHO PROFITS?" />
      <Center y={170}><In at={q(62, 0)} pop><Float amp={10}><div style={{ fontSize: 160 }}>⛏️</div></Float></In></Center>
      <Center y={400}><In at={q(62, 12)}><Big size={84}>Whoever sells <span style={{ color: K.goldHi }}>the shovels</span></Big></In></Center>
      <At x={130} y={580} w={1300}><div style={{ display: 'flex', gap: 40 }}>
        <In at={q(63, 17)}><Card w={560}><Txt size={26} color={K.mute} weight={700}>NVDA FORWARD P/E</Txt><Big size={90} color={K.goldHi}>~12×</Big><Txt size={28}>cheapest since <Gold>2013</Gold></Txt></Card></In>
        <In at={q(63, 40)}><Card w={560} border={K.green}><Txt size={26} color={K.mute} weight={700}>AFTER EARNINGS</Txt><Big size={90} color={K.green}>$150B</Big><Txt size={28}>buyback · Nvidia bets its shares are cheap</Txt></Card></In>
      </div></At>
      <Src text="The Edge / Bloomberg (11 Nov 2026); Nvidia (17 Nov 2026)" at={q(63, 17)} />
    </ShellF>
  );
};
const T4: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="OUR CALLS" title="ON THE RECORD" />
      <At x={130} y={180} w={1300}>
        <In at={q(65, 0)}><Card w={1260} border={K.goldHi}><Txt size={26} color={K.goldHi} weight={800}>📒 PREDICTION LEDGER #005</Txt><Txt size={36} style={{ marginTop: 8 }}>By end of <Gold>2027</Gold>, the <Gold>Nasdaq 100 beats the Hang Seng Tech Index</Gold> (from today's close)</Txt></Card></In>
        <In at={q(66, 0)} style={{ marginTop: 34 }}><Card w={1260} border={K.goldHi}><Txt size={26} color={K.goldHi} weight={800}>📒 PREDICTION LEDGER #006</Txt><Txt size={36} style={{ marginTop: 8 }}>By the same date, America lets <Gold>Nvidia sell its top chips to China</Gold> again</Txt></Card></In>
      </At>
      <At x={130} y={760} w={1300}><In at={q(66, 24)}><Txt size={38} weight={700}>Because in the end, <Gold>they need each other</Gold>.</Txt></In></At>
    </ShellF>
  );
};
const T5: React.FC = () => {
  const q = useCue();
  const f = useCurrentFrame();
  const W = 1250, H = W * 1110 / 2382;
  const lv = (y: number, at: number, t: string, c: string) => (
    <div style={{ position: 'absolute', left: 0, top: y * H, width: W * 0.95, opacity: tween(f, at, at + 12) }}>
      <div style={{ borderTop: `4px dashed ${c}` }} />
      <div style={{ position: 'absolute', left: 16, top: -50, background: c, color: K.bg, borderRadius: 24, padding: '4px 16px', fontFamily: F.sans, fontWeight: 700, fontSize: 24 }}>{t}</div>
    </div>
  );
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="LAK'S CHART" title="NASDAQ 100 · WEEKLY" />
      <At x={70} y={130}><Pill text="NQ weekly · Lak's levels" at={q(67, 0)} /></At>
      <At x={70} y={220}><In at={q(67, 0)}><div style={{ position: 'relative', width: W, height: H, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Img src={staticFile('srcF/nq_chart.jpg')} style={{ width: W, height: H }} />
        {lv(0.267, q(67, 20), 'Swept last week\'s lows · the dip if it turns up', K.green)}
        {lv(0.393, q(67, 60), 'Jiang\'s −20% line ≈ 24,980', K.gold)}
        {lv(0.502, q(67, 44), 'Break → 2025/26 equal lows 22,744 + gap', K.red)}
      </div></In></At>
      <At x={1380} y={240} w={460}><In at={q(67, 12)}><Card w={420}><Txt size={24} color={K.mute} weight={700}>LAK'S READ</Txt>
        <Txt size={28} style={{ marginTop: 8 }}>Inside its <Gold>20 / 40 / 60-day</Gold> range</Txt><Txt size={28} style={{ marginTop: 8 }}>Turns higher → <span style={{ color: K.green, fontWeight: 700 }}>the dip</span></Txt><Txt size={28} style={{ marginTop: 8 }}>Breaks → <span style={{ color: K.red, fontWeight: 700 }}>22,744</span></Txt></Card></In></At>
      <Src text="Chart: Lak (Nasdaq 100 futures, weekly). Not financial advice." at={q(67, 0)} />
    </ShellF>
  );
};
const HST = [4860, 4760, 4820, 4950, 5160, 4900, 4700, 4560, 4620, 4450, 4500, 4260, 4440, 4520, 4740, 4680, 4800, 4840, 4900, 4760, 4640, 4720, 4550, 4520, 4600, 4440, 4300, 4280, 4380, 4250, 4200, 4100, 4060, 4110, 4000, 3820, 3790, 3700, 3830, 4100, 4000, 3950, 3780, 3736];
const T6: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="OUR TAKE" title="CHINA DOESN'T PLAY THE MONEY GAME" />
      <At x={120} y={150}><Pill text="Hang Seng TECH Index · since June" at={q(68, 0)} /></At>
      <Out at={q(69, 37)}><At x={230} y={240}><LineF at={q(68, 4)} pts={HST} w={1100} h={330} min={3500} max={5300} color={K.cn}
        yTicks={[{ v: 3500, t: '3,500' }, { v: 4250, t: '4,250' }, { v: 5000, t: '5,000' }]}
        xLabels={[{ i: 0, t: 'Jun' }, { i: 9, t: 'Jul' }, { i: 18, t: 'Aug' }, { i: 27, t: 'Sep' }, { i: 35, t: 'Oct' }, { i: 41, t: 'Nov' }]}
        marks={[{ i: 4, t: 'June high ~5,150' }, { i: 43, t: '3,736 · −27%', color: K.red, above: false }]} /></At></Out>
      <Center y={250} w={1300}><div style={{ textAlign: 'center' }}><In at={q(69, 38)}><Big size={64}>China can win the AI race…</Big></In><In at={q(69, 46)}><Big size={64} color={K.goldHi}>…and still lose the money race</Big></In>
        <In at={q(69, 52)} style={{ marginTop: 24 }}><Txt size={36} color={K.mute}>For Beijing, <Gold>shareholders were never the point</Gold>.</Txt></In></div></Center>
      <At x={130} y={740} w={1300}><div style={{ display: 'flex', gap: 30 }}>
        <In at={q(69, 0)}><Card w={600}><Txt size={24} color={K.mute} weight={700}>BEIJING WANTS AI AS</Txt><Txt size={32} weight={700}>infrastructure to <Gold>run and control</Gold> the country</Txt></Card></In>
        <In at={q(69, 24)}><Card w={600} border={K.red}><Txt size={24} color={K.red} weight={700}>2021 TECH CRACKDOWN</Txt><Big size={60} color={K.red}>&gt;$1 trillion</Big><Txt size={26} color={K.mute}>of value wiped out</Txt></Card></In>
      </div></At>
      <Src text="Hang Seng Indexes (18 Nov 2026: 3,736.33); Bloomberg (Jul 2021: $1.1T since Feb peak). Opinion: our view." at={q(68, 4)} />
    </ShellF>
  );
};
const T7: React.FC = () => {
  const q = useCue();
  return (
    <ShellF><Score free={3} paid={1} /><RoundChip n="WHAT COULD PROVE US WRONG" title="" />
      <At x={130} y={200} w={1300}><div style={{ display: 'flex', gap: 40 }}>
        <In at={q(70, 6)}><Card w={590} border={K.red}><Float><div style={{ fontSize: 70 }}>🫧</div></Float><Txt size={34} weight={800}>A bubble pop</Txt><Txt size={28} color={K.mute}>hits the expensive Nasdaq hardest</Txt></Card></In>
        <In at={q(70, 16)}><Card w={590} border={K.red}><Float phase={2}><div style={{ fontSize: 70 }}>📈</div></Float><Txt size={34} weight={800}>Rates above 5%</Txt><Txt size={28} color={K.mute}>hurt growth stocks the most</Txt></Card></In>
      </div></At>
      <At x={130} y={680} w={1300}><In at={q(70, 28)}><Txt size={40} weight={800}>We'll score it publicly. <Gold>This isn't financial advice, it's a map.</Gold></Txt></In></At>
    </ShellF>
  );
};
const Close: React.FC = () => {
  const q = useCue();
  const f = useCurrentFrame();
  const end = q(72, 0);
  return (
    <ShellF>
      {f < end + 2 ? (<>
        <Center y={250}><In at={q(71, 0)}><Txt size={40} color={K.goldHi} weight={800} style={{ letterSpacing: '0.18em' }}>IN 5 YEARS, WILL YOU BE…</Txt></In></Center>
        <At x={180} y={380} w={1200}><div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <In at={q(71, 12)} pop><Card w={520} border={K.us}><Big size={74} color={K.us}>💳 Paying</Big><Txt size={30}>for AI</Txt></Card></In>
          <In at={q(71, 18)} pop><Card w={520} border={K.cn}><Big size={74} color={K.cn}>🎁 Free</Big><Txt size={30}>getting it for free</Txt></Card></In>
        </div></At>
        <Center y={760}><In at={q(71, 22)}><Pill text="Tell me in the comments 👇" size={34} /></In></Center>
      </>) : (
        <Center y={330}><div style={{ textAlign: 'center' }}><In at={end}><Big size={120}>Same world.</Big></In><In at={end + 20}><Big size={120} color={K.goldHi}>Different lens.</Big></In></div></Center>
      )}
    </ShellF>
  );
};

export const S2: SceneDef[] = [
  { line: 10, el: <R1a />, tal: { pose: 'thinking' } },
  { line: 13, el: <R1b />, tal: { pose: 'serious' } },
  { line: 15, el: <R2a />, tal: { pose: 'explaining' } },
  { line: 16, el: <R2b />, tal: { pose: 'pointing' } },
  { line: 18, el: <R2c />, tal: { pose: 'shocked' } },
  { line: 20, el: <R2d />, tal: { pose: 'pointup' } },
  { line: 22, el: <R3a />, tal: { pose: 'serious' } },
  { line: 24, el: <R3b />, tal: { pose: 'worried' } },
  { line: 26, el: <R3c />, tal: { pose: 'explaining' } },
  { line: 27, el: <R3d />, tal: { pose: 'thinking' } },
  { line: 28, el: <R4a />, tal: { pose: 'serious' } },
  { line: 30, el: <R4b />, tal: { pose: 'pointup' } },
  { line: 33, el: <R5a />, tal: { pose: 'thinking' } },
  { line: 35, el: <R5b />, tal: { pose: 'shocked' } },
  { line: 37, el: <R5c />, tal: { pose: 'explaining' } },
  { line: 39, el: <R5d1 />, tal: { pose: 'thinking' } },
  { line: 40, el: <R5d2 />, tal: { pose: 'pointing' } },
  { line: 41, el: <R5d3 />, tal: { pose: 'pointup' } },
  { line: 42, el: <R6a />, tal: { pose: 'worried' } },
  { line: 43, el: <R6b />, tal: { pose: 'explaining' } },
  { line: 44, el: <R6c />, tal: { pose: 'serious' } },
  { line: 45, el: <Fa />, tal: { pose: 'serious' } },
  { line: 48, el: <Fb />, tal: { pose: 'thinking' } },
  { line: 50, el: <Fc />, tal: { pose: 'pointup' } },
  { line: 52, el: <Fd />, tal: { pose: 'serious' } },
  { line: 55, el: <Fe />, tal: { pose: 'explaining' } },
  { line: 56, el: <Gulf />, tal: { pose: 'pointing' } },
  { line: 58, el: <T1 />, tal: { pose: 'laughing' } },
  { line: 60, el: <T2 />, tal: { pose: 'pointup' } },
  { line: 61, el: <T2b />, tal: { pose: 'serious' } },
  { line: 62, el: <T3 />, tal: { pose: 'coin' } },
  { line: 64, el: <T4 />, tal: { pose: 'thumbsup' } },
  { line: 67, el: <T5 />, tal: { pose: 'pointing' } },
  { line: 68, el: <T6 />, tal: { pose: 'serious' } },
  { line: 70, el: <T7 />, tal: { pose: 'worried' } },
  { line: 71, el: <Close />, tal: { pose: 'wave' } },
];
