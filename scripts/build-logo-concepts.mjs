import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const output = 'public/logos';
const ink = '#0a0a0a';
const cream = '#f1ead6';
const lime = '#c6ff35';
const svg = (width, height, content, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}"><title>${title}</title>${content}</svg>`;

// All lettering and symbols are original vector paths, with no font dependency.
const geometricLetters = [
  'M64 0H12L0 12V38L12 50H48V66H0V80H52L64 68V42L52 30H16V14H64Z',
  'M0 0H16V60L22 66H42L48 60V0H64V66L50 80H14L0 66Z',
  'M0 80V0H50L64 14V34L52 46L69 80H51L35 48H16V80ZM16 14V34H43L48 29V19L43 14Z',
  'M0 0H60V14H16V32H53V46H16V66H60V80H0Z',
  'M0 80V0H16L48 52V0H64V80H48L16 28V80Z',
];
const geometricWord = (color) =>
  `<g fill="${color}" fill-rule="evenodd">${geometricLetters.map((d, i) => `<path transform="translate(${i * 83} 0)" d="${d}"/>`).join('')}</g>`;

// Two chamfered structural members form an S with an open, diagonal seam.
const structuralSymbol = (color, accent = color) =>
  `<path fill="${color}" d="M104 0H24L0 24V62L24 86H58L34 62H26V32L32 26H104Z"/><path fill="${accent}" d="M0 120H80L104 96V58L80 34H46L70 58H78V88L72 94H0Z"/>`;

// Four rounded modules meet around an open square. The open joints keep each
// component readable at favicon size; rotation makes the symbol directional.
const connectedSymbol = (color, accent = color) =>
  `<g transform="translate(60 60) rotate(-45) translate(-60 -60)" fill="none" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"><path stroke="${color}" d="M17 51V29Q17 17 29 17H51"/><path stroke="${color}" d="M69 17H91Q103 17 103 29V51"/><path stroke="${accent}" d="M103 69V91Q103 103 91 103H69"/><path stroke="${color}" d="M51 103H29Q17 103 17 91V69"/><path stroke="${color}" stroke-width="12" d="M43 60H77M60 43V77"/></g>`;
const roundedLetters = [
  'M48 8H18Q5 8 5 21Q5 34 18 34H35Q49 34 49 48Q49 62 35 62H5',
  'M5 8V42Q5 62 27 62Q49 62 49 42V8',
  'M5 62V8H31Q49 8 49 23Q49 38 31 38H5M29 38L51 62',
  'M49 8H5V62H49M5 34H42',
  'M5 62V8L49 62V8',
];
const roundedWord = (color) =>
  `<g fill="none" stroke="${color}" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round">${roundedLetters.map((d, i) => `<path transform="translate(${i * 72} 0)" d="${d}"/>`).join('')}</g>`;

// A condensed masthead: hard shoulders, a generous R counter, and diagonal
// terminals on the E. Its proportions differ deliberately from both lockups.
const editorialLetters = [
  'M58 0H11L0 11V49L11 60H36V82H0V104H47L58 93V54L47 43H22V22H58Z',
  'M0 0H22V78L26 82H32L36 78V0H58V91L45 104H13L0 91Z',
  'M0 104V0H43L58 15V46L46 58L62 104H38L24 62H22V104ZM22 21V42H32L36 38V25L32 21Z',
  'M0 0H58L50 22H22V41H49V62H22V82H58L50 104H0Z',
  'M0 104V0H22L40 51V0H60V104H39L20 50V104Z',
];
const editorialWord = (color) =>
  `<g fill="${color}" fill-rule="evenodd">${editorialLetters.map((d, i) => `<path transform="translate(${i * 69} 0)" d="${d}"/>`).join('')}</g>`;

