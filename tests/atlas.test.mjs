import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Execute the actual TypeScript modules without adding a test runtime dependency.
const moduleCache = new Map();
async function moduleUrl(name) {
  if (moduleCache.has(name)) return moduleCache.get(name);
  const source = await readFile(new URL(`../app/components/atlas/${name}.ts`, import.meta.url), 'utf8');
  let { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  for (const match of [...outputText.matchAll(/from ['"]\.\/([^'"]+)['"]/g)]) {
    outputText = outputText.replace(match[0], `from '${await moduleUrl(match[1])}'`);
  }
  const url = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
  moduleCache.set(name, url);
  return url;
}
const catalog = await import(await moduleUrl('catalog'));
const { SYSTEMS } = await import(await moduleUrl('anatomy'));
const { PointerTap } = await import(await moduleUrl('pointer-tap'));
const { createExplosionLayout } = await import(await moduleUrl('explosion-layout'));
const { decodeModelResponse } = await import(await moduleUrl('model-download'));
const { atlasTools, registerAtlasTools } = await import(await moduleUrl('agent-tools'));
const atlas = JSON.parse(await readFile(new URL('../public/atlas/models/atlas.json', import.meta.url), 'utf8'));
const heart = atlas.concepts.find(concept => concept.id === 'FMA7088');
const index = catalog.buildSearchIndex(atlas);

test('the complete local atlas has valid unique meshes, hierarchy and system membership', () => {
  assert.equal(atlas.parts.length, 2234);
  assert.equal(atlas.concepts.length, 3432);
  const ids = new Set(atlas.parts.map(part => part.id));
  assert.equal(ids.size, atlas.parts.length);
  assert.equal(new Set(atlas.concepts.map(concept => concept.id)).size, atlas.concepts.length);
  for (const part of atlas.parts) {
    assert.ok(SYSTEMS.some(system => system.id === part.system), part.id);
    assert.ok(atlas.chunks[part.chunk], part.id);
    assert.ok(part.vertexCount > 0 && part.indexCount > 0 && part.indexCount % 3 === 0, part.id);
    assert.ok(part.bounds.flat().every(Number.isFinite), part.id);
    for (let axis = 0; axis < 3; axis++) assert.ok(part.bounds[0][axis] <= part.bounds[1][axis], part.id);
  }
  for (const concept of atlas.concepts) {
    assert.ok(concept.elements.length > 0, concept.id);
    assert.ok(concept.elements.every(id => ids.has(id)), concept.id);
  }
  assert.equal(atlas.parts.reduce((sum, part) => sum + part.indexCount / 3, 0), atlas.triangles);
});

test('all 15 geometry chunks decode as gzip or already-decoded HTTP responses and contain valid triangles', async () => {
  for (const [chunkIndex, chunk] of atlas.chunks.entries()) {
    assert.match(chunk.url, /^\/atlas\/models\/body-\d+\.bin$/);
    assert.match(chunk.gzip, /^\/atlas\/models\/body-\d+\.bin\.gz$/);
    const [raw, gzip] = await Promise.all([chunk.url, chunk.gzip].map(path => readFile(new URL(`../public${path}`, import.meta.url))));
    assert.equal(raw.length, chunk.bytes);
    assert.equal(gzip.length, chunk.gzipBytes);
    const decoded = await decodeModelResponse(new Response(gzip), chunk.bytes, true);
    assert.deepEqual(Buffer.from(decoded), raw);
    assert.deepEqual(Buffer.from(await decodeModelResponse(new Response(raw), chunk.bytes, true)), raw);
    assert.deepEqual(Buffer.from(await decodeModelResponse(new Response(raw), chunk.bytes, false)), raw);
    for (const part of atlas.parts.filter(item => item.chunk === chunkIndex)) {
      const positions = new Float32Array(decoded, part.positions, part.vertexCount * 3);
      const normals = new Int16Array(decoded, part.normals, part.vertexCount * 3);
      const indices = new Uint32Array(decoded, part.indices, part.indexCount);
      assert.equal(normals.length, positions.length);
      for (let i = 0; i < positions.length; i++) {
        const position = positions[i], axis = i % 3;
        assert.ok(Number.isFinite(position), `${part.id}: finite position`);
        assert.ok(position >= part.bounds[0][axis] - .00001 && position <= part.bounds[1][axis] + .00001, `${part.id}: bounds`);
      }
      for (const vertex of indices) assert.ok(vertex < part.vertexCount, `${part.id}: vertex index`);
    }
  }
  await assert.rejects(decodeModelResponse(new Response('missing', { status: 404 }), 7, false), /descargar/);
  await assert.rejects(decodeModelResponse(new Response(new Uint8Array(2)), 8, false), /incompleto/);
  await assert.rejects(decodeModelResponse(new Response(new Uint8Array([0x1f, 0x8b, 0])), 8, true));
});

test('search finds Spanish names without accents, original English, concepts and individual mesh IDs', () => {
  assert.equal(catalog.searchCatalog(index, 'corazon')[0].id, 'FMA7088');
  assert.equal(catalog.searchCatalog(index, '  CORAZÓN  ')[0].id, 'FMA7088');
  assert.equal(catalog.searchCatalog(index, 'mitral valve')[0].id, 'FMA7235');
  assert.equal(catalog.searchCatalog(index, 'valvula aortica')[0].id, 'FMA7236');
  assert.equal(catalog.searchCatalog(index, 'FMA7088')[0].id, 'FMA7088');
  assert.deepEqual(catalog.searchCatalog(index, 'fj2428')[0].elements, ['FJ2428']);
  assert.equal(catalog.searchCatalog(index, 'not-a-real-structure').length, 0);
  assert.ok(catalog.searchCatalog(index, '').some(item => item.id === heart.id));
  assert.equal(catalog.displayName('Left femur'), 'Fémur izquierdo');
  assert.equal(catalog.displayName('Right clavicle'), 'Clavícula derecha');
  assert.equal(catalog.displayName('Left 3rd rib'), '3.ª costilla izquierda');
  assert.equal(catalog.displayName('Untranslated source term'), 'Untranslated source term');
});

test('cardiac study retains actual walls, valves and papillary muscles without cerebral ventricles', () => {
  assert.equal(heart.elements.length, 84);
  for (const id of [...catalog.HEART_WALLS, ...catalog.HEART_CAVITIES, 'FJ2418', 'FJ2419', 'FJ2429', 'FJ2430', 'FJ2437']) {
    assert.ok(heart.elements.includes(id), id);
    assert.equal(atlas.parts.find(part => part.id === id).system, 'cardiac');
  }
  const mitral = atlas.concepts.find(concept => concept.id === 'FMA7235');
  assert.deepEqual(mitral.elements, ['FJ2420', 'FJ2432']);
  for (const id of ['FJ1730', 'FJ1731', 'FJ1752', 'FJ1767', 'FJ1814']) {
    assert.equal(atlas.parts.find(part => part.id === id).system, 'nervous');
    assert.ok(!heart.elements.includes(id));
  }
});

test('visibility combines system layers, study area, selection, isolation and hidden pieces', () => {
  const base = catalog.INITIAL_STATE;
  assert.ok(!catalog.visibleParts(atlas, base).some(part => part.system === 'integumentary'));
  const bones = catalog.visibleParts(atlas, { ...base, visible: ['skeletal'] });
  assert.ok(bones.length > 100 && bones.every(part => part.system === 'skeletal'));
  const selected = ['FJ2420', 'FJ2432'];
  const highlighted = catalog.visibleParts(atlas, { ...base, visible: [], selected });
  assert.deepEqual(new Set(highlighted.map(part => part.id)), new Set(selected));
  const scoped = { ...base, scope: heart.elements };
  assert.equal(catalog.visibleParts(atlas, scoped).length, 84);
  const interior = catalog.visibleParts(atlas, { ...scoped, hidden: [...catalog.HEART_WALLS, ...catalog.HEART_CAVITIES] });
  assert.equal(interior.length, 77);
  assert.ok(interior.some(part => part.id === 'FJ2420'));
  assert.deepEqual(catalog.visibleParts(atlas, { ...scoped, selected, isolate: true, hidden: ['FJ2420'] }).map(part => part.id), ['FJ2432']);
  assert.equal(catalog.visibleParts(atlas, { ...base, selected, isolate: true, scope: [] }).length, 0);
  assert.equal(catalog.visibleParts(atlas, { ...base, selected: [], isolate: true }).length, 0);
});

test('hide and restore undo/redo preserve exact state and invalidate future after a new action', () => {
  const first = catalog.changeHidden(catalog.EMPTY_HISTORY, ['FJ2428', 'FJ2428']);
  assert.deepEqual(first.present, ['FJ2428']);
  const second = catalog.changeHidden(first, [...first.present, 'FJ2438']);
  assert.deepEqual(catalog.undoHidden(second).present, first.present);
  assert.deepEqual(catalog.redoHidden(catalog.undoHidden(second)).present, second.present);
  const restored = catalog.changeHidden(second, []);
  assert.deepEqual(catalog.undoHidden(restored).present, second.present);
  const branched = catalog.changeHidden(catalog.undoHidden(second), ['FJ2439']);
  assert.equal(branched.future.length, 0);
  assert.equal(catalog.changeHidden(first, ['FJ2428']), first);
  assert.equal(catalog.undoHidden(catalog.EMPTY_HISTORY), catalog.EMPTY_HISTORY);
  assert.equal(catalog.redoHidden(catalog.EMPTY_HISTORY), catalog.EMPTY_HISTORY);
  assert.deepEqual(catalog.EMPTY_HISTORY, { past: [], present: [], future: [] });
});

test('exploded layout gives every visible mesh its own nonoverlapping cell on mobile and desktop', () => {
  const groups = [atlas.parts, ...SYSTEMS.map(system => atlas.parts.filter(part => part.system === system.id)), atlas.parts.filter(part => heart.elements.includes(part.id))];
  for (const aspect of [.45, 1, 1.8]) for (const group of groups) {
    const layout = createExplosionLayout(group, aspect);
    assert.equal(layout.cells.size, group.length);
    const cells = [...layout.cells.values()];
    for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) {
      const a = cells[i], b = cells[j];
      const overlapX = (a.width + b.width) / 2 - Math.abs(a.x - b.x);
      const overlapY = (a.height + b.height) / 2 - Math.abs(a.y - b.y);
      assert.ok(overlapX < .000001 || overlapY < .000001, `overlap at aspect ${aspect}`);
    }
    for (const part of group) {
      const cell = layout.cells.get(part.id);
      assert.ok(cell.width >= part.bounds[1][0] - part.bounds[0][0]);
      assert.ok(cell.height >= part.bounds[1][1] - part.bounds[0][1]);
    }
  }
  assert.equal(createExplosionLayout([]).cells.size, 0);
});

