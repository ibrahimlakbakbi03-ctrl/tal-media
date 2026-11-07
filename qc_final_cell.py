# FINAL QC CELL · transcribes a finished video's audio with word timestamps.
# Set QC_URL to the hosted audio (mp3) before running. Output: /kaggle/working/qc_final.json
import subprocess, sys, json, os, urllib.request
QC_URL = os.environ.get('QC_URL', 'https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/main/qc_audio.mp3')
urllib.request.urlretrieve(QC_URL, '/kaggle/working/qc_audio.mp3')
try:
    from faster_whisper import WhisperModel
except ImportError:
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'faster-whisper'], check=False)
    from faster_whisper import WhisperModel
import torch
dev = 'cuda' if torch.cuda.is_available() else 'cpu'
m = WhisperModel('medium.en', device=dev, compute_type='float16' if dev == 'cuda' else 'int8')
segs, info = m.transcribe('/kaggle/working/qc_audio.mp3', language='en', beam_size=5, word_timestamps=True, vad_filter=False)
out = []
for s in segs:
    out.append({'s': round(s.start, 2), 'e': round(s.end, 2), 't': s.text.strip(),
                'w': [[w.word.strip(), round(w.start, 2), round(w.end, 2), round(w.probability, 3)] for w in (s.words or [])]})
json.dump(out, open('/kaggle/working/qc_final.json', 'w'))
print('QC done:', len(out), 'segments')
os.remove('/kaggle/working/qc_audio.mp3')
