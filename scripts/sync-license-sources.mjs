// Explicit maintenance command. Normal builds use committed notices without network access.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const sources = [
  { id: 'draco', url: 'https://raw.githubusercontent.com/google/draco/main/LICENSE', marker: 'Apache License', destinations: ['public/draco/LICENSE.txt'] },
  { id: 'basis-universal', url: 'https://raw.githubusercontent.com/BinomialLLC/basis_universal/master/LICENSE', marker: 'Apache License', destinations: ['public/basis/LICENSE.txt'] },
  { id: 'meshoptimizer', url: 'https://raw.githubusercontent.com/zeux/meshoptimizer/v1.1/LICENSE.md', marker: 'MIT License', destinations: ['public/study-atlas/vendor/three/addons/libs/Meshoptimizer-LICENSE.txt', 'vendor/dental-scope/public/licenses/Meshoptimizer-LICENSE.txt'] },
  { id: 'dm-sans', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt', marker: 'SIL OPEN FONT LICENSE', destinations: ['public/licenses/DM-Sans-OFL.txt'] },
  { id: 'cormorant-garamond', url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt', marker: 'SIL OPEN FONT LICENSE', destinations: ['public/licenses/Cormorant-Garamond-OFL.txt'] },
];
const records = [];
for (const source of sources) {
  const response = await fetch(source.url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`${response.status}: ${source.url}`);
  const text = await response.text();
  if (!text.includes(source.marker) || text.length < 900) throw new Error(`Unexpected license response: ${source.id}`);
  for (const destination of source.destinations) {
    await mkdir(path.dirname(path.join(root, destination)), { recursive: true });
    await writeFile(path.join(root, destination), text);
  }
  records.push({ id: source.id, source: source.url, retrievedOn: new Date().toISOString().slice(0, 10), sha256: sha256(text), files: source.destinations });
}

const three = JSON.parse(await readFile(path.join(root, 'node_modules/three/package.json'), 'utf8'));
const copies = [];
for (const [directory, names] of [
  ['draco', ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js']],
  ['basis', ['basis_transcoder.js', 'basis_transcoder.wasm']],
]) {
  for (const name of names) {
    const destination = `public/${directory}/${name}`;
    const packageFile = `node_modules/three/examples/jsm/libs/${directory}/${name}`;
    const [local, packaged] = await Promise.all([readFile(path.join(root, destination)), readFile(path.join(root, packageFile))]);
    if (sha256(local) !== sha256(packaged)) throw new Error(`Vendored asset differs from installed Three.js: ${destination}`);
    copies.push({ file: destination, sha256: sha256(local), matches: packageFile, package: `three@${three.version}` });
  }
  const readme = await readFile(path.join(root, `node_modules/three/examples/jsm/libs/${directory}/README.md`), 'utf8');
  await writeFile(path.join(root, `public/${directory}/UPSTREAM-README.md`), readme);
  await writeFile(path.join(root, `public/${directory}/PROVENANCE.md`), `# ${directory === 'draco' ? 'Draco' : 'Basis Universal'} distribution provenance\n\nThese unchanged files match the copies distributed with three@${three.version}. Their source distribution describes them as Apache-2.0; see LICENSE.txt and UPSTREAM-README.md. Three.js's MIT license is separate.\n\nThe exact file hashes and license retrieval records are in /licenses/third-party-sources.json. No anatomy models are licensed by these notices.\n`);
}
const meshFile = 'public/study-atlas/vendor/three/addons/libs/meshopt_decoder.module.js';
const meshBytes = await readFile(path.join(root, meshFile));
const meshPackaged = await readFile(path.join(root, 'node_modules/three/examples/jsm/libs/meshopt_decoder.module.js'));
if (sha256(meshBytes) !== sha256(meshPackaged)) throw new Error('Meshoptimizer decoder differs from package reference');
copies.push({ file: meshFile, sha256: sha256(meshBytes), matches: 'node_modules/three/examples/jsm/libs/meshopt_decoder.module.js', package: `three@${three.version}`, component: 'meshoptimizer 1.1' });

await writeFile(path.join(root, 'public/licenses/third-party-sources.json'), JSON.stringify({ schemaVersion: 1, licenses: records, unchangedCopies: copies }, null, 2) + '\n');
console.log(`Preserved ${records.length} upstream license texts and verified ${copies.length} unchanged library copies.`);
