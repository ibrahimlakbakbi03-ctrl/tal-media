# VoiceStudio backend on Kaggle's GPU + a temporary HTTPS address (Cloudflare quick tunnel, no account).
# Lak's desktop app (Intel Mac) connects to it as its "Remote backend". Everything lives in /tmp (bigger disk).
import subprocess, os, time, re, secrets
def sh(c, **kw): return subprocess.run(c, shell=True, capture_output=True, text=True, stdin=subprocess.DEVNULL, **kw)
os.environ['HF_HOME'] = '/tmp/hf'; os.environ['UV_CACHE_DIR'] = '/tmp/uvcache'
if not os.path.exists('/tmp/vs'): print(sh('git clone -q --depth 1 https://github.com/debpalash/VoiceStudio /tmp/vs').stderr[-300:])
sh('pip install -q uv')
r = sh('uv sync --group cuda', cwd='/tmp/vs'); print('uv sync exit', r.returncode, (r.stderr[-800:] if r.returncode else ''))
KEY = os.environ.get('VS_KEY') or secrets.token_urlsafe(18); os.environ['VS_KEY'] = KEY
env = dict(os.environ, OMNIVOICE_API_KEY=KEY, OMNIVOICE_SERVER_MODE='1', OMNIVOICE_DATA_DIR='/tmp/vsdata')
sh('pkill -f "uvicorn backend.main:app"; pkill -f cloudflared')
subprocess.Popen('cd /tmp/vs && nohup uv run --no-sync uvicorn backend.main:app --host 0.0.0.0 --port 3900 > /tmp/vs.log 2>&1 &', shell=True, env=env)
for i in range(120):
    if sh('curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3900/.well-known/voicestudio-speech').stdout == '200': break
    time.sleep(5)
print('backend up:', i < 119)
if i >= 119: print(open('/tmp/vs.log').read()[-2000:])
if not os.path.exists('/tmp/cloudflared'):
    sh('wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /tmp/cloudflared && chmod +x /tmp/cloudflared')
subprocess.Popen('nohup /tmp/cloudflared tunnel --no-autoupdate --url http://127.0.0.1:3900 > /tmp/cf.log 2>&1 &', shell=True)
url = None
for i in range(60):
    m = re.search(r'https://[a-z0-9-]+\.trycloudflare\.com', open('/tmp/cf.log').read() if os.path.exists('/tmp/cf.log') else '')
    if m: url = m.group(0); break
    time.sleep(2)
from IPython.display import HTML, display
display(HTML(f'<div style="font-size:20px;line-height:1.8"><b>Backend URL:</b> <code>{url}</code><br><b>API key:</b> <code>{KEY}</code><br>'
             '<small>Paste both into VoiceStudio → Remote backend → Save &amp; reload. Works while this Kaggle session is running.</small></div>'))
