# venv (py3.10, CosyVoice @074ca6dc, VoiceStudio sidecar fixes): C1 = zero-shot clone with transcript, C2 = instructed narrator
import os, sys, json, io, time, torch, numpy as np, soundfile as sf
AB = sys.argv[1]; TAKES = int(sys.argv[2])
sys.path.insert(0, '/tmp/cosy_sidecar'); import main as side
model = side._load_model(io.BytesIO())
SR = int(getattr(model, 'sample_rate', 24000) or 24000)
ref = json.load(open(AB + '/ref.json')); R = AB + '/ref20.wav'
lines = [l[0] for l in json.load(open(AB + '/lines.json'))]
INSTR = 'Speak like a confident, engaged documentary narrator, with natural energy and a steady medium pace.'
for i, t in enumerate(lines, 1):
    for k in range(TAKES):
        for v in ('C1', 'C2'):
            msg = {'text': t, 'ref_audio': R, 'ref_text': ref['text']} if v == 'C1' else {'text': t, 'ref_audio': R, 'instruct': INSTR}
            torch.manual_seed(1000*i + k); t0 = time.time()
            try:
                ch = list(side._run_model(model, msg))
                w = torch.cat([torch.as_tensor(c['tts_speech'], dtype=torch.float32).reshape(-1) for c in ch]).numpy()
                sf.write(f'{AB}/takes/{v}_L{i}_s{k}.wav', np.clip(w, -1, 1), SR)
                print(v, i, k, f'{len(w)/SR:.1f}s audio in {time.time()-t0:.0f}s', flush=True)
            except Exception as e: print('ERR', v, i, k, repr(e)[:300], flush=True)
open(AB + '/cosy_done', 'w').write('ok')
