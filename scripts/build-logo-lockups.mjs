import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/images');

const markSrc = path.join(out, 'versacarte-logo-mark.png');
const wordSrc = path.join(out, 'versacarte-logo-wordmark.png');

const mark = await sharp(markSrc)
  .resize({ height: 420, fit: 'inside' })
  .ensureAlpha()
  .toBuffer();
const markInfo = await sharp(mark).metadata();

const word = await sharp(wordSrc)
  .resize({ height: 140, fit: 'inside' })
  .ensureAlpha()
  .toBuffer();
const wordInfo = await sharp(word).metadata();

const gap = 48;
const padX = 24;
const padY = 24;
const width = padX * 2 + (markInfo.width ?? 0) + gap + (wordInfo.width ?? 0);
const height = padY * 2 + Math.max(markInfo.height ?? 0, wordInfo.height ?? 0);

await sharp({
  create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([
    { input: mark, left: padX, top: Math.round((height - (markInfo.height ?? 0)) / 2) },
    {
      input: word,
      left: padX + (markInfo.width ?? 0) + gap,
      top: Math.round((height - (wordInfo.height ?? 0)) / 2),
    },
  ])
  .png()
  .toFile(path.join(out, 'versacarte-logo-horizontal.png'));

await sharp(path.join(out, 'versacarte-logo-horizontal.png'))
  .negate({ alpha: false })
  .png()
  .toFile(path.join(out, 'versacarte-logo-horizontal-light.png'));

await sharp(markSrc)
  .trim({ threshold: 20 })
  .ensureAlpha()
  .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(out, 'versacarte-logo-mark-clean.png'));

await sharp(path.join(out, 'versacarte-logo-mark-clean.png'))
  .negate({ alpha: false })
  .png()
  .toFile(path.join(out, 'versacarte-logo-mark-light.png'));

console.log('logo lockups ready');
