import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('public/echo');
const origin = 'https://echosuite.app/';
const queue = ['index.html', 'calculators/index.html', 'assets/cine-resources-CIyfBlnX.js'];
const seen = new Set(queue);
const failed = [];
let bytes = 0;
function enqueue(resource) {
  resource = resource?.replace(/^echo\//, '');
  if (/^(?:uma|translations-es)/.test(resource)) return;
  if (!resource || resource.includes('usage-analytics') || resource.includes('brand/') || resource.includes('favicon') || resource.includes('analytics') || resource.includes('..') || seen.has(resource)) return;
  seen.add(resource); queue.push(resource);
}
async function download(resource) {
  const target = path.resolve(root, resource);
  if (!target.startsWith(root + path.sep)) throw new Error('Path outside echo directory');
  let data;
  try { await access(target); data = await readFile(target); }
  catch {
    const response = await fetch(new URL(resource, origin), { signal: AbortSignal.timeout(120000) });
    if (!response.ok) throw new Error(`${response.status} ${resource}`);
    data = Buffer.from(await response.arrayBuffer());
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, data);
  }
  bytes += data.length;
  if (/\.(js|css|html|json)$/.test(resource)) {
    const source = data.toString();
    if (resource.includes('cine-resources')) {
      for (const match of source.matchAll(/"([^"\s]+)":\{hash:/g)) enqueue('assets/' + match[1]);
      for (const match of source.matchAll(/packed:"([^"\s]+)"/g)) enqueue('assets/' + match[1]);
    }
    for (const match of source.matchAll(/(?:["']|url\()((?:\.\.?\/|\/|assets\/)[^"'\s<>()`]+\.(?:js|css|json|png|jpg|svg|woff2?|wasm|gz|bin|rgba|frag|mp4|webm|txt))(?:\?[^"'\s]*)?["')]/g)) {
      const url = new URL(match[1], match[1].startsWith('assets/') ? origin : new URL(resource, origin));
      enqueue(url.pathname.slice(1));
    }
  }
}
while (queue.length) {
  const batch = queue.splice(0, 6);
  await Promise.all(batch.map(async resource => {
    try { await download(resource); }
    catch (error) { failed.push({ resource, error: String(error) }); }
  }));
  console.log(`${seen.size - queue.length}/${seen.size} recursos · ${(bytes / 1048576).toFixed(1)} MB`);
}
await mkdir('outputs', { recursive: true });
await writeFile('outputs/echo-import.json', JSON.stringify({ origin, resources: [...seen], bytes, failed }, null, 2));
console.log(JSON.stringify({ files: seen.size, megabytes: bytes / 1048576, failed }));
if (failed.length) process.exitCode = 1;
