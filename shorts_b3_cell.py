# SHORTS BATCH 3 · ONE RUN (2 Nov)
# Run Cell 1, then Cell 2, then run Cell 3 with the one-line loader. Then Cell 5 to listen.
# Format: [energy, pace] text  ·  ~ glues to previous line  ·  (beat) pause  ·  empty line = new section  ·  # = note

SCRIPT = """
# SHORTS BATCH 3 · MONEY MYTHS (v2, 2 Nov: fact-check fixes). Each section = one Short.

# S9 · WEIMAR 1923
[0.75,0.35] A loaf of bread: two hundred billion marks.
[0.7,0.4] Berlin, late nineteen twenty-three. A year earlier, that loaf cost about one hundred sixty.
[0.7,0.4] The claim: prices doubled every few days.
[0.7,0.4] Economists Steve Hanke and Nicholas Krus measured it. October nineteen twenty-three: prices doubling every three point seven days.
[0.7,0.4] Verdict: true.
[0.7,0.4] If your savings sat in a bank, they vanished.
[0.75,0.35] Twist: debts melted too. Even after a rescue law in nineteen twenty-five, mortgages came back at just a quarter of their value.

# S10 · TULIP MANIA
[0.75,0.35] One tulip bulb for a house?
[0.7,0.4] Holland, sixteen thirty-seven. The story: people traded homes for flowers, then the crash ruined merchants.
[0.7,0.4] Historian Anne Goldgar went into the Dutch archives.
[0.7,0.4] Rare bulbs really sold for around eleven hundred guilders. A decent house.
[0.7,0.4] But she found almost no bankruptcies tied to tulips, and no lasting depression. Most buyers simply never paid.
[0.7,0.4] Verdict: exaggerated.
[0.75,0.35] Twist: the house price was real. The ruin was the myth, spread by preachy pamphlets and a bestseller written two centuries later.

# S11 · NEWTON
[0.75,0.35] Isaac Newton lost twenty thousand pounds. Supposedly.
[0.7,0.4] Seventeen twenty. South Sea Company shares explode.
[0.7,0.4] Legend says the genius lost everything, sighing he could calculate the stars, but not human madness.
[0.7,0.4] Mathematician Andrew Odlyzko checked the records.
[0.7,0.4] Newton sold early, up about twenty thousand. Then, like you might, he chased it back in near the top.
[0.7,0.4] He lost roughly ten thousand. Not ruin. And that quote? No solid source.
[0.7,0.4] Verdict: exaggerated.
[0.75,0.35] Twist: twenty thousand pounds wasn't his loss. It was his profit. The one he gave back.

# S12 · VENEZUELA
[0.75,0.35] Venezuela deleted fourteen zeros from its money.
[0.7,0.4] Three in two thousand eight. Five in twenty eighteen. Six more in twenty twenty-one.
[0.7,0.4] The famous claim: inflation hit one million percent in twenty eighteen.
[0.7,0.4] That was an IMF forecast. The central bank later reported about one hundred thirty thousand percent.
[0.7,0.4] Verdict: exaggerated. But prices still doubled roughly every five weeks.
[0.7,0.4] Cutting zeros didn't save anyone's savings. It just shortened the numbers.
[0.75,0.35] Twist: fourteen zeros means one bolivar today equals one hundred trillion old ones.

# S13 · PENNY
[0.75,0.35] One penny costs almost four cents to make.
[0.7,0.4] That's the US Mint's own number: three point six nine cents, up from one point four two a decade ago.
[0.7,0.4] The claim: America stopped making pennies.
[0.7,0.4] November twelfth, twenty twenty-five: the Mint struck its final circulating penny in Philadelphia.
[0.7,0.4] Verdict: true.
[0.7,0.4] But your pennies aren't dead. About three hundred billion are still out there.
[0.75,0.35] Twist: the newest pennies in your jar cost almost four times their face value to make.

# S14 · ROME
[0.75,0.35] Rome's silver coin: ninety-five percent... then two.
[0.7,0.4] Under Augustus, the denarius was about ninety-five percent silver.
[0.7,0.4] Around two hundred AD, under Septimius Severus: half.
[0.7,0.4] Then a new coin, valued at two denarii, with only one and a half times the silver.
[0.7,0.4] By the two-seventies: about two percent. Bronze with a silver wash.
[0.7,0.4] The claim: Rome slowly drained the silver out of its own money. Verdict: true, over two centuries.
[0.75,0.35] Twist: same face, same name, two percent silver. For your money, the question is never the name. It's what's inside.

# S15 · SWISS FRANC
[0.75,0.35] One morning, the Swiss franc jumped about thirty percent.
[0.7,0.4] January fifteenth, twenty fifteen. Switzerland's central bank dropped its cap of one point two francs per euro.
[0.7,0.4] Within minutes, the euro crashed below ninety centimes.
[0.7,0.4] The claim: the franc protects your money from inflation.
[0.7,0.4] In twenty twenty-two, Swiss inflation peaked at three and a half percent. The eurozone hit ten point six.
[0.7,0.4] Verdict: true, historically.
[0.75,0.35] Twist: that's exactly why it jumped. Safe doesn't mean stable.
"""

