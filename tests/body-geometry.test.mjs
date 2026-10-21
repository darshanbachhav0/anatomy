import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import * as THREE from 'three';
import { repairSurfaceWinding } from '../public/study-atlas/geometry-repair.js';

test('full-body muscle and skin halves use matching outward-facing triangles', async () => {
  const root = new URL('../public/study-atlas/', import.meta.url);
  const parts = JSON.parse(await readFile(new URL('data/parts.json', root), 'utf8'));
  const buffer = Buffer.concat(await Promise.all(parts['atlas/conjuntos/level1/4420_component.glb'].map(path => readFile(new URL(path, root)))));
  const length = buffer.readUInt32LE(12);
  const doc = JSON.parse(buffer.subarray(20, 20 + length));
  const binary = buffer.subarray(28 + length);
  const constructors = {5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array};
  const sizes = {SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4};
  const attribute = id => {
    const accessor = doc.accessors[id], view = doc.bufferViews[accessor.bufferView], Type = constructors[accessor.componentType];
    assert.equal(view.byteStride, undefined);
    const start = (view.byteOffset || 0) + (accessor.byteOffset || 0);
    const bytes = Uint8Array.from(binary.subarray(start, start + accessor.count * sizes[accessor.type] * Type.BYTES_PER_ELEMENT));
    return new THREE.BufferAttribute(new Type(bytes.buffer), sizes[accessor.type]);
  };
  const expected = new Map([
    ['Trapezius, L', true], ['Trapezius, R', false],
    ['Gluteus maximus, L', true], ['Gluteus maximus, R', false],
    ['Latissimus dorsi, L', true], ['Latissimus dorsi, R', false],
    ['Deltoid, posterior head, L', true], ['Deltoid, posterior head, R', false],
    ['Male (skin) torso, L', false], ['Male (skin) torso, R', true],
    ['Female (skin) head, L', false], ['Female (skin) head, R', true],
  ]);
  let checked = 0;
  for (const node of doc.nodes) {
    const name = node.name?.split('#')[0];
    if (!expected.has(name) || node.mesh === undefined) continue;
    const primitive = doc.meshes[node.mesh].primitives[0];
    const geometry = new THREE.BufferGeometry();
    for (const [key, field] of [['position','POSITION'],['normal','NORMAL'],['uv','TEXCOORD_0']]) geometry.setAttribute(key, attribute(primitive.attributes[field]));
    geometry.setIndex(attribute(primitive.indices));
    const original = Object.fromEntries(Object.entries(geometry.attributes).map(([key,value]) => [key,value.array.slice()]));
    assert.equal(repairSurfaceWinding(geometry), expected.get(name), name);
    assert.equal(repairSurfaceWinding(geometry), false, `${name}: stable on reuse`);
    for (const [key,array] of Object.entries(original)) assert.deepEqual(geometry.attributes[key].array, array, `${name}: preserves ${key}`);
    // Face normals and supplied vertex normals now agree for both sides.
    const p=geometry.attributes.position,n=geometry.attributes.normal,ix=geometry.index;
    let agreeing=0,opposing=0;
    for(let i=0;i<ix.count;i+=3){
      const a=new THREE.Vector3().fromBufferAttribute(p,ix.getX(i));
      const b=new THREE.Vector3().fromBufferAttribute(p,ix.getX(i+1));
      const c=new THREE.Vector3().fromBufferAttribute(p,ix.getX(i+2));
      const normal=new THREE.Vector3().fromBufferAttribute(n,ix.getX(i));
      const dot=b.sub(a).cross(c.sub(a)).dot(normal);
      if(dot>=0)agreeing+=dot;else opposing-=dot;
    }
    assert.ok(agreeing>19*opposing, `${name}: outward surface`);
    checked++;
  }
  assert.equal(checked, expected.size);
});
