# Lively test: same Tall voice, cloned from 3 energetic stretches of the Pape vs Jiang narration.
# Paragraphs are generated whole (no sentence splitting). Blind: Lively 1-3.
import random, json, urllib.request
REV = 'b4c4889'
PRON = {'Jiang': 'Jee-yang', 'Kiriakou': 'Kiriyako'}; TAKES = 3; NAMES_TEST = False; TESTS = None
JOB = 'vF/narr_lively_test.json'
src = urllib.request.urlopen('https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV + '/narrate4_cell.py').read().decode()
order = ['A', 'B', 'C']; random.shuffle(order); key = {}
for n, r in enumerate(order, 1):
    REF_FILE = f'ref/ref_lively_{r}.wav'; NAME = f'Lively_{n}'; WDIR = f'/kaggle/working/lively_{r}'
    exec(src); key[f'Lively_{n}'] = r
print('K', json.dumps(key).encode().hex())