DEFAULT_EX, DEFAULT_CFG, DEFAULT_SPEED = 0.55, 0.45, 1.0
TEMPERATURE = 0.8      # default: keeps the voice consistent line to line
USE_SPEED = False      # speed changes after generation hurt clarity; rhythm comes from pace + pauses
SEEDS = [42, 7, 123]   # take 1 uses 42 (Tall's usual timbre); retakes only if a line fails the check
SECTION_PAUSE = 1.0
BEAT_PAUSE = 0.75
GLUE_PAUSE = 0.12
QC = True              # listen-back check: transcribe every line and retake if words are wrong
QC_MIN_SCORE = 0.85    # share of words that must come back correctly

# PRONUNCIATION GUIDE: the script stays normal; Tall is fed these spellings.
# Add a word here whenever you hear it said wrong. Keys are matched as whole words, case-sensitive.
PRON = {
    'Rystad': 'Ree-stahd',
    'Kuwaiti': 'Koo-way-tee',
    'Iraqi': 'Ih-rah-kee',
    'Axios': 'Ack-see-ose',
    'MI6': 'M. I. six',
    'GENIUS Act': 'Genius Act',
    'Putin': 'Poo-tin',
    'Rabat': 'Rah-baht',
    'Hormuz': 'Hor-mooz',
    'Zelenskyy': 'Zeh-len-skee',
    'Yalta': 'Yahl-tah',
    'Fed': 'Fed',
    'LNG': 'L. N. G.',
    'AI': 'A. I.',
    'Jiang Xueqin': 'Jee-ahng Shweh-cheen',
    'Jiang': 'Jee-ahng',
    'Shenzhen': 'Shen-jen',
    'NFL': 'N. F. L.',
    'CEO': 'C. E. O.',
    'Emirati': 'Em-ih-rah-tee',
    'riyal': 'ree-yahl',
    'Weimar': 'Vy-mar',
    'Goldgar': 'Gold-gar',
    'Odlyzko': 'Od-litch-ko',
    'Krus': 'Kroos',
    'bolivar': 'boh-lee-var',
    'Septimius Severus': 'Sep-tim-ee-us Seh-veer-us',
    'antoninianus': 'an-toh-nin-ee-ah-nus',
    'centimes': 'son-teems',
    'IMF': 'I. M. F.',
    'SNB': 'S. N. B.',
}

# ---- generation (no need to touch below) ----
import re, os, random, subprocess, sys, json, difflib
import torch, torchaudio, librosa, numpy as np
from chatterbox.tts import ChatterboxTTS
random.seed(7)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
if 'model' not in globals():
    model = ChatterboxTTS.from_pretrained(device=device)
SR = model.sr

asr = None
if QC:
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'faster-whisper'], check=False)
        from faster_whisper import WhisperModel
    asr = WhisperModel('small.en', device=device, compute_type='float16' if device == 'cuda' else 'int8')

def spoken(text):
    for k, v in sorted(PRON.items(), key=lambda kv: -len(kv[0])):
        text = re.sub(r'(?<![\w-])' + re.escape(k) + r'(?![\w-])', v, text)
    return text

SKIP = {w.lower() for k in PRON for w in re.findall(r"[A-Za-z']+", k)}
def norm(t):
    return [w for w in re.findall(r"[a-z']+", t.lower().replace('-', ' ')) if w not in SKIP]

def qc_score(wav, text):
    y = wav.squeeze(0).cpu().numpy().astype(np.float32)
    y16 = librosa.resample(y, orig_sr=SR, target_sr=16000)
    segs, _ = asr.transcribe(y16, language='en', beam_size=1)
    heard = ' '.join(s.text for s in segs)
    a, b = norm(text), norm(heard)
    if not a: return 1.0, heard
    return difflib.SequenceMatcher(None, a, b).ratio(), heard

def sil(sec): return torch.zeros(1, int(SR * max(sec, 0)))

