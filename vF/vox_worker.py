# VoxCPM2 narration worker (Lak's pick, 18 Nov: "Voice 5" = ultimate clone of the channel Tall, cfg 2.0, 16 steps, fp32).
# Each line: up to 3 takes, whisper-checked; first take with right words + natural pace wins, else the best score.
import os, sys, json, re, difflib, time, numpy as np, soundfile as sf, librosa, torch
W, SHARD, NSH = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
job = json.load(open(W + '/job.json')); PRON = json.load(open(W + '/pron.json'))
from transformers import pipeline
asr = pipeline('automatic-speech-recognition', model='openai/whisper-small.en', device=0, torch_dtype=torch.float16)
R = W + '/ref.wav'; REF_TEXT = asr(R)['text'].strip(); print('ref:', REF_TEXT, flush=True)
from voxcpm import VoxCPM
m = VoxCPM.from_pretrained('/tmp/m/VoxCPM2', load_denoiser=False, optimize=False); SR = m.tts_model.sample_rate
def prep(t):
    t = re.sub(r'\s*[—–]\s*', ', ', t); t = re.sub(r':\s+(?=[A-Za-z])', ', ', t)
    for k, v in sorted(PRON.items(), key=lambda kv: -len(kv[0])): t = re.sub(r'(?<![\w-])' + re.escape(k) + r'(?![\w-])', v, t)
    return t
norm = lambda s: re.sub(r'[^a-z0-9 ]', ' ', s.lower().replace('-', ' ')).split()
SKIP = {w for v in PRON.values() for w in norm(v)} | {w for k in PRON for w in norm(k)}
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
def score(text, y, sr, mg):
    heard = asr({'raw': librosa.resample(y, orig_sr=sr, target_sr=16000), 'sampling_rate': 16000})['text']
    a = [x for x in norm(text) if x not in SKIP]; b = [x for x in norm(heard) if x not in SKIP]
    sc = difflib.SequenceMatcher(None, a, b).ratio(); n = len(norm(text)); wps = n / max(len(y)/sr, 0.1)
    lo, hi = (1.6, 3.8) if n <= 7 else (2.4, 3.6)
    pen = max(0, wps-hi)*0.25 + max(0, lo-wps)*0.2 + (0.08 if mg > 1.0 else 0)
    ok = sc >= 0.97 and lo <= wps <= hi and mg <= 1.0
    return sc - pen + 0.03*np.clip(melody(y, sr)/6, 0, 1.3), sc, wps, heard, ok
rep = []
for j, (lid, text, sec, pause) in enumerate(job):
    if j % NSH != SHARD: continue
    best = None; t0 = time.time(); i = int(re.sub(r'\D', '', lid) or j)
    for k in range(3):
        torch.manual_seed(1000*i + k)
        w = np.asarray(m.generate(text=prep(text), prompt_wav_path=R, prompt_text=REF_TEXT, reference_wav_path=R, cfg_value=2.0, inference_timesteps=16,
                                  max_len=min(4096, max(256, len(text)*6)), retry_badcase=False, retry_badcase_max_times=1), np.float32).reshape(-1)
        y, mg = tidy(w, SR); s, sc, wps, heard, ok = score(text, y, SR, mg)
        if best is None or s > best[0]: best = (s, y, sc, wps, heard, k+1)
        if ok: break
    sf.write(f'{W}/parts/{lid}.wav', best[1], SR)
    rep.append({'id': lid, 'words': round(best[2], 3), 'pace': round(best[3], 2), 'takes': best[5], 'heard': best[4] if best[2] < 0.97 else ''})
    json.dump(rep, open(f'{W}/rep_{SHARD}.json', 'w'))
    print(f'line {lid}: words {best[2]:.3f} pace {best[3]:.2f} takes {best[5]} ({time.time()-t0:.0f}s)', flush=True)
open(f'{W}/done_{SHARD}', 'w').write('ok')
