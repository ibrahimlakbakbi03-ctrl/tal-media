# VOICE A/B · same 4 cold-open lines, 5 voices, scored by machine, judged blind by Lak.
# Q = old formula (Qwen clone, narrate5) · V1/V2 = VoxCPM2 (clone / styled clone) · C1/C2 = CosyVoice 3 (clone / instructed narrator)
import os, sys, json, time, subprocess, urllib.request, random, shutil, glob
REV = globals().get('REV', 'main'); REPO = 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV
VS = 'https://raw.githubusercontent.com/debpalash/VoiceStudio/8f6c113433faa1c39d0584534d7d20f469a2a419/backend/engines/cosyvoice_subprocess/'
AB = '/kaggle/working/ab'; shutil.rmtree(AB, ignore_errors=True); os.makedirs(AB + '/takes'); os.makedirs(AB + '/q')
TK = globals().get('ENGINE_TAKES', 3)
get = lambda u, p: urllib.request.urlretrieve(u, p)
for f in ['ref_step.py', 'vox_gen.py', 'cosy_gen.py', 'score_step.py']: get(REPO + '/vF/ab/' + f, AB + '/' + f)
get(REPO + '/vF/ab_job.json', AB + '/lines.json'); get(REPO + '/ref/TAL_voice_v1.mp3', AB + '/TAL_voice_v1.mp3')
os.makedirs('/tmp/cosy_sidecar', exist_ok=True); get(VS + 'main.py', '/tmp/cosy_sidecar/main.py'); get(VS + 'requirements.txt', '/tmp/cosy_req.txt')
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'uv'], check=False)
print(subprocess.run('nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv', shell=True, capture_output=True, text=True).stdout)
r = subprocess.run([sys.executable, AB + '/ref_step.py', AB], capture_output=True, text=True); print(r.stdout[-600:], r.stderr[-1500:] if r.returncode else '')
CU = 'https://download.pytorch.org/whl/cu126'
VOX = f'''set -x; export UV_LINK_MODE=copy; uv venv -q /tmp/venv_vox --python 3.11 && export VIRTUAL_ENV=/tmp/venv_vox &&
uv pip install -q torch==2.7.1 torchaudio==2.7.1 torchcodec==0.4.0 voxcpm==2.0.3 soundfile huggingface_hub --extra-index-url {CU} --index-strategy unsafe-best-match &&
/tmp/venv_vox/bin/python {AB}/vox_gen.py {AB} {TK}'''
C = '074ca6dc9e80a2f424f1f74b48bdd7d3fea531cc'; M = 'dd9105b34bf2be2230f4aa1e4769fb586a3c824e'; P = 'f31ad88d543fdaebbda2d0c9a5e4d4f991ae0b6c'; WD = 'd625e7608ca23a870018f01e7c562ac683d9847f'
COSY = f'''set -x; export UV_LINK_MODE=copy; cd /tmp && rm -rf CosyVoice CosyVoice-{C} &&
curl -sL https://github.com/FunAudioLLM/CosyVoice/archive/{C}.tar.gz | tar xz && mv CosyVoice-{C} CosyVoice && mkdir -p CosyVoice/third_party && cd CosyVoice/third_party && rm -rf Matcha-TTS PyWorld &&
curl -sL https://github.com/shivammehta25/Matcha-TTS/archive/{M}.tar.gz | tar xz && mv Matcha-TTS-{M} Matcha-TTS &&
curl -sL https://github.com/JeremyCCHsu/Python-Wrapper-for-World-Vocoder/archive/{P}.tar.gz | tar xz && mv Python-Wrapper-for-World-Vocoder-{P} PyWorld && rm -rf PyWorld/lib/World &&
curl -sL https://github.com/mmorise/World/archive/{WD}.tar.gz | tar xz && mv World-{WD} PyWorld/lib/World && cd /tmp &&
printf 'torch==2.7.0\\ntorchaudio==2.7.0\\n' > /tmp/cosy_c.txt && uv venv -q /tmp/venv_cosy --python 3.10 && export VIRTUAL_ENV=/tmp/venv_cosy &&
uv pip install -q torch==2.7.0 torchaudio==2.7.0 --index-url {CU} &&
uv pip install -q -c /tmp/cosy_c.txt -r /tmp/cosy_req.txt /tmp/CosyVoice/third_party/PyWorld huggingface_hub --extra-index-url {CU} --index-strategy unsafe-best-match &&
/tmp/venv_cosy/bin/python - <<'PY'
import glob, shutil, os
from huggingface_hub import snapshot_download
D = '/tmp/CosyVoice/pretrained_models/Fun-CosyVoice3-0.5B'
inp = glob.glob('/kaggle/input/**/models--FunAudioLLM--Fun-CosyVoice3-0.5B-2512/snapshots/*', recursive=True)
if inp: shutil.copytree(inp[0], D, dirs_exist_ok=True)
else: snapshot_download('FunAudioLLM/Fun-CosyVoice3-0.5B-2512', revision='29e01c4e8d000f4bcd70751be16fa94bf3d85a18', local_dir=D,
    allow_patterns=['cosyvoice3.yaml','config.json','configuration.json','campplus.onnx','speech_tokenizer_v3.onnx','llm.pt','flow.pt','hift.pt','CosyVoice-BlankEN/*'])
print('cosy weights ok', os.listdir(D))
PY
OMNIVOICE_COSYVOICE_DIR=/tmp/CosyVoice CUDA_VISIBLE_DEVICES=1 /tmp/venv_cosy/bin/python {AB}/cosy_gen.py {AB} {TK}'''
procs = {}
for name, script in [('vox', VOX), ('cosy', COSY)]:
    open(f'/tmp/{name}.sh', 'w').write(script)
    procs[name] = subprocess.Popen(['bash', f'/tmp/{name}.sh'], stdout=open(f'{AB}/{name}.log', 'w'), stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL)