def natural_pause(text):
    t = text.rstrip()
    if t.endswith('?'):   base = 0.55
    elif t.endswith('...'): base = 0.45
    elif t.endswith('!'): base = 0.4
    elif len(t) < 30:     base = 0.25
    else:                 base = 0.35
    return base + random.uniform(-0.08, 0.1)

def stretch(wav, speed):
    if not USE_SPEED or abs(speed - 1.0) < 0.01: return wav
    y = librosa.effects.time_stretch(wav.squeeze(0).cpu().numpy(), rate=speed)
    return torch.from_numpy(np.ascontiguousarray(y)).unsqueeze(0)

def trim(wav, thr=0.01):
    y = wav.squeeze(0)
    idx = (y.abs() > thr).nonzero()
    if len(idx) == 0: return wav
    a, b = max(int(idx[0]) - int(0.02*SR), 0), min(int(idx[-1]) + int(0.06*SR), y.shape[0])
    return wav[:, a:b]

os.makedirs('/kaggle/working/lines', exist_ok=True)
items = []
for raw in SCRIPT.strip().splitlines():
    s = raw.strip()
    if s.startswith('#'): continue
    if not s: items.append(('section', None)); continue
    if s == '(beat)': items.append(('beat', None)); continue
    glue = s.startswith('~'); s = s.lstrip('~').strip()
    m = re.match(r'^\[([^\]]*)\]\s*(.*)$', s)
    nums = [float(x) for x in m.group(1).split(',')] if m else []
    text = m.group(2) if m else s
    ex  = nums[0] if len(nums) > 0 else DEFAULT_EX
    cfg = nums[1] if len(nums) > 1 else DEFAULT_CFG
    spd = nums[2] if len(nums) > 2 else DEFAULT_SPEED
    items.append(('line', (glue, ex, cfg, spd, text)))

total = sum(1 for k, _ in items if k == 'line')
out, n, pending, report = [], 0, None, []
for kind, val in items:
    if kind == 'section': pending = SECTION_PAUSE; continue
    if kind == 'beat':    pending = max(pending or 0, BEAT_PAUSE); continue
    glue, ex, cfg, spd, text = val
    n += 1
    cfg = min(max(cfg, 0.35), 0.5)
    ex = min(ex, 0.75)
    say = spoken(text)
    best = None
    for t, seed in enumerate(SEEDS):
        torch.manual_seed(seed)
        wav = model.generate(say, audio_prompt_path=REF, exaggeration=ex, cfg_weight=cfg, temperature=TEMPERATURE)
        wav = trim(stretch(wav.cpu(), spd))
        score, heard = qc_score(wav, text) if asr else (1.0, '')
        if best is None or score > best[0]: best = (score, wav, heard, t + 1)
        if score >= QC_MIN_SCORE: break
    score, wav, heard, takes = best
    flag = '' if score >= QC_MIN_SCORE else '   <-- CHECK THIS LINE'
    print(f'[{n}/{total}] take {takes} · match {score:.0%}: {text[:60]}{flag}')
    report.append({'line': n, 'text': text, 'heard': heard, 'match': round(score, 3), 'takes': takes})
    torchaudio.save(f'/kaggle/working/lines/line_{n:03d}.wav', wav, SR)
    f = int(0.01*SR); ramp = torch.linspace(0, 1, f)
    wav[:, :f] *= ramp; wav[:, -f:] *= ramp.flip(0)
    if out:
        gap = pending if pending is not None else (GLUE_PAUSE if glue else natural_pause(last_text))
        out.append(sil(gap))
    out.append(wav); last_text, pending = text, None

full = torch.cat(out, dim=1)
torchaudio.save('/kaggle/working/TAL_shorts_b3.wav', full, SR)
json.dump(report, open('/kaggle/working/qc_report.json', 'w'), indent=1)
bad = [r for r in report if r['match'] < QC_MIN_SCORE]
print('Done:', round(full.shape[1] / 60 / SR, 1), 'minutes -> /kaggle/working/TAL_shorts_b3.wav')
print(f'Quality check: {total - len(bad)}/{total} lines clean.' + (' Listen to these:' if bad else ''))
for r in bad: print(f"  line {r['line']}: wanted '{r['text'][:60]}'  heard '{r['heard'][:60]}'")

# --- Auto-hand-off to Claude: upload the narration to a 1-hour temporary link ---
import subprocess
_r = subprocess.run(['curl', '-s', '-F', 'reqtype=fileupload', '-F', 'time=1h',
                     '-F', 'fileToUpload=@/kaggle/working/TAL_shorts_b3.wav',
                     'https://litterbox.catbox.moe/resources/internals/api.php'], capture_output=True, text=True)
print('CLAUDE LINK:', _r.stdout.strip())
