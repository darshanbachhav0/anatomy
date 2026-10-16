import * as THREE from "three";

/** The brain export contains overlapping caps where its anatomical parts meet.
 * Give each part a stable depth tie-breaker without moving its geometry. Shared
 * GLTF materials must be cloned or every part would receive the same offset. */
export function stabilizeBrainDepth(meshes: THREE.Mesh[]) {
  meshes.forEach((mesh, index) => {
    const prepare = (source: THREE.Material) => {
      const material = source.clone();
      material.polygonOffset = true;
      material.polygonOffsetFactor = 0;
      material.polygonOffsetUnits = -2 * (index + 1);
      return material;
    };
    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(prepare)
      : prepare(mesh.material);
  });
}

/** The fade's depth pass must use the same bias as its visible surface. */
export function createOrganDepthMaterial(source: THREE.Material) {
  return new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: true,
    depthTest: true,
    side: source.side,
    clippingPlanes: source.clippingPlanes,
    polygonOffset: source.polygonOffset,
    polygonOffsetFactor: source.polygonOffsetFactor,
    polygonOffsetUnits: source.polygonOffsetUnits,
  });
}
