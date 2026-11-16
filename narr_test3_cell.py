# Test 3: same v4 opening with the no-micro-pause tidy + Lak's name picks, plus a check on Jiang / Kiriakou.
PRON = {'Jiang': 'Jee-yang', 'Kiriakou': 'Kiri-ya-ko'}
NAME = 'TAL_v4_test3'; JOB = 'vF/narr_v4_test.json'; TAKES = 4
NAMES_TEST = True
TESTS = [('Professor Jee-yang', 'Professor Jeeyang'), ('John Kiri-ya-ko', 'John Kiriyako')]
exec(__import__('urllib.request').request.urlopen('https://raw.githubusercontent.com/ibrahimlakbakbi03-ctrl/tal-media/' + REV + '/narrate2_cell.py').read().decode())
