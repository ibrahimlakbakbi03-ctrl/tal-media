# VOICE DESIGN TEST · Qwen3-TTS VoiceDesign: 4 "wise explainer" narrators, same text, blind players.
import subprocess, sys, os, random, json
W = '/kaggle/working/vd4'; os.makedirs(W, exist_ok=True)
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '-U', 'qwen-tts', 'transformers==4.57.3'], check=False)
TEXT = ("In the last three years, central banks have bought more gold than at any time in half a century. "
        "Not hedge funds. Not retail traders. Central banks. "
        "And they're not buying it because they love shiny metal. "
        "They're buying it because they no longer fully trust the one asset that has run the world since 1971: the US dollar. "
        "So the real question isn't whether gold goes up. "
        "It's what these banks know, that most investors still don't.")
DESIGNS = {
 'M_32': "Male, around 32, clear American accent. Brisk, sharp and intelligent market analyst voice with a settled, mature tone and a slightly lower, fuller pitch. Quick tempo, crisp articulation, keeps momentum, conversational but authoritative, like a top macro YouTube channel. Young but grown-up, not nerdy, not thin.",
 'N_34': "Male, about 34, American. Confident, mature and composed analyst voice, warm mid-low pitch with body in the chest. Fast and crisp delivery, clear diction, calm authority, sounds experienced but still young and energetic. Not nasal, not academic.",
 'O_30s': "Male, early 30s, American. Sharp, quick, intelligent narrator with a grounded, slightly deeper voice and smooth clear tone. Keeps a fast rhythm and momentum, emphasizes numbers, confident and serious like a professional finance YouTuber. Mature, clean, not boyish.",
 'P_33': "Male, 33 years old, clear American accent. Brisk market analyst, rich and clear voice, a little lower and more resonant than average, steady confident energy, quick tempo, crisp consonants, sounds like a trusted expert in his early thirties.",
}
json.dump({'text': TEXT, 'designs': DESIGNS}, open(f'{W}/spec.json', 'w'))
code = f"""
import json, torch, soundfile as sf
W='{W}'; spec=json.load(open(W+'/spec.json'))
from qwen_tts import Qwen3TTSModel
dt = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign', device_map='cuda:0', dtype=dt, attn_implementation='sdpa')
for name, ins in spec['designs'].items():
    torch.manual_seed(11); torch.cuda.manual_seed_all(11)
    wavs, sr = m.generate_voice_design(text=spec['text'], language='English', instruct=ins)
    sf.write(f'{{W}}/{{name}}.wav', wavs[0], sr)
"""
open(f'{W}/step_design.py', 'w').write(code)
r = subprocess.run([sys.executable, f'{W}/step_design.py'], capture_output=True, text=True, stdin=subprocess.DEVNULL)
print('design exit', r.returncode, r.stderr[-1500:] if r.returncode else 'ok')
names = [n for n in DESIGNS if os.path.exists(f'{W}/{n}.wav')]
random.shuffle(names)
key = {}
from IPython.display import Audio, display, HTML
display(HTML('<h3>Voice test #4 (Clear A style, more mature): pick your favourite (and a runner-up)</h3>'))
for i, n in enumerate(names, 1):
    out = f'{W}/Mature_{i}.mp3'
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', f'{W}/{n}.wav', '-af', 'aresample=48000,highpass=f=75,equalizer=f=250:t=q:w=1.2:g=-4,equalizer=f=3500:t=q:w=1.5:g=4,equalizer=f=7500:t=q:w=2:g=-2,highshelf=f=10000:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14:TP=-1:LRA=7', '-ar', '48000', '-b:a', '128k', out], stdin=subprocess.DEVNULL)
    key[f'Mature_{i}'] = n
    display(HTML(f'<b>Mature {i}</b>')); display(Audio(out))
json.dump(key, open(f'{W}/key.json', 'w'))
print('K', json.dumps(key).encode().hex())
