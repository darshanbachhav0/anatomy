import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as THREE from "three";
import { repairSurfaceWinding as repairBrainWinding } from "../public/study-atlas/geometry-repair.js";

test("actual brain's mirrored cerebellum and pons face outward on both sides", async () => {
  const buffer = await readFile(new URL("../public/models/brain.glb", import.meta.url));
  const jsonLength = buffer.readUInt32LE(12);
  const document = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString());
  const binary = buffer.subarray(28 + jsonLength);
  const types = { 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
  const sizes = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
  function attribute(accessorIndex) {
    const accessor = document.accessors[accessorIndex];
    const view = document.bufferViews[accessor.bufferView];
    const Type = types[accessor.componentType];
    assert.equal(view.byteStride, undefined);
    const offset = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
    const count = accessor.count * sizes[accessor.type];
    const bytes = Uint8Array.from(binary.subarray(offset, offset + count * Type.BYTES_PER_ELEMENT));
    return new THREE.BufferAttribute(new Type(bytes.buffer), sizes[accessor.type]);
  }
  let repaired = 0;
  const correctedNames = [];
  for (const node of document.nodes.filter((node) => node.mesh !== undefined)) {
    const primitive = document.meshes[node.mesh].primitives[0];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", attribute(primitive.attributes.POSITION));
    geometry.setAttribute("normal", attribute(primitive.attributes.NORMAL));
    geometry.setAttribute("uv", attribute(primitive.attributes.TEXCOORD_0));
    geometry.setAttribute("tangent", attribute(primitive.attributes.TANGENT));
    geometry.setIndex(attribute(primitive.indices));
    const originals = Object.fromEntries(Object.entries(geometry.attributes).map(([key, value]) => [key, value.array.slice()]));
    const oldIndex = geometry.index.array.slice();
    if (repairBrainWinding(geometry)) {
      repaired++;
      correctedNames.push(node.name);
      for (let i = 0; i < oldIndex.length; i += 3) {
        assert.equal(geometry.index.getX(i), oldIndex[i]);
        assert.equal(geometry.index.getX(i + 1), oldIndex[i + 2]);
        assert.equal(geometry.index.getX(i + 2), oldIndex[i + 1]);
      }
    } else {
      assert.deepEqual(geometry.index.array, oldIndex);
    }
    for (const [key, original] of Object.entries(originals)) assert.deepEqual(geometry.attributes[key].array, original, `${node.name}: ${key}`);
    assert.equal(repairBrainWinding(geometry), false, `${node.name}: repair is idempotent`);
  }
  assert.ok(repaired > 0);
  for (const name of ["Cerebellum, anterior lobe, L", "Cerebellum, posterior lobe, L", "Pons, left side", "Medulla oblongata, left side"]) {
    assert.ok(correctedNames.some((corrected) => corrected.startsWith(name)), name);
  }
  assert.ok(!correctedNames.some((name) => name.startsWith("Cerebellum, posterior lobe, R")));
});

test("correctly mirrored geometry is left intact", () => {
  const geometry = new THREE.BoxGeometry();
  const mesh = new THREE.Mesh(geometry);
  mesh.scale.x = -1;
  const indices = geometry.index.array.slice();
  assert.equal(repairBrainWinding(geometry), false);
  assert.deepEqual(geometry.index.array, indices);
});
