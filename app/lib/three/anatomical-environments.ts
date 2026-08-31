import * as THREE from "three";
import type { OrganId } from "../anatomy-data";

type EnvironmentProfile = {
  secondary: number;
  build: (group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) => void;
};

export type AnatomicalEnvironment = {
  group: THREE.Group;
  materials: Array<{ material: THREE.Material; opacity: number }>;
};

const WINE = new THREE.Color(0x470c28);

const ENVIRONMENTS: Record<OrganId, EnvironmentProfile> = {
  heart: { secondary: 0x5984bd, build: buildVascularEnvironment },
  brain: { secondary: 0xd6a5c4, build: buildNeuralEnvironment },
  lungs: { secondary: 0x6f9fc5, build: buildAlveolarEnvironment },
  liver: { secondary: 0xd3a162, build: buildLobularEnvironment },
  kidneys: { secondary: 0x6f91bc, build: buildNephronEnvironment },
  eyeball: { secondary: 0x4f9bc5, build: buildOpticalEnvironment },
  intestine: { secondary: 0x9a72ad, build: buildIntestinalEnvironment },
  pancreas: { secondary: 0xd7a254, build: buildAcinarEnvironment },
  skin: { secondary: 0xd79a7b, build: buildDermalEnvironment },
};

/** Builds a subtle organ-specific anatomical world behind the interactive model. */
export function createAnatomicalEnvironment(organId: OrganId, accentHex: string): AnatomicalEnvironment {
  const profile = ENVIRONMENTS[organId];
  const accent = new THREE.Color(accentHex);
  const secondary = new THREE.Color(profile.secondary);
  const group = new THREE.Group();
  group.name = `environment-${organId}`;

  addClinicalChamber(group, accent, secondary);
  profile.build(group, accent, secondary);

  const materials: AnatomicalEnvironment["materials"] = [];
  const seen = new Set<THREE.Material>();
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points)) return;
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.forEach((material) => {
      if (seen.has(material)) return;
      seen.add(material);
      materials.push({ material, opacity: material.opacity });
    });
  });

  return { group, materials };
}

export function setAnatomicalEnvironmentOpacity(environment: AnatomicalEnvironment, strength: number) {
  environment.materials.forEach(({ material, opacity }) => {
    material.opacity = opacity * strength;
  });
}

export function disposeAnatomicalEnvironment(environment: AnatomicalEnvironment) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  environment.group.traverse((object) => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points)) return;
    geometries.add(object.geometry);
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.forEach((material) => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  environment.group.removeFromParent();
}

function addClinicalChamber(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  const backdrop = new THREE.Mesh(
    new THREE.CircleGeometry(5.2, 72),
    basic(accent.clone().lerp(new THREE.Color(0xffffff), 0.78), 0.13),
  );
  backdrop.position.set(0, 0.15, -3.75);
  group.add(backdrop);

  const haloMaterial = basic(WINE, 0.07);
  [3.15, 3.75, 4.35].forEach((radius, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 6, 96), haloMaterial);
    ring.position.set(0, 0.15, -3.62 - index * 0.015);
    group.add(ring);
  });

  const floorRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.75, 0.018, 7, 96),
    basic(secondary, 0.16),
  );
  floorRing.rotation.x = Math.PI / 2;
  floorRing.position.set(0, -2.31, -0.25);
  group.add(floorRing);
}

function buildVascularEnvironment(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  const random = seededRandom(11);
  for (let index = 0; index < 12; index += 1) {
    const side = index % 2 ? 1 : -1;
    const startY = -1.75 + random() * 1.2;
    addTube(group, [
      new THREE.Vector3(side * 0.22, startY, -3.05),
      new THREE.Vector3(side * (0.7 + random() * 0.3), startY + 0.7, -3.12),
      new THREE.Vector3(side * (1.45 + random() * 0.45), startY + 1.25, -3.18),
      new THREE.Vector3(side * (2.4 + random() * 0.45), startY + 1.7 + random() * 1.4, -3.22),
    ], index % 3 === 0 ? secondary : accent, 0.024 + random() * 0.018, 0.23);
  }
  addParticles(group, accent, 38, 4.9, 3.7, -2.7, 0.018, 0.22, 21);
}

