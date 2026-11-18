import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
const [,, comp, framesArg, outDir] = process.argv;
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable });
for (const f of framesArg.split(',').map(Number)) {
  await renderStill({ composition, serveUrl, output: `${outDir}/f${String(f).padStart(5,'0')}.png`, frame: f, browserExecutable, scale: 0.5 });
}
console.log('ok', composition.durationInFrames);
