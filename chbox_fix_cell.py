# Re-run the Chatterbox half with the transformers version it needs (Qwen half is already done).
import subprocess, sys, os, json
W = '/kaggle/working/narr'
tv = subprocess.run([sys.executable, '-c', 'import torch;print(torch.__version__.split("+")[0])'], capture_output=True, text=True).stdout.strip()
VIS = {'2.6.0': '0.21.0', '2.7.0': '0.22.0', '2.7.1': '0.22.1', '2.8.0': '0.23.0', '2.5.1': '0.20.1'}
print('torch', tv)
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'transformers==4.46.3', f'torchvision=={VIS.get(tv, "0.21.0")}', f'torchaudio=={tv}'], check=False)
r = subprocess.run([sys.executable, W + '/step_chbox.py'], capture_output=True, text=True, stdin=subprocess.DEVNULL)
print('chatterbox exit', r.returncode, r.stdout[-600:], r.stderr[-1200:] if r.returncode else '')
MASTER2 = 'highpass=f=70,lowshelf=f=120:g=2,equalizer=f=280:t=q:w=1.2:g=-3,equalizer=f=3200:t=q:w=1.5:g=2.5,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14:TP=-1:LRA=7'
from IPython.display import Audio, display, HTML
if os.path.exists(W + '/old_chbox_raw.wav'):
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', W + '/old_chbox_raw.wav', '-af', 'aresample=48000,' + MASTER2, '-ar', '48000', '-b:a', '128k', W + '/Old_2.mp3'], stdin=subprocess.DEVNULL)
    display(HTML('<b>Old voice 2</b>')); display(Audio(W + '/Old_2.mp3'))