function buildNeuralEnvironment(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  const random = seededRandom(29);
  const nodes: THREE.Vector3[] = [];
  while (nodes.length < 30) {
    const x = (random() - 0.5) * 5.7;
    const y = (random() - 0.5) * 3.8;
    if ((x * x) / 8.2 + (y * y) / 3.8 < 1) nodes.push(new THREE.Vector3(x, y + 0.2, -3.12 - random() * 0.2));
  }
  const nodeGeometry = new THREE.SphereGeometry(0.055, 10, 8);
  const nodeMaterial = standard(accent, 0.28, 0.45);
  nodes.forEach((position, index) => {
    const node = new THREE.Mesh(nodeGeometry, index % 4 === 0 ? standard(secondary, 0.32, 0.38) : nodeMaterial);
    node.position.copy(position);
    group.add(node);
  });
  const segments: number[] = [];
  nodes.forEach((node, index) => {
    for (let offset = 1; offset <= 2; offset += 1) {
      const target = nodes[(index + offset * 5) % nodes.length];
      if (node.distanceTo(target) > 2.2) continue;
      segments.push(node.x, node.y, node.z, target.x, target.y, target.z);
    }
  });
  addLineSegments(group, segments, secondary, 0.2);
}

function buildAlveolarEnvironment(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  const random = seededRandom(43);
  [-1, 1].forEach((side) => {
    addTube(group, [
      new THREE.Vector3(0, 1.75, -3.3),
      new THREE.Vector3(side * 0.45, 0.8, -3.24),
      new THREE.Vector3(side * 1.25, 0.15, -3.18),
      new THREE.Vector3(side * 2.15, -0.35, -3.12),
    ], secondary, 0.04, 0.22);
    for (let index = 0; index < 18; index += 1) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.18 + random() * 0.12, 14, 10),
        standard(index % 4 === 0 ? secondary : accent, 0.08, 0.28, true),
      );
      sphere.position.set(side * (1.25 + random() * 1.35), -1.25 + random() * 2.7, -3.05 - random() * 0.35);
      group.add(sphere);
    }
  });
}

function buildLobularEnvironment(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  const sharedFill = basic(accent, 0.065);
  const sharedEdge = new THREE.LineBasicMaterial({ color: secondary, transparent: true, opacity: 0.2, depthWrite: false });
  for (let row = -2; row <= 2; row += 1) {
    for (let column = -3; column <= 3; column += 1) {
      const x = column * 0.74 + (row % 2 ? 0.37 : 0);
      const y = row * 0.66 + 0.15;
      const geometry = new THREE.CircleGeometry(0.41, 6);
      const cell = new THREE.Mesh(geometry, sharedFill);
      cell.position.set(x, y, -3.16);
      group.add(cell);
      const outline = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), sharedEdge);
      outline.position.copy(cell.position);
      group.add(outline);
    }
  }
}

function buildNephronEnvironment(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  [-1, 1].forEach((side, sideIndex) => {
    for (let strand = 0; strand < 4; strand += 1) {
      const points: THREE.Vector3[] = [];
      for (let index = 0; index <= 22; index += 1) {
        const t = index / 22;
        points.push(new THREE.Vector3(
          side * (1.25 + strand * 0.34) + Math.sin(t * Math.PI * 4 + strand) * 0.18,
          1.8 - t * 3.5,
          -3.05 - sideIndex * 0.07,
        ));
      }
      addTube(group, points, strand % 2 ? secondary : accent, 0.018, 0.18);
    }
    const glomerulus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.32, 2),
      standard(accent, 0.1, 0.38, true),
    );
    glomerulus.position.set(side * 2.12, 1.62, -3.05);
    group.add(glomerulus);
  });
}

function buildOpticalEnvironment(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  [0.72, 1.15, 1.65, 2.15, 2.72].forEach((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, index === 2 ? 0.035 : 0.018, 7, 96),
      basic(index % 2 ? secondary : accent, 0.12 + index * 0.018),
    );
    ring.position.set(0, 0.12, -3.12 - index * 0.02);
    group.add(ring);
  });
  const rays: number[] = [];
  for (let index = 0; index < 48; index += 1) {
    const angle = (index / 48) * Math.PI * 2;
    rays.push(
      Math.cos(angle) * 0.78, Math.sin(angle) * 0.78 + 0.12, -3.2,
      Math.cos(angle) * 2.65, Math.sin(angle) * 2.65 + 0.12, -3.2,
    );
  }
  addLineSegments(group, rays, secondary, 0.12);
}

