import { readFile, writeFile } from 'node:fs/promises';
import { translateName } from './atlas-spanish.mjs';
const atlas = JSON.parse(await readFile(new URL('../public/atlas/models/atlas.json', import.meta.url), 'utf8'));
const names = [...new Set([...atlas.parts, ...atlas.concepts].map(part => part.name.toLowerCase()))].sort();
const translations = {}, unresolved = new Set();
for (const name of names) {
  try { translations[name] = translateName(name); }
  catch (error) { unresolved.add(error.message); }
}
console.log(`Traducidos: ${Object.keys(translations).length}/${names.length}`);
if (unresolved.size) {
  console.log([...unresolved].sort().join('\n'));
  process.exitCode = 1;
} else {
  const destination = new URL('../app/components/atlas/names-es.json', import.meta.url);
  const serialized = JSON.stringify(translations, null, 2) + '\n';
  if (process.argv.includes('--check')) {
    const existing = await readFile(destination, 'utf8');
    if (existing.replace(/\r\n/g, '\n') !== serialized) {
      console.error('El catálogo en español debe regenerarse con npm run atlas:translate.');
      process.exitCode = 1;
    }
  } else await writeFile(destination, serialized);
}