const concepts = [
  {
    id: '01-structural-s', number: '01', name: 'Structural S',
    short: 'A mark built to hold.',
    description: 'Two angular members form a split S. Broad geometric lettering gives it the character of an engineering practice.',
    tags: 'ARCHITECTURAL / PRECISE / BOLD', width: 680, height: 150,
    logo: (color, accent = color) => `<g transform="translate(12 15)">${structuralSymbol(color, accent)}</g><g transform="translate(165 35) scale(1.23)">${geometricWord(color)}</g>`,
    symbol: structuralSymbol, iconWidth: 104, iconHeight: 120,
  },
  {
    id: '02-connected-system', number: '02', name: 'Connected System',
    short: 'Separate parts. Shared purpose.',
    description: 'Four rounded modules connect around a central junction. Open joints and softer lettering suggest an approachable technical partner.',
    tags: 'MODULAR / OPEN / HUMAN', width: 610, height: 170,
    logo: (color, accent = color) => `<g transform="translate(14 24)">${connectedSymbol(color, accent)}</g><g transform="translate(185 44) scale(1.16)">${roundedWord(color)}</g>`,
    symbol: connectedSymbol, iconWidth: 120, iconHeight: 120,
  },
  {
    id: '03-editorial-wordmark', number: '03', name: 'Editorial Wordmark',
    short: 'Let the name do the work.',
    description: 'A compact, custom-drawn masthead with deep counters and cut terminals. No separate emblem: the name is the identity.',
    tags: 'EXPRESSIVE / CONDENSED / CONFIDENT', width: 365, height: 140,
    logo: (color, accent = color) => `<g transform="translate(14 18)">${editorialWord(color)}</g>${accent !== color ? `<path fill="${accent}" d="M290 122H350L346 130H286Z"/>` : ''}`,
    symbol: (color) => `<path fill="${color}" d="${editorialLetters[0]}"/>`, iconWidth: 58, iconHeight: 104,
  },
];

await mkdir(output, { recursive: true });
for (const concept of concepts) {
  const folder = `${output}/${concept.id}`;
  await mkdir(folder, { recursive: true });
  for (const [variant, color, accent] of [['ink', ink, ink], ['cream', cream, cream], ['accent', cream, lime]]) {
    const vector = svg(concept.width, concept.height, concept.logo(color, accent), `SUREN — ${concept.name}`);
    await writeFile(`${folder}/logo-${variant}.svg`, vector);
    await sharp(Buffer.from(vector)).resize({ width: 1800 }).png().toFile(`${folder}/logo-${variant}.png`);
  }
  for (const [variant, color] of [['ink', ink], ['cream', cream]]) {
    const scale = 80 / Math.max(concept.iconWidth, concept.iconHeight);
    const x = (128 - concept.iconWidth * scale) / 2;
    const y = (128 - concept.iconHeight * scale) / 2;
    await writeFile(`${folder}/symbol-${variant}.svg`, svg(128, 128, `<g transform="translate(${x} ${y}) scale(${scale})">${concept.symbol(color)}</g>`, `SUREN — ${concept.name} symbol`));
  }
  for (const [theme, bg, fg] of [['dark', ink, cream], ['light', cream, ink]]) {
    const scale = Math.min(1000 / concept.width, 250 / concept.height);
    const x = (1400 - concept.width * scale) / 2;
    const y = (650 - concept.height * scale) / 2;
    const preview = svg(1400, 650, `<rect width="1400" height="650" fill="${bg}"/><g transform="translate(${x} ${y}) scale(${scale})">${concept.logo(fg)}</g>`, `SUREN — ${concept.name} on ${theme}`);
    await sharp(Buffer.from(preview)).png().toFile(`${folder}/preview-${theme}.png`);
  }
}

const label = (x, y, text, size = 16, color = cream, extra = '') =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, sans-serif" font-size="${size}" ${extra}>${text}</text>`;
let board = `<rect width="1800" height="1910" fill="${ink}"/>${label(90, 92, 'SUREN / IDENTITY EXPLORATIONS', 22, cream, 'letter-spacing="4"')}${label(90, 150, 'Three directions. One independent studio.', 40)}${label(90, 197, 'Original vector concepts · Black, warm cream and electric lime', 18, '#aaa28c')}`;
for (const [i, c] of concepts.entries()) {
  const y = 255 + i * 520;
  board += `<path d="M90 ${y}H1710" stroke="#38362f"/>${label(90, y + 48, c.number, 22, lime)}${label(150, y + 48, c.name, 22)}${label(1710, y + 48, c.tags, 13, '#aaa28c', 'text-anchor="end" letter-spacing="2"')}`;
  const scale = Math.min(1040 / c.width, 205 / c.height);
  board += `<g transform="translate(${90 + (1100 - c.width * scale) / 2} ${y + 125}) scale(${scale})">${c.logo(cream, lime)}</g>`;
  board += `<rect x="1280" y="${y + 95}" width="430" height="280" rx="3" fill="${cream}"/>`;
  const sampleScale = Math.min(345 / c.width, 145 / c.height);
  board += `<g transform="translate(${1280 + (430 - c.width * sampleScale) / 2} ${y + 95 + (280 - c.height * sampleScale) / 2}) scale(${sampleScale})">${c.logo(ink)}</g>`;
  board += label(90, y + 425, c.short, 27);
  board += label(90, y + 465, ['Split S monogram / geometric wordmark', 'Four-part junction / rounded line lettering', 'Custom condensed lettering / typographic identity'][i], 17, '#aaa28c');
}
board += `<path d="M90 1840H1710" stroke="#38362f"/>${label(90, 1878, 'CONCEPT REVIEW / SURENCOMPANY.COM', 13, '#aaa28c', 'letter-spacing="2"')}${label(1710, 1878, '01 — 03', 13, '#aaa28c', 'text-anchor="end"')}`;
const boardSvg = svg(1800, 1910, board, 'Three SUREN logo concepts');
await writeFile(`${output}/comparison.svg`, boardSvg);
await sharp(Buffer.from(boardSvg)).png().toFile(`${output}/comparison.png`);

