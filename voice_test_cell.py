# VOICE BLIND TEST · Qwen3-TTS (x3), Orpheus 3B, Chatterbox (current baseline)
# Runs each model in its own subprocess (they need different packages), then loudness-matches,
# shuffles and shows players labelled Sample 1..N. The key is printed base64-encoded (no spoilers).
import subprocess, sys, os, random, json, base64, urllib.request
W = '/kaggle/working/vt'; os.makedirs(W, exist_ok=True)
REF_URL = 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/main/ref/TAL_reference_12s.wav'
urllib.request.urlretrieve(REF_URL, f'{W}/ref.wav')
TEXT = ("In the last three years, central banks have bought more gold than at any time in half a century. "
        "Not hedge funds. Not retail traders. Central banks. "
        "And they're not buying it because they love shiny metal. "
        "They're buying it because they no longer fully trust the one asset that has run the world since 1971: the US dollar. "
        "So the real question isn't whether gold goes up. "
        "It's what these banks know, that most investors still don't.")
json.dump({'text': TEXT}, open(f'{W}/text.json', 'w'))

def pip(*a):
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', *a], check=False)

def run(name, code):
    p = f'{W}/{name}.py'; open(p, 'w').write(code)
    r = subprocess.run([sys.executable, p], capture_output=True, text=True)
    print(f'[{name}] exit {r.returncode}', (r.stdout[-400:] + r.stderr[-1500:]) if r.returncode else 'ok')

COMMON = f"import json, numpy as np, soundfile as sf, torch, re\nW='{W}'\nTEXT=json.load(open(W+'/text.json'))['text']\nSENTS=[s.strip() for s in re.split(r'(?<=[.!?:])\\s+', TEXT) if s.strip()]\n"

# 0. transcript of the reference clip (Qwen clone needs it)
pip('faster-whisper')
run('ref_txt', COMMON + """
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cuda', compute_type='float16')
segs, _ = m.transcribe(W+'/ref.wav')
open(W+'/ref.txt','w').write(' '.join(s.text.strip() for s in segs))
""")

# 1. Qwen3-TTS: two preset narrators + clone of our current Tall voice
pip('-U', 'qwen-tts')
run('qwen', COMMON + """
from qwen_tts import Qwen3TTSModel
dt = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
cv = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice', device_map='cuda:0', dtype=dt, attn_implementation='sdpa')
ins = 'A confident, measured documentary narrator. Clear American English, calm authority, natural pauses.'
for spk in ['Ryan', 'Aiden']:
    wavs, sr = cv.generate_custom_voice(text=TEXT, language='English', speaker=spk, instruct=ins)
    sf.write(f'{W}/qwen_{spk.lower()}.wav', wavs[0], sr)
del cv; torch.cuda.empty_cache()
base = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-1.7B-Base', device_map='cuda:0', dtype=dt, attn_implementation='sdpa')
wavs, sr = base.generate_voice_clone(text=TEXT, language='English', ref_audio=W+'/ref.wav', ref_text=open(W+'/ref.txt').read())
sf.write(f'{W}/qwen_clone.wav', wavs[0], sr)
""")

# 2. Orpheus 3B (Apache 2.0), via transformers + SNAC decoder, sentence by sentence
pip('snac', 'accelerate')
run('orpheus', COMMON + """
from transformers import AutoTokenizer, AutoModelForCausalLM
from snac import SNAC
M = 'unsloth/orpheus-3b-0.1-ft'
tok = AutoTokenizer.from_pretrained(M)
model = AutoModelForCausalLM.from_pretrained(M, torch_dtype=torch.float16).cuda().eval()
snac = SNAC.from_pretrained('hubertsiuzdak/snac_24khz').eval().cuda()
def gen(text, voice):
    ids = tok(f'{voice}: {text}', return_tensors='pt').input_ids
    ids = torch.cat([torch.tensor([[128259]]), ids, torch.tensor([[128009, 128260]])], 1).cuda()
    with torch.no_grad():
        g = model.generate(input_ids=ids, attention_mask=torch.ones_like(ids), max_new_tokens=1600, do_sample=True,
                           temperature=0.6, top_p=0.95, repetition_penalty=1.1, eos_token_id=128258)[0]
    idx = (g == 128257).nonzero()
    if len(idx): g = g[idx[-1].item() + 1:]
    g = g[g != 128258]
    c = [t.item() - 128266 for t in g[:(len(g) // 7) * 7]]
    l1, l2, l3 = [], [], []
    for i in range(len(c) // 7):
        f = [c[7*i], c[7*i+1]-4096, c[7*i+2]-2*4096, c[7*i+3]-3*4096, c[7*i+4]-4*4096, c[7*i+5]-5*4096, c[7*i+6]-6*4096]
        if any(x < 0 or x > 4095 for x in f): continue
        l1.append(f[0]); l2 += [f[1], f[4]]; l3 += [f[2], f[3], f[5], f[6]]
    codes = [torch.tensor(l).unsqueeze(0).cuda() for l in (l1, l2, l3)]
    with torch.no_grad(): a = snac.decode(codes)
    return a.squeeze().float().cpu().numpy()
for voice in ['dan', 'leo']:
    parts = []
    for s in SENTS:
        parts += [gen(s, voice), np.zeros(int(24000 * 0.25), dtype=np.float32)]
    sf.write(f'{W}/orpheus_{voice}.wav', np.concatenate(parts), 24000)
""")

# 3. Chatterbox (MIT) cloning the current Tall reference = today's baseline
pip('chatterbox-tts')
run('chatterbox', COMMON + """
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS
m = ChatterboxTTS.from_pretrained(device='cuda')
parts = []
for s in SENTS:
    w = m.generate(s, audio_prompt_path=W+'/ref.wav', exaggeration=0.5, cfg_weight=0.5)
    parts += [w.squeeze().cpu().numpy(), np.zeros(int(m.sr * 0.25), dtype=np.float32)]
sf.write(W+'/chatterbox_clone.wav', np.concatenate(parts), m.sr)
""")

# 4. Loudness-match, shuffle, show blind players
src = [f for f in sorted(os.listdir(W)) if f.endswith('.wav') and f != 'ref.wav']
random.seed(); random.shuffle(src)
os.makedirs(f'{W}/blind', exist_ok=True)
key = {}
for i, f in enumerate(src, 1):
    out = f'{W}/blind/Sample_{i}.wav'
    subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-i', f'{W}/{f}', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', out], check=False)
    key[f'Sample_{i}'] = f[:-4]
json.dump(key, open(f'{W}/key.json', 'w'))
from IPython.display import Audio, display, HTML
display(HTML('<h3>Blind voice test: listen to each, pick your favourite (and a runner-up)</h3>'))
for i in range(1, len(src) + 1):
    display(HTML(f'<b>Sample {i}</b>')); display(Audio(f'{W}/blind/Sample_{i}.wav'))
print('KEY (for Claude):', base64.b64encode(json.dumps(key).encode()).decode())