# Q: the old formula, exactly as used for Video F v5 (12 s Tall reference, Qwen3-TTS Base clone, scored takes)
ns = dict(WDIR=AB + '/q', REV=REV, JOB='vF/ab_job.json', NAME='Q', TAKES=4, NAMES_TEST=False, PACE=[2.3, 2.8])
try: exec(urllib.request.urlopen(REPO + '/narrate5_cell.py').read().decode(), ns)
except Exception as e: print('old formula failed:', repr(e)[:500])
finally: open(AB + '/qwen_done', 'w').write('ok')
from IPython.display import clear_output, display, Audio, HTML
clear_output(); print('old formula done; VoxCPM2 + CosyVoice 3 running')
t0 = time.time()
while any(p.poll() is None for p in procs.values()):
    time.sleep(120)
    for n in procs:
        tail = open(f'{AB}/{n}.log').read().strip().splitlines()[-1:] if os.path.exists(f'{AB}/{n}.log') else ['']
        print(f'[{(time.time()-t0)/60:.0f} min] {n}: {"running" if procs[n].poll() is None else "exit " + str(procs[n].returncode)} | {tail[0][:160]}', flush=True)
for n in procs:
    print(f'== {n} exit {procs[n].returncode}, takes:', len(glob.glob(f'{AB}/takes/{"V" if n == "vox" else "C"}*.wav')))
    if procs[n].returncode: print(open(f'{AB}/{n}.log').read()[-2500:])
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'speechbrain'], check=False)
r = subprocess.run([sys.executable, AB + '/score_step.py', AB], capture_output=True, text=True); print(r.stdout[-3000:], r.stderr[-2500:] if r.returncode else '')
MASTER = ('highpass=f=70,lowshelf=f=120:g=1.5,equalizer=f=300:t=q:w=1.0:g=-3,equalizer=f=3000:t=q:w=1.4:g=2.5,'
          'deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-21dB:ratio=2.5:attack=8:release=120:makeup=2,'
          'alimiter=limit=0.84,loudnorm=I=-14:TP=-1.5:LRA=7')
rep = json.load(open(AB + '/report.json')) if os.path.exists(AB + '/report.json') else {}
names = [v for v in ['Q', 'V1', 'V2', 'C1', 'C2'] if os.path.exists(f'{AB}/{v}_raw.wav')]
random.Random(1118).shuffle(names); key = {}
os.makedirs(AB + '/blind', exist_ok=True)
display(HTML('<h2>Voice test · blind</h2><p>Same text, 5 voices. One of them is our old voice. Listen to all, then tell me your ranking (best → worst).</p>'))
for n, v in enumerate(names, 1):
    dst = f'{AB}/blind/Voice_{n}.mp3'; key[f'Voice_{n}'] = v
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', f'{AB}/{v}_raw.wav', '-af', 'aresample=48000,' + MASTER, '-ar', '48000', '-b:a', '192k', dst])
    a = rep.get(v, {}).get('avg', {})
    display(HTML(f'<h3>Voice {n}</h3><small>machine check: words {a.get("words")} · pace {a.get("pace")} w/s · melody {a.get("melody")} st · sounds-like-Tall {a.get("tall")}</small>')); display(Audio(dst))
json.dump(key, open(AB + '/blind_key.json', 'w'))
shutil.make_archive('/kaggle/working/voice_test_blind', 'zip', AB + '/blind')
print('zip: /kaggle/working/voice_test_blind.zip')
