import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'design/logos/versacarte-logo-source.png');
const out = path.join(root, 'public/images');

if (!fs.existsSync(source)) {
  console.error('Missing', source);
  process.exit(1);
}

/**
 * Source is black art on white. Convert white-ish pixels to transparent.
 * Keep black artwork opaque.
 */
async function toTransparentBlackArt(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (luminance > 235) {
      data[i + 3] = 0;
    } else if (luminance > 40) {
      // Soften anti-aliased fringes: keep RGB dark, scale alpha
      const t = (luminance - 40) / (235 - 40);
      data[i] = 10;
      data[i + 1] = 10;
      data[i + 2] = 10;
      data[i + 3] = Math.round(255 * (1 - t));
    } else {
      data[i] = 10;
      data[i + 1] = 10;
      data[i + 2] = 10;
      data[i + 3] = 255;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function invertArtKeepAlpha(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;
    data[i] = 250;
    data[i + 1] = 250;
    data[i + 2] = 250;
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

const { width = 1320, height = 1000 } = await sharp(source).metadata();
const emblemHeight = Math.round(height * 0.62);

const emblemBuf = await sharp(source)
  .extract({ left: 0, top: 0, width, height: emblemHeight })
  .toBuffer();

const fullTrimmed = await sharp(source).trim({ threshold: 18 }).toBuffer();

// Full logo (black art, transparent)
await (await toTransparentBlackArt(fullTrimmed))
  .trim()
  .png()
  .toFile(path.join(out, 'versacarte-logo-trimmed.png'));

await (await invertArtKeepAlpha(path.join(out, 'versacarte-logo-trimmed.png')))
  .png()
  .toFile(path.join(out, 'versacarte-logo-light.png'));

// Emblem mark only — keep natural aspect, no square black padding
const markTransparent = await (await toTransparentBlackArt(emblemBuf)).trim().png().toBuffer();
await sharp(markTransparent)
  .resize({ height: 512, fit: 'inside', withoutEnlargement: false })
  .png()
  .toFile(path.join(out, 'versacarte-logo-mark-clean.png'));

await (await invertArtKeepAlpha(path.join(out, 'versacarte-logo-mark-clean.png')))
  .png()
  .toFile(path.join(out, 'versacarte-logo-mark-light.png'));

// Also refresh mark/wordmark splits with transparency for other uses
await (await toTransparentBlackArt(emblemBuf))
  .trim()
  .png()
  .toFile(path.join(out, 'versacarte-logo-mark.png'));

const wordBuf = await sharp(source)
  .extract({ left: 0, top: emblemHeight, width, height: height - emblemHeight })
  .toBuffer();

await (await toTransparentBlackArt(wordBuf))
  .trim()
  .png()
  .toFile(path.join(out, 'versacarte-logo-wordmark.png'));

const meta = await sharp(path.join(out, 'versacarte-logo-mark-clean.png')).metadata();
console.log('mark-clean', meta.width, meta.height, 'alpha', meta.hasAlpha);
console.log('transparent logos ready');
