# Re-run VoxCPM2 + CosyVoice 3 cloning the RIGHT voice (TAL_reference_12s = the channel's Tall), keep the old-formula takes, re-score, blind.
import os, sys, json, time, subprocess, urllib.request, random, shutil, glob
REV = globals().get('REV', 'main'); REPO = 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV
AB = '/kaggle/working/ab'; TK = globals().get('ENGINE_TAKES', 3); QPY = '/tmp/venv_q/bin/python'
for f in ['ref_step.py', 'vox_gen.py', 'score_step.py']: urllib.request.urlretrieve(REPO + '/vF/ab/' + f, AB + '/' + f)
urllib.request.urlretrieve(REPO + '/ref/TAL_reference_12s.wav', AB + '/TAL_ref12.wav')
shutil.rmtree(AB + '/takes', ignore_errors=True); os.makedirs(AB + '/takes')
for f in glob.glob(AB + '/*_raw.wav') + [AB + '/report.json']:
    if not os.path.basename(f).startswith('Q') and os.path.exists(f): os.remove(f)
r = subprocess.run([QPY, AB + '/ref_step.py', AB, AB + '/TAL_ref12.wav'], capture_output=True, text=True); print(r.stdout[-600:], r.stderr[-1500:] if r.returncode else '')
env = dict(os.environ, OMNIVOICE_COSYVOICE_DIR='/tmp/CosyVoice')
procs = {'vox': subprocess.Popen(['/tmp/venv_vox/bin/python', AB + '/vox_gen.py', AB, str(TK)], stdout=open(AB + '/vox2.log', 'w'), stderr=subprocess.STDOUT, env=dict(env, CUDA_VISIBLE_DEVICES='0')),
         'cosy': subprocess.Popen(['/tmp/venv_cosy/bin/python', AB + '/cosy_gen.py', AB, str(TK)], stdout=open(AB + '/cosy2.log', 'w'), stderr=subprocess.STDOUT, env=dict(env, CUDA_VISIBLE_DEVICES='1'))}
t0 = time.time()
while any(p.poll() is None for p in procs.values()):
    time.sleep(90)
    for n in procs:
        tail = (open(f'{AB}/{n}2.log').read().strip().splitlines() or [''])[-1]
        print(f'[{(time.time()-t0)/60:.0f} min] {n}: {"running" if procs[n].poll() is None else "exit " + str(procs[n].returncode)} | {tail[:150]}', flush=True)
r = subprocess.run([QPY, AB + '/score_step.py', AB], capture_output=True, text=True); print(r.stdout[-2000:], r.stderr[-2000:] if r.returncode else '')
MASTER = ('highpass=f=70,lowshelf=f=120:g=1.5,equalizer=f=300:t=q:w=1.0:g=-3,equalizer=f=3000:t=q:w=1.4:g=2.5,'
          'deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-21dB:ratio=2.5:attack=8:release=120:makeup=2,'
          'alimiter=limit=0.84,loudnorm=I=-14:TP=-1.5:LRA=7')
from IPython.display import display, Audio, HTML, clear_output
names = [v for v in ['Q', 'V1', 'V2', 'C1', 'C2'] if os.path.exists(f'{AB}/{v}_raw.wav')]
random.Random(1118).shuffle(names); key = {}
shutil.rmtree(AB + '/blind', ignore_errors=True); os.makedirs(AB + '/blind')
clear_output()
display(HTML('<h2>Voice test · blind</h2><p>Same text, same Tall reference, %d voices. One of them is our current voice. Rank them best → worst by ear.</p>' % len(names)))
for n, v in enumerate(names, 1):
    dst = f'{AB}/blind/Voice_{n}.mp3'; key[f'Voice_{n}'] = v
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', f'{AB}/{v}_raw.wav', '-af', 'aresample=48000,' + MASTER, '-ar', '48000', '-b:a', '192k', dst])
    display(HTML(f'<h3>Voice {n}</h3>')); display(Audio(dst))
json.dump(key, open(AB + '/blind_key.json', 'w'))
shutil.make_archive('/kaggle/working/voice_test_blind', 'zip', AB + '/blind')
print('done ·', len(names), 'voices')
