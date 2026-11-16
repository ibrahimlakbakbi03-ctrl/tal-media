# NARRATION v2 · Old Tall voice via Qwen3-TTS Base clone (Lak picked "Old voice 1", 16 Nov).
# Flow fixes: text prep (colons/dashes), internal pauses normalised (no dead air, no rushed joins),
# punctuation-aware joins with short fades, up to N takes scored on words + pace + no hesitations.
# Pronunciation: PRON respellings; optional NAMES test (A = plain, B = respelled) for Lak to pick by ear.
import subprocess, sys, os, json, urllib.request
W = '/kaggle/working/narr2'; os.makedirs(W, exist_ok=True)
REV = globals().get('REV', 'main'); REPO = 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV
JOB = globals().get('JOB', 'vF/narr_v4_test.json'); NAME = globals().get('NAME', 'TAL_v4_test')
TAKES = globals().get('TAKES', 4); NAMES_TEST = globals().get('NAMES_TEST', True)
PRON = globals().get('PRON', {})
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '-U', 'qwen-tts', 'transformers==4.57.3'], check=False)
urllib.request.urlretrieve(REPO + '/ref/TAL_reference_12s.wav', W + '/ref_in.wav')
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', W + '/ref_in.wav', '-ac', '1', '-ar', '24000', W + '/ref.wav'], stdin=subprocess.DEVNULL)
urllib.request.urlretrieve(REPO + '/' + JOB, W + '/job.json')
json.dump({'PRON': PRON, 'TAKES': TAKES, 'NAME': NAME, 'NAMES_TEST': NAMES_TEST}, open(W + '/cfg.json', 'w'))
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
    # keep speech, cap internal gaps at 0.42 s, keep natural short gaps; 25 ms fades at the edges
    iv = librosa.effects.split(w, top_db=36, frame_length=1024, hop_length=256)
    if len(iv) == 0: return w, 0.0
    out = []; maxgap = 0.0
    for j, (a, b) in enumerate(iv):
        a = max(0, a - int(0.03*sr)); b = min(len(w), b + int(0.05*sr))
        if j:
            gap = (iv[j][0] - iv[j-1][1]) / sr; maxgap = max(maxgap, gap)
            out.append(np.zeros(int(sr * min(max(gap, 0.06), 0.42)), np.float32))
        out.append(w[a:b])
    y = np.concatenate(out); f = int(0.025*sr)
    y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y, maxgap
def take(text, seed):
    torch.manual_seed(seed)
    wavs, sr = m.generate_voice_clone(text=prep(text), language='English', voice_clone_prompt=prompt)
    return np.asarray(wavs[0], np.float32), sr
def best_take(text, i):
    best = None
    for t in range(TAKES):
        w, sr = take(text, 100*i + t)
        y, maxgap = tidy(w, sr)
        heard = asr({'raw': librosa.resample(y, orig_sr=sr, target_sr=16000), 'sampling_rate': 16000})['text']
        a = [x for x in norm(text) if x not in SKIP]; b = [x for x in norm(heard) if x not in SKIP]
        sc = difflib.SequenceMatcher(None, a, b).ratio()
        wps = len(norm(text)) / (len(y)/sr)
        pen = (0 if 2.4 <= wps <= 3.5 else 0.08) + (0.06 if maxgap > 0.9 else 0)
        s = sc - pen
        if best is None or s > best[0]: best = (s, y, heard, wps, sc)
        if sc > 0.97 and pen == 0: break
    return best
out = []; rep = []
for i, (text, section_end, pause) in enumerate(job):
    s, y, heard, wps, sc = best_take(text, i)
    sf.write(f'{W}/{NAME}_{i+1:03d}.wav', y, SR)
    gap = pause if pause else (0.9 if section_end else 0.4)
    out += [y, np.zeros(int(SR*gap), np.float32)]
    rep.append([i+1, round(sc,3), round(wps,2), heard if sc < 0.95 else ''])
sf.write(f'{W}/{NAME}_raw.wav', np.concatenate(out), SR)
json.dump(rep, open(W + '/report.json', 'w'))
if cfg['NAMES_TEST']:
    tests = [('Nvidia','En-vidia'),('Huang','Hwahng'),('Jiang','Jyahng'),('Qwen','Chwen'),('Kimi','Kee-mee'),
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
    display(HTML(f'<h3>{NAME}: new script opening, smoother pauses, new mastering</h3>')); display(Audio(f'{W}/{NAME}.mp3'))
if NAMES_TEST and os.path.exists(f'{W}/names.json'):
    display(HTML('<h3>Name test: each clip says option A, then option B. Tell me A or B per number.</h3>'))
    for n, (a, b) in enumerate(json.load(open(f'{W}/names.json')), 1):
        master(f'{W}/name_{n:02d}.wav', f'{W}/name_{n:02d}.mp3', '96k')
        display(HTML(f'<b>{n}. {a}</b>  (A = "{a}", B = "{b}")')); display(Audio(f'{W}/name_{n:02d}.mp3'))