test('picking distinguishes clicks from drags, canceled touches and two-finger gestures', () => {
  const tap = new PointerTap();
  tap.down(1, 10, 10, 5); assert.equal(tap.up(1, 12, 12), true);
  tap.down(1, 10, 10, 5); tap.move(1, 30, 10); assert.equal(tap.up(1, 10, 10), false);
  tap.down(1, 10, 10, 12); tap.down(2, 30, 10, 12); assert.equal(tap.up(2, 30, 10), false); assert.equal(tap.up(1, 10, 10), false);
  tap.down(1, 10, 10, 12); tap.cancel(1); assert.equal(tap.up(1, 10, 10), false);
  tap.down(1, 10, 10, 12); assert.equal(tap.up(1, 13, 12), true);
});

test('optional browser tools search and select real catalog data, and clean up registration', () => {
  const selections = [];
  const [find, inspect] = atlasTools(atlas, concept => selections.push(concept));
  assert.equal(find.execute({ query: 'corazón' })[0].id, heart.id);
  assert.equal(inspect.execute({ id: 'fma7088' }).selectedPieces, 84);
  assert.equal(selections[0].id, heart.id);
  assert.equal(inspect.execute({ id: 'fj2428' }).selectedPieces, 1);
  assert.throws(() => find.execute({ query: '' }));
  assert.throws(() => inspect.execute({ id: 'missing' }));
  assert.throws(() => inspect.execute(null));
  const registered = [];
  const original = globalThis.document;
  try {
    globalThis.document = {};
    assert.equal(registerAtlasTools(atlas, () => {}), undefined);
    globalThis.document = { modelContext: { registerTool: (tool, options) => registered.push({ tool, options }) } };
    const cleanup = registerAtlasTools(atlas, () => {});
    assert.equal(registered.length, 2);
    assert.equal(registered[0].options.signal.aborted, false);
    cleanup();
    assert.ok(registered.every(item => item.options.signal.aborted));
  } finally { if (original === undefined) delete globalThis.document; else globalThis.document = original; }
});
