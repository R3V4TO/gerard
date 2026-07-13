import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');

const jobs = [
  { src: 'public/images', out: 'public/images' },
  { src: 'public', files: ['favicon.svg'], out: 'public/images' },
  { src: 'design/brand', out: 'design/brand/images' },
];

function viewBoxSize(svg) {
  const match = svg.match(/viewBox=["']([^"']+)["']/);
  if (!match) return { width: 512, height: 512 };
  const parts = match[1].trim().split(/\s+/).map(Number);
  return { width: parts[2] || 512, height: parts[3] || 512 };
}

function targetSize(width, height, scale = 2, max = 2400) {
  let w = Math.round(width * scale);
  let h = Math.round(height * scale);
  if (w > max) {
    h = Math.round((h * max) / w);
    w = max;
  }
  return { width: Math.max(1, w), height: Math.max(1, h) };
}

async function convert(file, outDir) {
  let svg = fs.readFileSync(file);
  svg = Buffer.from(
    svg
      .toString('utf8')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ''),
    'utf8',
  );
  const { width, height } = viewBoxSize(svg.toString('utf8'));
  const size = targetSize(width, height);
  const base = path.basename(file, '.svg');

  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${base}.png`);

  await sharp(svg, { density: 300 })
    .resize(size.width, size.height, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile(out);

  console.log(`OK ${path.relative(root, file)} -> ${path.relative(root, out)} (${size.width}x${size.height})`);
}

for (const job of jobs) {
  const srcDir = path.join(root, job.src);
  const outDir = path.join(root, job.out);
  const files = job.files ?? fs.readdirSync(srcDir).filter((f) => f.endsWith('.svg'));

  for (const fileName of files) {
    const file = path.join(srcDir, fileName);
    if (!fs.existsSync(file)) {
      console.warn(`skip ${file}`);
      continue;
    }
    await convert(file, outDir);
  }
}
