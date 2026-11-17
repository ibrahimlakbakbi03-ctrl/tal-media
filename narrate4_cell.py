# NARRATION v2 · Old Tall voice via Qwen3-TTS Base clone (Lak picked "Old voice 1", 16 Nov).
# Flow fixes: text prep (colons/dashes), internal pauses normalised (no dead air, no rushed joins),
# punctuation-aware joins with short fades, up to N takes scored on words + pace + no hesitations.
# Pronunciation: PRON respellings; optional NAMES test (A = plain, B = respelled) for Lak to pick by ear.
import subprocess, sys, os, json, urllib.request
W = globals().get('WDIR', '/kaggle/working/narr2'); os.makedirs(W, exist_ok=True)
REV = globals().get('REV', 'main'); REPO = 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV
JOB = globals().get('JOB', 'vF/narr_v4_test.json'); NAME = globals().get('NAME', 'TAL_v4_test')
TAKES = globals().get('TAKES', 4); NAMES_TEST = globals().get('NAMES_TEST', True)
PRON = globals().get('PRON', {})
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '-U', 'qwen-tts', 'transformers==4.57.3'], check=False)
urllib.request.urlretrieve(REPO + '/' + globals().get('REF_FILE', 'ref/TAL_reference_12s.wav'), W + '/ref_in.wav')
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', W + '/ref_in.wav', '-ac', '1', '-ar', '24000', W + '/ref.wav'], stdin=subprocess.DEVNULL)
urllib.request.urlretrieve(REPO + '/' + JOB, W + '/job.json')
TESTS = globals().get('TESTS')
json.dump({'PRON': PRON, 'TAKES': TAKES, 'NAME': NAME, 'NAMES_TEST': NAMES_TEST, 'TESTS': TESTS}, open(W + '/cfg.json', 'w'))
code = r'''
import json, re, difflib, torch, numpy as np, soundfile as sf, librosa
W = '%s'; cfg = json.load(open(W + '/cfg.json')); job = json.load(open(W + '/job.json'))
PRON, TAKES, NAME = cfg['PRON'], cfg['TAKES'], cfg['NAME']
from qwen_tts import Qwen3TTSModel
dt = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-Base', device_map='cuda:0', dtype=dt, attn_implementation='sdpa')
from transformers import pipeline
asr = pipeline('automatic-speech-recognition', model='openai/whisper-small.en', device=0, torch_dtype=torch.float16)
rt = asr(W + '/ref.wav')['text'].strip()
prompt = m.create_voice_clone_prompt(ref_audio=W + '/ref.wav', ref_text=rt)
SR = 24000
def prep(t):
    t = re.sub(r'\s*[—–]\s*', ', ', t)          # dashes -> comma
    t = re.sub(r':\s+(?=[A-Za-z])', ', ', t)               # colon -> comma (colons made odd long stops)
    for k, v in sorted(PRON.items(), key=lambda kv: -len(kv[0])):
        t = re.sub(r'(?<![\w-])' + re.escape(k) + r'(?![\w-])', v, t)
    return t
norm = lambda s: re.sub(r'[^a-z0-9 ]', ' ', s.lower().replace('-', ' ')).split()
SKIP = {w for v in PRON.values() for w in norm(v)} | {w for k in PRON for w in norm(k)}
def tidy(w, sr):
    # v3: never chop speech. Only real dead air (> 0.55 s below -42 dB of peak) is shortened to 0.34 s,
    # joined with a 40 ms equal-power crossfade; edges trimmed gently with 30 ms fades. No micro gaps.
    w = w - np.mean(w)
    hop = int(0.01*sr); fr = int(0.03*sr)
    rms = librosa.feature.rms(y=w, frame_length=fr, hop_length=hop)[0]
    thr = np.max(rms) * 10**(-42/20); sil = rms < thr
    voiced = np.where(~sil)[0]
    if len(voiced) == 0: return w, 0.0
    a0 = max(0, voiced[0]*hop - int(0.04*sr)); b0 = min(len(w), voiced[-1]*hop + fr + int(0.08*sr))
    runs = []; k = voiced[0]
    while k <= voiced[-1]:
        if sil[k]:
            st = k
            while k <= voiced[-1] and sil[k]: k += 1
            runs.append((st*hop, k*hop))
        else: k += 1
    maxgap = max([(b-a)/sr for a, b in runs], default=0.0)
    y = w[a0:b0].copy(); off = a0; cf = int(0.04*sr)
    for a, b in reversed(runs):
        L = (b - a)/sr
        if L <= 0.7: continue
        keep = int(0.4*sr); a -= off; b -= off
        cut_a = a + keep//2; cut_b = b - keep//2
        if cut_b - cut_a <= 2*cf: continue
        t = np.linspace(0, np.pi/2, cf)
        mix = y[cut_a:cut_a+cf]*np.cos(t) + y[cut_b-cf:cut_b]*np.sin(t)
        y = np.concatenate([y[:cut_a], mix, y[cut_b:]])
    f = int(0.03*sr); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y.astype(np.float32), maxgap
def take(text, seed):
    torch.manual_seed(seed)
    wavs, sr = m.generate_voice_clone(text=prep(text), language='English', voice_clone_prompt=prompt)
    return np.asarray(wavs[0], np.float32), sr
YN = re.compile(r"^(is|are|was|were|do|does|did|will|would|can|could|should|has|have|had|isn't|aren't|wasn't|doesn't|didn't|won't)\b", re.I)
def f0_track(y, sr):
    y16 = librosa.resample(y, orig_sr=sr, target_sr=16000)
    f0 = librosa.yin(y16, fmin=65, fmax=300, sr=16000, frame_length=1024, hop_length=160)
    rms = librosa.feature.rms(y=y16, frame_length=1024, hop_length=160)[0][:len(f0)]
    v = f0[:len(rms)][rms > np.max(rms)*0.12]
    return v[(v > 70) & (v < 290)]
def prosody_bonus(text, y, sr):
    t = text.strip(); v = f0_track(y, sr)
    if len(v) < 20: return 0.0
    st = 12*np.log2(v/np.median(v))           # semitones around the median
    rng = np.percentile(st, 90) - np.percentile(st, 10)
    if t.endswith('?'):
        tail = st[-max(8, len(st)//4):]; head = st[:-len(tail)] if len(st) > len(tail) else st
        rise = np.median(tail[-6:]) - np.median(head[-12:]) if len(head) else 0
        if YN.match(t): return 0.06*np.clip(rise/3, -1, 1) + 0.02*np.clip(rng/6, 0, 1)
        return 0.05*np.clip(rng/7, 0, 1)
    if t.endswith('!') or len(t.split()) <= 6:
        return 0.04*np.clip(rng/7, 0, 1)
    return 0.02*np.clip(rng/6, 0, 1)
def score_take(text, y, sr, maxgap):
    heard = asr({'raw': librosa.resample(y, orig_sr=sr, target_sr=16000), 'sampling_rate': 16000})['text']
    a = [x for x in norm(text) if x not in SKIP]; b = [x for x in norm(heard) if x not in SKIP]
    sc = difflib.SequenceMatcher(None, a, b).ratio()
    wps = len(norm(text)) / max(len(y)/sr, 0.1)
    lo, hi = (1.8, 3.4) if len(norm(text)) <= 6 else (2.45, 3.2)
    pen = max(0, wps-hi)*0.18 + max(0, lo-wps)*0.15 + (0.06 if maxgap > 1.0 else 0)
    return sc - pen + prosody_bonus(text, y, sr), sc, wps, heard
def best_take(text, i):
    best = None; t = 0; limit = TAKES
    while t < limit:
        w, sr = take(text, 100*i + t); y, maxgap = tidy(w, sr)
        s, sc, wps, heard = score_take(text, y, sr, maxgap)
        if best is None or s > best[0]: best = (s, y, heard, wps, sc)
        t += 1
        if t == TAKES and (best[4] < 0.95 or not (2.3 <= best[3] <= 3.35)): limit = TAKES + 3   # extra takes for rushed/garbled lines
        if best[4] > 0.97 and 2.45 <= best[3] <= 3.2 and t >= 2: break
    return best
def pieces(text):
    return [text]   # v4: one generation per paragraph, never split sentences
out = []; rep = []
for i, (text, section_end, pause) in enumerate(job):
    parts = []; scs = []; wpss = []; heards = []
    for k, ptxt in enumerate(pieces(text)):
        s, y, heard, wps, sc = best_take(ptxt, 1000*i + 10*k)
        if parts: parts.append(np.zeros(int(SR*(0.22 if ptxt.endswith('?') or parts and True else 0.2)), np.float32))
        parts.append(y); scs.append(sc); wpss.append(wps); heards.append(heard)
    y = np.concatenate(parts)
    sf.write(f'{W}/{NAME}_{i+1:03d}.wav', y, SR)
    gap = pause if pause else (0.9 if section_end else 0.4)
    out += [y, np.zeros(int(SR*gap), np.float32)]
    rep.append([i+1, round(min(scs),3), round(float(np.mean(wpss)),2), ' | '.join(h for h, c in zip(heards, scs) if c < 0.95)])
    json.dump(rep, open(W + '/report.json', 'w'))
sf.write(f'{W}/{NAME}_raw.wav', np.concatenate(out), SR)
json.dump(rep, open(W + '/report.json', 'w'))
if cfg['NAMES_TEST']:
    tests = cfg.get('TESTS') or [('Nvidia','En-vidia'),('Huang','Hwahng'),('Jiang','Jyahng'),('Qwen','Chwen'),('Kimi','Kee-mee'),
             ('Hassabis','Ha-sah-biss'),('Kiriakou','Kirry-ah-koo'),('Humain','Hu-mane'),('Hang Seng','Hahng Seng'),('Megaspeed','Mega speed')]
    for n, (a, b) in enumerate(tests, 1):
        parts = []
        for k, word in enumerate([a, b]):
            w, sr = take(f'Today we look at {word}, and why it matters.', 7000 + 10*n + k)
            y, _ = tidy(w, sr); parts += [y, np.zeros(int(SR*0.9), np.float32)]
        sf.write(f'{W}/name_{n:02d}.wav', np.concatenate(parts), SR)
    json.dump(tests, open(W + '/names.json', 'w'))
''' % W
open(W + '/step_narr2.py', 'w').write(code)
r = subprocess.run([sys.executable, W + '/step_narr2.py'], capture_output=True, text=True, stdin=subprocess.DEVNULL)
print('narrate exit', r.returncode, r.stderr[-2000:] if r.returncode else 'ok')
# Mastering v2: body, de-mud, presence, gentle de-ess, compression, -14 LUFS, true peak -1.5
MASTER = ('highpass=f=70,lowshelf=f=120:g=1.5,equalizer=f=300:t=q:w=1.0:g=-3,equalizer=f=3000:t=q:w=1.4:g=2.5,'
          'deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-21dB:ratio=2.5:attack=8:release=120:makeup=2,'
          'alimiter=limit=0.84,loudnorm=I=-14:TP=-1.5:LRA=7')
def master(src, dst, br='160k'):
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', src, '-af', 'aresample=48000,' + MASTER, '-ar', '48000', '-b:a', br, dst], stdin=subprocess.DEVNULL)
from IPython.display import Audio, display, HTML
if os.path.exists(f'{W}/report.json'):
    for n, sc, wps, heard in json.load(open(f'{W}/report.json')):
        print(f'part {n:02d}  words {sc:.3f}  pace {wps}', ('  CHECK: ' + heard) if heard else '')
    master(f'{W}/{NAME}_raw.wav', f'{W}/{NAME}.mp3')
    display(HTML(f'<h3>{NAME}</h3>')); display(Audio(f'{W}/{NAME}.mp3'))
if NAMES_TEST and os.path.exists(f'{W}/names.json'):
    display(HTML('<h3>Name test: each clip says option A, then option B. Tell me A or B per number.</h3>'))
    for n, (a, b) in enumerate(json.load(open(f'{W}/names.json')), 1):
        master(f'{W}/name_{n:02d}.wav', f'{W}/name_{n:02d}.mp3', '96k')
        display(HTML(f'<b>{n}. {a}</b>  (A = "{a}", B = "{b}")')); display(Audio(f'{W}/name_{n:02d}.mp3'))
