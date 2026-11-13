# VOICE DESIGN TEST · Qwen3-TTS VoiceDesign: 4 "wise explainer" narrators, same text, blind players.
import subprocess, sys, os, random, json
W = '/kaggle/working/vd2'; os.makedirs(W, exist_ok=True)
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '-U', 'qwen-tts', 'transformers==4.57.3'], check=False)
TEXT = ("In the last three years, central banks have bought more gold than at any time in half a century. "
        "Not hedge funds. Not retail traders. Central banks. "
        "And they're not buying it because they love shiny metal. "
        "They're buying it because they no longer fully trust the one asset that has run the world since 1971: the US dollar. "
        "So the real question isn't whether gold goes up. "
        "It's what these banks know, that most investors still don't.")
DESIGNS = {
 'E_urgent': "Male, early 30s, American. Fast-paced, energetic and urgent finance YouTube narrator. Confident, punchy delivery that builds tension, short sharp pauses, emphasizes key words and numbers, sounds like he is revealing something big. Never slow or sleepy.",
 'F_sharp': "Male, mid 30s, clear American accent. Brisk, sharp and intelligent market analyst voice. Quick tempo, crisp articulation, slightly intense, keeps momentum, conversational but authoritative, like a top macro YouTube channel.",
 'G_hype': "Male, late 20s, American. High-energy, fast and gripping storyteller. Lively intonation, rises with suspense, hits the punchlines hard, quick rhythm, sounds excited but credible, not cartoonish.",
 'H_newsroom': "Male, around 35, American. Fast, confident newsroom-style delivery. Tight pacing, strong emphasis on stakes and numbers, serious and urgent tone, clean diction, keeps the listener on edge.",
}
json.dump({'text': TEXT, 'designs': DESIGNS}, open(f'{W}/spec.json', 'w'))
code = f"""
import json, torch, soundfile as sf
W='{W}'; spec=json.load(open(W+'/spec.json'))
from qwen_tts import Qwen3TTSModel
dt = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign', device_map='cuda:0', dtype=dt, attn_implementation='sdpa')
for name, ins in spec['designs'].items():
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
display(HTML('<h3>Voice design test #2 (fast style): pick your favourite (and a runner-up)</h3>'))
for i, n in enumerate(names, 1):
    out = f'{W}/Voice_{i}.mp3'
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', f'{W}/{n}.wav', '-af', 'loudnorm=I=-16:TP=-1.5', '-b:a', '64k', out], stdin=subprocess.DEVNULL)
    key[f'Voice_{i}'] = n
    display(HTML(f'<b>Voice {i}</b>')); display(Audio(out))
json.dump(key, open(f'{W}/key.json', 'w'))
print('K', json.dumps(key).encode().hex())
