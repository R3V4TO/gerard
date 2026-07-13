import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'design/logos/versacarte-logo-source.png');
const out = path.join(root, 'public/images');

if (!fs.existsSync(source)) {
  console.error('Missing source logo at design/logos/versacarte-logo-source.png');
  process.exit(1);
}

const { width = 1320, height = 1000 } = await sharp(source).metadata();
const emblemHeight = Math.round(height * 0.62);

await fs.promises.mkdir(out, { recursive: true });

await sharp(source).png().toFile(path.join(out, 'versacarte-logo.png'));
await sharp(source)
  .extract({ left: 0, top: 0, width, height: emblemHeight })
  .png()
  .toFile(path.join(out, 'versacarte-logo-mark.png'));
await sharp(source)
  .extract({ left: 0, top: emblemHeight, width, height: height - emblemHeight })
  .png()
  .toFile(path.join(out, 'versacarte-logo-wordmark.png'));
await sharp(source)
  .trim({ threshold: 20 })
  .ensureAlpha()
  .png()
  .toFile(path.join(out, 'versacarte-logo-trimmed.png'));

const trimmedBuf = await sharp(path.join(out, 'versacarte-logo-trimmed.png')).toBuffer();
await sharp(trimmedBuf).negate({ alpha: false }).png().toFile(path.join(out, 'versacarte-logo-light.png'));

const markIcon = path.join(out, 'versacarte-logo-mark.png');
await sharp(markIcon)
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(out, 'versacarte-logo-icon.png'));
await sharp(path.join(out, 'versacarte-logo-icon.png'))
  .resize(32, 32)
  .png()
  .toFile(path.join(root, 'public/favicon.png'));

console.log('VersaCarte logo variants built in public/images/');
