import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as THREE from "three";
import ts from "typescript";

const source = await readFile(new URL("../app/lib/three/brain-depth.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
});
const moduleSource = outputText.replace('from "three"', `from "${import.meta.resolve("three")}"`);
const { stabilizeBrainDepth, createOrganDepthMaterial } = await import(
  `data:text/javascript;base64,${Buffer.from(moduleSource).toString("base64")}`
);

test("brain parts sharing exported materials have distinct depth priorities without changing geometry", async () => {
  const buffer = await readFile(new URL("../public/models/brain.glb", import.meta.url));
  const document = JSON.parse(buffer.subarray(20, 20 + buffer.readUInt32LE(12)).toString());
  const originals = document.materials.map(() => new THREE.MeshStandardMaterial());
  const texture = new THREE.Texture();
  originals.forEach((material) => { material.map = texture; });
  const meshes = document.nodes.filter((node) => node.mesh !== undefined).map((node) => {
    const primitive = document.meshes[node.mesh].primitives[0];
    const mesh = new THREE.Mesh(new THREE.BufferGeometry(), originals[primitive.material]);
    mesh.name = node.name;
    return mesh;
  });
  assert.equal(meshes.length, 132);
  const geometry = meshes.map((mesh) => mesh.geometry);
  stabilizeBrainDepth(meshes);
  assert.equal(new Set(meshes.map((mesh) => mesh.material.polygonOffsetUnits)).size, meshes.length);
  meshes.forEach((mesh, index) => {
    assert.equal(mesh.geometry, geometry[index]);
    assert.deepEqual(mesh.position.toArray(), [0, 0, 0]);
    assert.equal(mesh.material.map, texture);
    assert.equal(mesh.material.depthWrite, true);
    assert.equal(mesh.material.depthTest, true);
    assert.equal(mesh.material.polygonOffset, true);
    assert.equal(mesh.material.polygonOffsetFactor, 0);
    assert.ok(!originals.includes(mesh.material));
  });
  originals.forEach((material) => assert.equal(material.polygonOffset, false));
});

test("fade depth pass matches the biased surface and section plane", () => {
  const source = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), [source, source]);
  stabilizeBrainDepth([mesh]);
  const plane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
  for (const material of mesh.material) {
    material.clippingPlanes = [plane];
    const depth = createOrganDepthMaterial(material);
    assert.equal(depth.colorWrite, false);
    assert.equal(depth.transparent, false);
    for (const key of ["side", "depthWrite", "depthTest", "polygonOffset", "polygonOffsetFactor", "polygonOffsetUnits", "clippingPlanes"]) {
      assert.equal(depth[key], material[key], key);
    }
  }
  assert.equal(createOrganDepthMaterial(source).polygonOffset, false);
});
