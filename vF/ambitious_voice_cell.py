# AMBITIOUS VOICE TEST · Tall voice (lively Pape-vs-Jiang reference) read by next-gen open models.
#   VibeVoice-1.5B / VibeVoice-7B (MIT): whole cold open generated in ONE pass (natural long-form flow)
#   IndexTTS-2.5 (bilibili licence, free under 100M MAU): emotion steered by a text description
# Blind players "Engine 1..N". Each engine runs in its own subprocess; failures are reported, not fatal.
import subprocess, sys, os, json, random, urllib.request, shutil
REV = 'bd4887f'; REPO = 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV
W = '/kaggle/working/amb'; os.makedirs(W, exist_ok=True)
def sh(cmd, cwd=None):
    r = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True, stdin=subprocess.DEVNULL)
    return r.returncode, (r.stdout[-1500:] + r.stderr[-2500:])
urllib.request.urlretrieve(REPO + '/ref/ref_lively_A.wav', W + '/ref_raw.wav')
sh(f'ffmpeg -nostdin -y -loglevel error -i {W}/ref_raw.wav -ac 1 -ar 24000 {W}/ref24.wav')
TEXT = urllib.request.urlopen(REPO + '/vF/ambitious_text.txt').read().decode().strip().split('\n')
FULL = ' '.join(TEXT)
open(W + '/full.txt', 'w').write(FULL)
log = {}
# ---------- 1) VibeVoice (community repo, MIT) ----------
if not os.path.exists(W + '/vv'):
    sh(f'git clone -q --depth 1 https://github.com/vibevoice-community/VibeVoice {W}/vv')
c, o = sh(f'{sys.executable} -m pip install -q -e {W}/vv'); log['vv_install'] = c
shutil.copy(W + '/ref24.wav', W + '/vv/demo/voices/en-Tall_man.wav')
open(W + '/vv_script.txt', 'w').write('Speaker 1: ' + FULL)
for tag, mid in [('vv15', 'vibevoice/VibeVoice-1.5B'), ('vv7', 'vibevoice/VibeVoice-7B')]:
    if os.path.exists(f'{W}/{tag}.wav'): continue
    c, o = sh(f'{sys.executable} demo/inference_from_file.py --model_path {mid} --txt_path {W}/vv_script.txt '
              f'--speaker_names Tall --dtype float16 --cfg_scale 1.3 --seed 42 --output_dir {W}/{tag}_out', cwd=W + '/vv')
    outs = [f for f in os.listdir(f'{W}/{tag}_out')] if os.path.exists(f'{W}/{tag}_out') else []
    wavs = [f for f in outs if f.endswith('.wav')]
    if wavs: shutil.copy(f'{W}/{tag}_out/{wavs[0]}', f'{W}/{tag}.wav'); log[tag] = 'ok'
    else: log[tag] = 'FAILED: ' + o[-900:]
# ---------- 2) IndexTTS-2.5 with emotion from a text description ----------
if not os.path.exists(W + '/it'):
    sh(f'git clone -q --depth 1 https://github.com/index-tts/index-tts {W}/it')
c, o = sh(f'{sys.executable} -m pip install -q -e {W}/it'); log['it_install'] = c
c, o = sh(f'{sys.executable} -m pip install -q -U "huggingface_hub[cli]"')
c, o = sh(f'hf download IndexTeam/IndexTTS-2.5 --local-dir {W}/it/checkpoints'); log['it_download'] = c
step = f'''
import sys, os; sys.path.insert(0, "{W}/it"); os.chdir("{W}/it")
from indextts.infer_v2_5 import IndexTTS2
text = open("{W}/full.txt").read()
try:
    tts = IndexTTS2(cfg_path="checkpoints/config.yaml", model_dir="checkpoints", use_bf16=False, use_qwen_emo=True)
    tts.infer(spk_audio_prompt="{W}/ref24.wav", text=text, lang="EN", output_path="{W}/it25.wav",
              use_emo_text=True, emo_text="confident, curious storyteller revealing a big secret, energetic but controlled", emo_alpha=0.6)
except Exception as e:
    print("emo mode failed:", e)
    tts = IndexTTS2(cfg_path="checkpoints/config.yaml", model_dir="checkpoints", use_bf16=False)
    tts.infer(spk_audio_prompt="{W}/ref24.wav", text=text, lang="EN", output_path="{W}/it25.wav")
'''
open(W + '/step_it.py', 'w').write(step)
if not os.path.exists(W + '/it25.wav'):
    c, o = sh(f'{sys.executable} {W}/step_it.py'); log['it25'] = 'ok' if os.path.exists(W + '/it25.wav') else 'FAILED: ' + o[-900:]
# ---------- blind players, same mastering ----------
MASTER = ('highpass=f=70,lowshelf=f=120:g=1.5,equalizer=f=300:t=q:w=1.0:g=-3,equalizer=f=3000:t=q:w=1.4:g=2.5,'
          'deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-21dB:ratio=2.5:attack=8:release=120:makeup=2,alimiter=limit=0.84,loudnorm=I=-14:TP=-1.5:LRA=7')
names = [n for n in ['vv15', 'vv7', 'it25'] if os.path.exists(f'{W}/{n}.wav')]
random.shuffle(names); key = {}
from IPython.display import Audio, display, HTML
for k, v in log.items(): print(k, '→', v if isinstance(v, str) else ('ok' if v == 0 else f'exit {v}'))
display(HTML('<h3>Ambitious voice test: which one sounds alive and human?</h3>'))
for i, n in enumerate(names, 1):
    sh(f'ffmpeg -nostdin -y -loglevel error -i {W}/{n}.wav -af "aresample=48000,{MASTER}" -ar 48000 -b:a 160k {W}/Engine_{i}.mp3')
    key[f'Engine_{i}'] = n; display(HTML(f'<b>Engine {i}</b>')); display(Audio(f'{W}/Engine_{i}.mp3'))
print('K', json.dumps(key).encode().hex())