function buildIntestinalEnvironment(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  for (let row = 0; row < 5; row += 1) {
    const points: THREE.Vector3[] = [];
    for (let index = 0; index <= 34; index += 1) {
      const t = index / 34;
      points.push(new THREE.Vector3(
        -2.75 + t * 5.5,
        1.5 - row * 0.74 + Math.sin(t * Math.PI * 6 + row * 0.8) * 0.28,
        -3.12 - row * 0.025,
      ));
    }
    addTube(group, points, row % 2 ? secondary : accent, 0.035, 0.16);
  }
  addParticles(group, secondary, 46, 5.3, 3.7, -2.75, 0.015, 0.18, 71);
}

function buildAcinarEnvironment(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  const random = seededRandom(89);
  const geometry = new THREE.SphereGeometry(0.105, 10, 8);
  const material = standard(accent, 0.16, 0.58);
  const clusters = new THREE.InstancedMesh(geometry, material, 52);
  const transform = new THREE.Object3D();
  for (let index = 0; index < 52; index += 1) {
    const t = index / 51;
    transform.position.set(-2.7 + t * 5.4 + (random() - 0.5) * 0.48, 1.15 - t * 2.1 + (random() - 0.5) * 0.72, -3.08 - random() * 0.28);
    transform.scale.setScalar(0.65 + random() * 0.8);
    transform.updateMatrix();
    clusters.setMatrixAt(index, transform.matrix);
  }
  group.add(clusters);
  addTube(group, [
    new THREE.Vector3(-2.8, 1.25, -3.25),
    new THREE.Vector3(-1.2, 0.65, -3.2),
    new THREE.Vector3(0.4, 0.05, -3.16),
    new THREE.Vector3(2.75, -1.0, -3.12),
  ], secondary, 0.035, 0.2);
}

function buildDermalEnvironment(group: THREE.Group, accent: THREE.Color, secondary: THREE.Color) {
  const layers = [
    { y: 1.05, height: 0.55, color: secondary, opacity: 0.09 },
    { y: 0.15, height: 0.92, color: accent, opacity: 0.075 },
    { y: -1.1, height: 1.22, color: new THREE.Color(0xe6b45e), opacity: 0.07 },
  ];
  layers.forEach((layer) => {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5.8, layer.height), basic(layer.color, layer.opacity));
    plane.position.set(0, layer.y, -3.2);
    group.add(plane);
  });
  for (let index = -3; index <= 3; index += 1) {
    addTube(group, [
      new THREE.Vector3(index * 0.78, 1.8, -3.02),
      new THREE.Vector3(index * 0.78 + 0.08, 0.6, -3.06),
      new THREE.Vector3(index * 0.78 + 0.2, -0.45, -3.1),
      new THREE.Vector3(index * 0.78 - 0.05, -1.7, -3.12),
    ], index % 2 ? secondary : accent, 0.018, 0.16);
  }
  addParticles(group, new THREE.Color(0xe6b45e), 34, 5.2, 1.2, -2.85, 0.025, 0.15, 101, -1.05);
}

function addTube(group: THREE.Group, points: THREE.Vector3[], color: THREE.Color, radius: number, opacity: number) {
  const curve = new THREE.CatmullRomCurve3(points);
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, Math.max(24, points.length * 3), radius, 6, false),
    standard(color, opacity, 0.48),
  );
  group.add(mesh);
}

function addParticles(
  group: THREE.Group,
  color: THREE.Color,
  count: number,
  width: number,
  height: number,
  z: number,
  size: number,
  opacity: number,
  seed: number,
  centerY = 0.15,
) {
  const random = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (random() - 0.5) * width;
    positions[index * 3 + 1] = centerY + (random() - 0.5) * height;
    positions[index * 3 + 2] = z - random() * 0.45;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  group.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color, size, transparent: true, opacity, depthWrite: false })));
}

function addLineSegments(group: THREE.Group, positions: number[], color: THREE.Color, opacity: number) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  group.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false })));
}

function basic(color: THREE.Color, opacity: number) {
  return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
}

function standard(color: THREE.Color, opacity: number, roughness: number, wireframe = false) {
  return new THREE.MeshStandardMaterial({ color, transparent: true, opacity, depthWrite: false, roughness, metalness: 0, wireframe, side: THREE.DoubleSide });
}

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}
