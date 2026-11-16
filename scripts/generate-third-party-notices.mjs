import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public/third-party-notices');
const check = process.argv.includes('--check');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const escape = text => String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'));
const generated = new Map();
const notes = [];
const packages = [];
const recovered = JSON.parse(await readFile(path.join(root, 'compliance/package-notice-sources.json'), 'utf8').catch(error => {
  if (error.code === 'ENOENT') return '{"records":[]}';
  throw error;
}));

async function optionalRead(filename) {
  try { return await readFile(filename, 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') return undefined; throw error; }
}

async function noticeFiles(directory, depth = 0) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const filename = path.join(directory, entry.name);
    if (entry.isFile() && /^(?:licen[cs]e|notice|copying|copyright)(?:[._-]|$)/i.test(entry.name)) files.push(filename);
    // Nested notice directories often contain native-library component notices.
    if (entry.isDirectory() && depth < 4 && (depth > 0 || /^(?:licenses?|notices?)$/i.test(entry.name))) files.push(...await noticeFiles(filename, depth + 1));
  }
  return files;
}

async function keepNotice(filename) {
  const text = await readFile(filename, 'utf8');
  const id = hash(text);
  const target = `licenses/${id}.txt`;
  generated.set(target, text);
  return { original: path.relative(root, filename).split(path.sep).join('/'), file: target, sha256: id };
}