const cards = concepts.map(c => `<article class="card" id="${c.id}">
  <header><span class="number">${c.number}</span><div><h2>${c.name}</h2><p class="tags">${c.tags}</p></div></header>
  <div class="stage"><img class="logo" data-base="${c.id}" src="${c.id}/logo-cream.svg" alt="SUREN ${c.name} logo" width="${c.width}" height="${c.height}"></div>
  <div class="specimens"><div class="icon-sample"><img data-base="${c.id}" data-symbol src="${c.id}/symbol-cream.svg" alt="${c.name} at icon size" width="40" height="40"><span>40px</span></div><div class="small-sample"><img data-base="${c.id}" src="${c.id}/logo-cream.svg" alt="${c.name} at a small header size" width="145"><span>HEADER SIZE</span></div></div>
  <div class="description"><h3>${c.short}</h3><p>${c.description}</p></div>
  <footer><a data-download data-base="${c.id}" data-ext="svg" href="${c.id}/logo-cream.svg" download>Download SVG ↗</a><a data-download data-base="${c.id}" data-ext="png" href="${c.id}/logo-cream.png" download>PNG ↗</a><a href="${c.id}/preview-light.png" target="_blank" rel="noopener">Light preview ↗</a></footer>
</article>`).join('\n');
await writeFile(`${output}/index.html`, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>SUREN — Logo concepts</title>
<style>
@font-face{font-family:Manrope;src:url('../fonts/manrope-latin-variable.woff2')}@font-face{font-family:Plex;src:url('../fonts/ibm-plex-mono-latin.woff2')}
*{box-sizing:border-box}body{margin:0;background:#0a0a0a;color:#f1ead6;font-family:Manrope,Arial,sans-serif;--stage:#0a0a0a;--ink:#f1ead6;--muted:#aaa28c;--line:#38362f}body.light{--stage:#f1ead6;--ink:#0a0a0a;--muted:#625e50;--line:#c9c2ae}a{color:inherit;text-underline-offset:5px}button{font:inherit;cursor:pointer}main{max-width:1540px;margin:auto;padding:64px 40px 40px}.eyebrow,.tags,.number,.specimens span,.controls label,.note{font-family:Plex,monospace}.eyebrow{font-size:11px;letter-spacing:2px;color:#c6ff35}h1{font-size:clamp(32px,4.8vw,66px);line-height:1.08;letter-spacing:-2.5px;font-weight:600;max-width:900px;margin:24px 0 20px}.intro{color:#aaa28c;font-size:15px;line-height:1.8;max-width:620px}.controls{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;margin:38px 0 32px;padding:22px 0;border-block:1px solid #38362f}.modes{display:flex;gap:6px;flex-wrap:wrap}.modes button{padding:10px 16px;border:1px solid #4a463c;background:transparent;color:#f1ead6;border-radius:30px;font-size:12px}.modes button[aria-pressed=true]{background:#c6ff35;color:#0a0a0a;border-color:#c6ff35}.controls label{display:flex;gap:14px;align-items:center;font-size:11px;color:#aaa28c}input{accent-color:#c6ff35;width:130px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.card{background:var(--stage);color:var(--ink);border:1px solid var(--line);border-radius:4px;overflow:hidden}.card header{display:flex;gap:16px;align-items:start;padding:26px 24px}.number{font-size:13px;color:var(--muted);padding-top:3px}h2{font-size:19px;letter-spacing:-.5px;margin:0;font-weight:600}.tags{font-size:8px;letter-spacing:.6px;color:var(--muted);margin-top:10px}.stage{height:220px;display:flex;align-items:center;justify-content:center;padding:26px}.stage .logo{width:var(--logo-size,90%);max-width:100%;height:auto;max-height:150px}.specimens{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 24px;padding:22px 0;border-block:1px solid var(--line);min-height:96px}.specimens span{font-size:8px;color:var(--muted);letter-spacing:1px}.icon-sample{display:flex;align-items:center;gap:8px}.small-sample{display:flex;flex-direction:column;align-items:end;gap:14px}.small-sample img{height:auto;max-height:46px}.description{padding:24px;min-height:185px}.description h3{font-size:16px;line-height:1.5;font-weight:600;margin:0 0 12px}.description p{color:var(--muted);font-size:12px;line-height:1.9;margin:0}.card footer{display:flex;flex-wrap:wrap;gap:16px;padding:20px 24px;border-top:1px solid var(--line);font-size:10px}.page-footer{margin-top:34px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;color:#aaa28c;font-size:12px}.note{font-size:10px;letter-spacing:.5px;line-height:1.8;max-width:620px}a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid #c6ff35;outline-offset:5px}@media(max-width:1050px){.grid{grid-template-columns:1fr}.card{display:block;max-width:750px;width:100%;margin:auto}.stage{height:250px}.stage .logo{max-width:570px}.description{min-height:0}.tags{font-size:10px}.card footer{font-size:12px}.specimens{justify-content:start;gap:60px}.small-sample{align-items:start}}@media(max-width:600px){main{padding:36px 18px}h1{letter-spacing:-1.5px}.controls{align-items:start}.stage{height:190px;padding:20px}.card header,.description{padding:22px}.tags{font-size:8px}.card footer{gap:18px;font-size:10px}.specimens{gap:24px}.small-sample img{width:125px}}
</style></head><body><main>
<div class="eyebrow">SUREN / IDENTITY EXPLORATIONS</div><h1>Three ways to<br>make our mark.</h1><p class="intro">Three distinct logo directions for an independent digital engineering studio. Compare their shapes, small-size clarity and fit with the website's palette.</p>
<div class="controls"><div class="modes" role="group" aria-label="Logo palette"><button data-mode="dark" aria-pressed="true">Cream on black</button><button data-mode="light" aria-pressed="false">Black on cream</button><button data-mode="accent" aria-pressed="false">Electric accent</button></div><label for="size">LOGO SIZE <input id="size" type="range" min="40" max="100" value="90"><output id="size-value" for="size">90%</output></label></div>
<div class="grid">${cards}</div><div class="page-footer"><p class="note">REVIEW CONCEPTS / Original path-based SVGs. Transparent PNGs included.<br>Selected identity: Structural S / Electric accent.</p><a href="comparison.png" target="_blank" rel="noopener">Open comparison board ↗</a></div>
</main><script>
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{const mode=button.dataset.mode;const variant=mode==='light'?'ink':mode==='accent'?'accent':'cream';document.body.classList.toggle('light',mode==='light');document.querySelectorAll('[data-mode]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));document.querySelectorAll('img[data-base]').forEach(img=>{img.src=img.dataset.base+'/'+(img.hasAttribute('data-symbol')?'symbol-'+(mode==='light'?'ink':'cream'):'logo-'+variant)+'.svg'});document.querySelectorAll('[data-download]').forEach(link=>{link.href=link.dataset.base+'/logo-'+variant+'.'+link.dataset.ext})}));document.getElementById('size').addEventListener('input',event=>{document.documentElement.style.setProperty('--logo-size',event.target.value+'%');document.getElementById('size-value').value=event.target.value+'%'});
</script></body></html>`);
await writeFile(`${output}/README.md`, `# SUREN logo concepts\n\nOpen index.html to compare the three directions, switch palettes, and inspect smaller sizes. Open comparison.png for the complete concept board.\n\n${concepts.map(c => `- **${c.number} — ${c.name}:** ${c.description} Folder: ${c.id}/`).join('\n')}\n\nEach folder contains:\n\n- logo-ink.svg / .png — dark ink, transparent background\n- logo-cream.svg / .png — warm cream, transparent background\n- logo-accent.svg / .png — cream and electric lime, transparent background\n- symbol-ink.svg and symbol-cream.svg — square icon canvases\n- preview-dark.png and preview-light.png — presentation previews\n\nAll logo lettering is drawn as SVG paths; no fonts or external services are needed to render the logos. PNG lockups are 1800px wide. Palette: #0a0a0a / #f1ead6 / #c6ff35. Selected website identity: Structural S / Electric accent.\n\nRebuild assets with: node scripts/build-logo-concepts.mjs\n`);
console.log(`Created ${concepts.length} SUREN logo concepts in ${output}/`);
