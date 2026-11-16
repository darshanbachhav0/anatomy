// Explicit network maintenance; normal builds only read the pinned local records.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = JSON.parse(await readFile(path.join(root, 'public/third-party-notices/manifest.json'), 'utf8'));
const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'));
const old = await readFile(path.join(root, 'compliance/package-notice-sources.json'), 'utf8').catch(error => {
  if (error.code === 'ENOENT') return '{"records":[]}';
  throw error;
});
const records = new Map(JSON.parse(old).records.map(record => [record.location, record]));
const pending = [];
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response.text();
}
for (const pkg of manifest.packages.filter(p => p.noticeStatus === 'upstream-notice-review-required')) {
  const metadataURL = `https://registry.npmjs.org/${encodeURIComponent(pkg.name)}/${pkg.version}`;
  const metadata = JSON.parse(await get(metadataURL));
  const integrity = lock.packages[pkg.location]?.integrity;
  if (!integrity || metadata.dist?.integrity !== integrity) {
    pending.push({ location: pkg.location, reason: 'Registry integrity cannot be matched to lockfile' });
    continue;
  }
  const repository = (metadata.repository?.url ?? '').match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/)?.[1];
  if (!repository || !/^[a-f0-9]{40}$/.test(metadata.gitHead ?? '')) {
    pending.push({ location: pkg.location, reason: 'No exact published Git commit/repository in version metadata' });
    continue;
  }
  // Fetch exact published commits, never an unrelated current main-branch license.
  const directories = [...new Set([metadata.repository?.directory, ''].filter(v => v !== undefined))];
  const notices = [];
  for (const directory of directories) {
    for (const name of ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENSE-MIT', 'LICENSE-APACHE', 'LICENSE.BSD', 'license', 'license.md', 'license.txt', 'LICENCE', 'COPYING', 'NOTICE', 'NOTICE.txt']) {
      const source = `https://raw.githubusercontent.com/${repository}/${metadata.gitHead}/${directory ? directory + '/' : ''}${name}`;
      const text = await get(source);
      if (!text || text.length < 100 || !/copyright|permission|license|licence|redistribut/i.test(text)) continue;
      const file = `compliance/upstream-package-notices/${sha(text)}.txt`;
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), text);
      notices.push({ file, sha256: sha(text), source });
    }
  }
  if (notices.length) records.set(pkg.location, { location: pkg.location, name: pkg.name, version: pkg.version, integrity, metadataURL, gitHead: metadata.gitHead, notices });
  else pending.push({ location: pkg.location, reason: 'No original notice found at tested paths in exact published commit' });
}
await writeFile(path.join(root, 'compliance/package-notice-sources.json'), JSON.stringify({ schemaVersion: 1, scope: 'Original upstream texts tied to npm version metadata and lockfile integrity. Does not certify complete transitive native-library rights.', records: [...records.values()].sort((a,b) => a.location.localeCompare(b.location)), pending }, null, 2) + '\n');
console.log(`Preserved pinned upstream notices for ${records.size} package locations; ${pending.length} still require evidence.`);
