# VIDEO F · FULL NARRATION v6 (Bravos rhythm). Tall voice cloned from the lively Pape vs Jiang stretch Lak picks.
REV = '__REV__'
REF_FILE = 'ref/ref_lively___PICK__.wav'
PRON = {'Jiang': 'Jee-yang', 'Kiriakou': 'Kiriyako'}
PACE = [2.3, 2.8]          # Bravos ≈ 150 wpm ≈ 2.5 words/sec
NAME = 'TAL_videoF_v6'; JOB = 'vF/narr_v6_full.json'; TAKES = 4; NAMES_TEST = False; TESTS = None
WDIR = '/kaggle/working/v6'
exec(__import__('urllib.request').request.urlopen('https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV + '/narrate5_cell.py').read().decode())
import shutil
shutil.make_archive('/kaggle/working/TAL_videoF_v6_parts', 'zip', WDIR, '.')
print('DONE')
