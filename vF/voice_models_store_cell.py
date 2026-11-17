# TAL voice models store: downloads the commercial-OK VoiceStudio TTS models into this notebook's saved output
# (HF cache layout), so voice sessions can attach it as Input and skip the downloads. CPU only.
import subprocess, sys, os
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '-U', 'huggingface_hub<1.0'], check=False)
from huggingface_hub import snapshot_download
CACHE = '/kaggle/working/hf/hub'; os.makedirs(CACHE, exist_ok=True)
for repo in ['openbmb/VoxCPM2', 'FunAudioLLM/Fun-CosyVoice3-0.5B-2512']:
    p = snapshot_download(repo_id=repo, cache_dir=CACHE)
    print(repo, '->', p)
print(subprocess.run('du -sh /kaggle/working/hf', shell=True, capture_output=True, text=True).stdout)
