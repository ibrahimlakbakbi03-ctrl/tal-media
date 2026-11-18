# FULL NARRATION · VoxCPM2 "Voice 5" (Lak's blind-test pick, 18 Nov). Two T4s in parallel, one shard each.
import os, sys, json, time, subprocess, urllib.request, shutil, glob
REV = globals().get('REV', 'main'); REPO = 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV
JOB = globals().get('JOB', 'vF/narr_v6b_full.json'); NAME = globals().get('NAME', 'TAL_videoF_v6_voxcpm')
PRON = globals().get('PRON', {'Jiang': 'Jee-yang', 'Kiriakou': 'Kiriyako'})
W = '/kaggle/working/' + NAME; shutil.rmtree(W, ignore_errors=True); os.makedirs(W + '/parts')
get = lambda u, p: urllib.request.urlretrieve(u, p)
get(REPO + '/' + JOB, W + '/job.json'); get(REPO + '/vF/vox_worker.py', W + '/vox_worker.py'); get(REPO + '/ref/TAL_reference_12s.wav', W + '/ref_in.wav')
json.dump(PRON, open(W + '/pron.json', 'w'))
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', W + '/ref_in.wav', '-ac', '1', '-ar', '24000', '-af', 'silenceremove=start_periods=1:start_threshold=-45dB', W + '/ref.wav'])
VPY = '/tmp/venv_vox/bin/python'; CU = 'https://download.pytorch.org/whl/cu126'
if not os.path.exists(VPY):
    subprocess.run(['pip', 'install', '-q', 'uv'])
    r = subprocess.run(['bash', '-c', f'unset UV_SYSTEM_PYTHON; export UV_LINK_MODE=copy; uv venv -q /tmp/venv_vox --python 3.11 && uv pip install -q --python {VPY} torch==2.7.1 torchaudio==2.7.1 torchcodec==0.4.0 voxcpm==2.0.3 soundfile huggingface_hub --extra-index-url {CU} --index-strategy unsafe-best-match'], capture_output=True, text=True)
    print('venv', r.returncode, r.stderr[-1500:])
D = '/tmp/m/VoxCPM2'
if not os.path.exists(D + '/config.json'):
    inp = glob.glob('/kaggle/input/**/models--openbmb--VoxCPM2/snapshots/*', recursive=True)
    if inp: shutil.copytree(inp[0], D, dirs_exist_ok=True)
    else: subprocess.run([VPY, '-c', f"from huggingface_hub import snapshot_download as s; s('openbmb/VoxCPM2', local_dir='{D}')"])
c = json.load(open(D + '/config.json')); c['dtype'] = 'float32'; json.dump(c, open(D + '/config.json', 'w'))
P = [subprocess.Popen([VPY, W + '/vox_worker.py', W, str(g), '2'], stdout=open(f'{W}/w{g}.log', 'w'), stderr=subprocess.STDOUT, env=dict(os.environ, CUDA_VISIBLE_DEVICES=str(g))) for g in (0, 1)]
job = json.load(open(W + '/job.json')); t0 = time.time()
while any(p.poll() is None for p in P):
    time.sleep(120)
    n = len(glob.glob(W + '/parts/*.wav')); print(f'[{(time.time()-t0)/60:.0f} min] {n}/{len(job)} lines', flush=True)
for g, p in enumerate(P):
    if p.returncode: print(f'worker {g} exit {p.returncode}:', open(f'{W}/w{g}.log').read()[-2500:])
import numpy as np, soundfile as sf
out, tl, t, sr = [], [], 0.0, None
for lid, text, sec, pause in job:
    f = f'{W}/parts/{lid}.wav'
    if not os.path.exists(f): print('MISSING line', lid); continue
    y, sr = sf.read(f); y = y.astype(np.float32); tl.append({'id': lid, 'start': round(t, 2), 'end': round(t + len(y)/sr, 2)})
    out += [y, np.zeros(int(sr*pause), np.float32)]; t += len(y)/sr + pause
sf.write(f'{W}/{NAME}_raw.wav', np.concatenate(out), sr); json.dump(tl, open(f'{W}/timeline.json', 'w'))
MASTER = ('highpass=f=70,lowshelf=f=120:g=1.5,equalizer=f=300:t=q:w=1.0:g=-3,equalizer=f=3000:t=q:w=1.4:g=2.5,'
          'deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-21dB:ratio=2.5:attack=8:release=120:makeup=2,'
          'alimiter=limit=0.84,loudnorm=I=-14:TP=-1.5:LRA=7')
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', f'{W}/{NAME}_raw.wav', '-af', 'aresample=48000,' + MASTER, '-ar', '48000', '-b:a', '192k', f'/kaggle/working/{NAME}.mp3'])
rep = sorted(sum([json.load(open(f)) for f in glob.glob(W + '/rep_*.json')], []), key=lambda r: int(r['id']) if r['id'].isdigit() else 0)
json.dump(rep, open(f'{W}/report.json', 'w'), indent=0)
for r in rep:
    if r['words'] < 0.97 or not (2.3 <= r['pace'] <= 3.7): print('CHECK', r)
shutil.make_archive(f'/kaggle/working/{NAME}_pack', 'zip', W, '.')
from IPython.display import Audio, display, HTML
print(f'total {t/60:.1f} min'); display(HTML(f'<h3>{NAME}</h3>')); display(Audio(f'/kaggle/working/{NAME}.mp3'))
