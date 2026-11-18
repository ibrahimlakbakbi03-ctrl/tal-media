# venv (py3.11, voxcpm 2.0.3): VoxCPM2 takes. V1 = ultimate clone (prompt + transcript), V2 = style-controlled clone
import os, sys, json, time, glob, shutil
AB = sys.argv[1]; TAKES = int(sys.argv[2])
while not os.path.exists(AB + '/qwen_done'): time.sleep(10)
from huggingface_hub import snapshot_download
import soundfile as sf, numpy as np, torch
D = '/tmp/m/VoxCPM2'
inp = glob.glob('/kaggle/input/*/hf/hub/models--openbmb--VoxCPM2/snapshots/*')
src = inp[0] if inp else snapshot_download('openbmb/VoxCPM2', cache_dir='/tmp/hf')
if not os.path.exists(D): shutil.copytree(src, D, symlinks=False)
cfgp = D + '/config.json'; c = json.load(open(cfgp)); print('config dtype', c.get('dtype')); c['dtype'] = 'float32'; json.dump(c, open(cfgp, 'w'))
from voxcpm import VoxCPM
m = VoxCPM.from_pretrained(D, load_denoiser=False, optimize=False)
SR = m.tts_model.sample_rate
ref = json.load(open(AB + '/ref.json')); R = AB + '/ref20.wav'
lines = [l[0] for l in json.load(open(AB + '/lines.json'))]
STYLE = '(confident, engaged documentary narrator, natural energy, medium pace)'
for i, t in enumerate(lines, 1):
    for k in range(TAKES):
        for v in ('V1', 'V2'):
            kw = dict(cfg_value=2.0, inference_timesteps=16, max_len=min(4096, max(256, len(t)*6)), retry_badcase=False, retry_badcase_max_times=1, seed=1000*i + k)
            if v == 'V1': kw.update(text=t, prompt_wav_path=R, prompt_text=ref['text'], reference_wav_path=R)
            else: kw.update(text=STYLE + t, reference_wav_path=R)
            t0 = time.time()
            try:
                w = np.asarray(m.generate(**kw), np.float32).reshape(-1)
                sf.write(f'{AB}/takes/{v}_L{i}_s{k}.wav', w, SR)
                print(v, i, k, f'{len(w)/SR:.1f}s audio in {time.time()-t0:.0f}s', flush=True)
            except Exception as e: print('ERR', v, i, k, repr(e)[:300], flush=True)
open(AB + '/vox_done', 'w').write('ok')
