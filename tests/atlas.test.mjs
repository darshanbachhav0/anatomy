import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import test from 'node:test';

// These shared assets remain in use by public/echo/atlas-anatomy.js.
const atlas = JSON.parse(await readFile(new URL('../public/atlas/models/atlas.json', import.meta.url), 'utf8'));
const systems = new Set(['skeletal', 'sensory', 'nervous', 'connective', 'muscular', 'arterial', 'endocrine', 'venous', 'digestive', 'cardiac', 'respiratory', 'lymphatic', 'integumentary', 'reproductive', 'urinary']);

test('shared anatomy catalog has valid meshes, hierarchy and registration landmarks', () => {
  assert.equal(atlas.parts.length, 2234);
  assert.equal(atlas.concepts.length, 3432);
  assert.equal(atlas.chunks.length, 15);
  const ids = new Set(atlas.parts.map(part => part.id));
  assert.equal(ids.size, atlas.parts.length);
  assert.equal(new Set(atlas.concepts.map(concept => concept.id)).size, atlas.concepts.length);
  assert.ok(ids.has('FJ2428'), 'Echo registration requires the ventricular envelope');
  for (const part of atlas.parts) {
    assert.ok(systems.has(part.system), part.id);
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

test('all shared geometry chunks retain matching gzip and raw data with valid triangles', async () => {
  for (const [chunkIndex, chunk] of atlas.chunks.entries()) {
    assert.match(chunk.url, /^\/atlas\/models\/body-\d+\.bin$/);
    assert.match(chunk.gzip, /^\/atlas\/models\/body-\d+\.bin\.gz$/);
    const [raw, gzip] = await Promise.all([chunk.url, chunk.gzip].map(file => readFile(new URL(`../public${file}`, import.meta.url))));
    assert.equal(raw.length, chunk.bytes);
    assert.equal(gzip.length, chunk.gzipBytes);
    assert.deepEqual(gunzipSync(gzip), raw);
    const buffer = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
    for (const part of atlas.parts.filter(part => part.chunk === chunkIndex)) {
      const positions = new Float32Array(buffer, part.positions, part.vertexCount * 3);
      const normals = new Int16Array(buffer, part.normals, part.vertexCount * 3);
      const indices = new Uint32Array(buffer, part.indices, part.indexCount);
      assert.equal(normals.length, positions.length);
      for (let index = 0; index < positions.length; index++) {
        const value = positions[index], axis = index % 3;
        assert.ok(Number.isFinite(value), `${part.id}: finite position`);
        assert.ok(value >= part.bounds[0][axis] - .00001 && value <= part.bounds[1][axis] + .00001, `${part.id}: bounds`);
      }
      for (const vertex of indices) assert.ok(vertex < part.vertexCount, `${part.id}: vertex index`);
    }
  }
});
