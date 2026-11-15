# NARRATION · Qwen3-TTS Base, cloned from Lak's chosen voice (ref/TAL_voice_v1.mp3).
# Paragraph-sized chunks for natural flow; N takes per chunk, Whisper picks the take that says the words best.
import subprocess, sys, os, json, urllib.request
W = '/kaggle/working/narr'; os.makedirs(W, exist_ok=True)
REPO = 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + globals().get('REV', 'main')
JOB = globals().get('JOB', 'vF/narr_test.json'); NAME = globals().get('NAME', 'TAL_test')
TAKES = globals().get('TAKES', 3)
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '-U', 'qwen-tts', 'transformers==4.57.3'], check=False)
urllib.request.urlretrieve(REPO + '/ref/TAL_voice_v1.mp3', W + '/ref.mp3')
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', W + '/ref.mp3', '-ac', '1', '-ar', '24000', W + '/ref.wav'], stdin=subprocess.DEVNULL)
urllib.request.urlretrieve(REPO + '/' + JOB, W + '/job.json')
REF_TEXT = ("In the last three years, central banks have bought more gold than at any time in half a century. "
            "Not hedge funds. Not retail traders. Central banks. "
            "And they're not buying it because they love shiny metal. "
            "They're buying it because they no longer fully trust the one asset that has run the world since 1971: the US dollar. "
            "So the real question isn't whether gold goes up. "
            "It's what these banks know, that most investors still don't.")
open(W + '/ref.txt', 'w').write(REF_TEXT)
code = f"""
import json, os, re, difflib, torch, numpy as np, soundfile as sf, librosa
W='{W}'; TAKES={TAKES}; NAME='{NAME}'
job = json.load(open(W+'/job.json'))
from qwen_tts import Qwen3TTSModel
dt = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-Base', device_map='cuda:0', dtype=dt, attn_implementation='sdpa')
prompt = m.create_voice_clone_prompt(ref_audio=W+'/ref.wav', ref_text=open(W+'/ref.txt').read())
from transformers import pipeline
asr = pipeline('automatic-speech-recognition', model='openai/whisper-small.en', device=0, torch_dtype=torch.float16)
norm = lambda s: re.sub(r'[^a-z0-9 ]', ' ', s.lower()).split()
SR = None; out = []; report = []
for i, (text, pause) in enumerate(job):
    best = None
    for t in range(TAKES):
        torch.manual_seed(100*i + t)
        wavs, sr = m.generate_voice_clone(text=text, language='English', voice_clone_prompt=prompt)
        w = np.asarray(wavs[0], dtype=np.float32); SR = sr
        w, _ = librosa.effects.trim(w, top_db=38)
        heard = asr({{'raw': librosa.resample(w, orig_sr=sr, target_sr=16000), 'sampling_rate': 16000}})['text']
        score = difflib.SequenceMatcher(None, norm(text), norm(heard)).ratio()
        wps = len(norm(text)) / (len(w)/sr)
        pen = 0 if 2.3 <= wps <= 3.9 else 0.1
        if best is None or score - pen > best[0]: best = (score - pen, w, heard, wps)
        if score > 0.97 and pen == 0: break
    sc, w, heard, wps = best
    sf.write(f'{{W}}/{{NAME}}_{{i+1:02d}}.wav', w, sr)
    out += [w, np.zeros(int(sr*(0.12 + pause)), np.float32)]
    report.append((i+1, round(sc,3), round(wps,2), heard if sc < 0.95 else ''))
sf.write(f'{{W}}/{{NAME}}_raw.wav', np.concatenate(out), SR)
json.dump(report, open(W+'/report.json','w'))
"""
open(W + '/step_narrate.py', 'w').write(code)
r = subprocess.run([sys.executable, W + '/step_narrate.py'], capture_output=True, text=True, stdin=subprocess.DEVNULL)
print('narrate exit', r.returncode, r.stderr[-2000:] if r.returncode else 'ok')
MASTER = 'highpass=f=75,equalizer=f=250:t=q:w=1.2:g=-3,equalizer=f=3500:t=q:w=1.5:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14:TP=-1:LRA=7'
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', f'{W}/{NAME}_raw.wav', '-af', 'aresample=48000,' + MASTER, '-ar', '48000', f'{W}/{NAME}.wav'], stdin=subprocess.DEVNULL)
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', f'{W}/{NAME}.wav', '-b:a', '128k', f'{W}/{NAME}.mp3'], stdin=subprocess.DEVNULL)
from IPython.display import Audio, display, HTML
if os.path.exists(W + '/report.json'):
    for n, sc, wps, heard in json.load(open(W + '/report.json')):
        print(f'part {n:02d}  accuracy {sc:.3f}  words/sec {wps}', ('  CHECK: ' + heard) if heard else '')
display(HTML(f'<h3>{NAME}: listen for flow</h3>')); display(Audio(f'{W}/{NAME}.mp3'))
