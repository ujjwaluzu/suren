import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Reuse the selected logo's S, with less padding for legibility in browser tabs.
const original = await readFile('public/brand/symbol.svg', 'utf8');
const symbol = original.replace('translate(25 19) scale(.75)', 'translate(12 4)');
await writeFile('public/favicon.svg', symbol);

for (const [file, size] of [
  ['public/favicon-96x96.png', 96],
  ['public/apple-touch-icon.png', 180],
  ['public/brand/apple-touch-icon.png', 180],
]) {
  await sharp(Buffer.from(symbol)).resize(size, size).png().toFile(file);
}

// Standard multi-resolution ICO with 32-bit BGRA bitmap frames and AND masks.
// Next.js serves src/app/favicon.ico at /favicon.ico and adds its head link.
const sizes = [16, 32, 48];
const frames = [];
for (const size of sizes) {
  const pixels = await sharp(Buffer.from(symbol)).resize(size, size).ensureAlpha().raw().toBuffer();
  const maskStride = Math.ceil(size / 32) * 4;
  const pixelBytes = size * size * 4;
  const frame = Buffer.alloc(40 + pixelBytes + maskStride * size);
  frame.writeUInt32LE(40, 0);
  frame.writeInt32LE(size, 4);
  frame.writeInt32LE(size * 2, 8);
  frame.writeUInt16LE(1, 12);
  frame.writeUInt16LE(32, 14);
  frame.writeUInt32LE(pixelBytes + maskStride * size, 20);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const source = (y * size + x) * 4;
      const target = 40 + ((size - 1 - y) * size + x) * 4;
      frame[target] = pixels[source + 2];
      frame[target + 1] = pixels[source + 1];
      frame[target + 2] = pixels[source];
      frame[target + 3] = pixels[source + 3];
      if (!pixels[source + 3]) {
        frame[40 + pixelBytes + (size - 1 - y) * maskStride + (x >> 3)] |= 0x80 >> (x % 8);
      }
    }
  }
  frames.push(frame);
}
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (const [index, frame] of frames.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frame.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
}
await writeFile('src/app/favicon.ico', Buffer.concat([directory, ...frames]));
console.log('Built S favicon: SVG, 96px PNG, 180px Apple icon, and 16/32/48px ICO.');
