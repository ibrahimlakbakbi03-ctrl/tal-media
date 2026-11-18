# main env: build a ~20 s Tall reference cut at a sentence pause + whisper transcript
import subprocess, re, json, sys
AB = sys.argv[1]
full = AB + '/ref_full.wav'
subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error','-i',AB+'/TAL_voice_v1.mp3','-ac','1','-ar','24000',full])
r = subprocess.run(['ffmpeg','-nostdin','-i',full,'-af','silencedetect=noise=-35dB:d=0.22','-f','null','-'],capture_output=True,text=True).stderr
st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
gaps = [(a+b)/2 for a, b in zip(st, en) if 12 <= (a+b)/2 <= 21]
cut = max(gaps) if gaps else 20.0
subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error','-i',full,'-t',f'{cut:.2f}','-af','silenceremove=start_periods=1:start_threshold=-45dB,afade=t=out:st=%.2f:d=0.05' % (cut-0.3),AB+'/ref20.wav'])
import torch
from transformers import pipeline
asr = pipeline('automatic-speech-recognition', model='openai/whisper-small.en', device=0, torch_dtype=torch.float16)
txt = asr(AB + '/ref20.wav')['text'].strip()
json.dump({'cut': cut, 'text': txt}, open(AB + '/ref.json', 'w'))
print('ref cut', cut, '|', txt)
