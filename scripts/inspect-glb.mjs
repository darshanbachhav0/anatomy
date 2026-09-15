import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const GLB_MAGIC = 0x46546c67;
const JSON_CHUNK = 0x4e4f534a;

function parseGlb(buffer) {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  if (view.getUint32(0, true) !== GLB_MAGIC) throw new Error("El archivo no es un GLB válido.");
  const length = view.getUint32(8, true);
  let offset = 12;
  while (offset < length) {
    const chunkLength = view.getUint32(offset, true);
    const chunkType = view.getUint32(offset + 4, true);
    if (chunkType === JSON_CHUNK) {
      const json = buffer.subarray(offset + 8, offset + 8 + chunkLength).toString("utf8").replace(/\u0000+$/g, "");
      return JSON.parse(json);
    }
    offset += 8 + chunkLength;
  }
  throw new Error("El GLB no contiene un bloque JSON.");
}

function nodeType(node) {
  if (node.mesh !== undefined) return "Mesh";
  if (node.camera !== undefined) return "Camera";
  return "Object3D";
}

function inspect(document) {
  const nodes = document.nodes ?? [];
  const meshes = document.meshes ?? [];
  const materials = document.materials ?? [];
  const accessors = document.accessors ?? [];
  const parents = new Map();
  nodes.forEach((node, parentIndex) => node.children?.forEach((childIndex) => parents.set(childIndex, parentIndex)));

  const meshNodes = nodes
    .map((node, nodeIndex) => ({ node, nodeIndex }))
    .filter(({ node }) => node.mesh !== undefined);

  console.log(`Archivo: ${modelPath}`);
  console.log(`Escenas: ${(document.scenes ?? []).length}`);
  console.log(`Nodos: ${nodes.length}`);
  console.log(`Nodos con malla: ${meshNodes.length}`);
  console.log(`Definiciones de malla: ${meshes.length}`);
  console.log(`Materiales: ${materials.length}`);
  console.log(`Animaciones: ${(document.animations ?? []).length}`);
  console.log(`Extensiones usadas: ${(document.extensionsUsed ?? []).join(", ") || "ninguna"}`);
  console.log("\nJerarquía completa:");

  const roots = new Set((document.scenes ?? []).flatMap((scene) => scene.nodes ?? []));
  const printNode = (index, depth = 0) => {
    const node = nodes[index];
    const mesh = node.mesh === undefined ? null : meshes[node.mesh];
    const parentIndex = parents.get(index);
    const prefix = "  ".repeat(depth);
    console.log(`${prefix}- [${index}] ${node.name || "(sin nombre)"} <${nodeType(node)}> parent=${parentIndex ?? "scene"} children=${(node.children ?? []).join(",") || "-"}`);
    if (mesh) {
      console.log(`${prefix}  mesh[${node.mesh}]=${mesh.name || "(sin nombre)"} primitives=${mesh.primitives.length}`);
      mesh.primitives.forEach((primitive, primitiveIndex) => {
        const positionAccessor = accessors[primitive.attributes?.POSITION];
        const material = primitive.material === undefined ? null : materials[primitive.material];
        const materialLabel = material?.name || (primitive.material ?? "sin material");
        const boundingBox = positionAccessor?.min && positionAccessor?.max
          ? { min: positionAccessor.min, max: positionAccessor.max }
          : null;
        console.log(`${prefix}    primitive[${primitiveIndex}] material=${materialLabel} vertices=${positionAccessor?.count ?? "?"} boundingBox=${JSON.stringify(boundingBox)}`);
      });
    }
    node.children?.forEach((child) => printNode(child, depth + 1));
  };

  roots.forEach((root) => printNode(root));
  console.log("\nResumen de mallas:");
  meshNodes.forEach(({ node, nodeIndex }) => {
    const mesh = meshes[node.mesh];
    const primitiveMaterials = mesh.primitives.map((primitive) => materials[primitive.material]?.name || `material_${primitive.material ?? "none"}`);
    console.log(`- node[${nodeIndex}] ${node.name || "(sin nombre)"} -> mesh[${node.mesh}] ${mesh.name || "(sin nombre)"}; materiales: ${primitiveMaterials.join(", ")}`);
  });
}

const modelPath = resolve(process.argv[2] ?? "public/models/heart.glb");
inspect(parseGlb(await readFile(modelPath)));