for (const [location, record] of Object.entries(lock.packages).sort(([a], [b]) => a.localeCompare(b, 'en'))) {
  if (!location) continue;
  const filename = path.join(root, location, 'package.json');
  const source = await optionalRead(filename);
  const local = source ? JSON.parse(source) : undefined;
  if (local && record.version && local.version !== record.version) throw new Error(`Installed version differs from lockfile: ${location}`);
  const files = source ? await noticeFiles(path.dirname(filename)) : [];
  const notices = [];
  for (const file of files) notices.push(await keepNotice(file));
  const upstream = recovered.records.find(p => p.location === location && p.version === record.version && p.integrity === record.integrity);
  if (source && upstream) {
    for (const notice of upstream.notices) {
      if (hash(await readFile(path.join(root, notice.file))) !== notice.sha256) throw new Error(`Recovered upstream notice changed: ${notice.file}`);
      notices.push({ ...await keepNotice(path.join(root, notice.file)), source: notice.source, gitHead: upstream.gitHead, metadataURL: upstream.metadataURL });
    }
  }
  // Preserve the original GSAP proprietary banner even though the package has no LICENSE file.
  if (local?.name === 'gsap') {
    const code = await readFile(path.join(root, location, 'gsap-core.js'), 'utf8');
    const banner = code.match(/\/\*![\s\S]*?\*\//)?.[0];
    if (!banner?.includes('@license')) throw new Error('Expected GSAP copyright banner is missing');
    const content = `${banner}\n\nApplicable custom license: https://gsap.com/standard-license\nThis component is not MIT licensed. Preserve its proprietary notices.\n`;
    const target = `licenses/${hash(content)}.txt`;
    generated.set(target, content);
    notices.push({ original: `${location}/gsap-core.js copyright banner`, file: target, sha256: hash(content) });
  }
  let repository = local?.repository?.url ?? local?.repository ?? '';
  if (typeof repository !== 'string') repository = '';
  repository = repository.replace(/^git\+/, '').replace(/\.git$/, '');
  if (!/^https?:\/\//.test(repository)) repository = '';
  packages.push({
    location, name: local?.name ?? location.split('node_modules/').at(-1), version: record.version ?? local?.version ?? null,
    declaredLicense: record.license ?? local?.license ?? 'UNKNOWN',
    installed: Boolean(source), dev: Boolean(record.dev), optional: Boolean(record.optional),
    source: repository || record.resolved || null, notices,
    noticeStatus: !source ? 'not-installed-here' : notices.length ? 'original-notices-preserved' : 'upstream-notice-review-required',
  });
}

// Next.js includes code that has no separate root lock entry.
async function nestedNotices(directory) {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await nestedNotices(filename);
    else if (/^(?:licen[cs]e|notice|copying|copyright)(?:[._-]|$)/i.test(entry.name)) notes.push(await keepNotice(filename));
  }
}
await nestedNotices(path.join(root, 'node_modules/next/dist/compiled'));

const sources = JSON.parse(await readFile(path.join(root, 'public/licenses/third-party-sources.json'), 'utf8'));
for (const source of sources.licenses) {
  for (const file of source.files) {
    const text = await readFile(path.join(root, file), 'utf8');
    if (hash(text) !== source.sha256) throw new Error(`Upstream license text changed: ${file}`);
  }
}
for (const copy of sources.unchangedCopies) {
  if (hash(await readFile(path.join(root, copy.file))) !== copy.sha256) throw new Error(`Vendored library changed; review its provenance: ${copy.file}`);
}
const manifest = {
  schemaVersion: 1, lockfileSHA256: hash(await readFile(path.join(root, 'package-lock.json'))),
  scope: 'Conservative inventory of all installed root-workspace packages and Next embedded notices. Not a legal clearance or exact shipped-code trace.',
  packages, embeddedNotices: notes, upstreamLicenseRecords: '/licenses/third-party-sources.json',
};
generated.set('manifest.json', JSON.stringify(manifest, null, 2) + '\n');
let combined = '# Third-party notices\n\nOriginal notices are preserved verbatim below. Package declarations do not grant rights in anatomical assets.\n\n';
for (const [file, text] of [...generated].filter(([file]) => file.startsWith('licenses/')).sort(([a], [b]) => a.localeCompare(b))) combined += `\n---\n\n## ${file}\n\n${text}\n`;
generated.set('THIRD_PARTY_NOTICES.txt', combined);
const rows = packages.map(p => `<tr><td>${escape(p.name)}<br><small>${escape(p.version)}</small></td><td>${escape(p.declaredLicense)}</td><td>${p.notices.map((n, i) => `<a href="${n.file}">Aviso ${i + 1}</a>`).join(' · ') || (p.installed ? 'Aviso original pendiente de revisión' : 'No instalado en este entorno')}</td></tr>`).join('\n');
generated.set('index.html', `<!doctype html><html lang="es-PE"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fuentes, licencias y modificaciones | UMA</title><style>body{max-width:1100px;margin:40px auto;padding:0 24px;font:16px/1.6 system-ui;color:#172033}a{color:#174a8b}table{width:100%;border-collapse:collapse}td,th{padding:12px;border:1px solid #d9d9d9;text-align:left;overflow-wrap:anywhere}th{background:#f2f4f6}small{color:#475569}</style></head><body><h1>Fuentes, licencias y modificaciones</h1><p>Las bibliotecas, los modelos y los contenidos conservan sus licencias individuales. Los avisos de software no conceden derechos adicionales sobre los recursos anatómicos.</p><ul><li><a href="/atlas/ATRIBUCION.md">Atlas corporal: BodyParts3D y Human Atlas</a></li><li><a href="/dental/CREDITS.md">Odontología: fuentes, modelos y modificaciones</a> · <a href="/dental/LICENSE">Licencias de código y contenido dental</a></li><li><a href="/echo/credits.html">Ecocardiografía: autor, anatomía y medios clínicos</a></li><li><a href="/licenses/DM-Sans-OFL.txt">DM Sans</a> · <a href="/licenses/Cormorant-Garamond-OFL.txt">Cormorant Garamond</a></li><li><a href="THIRD_PARTY_NOTICES.txt">Avisos originales completos</a> · <a href="manifest.json">Inventario técnico de dependencias</a></li></ul><h2>Bibliotecas y dependencias</h2><p>Este inventario conserva también avisos de herramientas de compilación y paquetes opcionales. Las declaraciones de licencia proceden de los paquetes; los registros sin aviso original requieren revisión.</p><table><thead><tr><th>Componente y versión</th><th>Licencia declarada</th><th>Avisos originales</th></tr></thead><tbody>${rows}</tbody></table><h2>Software incluido dentro de Next.js</h2><p>Los ${notes.length} avisos internos se conservan en el inventario técnico y en la recopilación completa, con sus derechos originales.</p></body></html>\n`);

// Static, script-free access works from the existing main About link as well as direct URLs.
const echo = JSON.parse(await readFile(path.join(root, 'public/echo/assets/credits.json'), 'utf8'));
const locale = vm.createContext({ window: {}, document: { readyState: 'loading', addEventListener() {} } });
for (const file of ['translations-es.js', 'uma-es.js']) vm.runInContext(await readFile(path.join(root, 'public/echo', file), 'utf8'), locale);
const spanish = vm.runInContext('translate', locale);
const creditLink = (label, value) => /^https?:\/\//.test(value ?? '') ? `<a href="${escape(value)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>` : escape(label);
const groups = [['figuresAndAnatomy', 'Figuras y anatomía'], ['videos', 'Vídeos clínicos']].map(([key, title]) => `<h2>${title}</h2>${(echo[key] ?? []).map(c => `<article><h3>${escape(spanish(c.title))}</h3><p>${escape(c.creator)}</p><p>${escape(spanish(c.detail ?? c.modifications ?? ''))}</p><p>${creditLink('Fuente original', c.sourceURL)} · ${creditLink(c.license, c.licenseURL)}</p></article>`).join('\n')}`).join('\n');
const echoPage = `<!doctype html><html lang="es-PE"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fuentes y licencias de ecocardiografía | UMA</title><style>body{max-width:850px;margin:40px auto;padding:0 24px;font:16px/1.65 system-ui;color:#172033}a{color:#174a8b}article{padding:16px 0;border-top:1px solid #d9d9d9}p{overflow-wrap:anywhere}</style></head><body><h1>Fuentes y licencias de ecocardiografía</h1><p>Software y superposiciones educativas originales de EchoSuite © Mohammed Kamareddine, MD. La adaptación UMA conserva los derechos de autor y las licencias individuales de sus recursos.</p><p>${creditLink('EchoSuite y su autor', 'https://echosuite.app/about')} · <a href="/echo/ADAPTACION-UMA.md">Procedencia y modificaciones UMA</a></p>${groups}<h2>Avisos originales</h2><ul><li><a href="assets/ATTRIBUTION.txt">Anatomía y figuras</a></li><li><a href="assets/THREE-LICENSE.txt">Three.js</a></li><li><a href="assets/Michroma-OFL.txt">Michroma</a></li><li><a href="/atlas/ATRIBUCION.md">Atlas corporal compartido</a></li><li><a href="/third-party-notices/index.html">Todos los avisos de terceros</a></li></ul></body></html>\n`;

const stale = [];
for (const [file, text] of generated) {
  const destination = path.join(output, file);
  if (check) {
    if (await optionalRead(destination) !== text) stale.push(destination);
  } else {
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, text);
  }
}
const echoDestination = path.join(root, 'public/echo/credits.html');
if (check) {
  if (await optionalRead(echoDestination) !== echoPage) stale.push(echoDestination);
} else await writeFile(echoDestination, echoPage);
if (stale.length) throw new Error(`Notices are missing or stale. Run npm run licenses:generate.\n${stale.join('\n')}`);
console.log(`${check ? 'Verified' : 'Generated'} original notices for ${packages.length} lock entries and ${notes.length} embedded Next notices. Entries without original notices remain explicitly unresolved.`);
