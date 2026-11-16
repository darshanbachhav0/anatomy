import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { repairEyeSurface } from "../app/lib/three/eye-surface.ts";

test("actual eye recess becomes continuous sclera without moving the iris or other structures", async () => {
  await MeshoptDecoder.ready;
  const file = await readFile(new URL("../public/models/eyeball.glb", import.meta.url));
  const length = file.readUInt32LE(12);
  const gltf = JSON.parse(file.subarray(20, 20 + length));
  const bin = file.subarray(28 + length);
  const geometry = new THREE.BufferGeometry();
  for (const [semantic, index] of Object.entries(gltf.meshes[0].primitives[0].attributes)) {
    const accessor = gltf.accessors[index];
    const compression = gltf.bufferViews[accessor.bufferView].extensions.EXT_meshopt_compression;
    const bytes = new Uint8Array(compression.count * compression.byteStride);
    MeshoptDecoder.decodeGltfBuffer(bytes, compression.count, compression.byteStride,
      bin.subarray(compression.byteOffset, compression.byteOffset + compression.byteLength), compression.mode, compression.filter);
    const Type = { 5120: Int8Array, 5122: Int16Array, 5123: Uint16Array }[accessor.componentType];
    const data = new THREE.InterleavedBuffer(new Type(bytes.buffer), compression.byteStride / Type.BYTES_PER_ELEMENT);
    geometry.setAttribute({POSITION: "position", NORMAL: "normal", TEXCOORD_0: "uv"}[semantic],
      new THREE.InterleavedBufferAttribute(data, accessor.type === "VEC2" ? 2 : 3, 0, true));
  }
  const source = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  repairEyeSurface(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial()));
  const positions = geometry.getAttribute("position");
  const weights = geometry.getAttribute("eyeRepairWeight");
  let filled = 0, untouched = 0;
  for (let i = 0; i < source.count; i++) {
    const x = source.getX(i), y = source.getY(i), z = source.getZ(i);
    assert.ok(Number.isFinite(positions.getX(i)));
    assert.ok(Math.abs(positions.getY(i) - y) < 1e-7);
    assert.ok(Math.abs(positions.getZ(i) - z) < 1e-7);
    if (weights.getX(i) === 0) {
      assert.ok(Math.abs(positions.getX(i) - x) < 1e-7);
      untouched++;
    } else if (weights.getX(i) === 1) {
      // The original false pupil is recessed to x≈-0.82; intact sclera is x≈-1.
      assert.ok(positions.getX(i) < -0.96);
      if (x > -0.9) filled++;
    }
  }
  assert.ok(filled > 100, "repair must fill the actual recessed vertices");
  assert.ok(untouched > source.count * 0.95, "repair must remain local");
  assert.equal(geometry.getAttribute("uv"), uv);
  repairEyeSurface(new THREE.Mesh(geometry));
  assert.equal(geometry.getAttribute("position"), positions, "cached meshes are not repaired twice");
});
