# OLD TALL VOICE, made clearer + more mature. Two versions, blind:
#   qwen  = Qwen3-TTS Base cloning the old Tall reference (paragraph flow, whisper-picked takes)
#   chbox = Chatterbox (the exact engine of past videos), paragraph chunks, whisper-picked takes
# Both get the same mastering: warmer low end, no mud, clearer words.
import subprocess, sys, os, json, random, urllib.request
REV = globals().get('REV', 'main')
REPO = 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV
W = '/kaggle/working/narr'; os.makedirs(W, exist_ok=True)
# 1) Qwen clone of the old voice (reuses the narration pipeline)
REF_FILE = 'ref/TAL_reference_12s.wav'; REF_TEXT_OVERRIDE = ''; NAME = 'old_qwen'; JOB = 'vF/narr_test.json'; QUIET = True
exec(urllib.request.urlopen(REPO + '/narrate_cell.py').read().decode())
# 2) Chatterbox, the original engine (installed after Qwen: it changes transformers)
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'chatterbox-tts', 'faster-whisper'], check=False)
code = f"""
import json, re, difflib, torch, numpy as np, soundfile as sf, librosa
W='{W}'; job=json.load(open(W+'/job.json'))
from chatterbox.tts import ChatterboxTTS
m = ChatterboxTTS.from_pretrained(device='cuda'); SR = m.sr
from faster_whisper import WhisperModel
asr = WhisperModel('small.en', device='cuda', compute_type='float16')
norm = lambda s: re.sub(r'[^a-z0-9 ]', ' ', s.lower()).split()
out=[]; rep=[]
for i,(text,pause) in enumerate(job):
    best=None
    for t in range(3):
        torch.manual_seed(100*i+t)
        w = m.generate(text.replace('Nvidia', 'En-vid-ee-uh'), audio_prompt_path=W+'/ref.wav', exaggeration=0.5, cfg_weight=0.45, temperature=0.8).squeeze().cpu().numpy().astype(np.float32)
        w,_ = librosa.effects.trim(w, top_db=38)
        segs,_ = asr.transcribe(librosa.resample(w, orig_sr=SR, target_sr=16000), language='en', beam_size=1)
        heard = ' '.join(s.text for s in segs)
        sc = difflib.SequenceMatcher(None, norm(text.replace('Nvidia','nvidia')), norm(heard)).ratio()
        wps = len(norm(text))/(len(w)/SR); pen = 0 if 2.3 <= wps <= 3.9 else 0.1
        if best is None or sc-pen > best[0]: best=(sc-pen,w,heard,wps)
        if sc > 0.97 and pen == 0: break
    out += [best[1], np.zeros(int(SR*(0.12+pause)), np.float32)]
    rep.append((i+1, round(best[0],3), round(best[3],2)))
sf.write(W+'/old_chbox_raw.wav', np.concatenate(out), SR)
print(rep)
"""
open(W + '/step_chbox.py', 'w').write(code)
r = subprocess.run([sys.executable, W + '/step_chbox.py'], capture_output=True, text=True, stdin=subprocess.DEVNULL)
print('chatterbox exit', r.returncode, r.stdout[-600:], r.stderr[-1500:] if r.returncode else '')
# 3) same mastering for both: body at 120 Hz, less mud, clearer words, even loudness
MASTER2 = 'highpass=f=70,lowshelf=f=120:g=2,equalizer=f=280:t=q:w=1.2:g=-3,equalizer=f=3200:t=q:w=1.5:g=2.5,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14:TP=-1:LRA=7'
names = ['old_qwen', 'old_chbox']; random.shuffle(names); key = {}
from IPython.display import Audio, display, HTML
display(HTML('<h3>Old Tall voice, clearer + more mature: which flows better?</h3>'))
for i, n in enumerate(names, 1):
    if not os.path.exists(f'{W}/{n}_raw.wav'): print('missing', n); continue
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', f'{W}/{n}_raw.wav', '-af', 'aresample=48000,' + MASTER2, '-ar', '48000', '-b:a', '128k', f'{W}/Old_{i}.mp3'], stdin=subprocess.DEVNULL)
    key[f'Old_{i}'] = n
    display(HTML(f'<b>Old voice {i}</b>')); display(Audio(f'{W}/Old_{i}.mp3'))
print('K', json.dumps(key).encode().hex())
