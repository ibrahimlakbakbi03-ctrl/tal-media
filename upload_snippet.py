
# --- Auto-hand-off to Claude: upload the narration to a 1-hour temporary link ---
import subprocess
_r = subprocess.run(['curl', '-s', '-F', 'reqtype=fileupload', '-F', 'time=1h',
                     '-F', 'fileToUpload=@/kaggle/working/TAL_narration.wav',
                     'https://litterbox.catbox.moe/resources/internals/api.php'], capture_output=True, text=True)
print('CLAUDE LINK:', _r.stdout.strip())
