# main env: score every take (words heard, pace, pause, melody, sounds-like-Tall), pick the best per line, stitch per voice
import json, re, glob, difflib, sys, os, numpy as np, soundfile as sf, librosa, torch
AB = sys.argv[1]
lines = [l[0] for l in json.load(open(AB + '/lines.json'))]
from transformers import pipeline
asr = pipeline('automatic-speech-recognition', model='openai/whisper-small.en', device=0, torch_dtype=torch.float16)
try:
    from speechbrain.inference.speaker import EncoderClassifier
    enc = EncoderClassifier.from_hparams(source='speechbrain/spkrec-ecapa-voxceleb', savedir='/tmp/ecapa', run_opts={'device': 'cuda:0'})
    def emb(y, sr):
        y16 = librosa.resample(y, orig_sr=sr, target_sr=16000)
        e = enc.encode_batch(torch.tensor(y16)[None].float().cuda()).squeeze().cpu().numpy(); return e / np.linalg.norm(e)
    yr, srr = sf.read(AB + '/ref_full.wav'); E_REF = emb(yr.astype(np.float32), srr)
except Exception as e:
    print('speaker sim off:', repr(e)[:200]); emb = None
norm = lambda s: re.sub(r'[^a-z0-9 ]', ' ', s.lower().replace('-', ' ')).split()
def tidy(w, sr):
    w = w - np.mean(w); hop = int(0.01*sr); fr = int(0.03*sr)
    rms = librosa.feature.rms(y=w, frame_length=fr, hop_length=hop)[0]
    sil = rms < np.max(rms) * 10**(-42/20); voiced = np.where(~sil)[0]
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
        if (b - a)/sr <= 0.7: continue
        keep = int(0.4*sr); a -= off; b -= off; ca = a + keep//2; cb = b - keep//2
        if cb - ca <= 2*cf: continue
        t = np.linspace(0, np.pi/2, cf); mix = y[ca:ca+cf]*np.cos(t) + y[cb-cf:cb]*np.sin(t)
        y = np.concatenate([y[:ca], mix, y[cb:]])
    f = int(0.03*sr); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y.astype(np.float32), maxgap
def melody(y, sr):
    y16 = librosa.resample(y, orig_sr=sr, target_sr=16000)
    f0 = librosa.yin(y16, fmin=65, fmax=300, sr=16000, frame_length=1024, hop_length=160)
    rms = librosa.feature.rms(y=y16, frame_length=1024, hop_length=160)[0][:len(f0)]
    v = f0[:len(rms)][rms > np.max(rms)*0.12]; v = v[(v > 70) & (v < 290)]
    if len(v) < 20: return 0.0
    st = 12*np.log2(v/np.median(v)); return float(np.percentile(st, 90) - np.percentile(st, 10))
LO, HI = 2.3, 2.85
def score(text, y, sr, maxgap):
    heard = asr({'raw': librosa.resample(y, orig_sr=sr, target_sr=16000), 'sampling_rate': 16000})['text']
    sc = difflib.SequenceMatcher(None, norm(text), norm(heard)).ratio()
    wps = len(norm(text)) / max(len(y)/sr, 0.1); rng = melody(y, sr)
    sim = float(np.dot(emb(y, sr), E_REF)) if emb else 0.0
    pen = max(0, wps-HI)*0.25 + max(0, LO-wps)*0.2 + (0.08 if maxgap > 1.0 else 0) + (0.5 if sc < 0.92 else 0)
    total = sc - pen + 0.03*np.clip(rng/6, 0, 1.3) + 0.6*sim
    return dict(total=float(total), words=round(sc, 3), pace=round(wps, 2), melody=round(rng, 1), tall=round(sim, 3), heard=heard)
report = {}
for v in ['Q', 'V1', 'V2', 'C1', 'C2']:
    picks = []; rows = []
    for i, t in enumerate(lines, 1):
        files = [f'{AB}/q/Q_{i:03d}.wav'] if v == 'Q' else sorted(glob.glob(f'{AB}/takes/{v}_L{i}_s*.wav'))
        best = None
        for f in files:
            if not os.path.exists(f): continue
            w, sr = sf.read(f); w = w.astype(np.float32)
            if w.ndim > 1: w = w.mean(1)
            y, mg = (w, 0.0) if v == 'Q' else tidy(w, sr)
            s = score(t, y, sr, mg)
            if best is None or s['total'] > best[0]['total']: best = (s, y, sr)
        if best is None: break
        picks.append(best); rows.append({k: best[0][k] for k in ('words', 'pace', 'melody', 'tall')})
    if len(picks) != len(lines): print(v, 'incomplete, skipped'); continue
    sr = picks[0][2]; out = []
    for n, (s, y, _) in enumerate(picks):
        out += [y, np.zeros(int(sr*(0.45 if n == 2 else 0.4)), np.float32)]
    sf.write(f'{AB}/{v}_raw.wav', np.concatenate(out), sr)
    report[v] = {'lines': rows, 'avg': {k: round(float(np.mean([r[k] for r in rows])), 3) for k in rows[0]}}
    print(v, report[v]['avg'], flush=True)
json.dump(report, open(AB + '/report.json', 'w'), indent=1)
