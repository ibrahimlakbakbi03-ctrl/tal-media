# VIDEO F · FULL NARRATION (commit run). Old Tall voice (Qwen clone), Lak's name picks, flow + prosody fixes.
REV = '__REV__'
PRON = {'Jiang': 'Jee-yang', 'Kiriakou': 'Kiriyako'}
NAME = 'TAL_videoF'; JOB = 'vF/narr_v4_full.json'; TAKES = 4; NAMES_TEST = False; TESTS = None
exec(__import__('urllib.request').request.urlopen('https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV + '/narrate3_cell.py').read().decode())
import shutil, os
W = '/kaggle/working/narr2'
shutil.make_archive('/kaggle/working/TAL_videoF_parts', 'zip', W, '.')  # every part as its own wav + report.json
for f in os.listdir(W):
    if f.endswith('.mp3') or f == 'report.json': shutil.copy(os.path.join(W, f), '/kaggle/working/' + f)
print('DONE')
