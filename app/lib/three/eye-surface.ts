import * as THREE from "three";

/** Local repair for the false pupil recess in the supplied, quantized eye mesh.
 * Coordinates are in the GLB's original normalized mesh space, before fitting.
 * The quadratic follows the intact sclera surrounding the recess. */
export function repairEyeSurface(mesh: THREE.Mesh) {
  const geometry = mesh.geometry;
  if (geometry.userData.eyeSurfaceRepaired) return;
  const source = geometry.getAttribute("position");
  const oldNormals = geometry.getAttribute("normal");
  const positions = new Float32Array(source.count * 3);
  const normals = new Float32Array(source.count * 3);
  const weights = new Float32Array(source.count);
  const donor = new Float32Array(source.count * 2);
  const normal = new THREE.Vector3();
  for (let i = 0; i < source.count; i++) {
    const x = source.getX(i), y = source.getY(i), z = source.getZ(i);
    const radius = Math.hypot(y - 0.02, z - 0.07);
    const weight = x < -0.7 ? 1 - THREE.MathUtils.smoothstep(radius, 0.17, 0.28) : 0;
    const surface = -1.00179789 + 0.00938291 * y - 0.11768274 * z
      + 0.73284189 * y * y - 0.00610175 * y * z + 0.62199111 * z * z;
    positions.set([THREE.MathUtils.lerp(x, surface, weight), y, z], i * 3);
    normal.set(-1, 0.00938291 + 1.46568378 * y - 0.00610175 * z,
      -0.11768274 - 0.00610175 * y + 1.24398222 * z).normalize();
    normal.set(
      THREE.MathUtils.lerp(oldNormals.getX(i), normal.x, weight),
      THREE.MathUtils.lerp(oldNormals.getY(i), normal.y, weight),
      THREE.MathUtils.lerp(oldNormals.getZ(i), normal.z, weight),
    ).normalize();
    normals.set(normal.toArray(), i * 3);
    weights[i] = weight;
    // Sample an intact sclera island continuously across the old UV seam.
    donor.set([0.65 + z * 0.12, 0.27 + y * 0.12], i * 2);
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("eyeRepairWeight", new THREE.BufferAttribute(weights, 1));
  geometry.setAttribute("eyeRepairUv", new THREE.BufferAttribute(donor, 2));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData.eyeSurfaceRepaired = true;

  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const material of materials) {
    if (!(material instanceof THREE.MeshStandardMaterial)) continue;
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = "attribute float eyeRepairWeight; attribute vec2 eyeRepairUv; varying float vEyeRepair; varying vec2 vEyeRepairUv;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>",
        "#include <begin_vertex>\nvEyeRepair = eyeRepairWeight; vEyeRepairUv = eyeRepairUv;");
      shader.fragmentShader = "varying float vEyeRepair; varying vec2 vEyeRepairUv;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>",
        "#include <map_fragment>\n#ifdef USE_MAP\ndiffuseColor.rgb = mix(diffuseColor.rgb, diffuse * texture2D(map, vEyeRepairUv).rgb, vEyeRepair);\n#endif");
      shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_maps>",
        "vec3 eyeSmoothNormal = normal;\n#include <normal_fragment_maps>\nnormal = normalize(mix(normal, eyeSmoothNormal, vEyeRepair));");
      shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, roughness, vEyeRepair);");
    };
    material.customProgramCacheKey = () => "eye-sclera-repair-v1";
    material.needsUpdate = true;
  }
}
