# Fix pass for the ambitious voice test: VibeVoice-7B split across both T4s; IndexTTS-2.5 in its own uv venv.
import subprocess, sys, os, json, random, shutil
W = '/kaggle/working/amb'
def sh(cmd, cwd=None):
    r = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    return r.returncode, (r.stdout[-1200:] + r.stderr[-2000:])
log = {}
# VibeVoice-7B: patch the demo to spread layers over both GPUs
src = open(W + '/vv/demo/inference_from_file.py').read()
src = src.replace('device_map="cuda",', 'device_map="auto", max_memory={0: "13GiB", 1: "14GiB"},')
open(W + '/vv/demo/step_infer_multi.py', 'w').write(src)
sh(f'{sys.executable} -m pip install -q "huggingface_hub>=0.30.0,<1.0" "transformers==4.51.3" "accelerate==1.6.0"')
if not os.path.exists(W + '/vv7.wav'):
    c, o = sh(f'PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True {sys.executable} demo/step_infer_multi.py --model_path vibevoice/VibeVoice-7B '
              f'--txt_path {W}/vv_script.txt --speaker_names Tall --dtype float16 --cfg_scale 1.3 --seed 42 --output_dir {W}/vv7_out', cwd=W + '/vv')
    wavs = [f for f in os.listdir(f'{W}/vv7_out') if f.endswith('.wav')] if os.path.exists(f'{W}/vv7_out') else []
    if wavs: shutil.copy(f'{W}/vv7_out/{wavs[0]}', f'{W}/vv7.wav'); log['vv7'] = 'ok'
    else: log['vv7'] = 'FAILED: ' + o[-800:]
# IndexTTS-2.5 in an isolated environment (uv)
if not os.path.exists(W + '/it25.wav'):
    sh(f'{sys.executable} -m pip install -q uv')
    c, o = sh('uv sync --all-extras', cwd=W + '/it'); log['it_uv'] = 'ok' if c == 0 else 'FAILED: ' + o[-600:]
    py = W + '/it/.venv/bin/python'
    if os.path.exists(py):
        c, o = sh(f'{py} {W}/step_it.py', cwd=W + '/it')
        log['it25'] = 'ok' if os.path.exists(W + '/it25.wav') else 'FAILED: ' + o[-800:]
# blind players for everything that exists (re-shuffled)
MASTER = ('highpass=f=70,lowshelf=f=120:g=1.5,equalizer=f=300:t=q:w=1.0:g=-3,equalizer=f=3000:t=q:w=1.4:g=2.5,'
          'deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-21dB:ratio=2.5:attack=8:release=120:makeup=2,alimiter=limit=0.84,loudnorm=I=-14:TP=-1.5:LRA=7')
names = [n for n in ['vv15', 'vv7', 'it25'] if os.path.exists(f'{W}/{n}.wav')]
random.shuffle(names); key = {}
from IPython.display import Audio, display, HTML
for k, v in log.items(): print(k, '→', v)
display(HTML('<h3>Ambitious voice test, round 2: which one sounds alive and human?</h3>'))
for i, n in enumerate(names, 1):
    sh(f'ffmpeg -nostdin -y -loglevel error -i {W}/{n}.wav -af "aresample=48000,{MASTER}" -ar 48000 -b:a 160k {W}/Voice_{chr(64+i)}.mp3')
    dur = sh(f'ffprobe -v error -show_entries format=duration -of csv=p=0 {W}/{n}.wav')[1].strip()
    key[f'Voice_{chr(64+i)}'] = n; display(HTML(f'<b>Voice {chr(64+i)}</b> ({dur[:5]} s)')); display(Audio(f'{W}/Voice_{chr(64+i)}.mp3'))
print('K', json.dumps(key).encode().hex())
