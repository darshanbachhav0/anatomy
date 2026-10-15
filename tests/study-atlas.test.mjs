import assert from 'node:assert/strict';
import { readFile, stat, open } from 'node:fs/promises';
import test from 'node:test';
import { initialResource } from '../public/study-atlas/startup.js';

const root = new URL('../public/study-atlas/', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const catalog = await json('data/catalog.json');
const parts = await json('data/parts.json');

test('Exploración and Movimientos have distinct initial resources', () => {
  assert.equal(initialResource(catalog, '?mode=explore').entry.source, 'level1');
  const motion = initialResource(catalog, '?mode=motion');
  assert.equal(motion.mode, 'motion');
  assert.equal(motion.entry.animated, true);
  assert.equal(initialResource(catalog, '?mode=motion&asset=missing').entry.animated, true);
  assert.equal(initialResource(catalog, '?mode=invalid').mode, 'explore');
  assert.equal(catalog.filter(row => row.animated).length, 58);
});

test('all catalog models and split body files exist with their original size', async () => {
  for (const entry of catalog) {
    const paths = parts[entry.url] || [entry.url];
    let size = 0;
    for (const path of paths) size += (await stat(new URL(path, root))).size;
    assert.equal(size, entry.bytes, entry.url);
  }
});

test('every GLB external texture and buffer is included locally', async () => {
  const checked = new Set();
  for (const entry of catalog) {
    const first = new URL(parts[entry.url]?.[0] || entry.url, root);
    const handle = await open(first, 'r');
    try {
      const header = Buffer.alloc(20);
      await handle.read(header, 0, 20, 0);
      assert.equal(header.toString('ascii', 0, 4), 'glTF', entry.url);
      const content = Buffer.alloc(header.readUInt32LE(12));
      await handle.read(content, 0, content.length, 20);
      const gltf = JSON.parse(content.toString('utf8').trim());
      for (const item of [...(gltf.images || []), ...(gltf.buffers || [])]) {
        if (!item.uri || item.uri.startsWith('data:')) continue;
        const url = new URL(item.uri, new URL(entry.url, root));
        assert.ok(url.href.startsWith(root.href), `Nonlocal asset: ${url}`);
        if (!checked.has(url.href)) { assert.ok((await stat(url)).size > 0); checked.add(url.href); }
      }
    } finally { await handle.close(); }
  }
  assert.ok(checked.size > 0);
});

test('Exploración offers the Atlas 3D despiece bar, hidden for animated movements', async () => {
  const [html, app] = await Promise.all([readFile(new URL('index.html', root), 'utf8'), readFile(new URL('app.js', root), 'utf8')]);
  assert.match(html, /id="explode-range" type="range" min="0" max="100"/);
  for (const label of ['Despiece anatómico', 'Ensamblado', 'Separación por sistemas', 'Piezas individuales']) assert.match(html, new RegExp(label));
  assert.match(app, /\$\('explode-dock'\)\.hidden=!!state\.clip/);
  assert.match(app, /function layoutExplosion\(/);
});
