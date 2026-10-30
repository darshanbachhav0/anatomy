// Reuse Exploration's atlas buffers. No second set of model assets is generated.
// Only display meshes change: the heart, skin, liver, poses and scan volumes stay intact.
export function meshBounds(meshes, buffer) {
  const bounds = [[Infinity, Infinity, Infinity], [-Infinity, -Infinity, -Infinity]];
  for (const mesh of meshes) {
    const positions = new Float32Array(buffer, mesh.positionOffset, mesh.positionCount);
    positions.forEach((value, index) => {
      const axis = index % 3;
      bounds[0][axis] = Math.min(bounds[0][axis], value);
      bounds[1][axis] = Math.max(bounds[1][axis], value);
    });
  }
  return bounds;
}

export function registration(atlas, original, buffer) {
  // Both models use metres, +Y superior and +Z anterior. Register the shared
  // ventricular envelope, retaining one uniform scale for all surrounding anatomy.
  const source = atlas.parts.find(part => part.id === 'FJ2428').bounds;
  const target = meshBounds(original.meshes.filter(mesh =>
    ['left_ventricle', 'right_ventricle', 'interventricular_septum'].includes(mesh.name)), buffer);
  const size = bounds => bounds[1].map((value, axis) => value - bounds[0][axis]);
  const a = size(source), b = size(target);
  const scale = a.reduce((sum, value, axis) => sum + value * b[axis], 0) /
    a.reduce((sum, value) => sum + value * value, 0);
  const offset = target[0].map((value, axis) =>
    (value + target[1][axis] - scale * (source[0][axis] + source[1][axis])) / 2);
  return { scale, offset };
}

async function readChunk(chunk, fetcher) {
  const compressed = !!chunk.gzip && typeof DecompressionStream !== 'undefined';
  const response = await fetcher(compressed ? chunk.gzip : chunk.url);
  if (!response.ok) throw new Error('No se pudo cargar la anatomía de Exploración. Reintenta la carga.');
  let buffer = await response.arrayBuffer();
  const signature = new Uint8Array(buffer, 0, Math.min(2, buffer.byteLength));
  if (compressed && signature[0] === 0x1f && signature[1] === 0x8b) {
    buffer = await new Response(new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  }
  if (buffer.byteLength !== chunk.bytes) throw new Error('El archivo del atlas está incompleto. Reintenta la carga.');
  return buffer;
}

export async function useExplorationAnatomy([original, buffer, poses], fetcher = fetch) {
  const digest = async data => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)),
    value => value.toString(16).padStart(2, '0')).join('');
  if (await digest(buffer) !== original.binarySHA256) throw new Error('No se pudo verificar la integridad de la anatomía original.');
  const response = await fetcher('/atlas/models/atlas.json');
  if (!response.ok) throw new Error('No se pudo cargar el catálogo de Exploración.');
  const atlas = await response.json();
  const { scale, offset } = registration(atlas, original, buffer);
  const region = meshBounds(original.meshes.filter(mesh => mesh.layer === 'bone'), buffer);
  const systems = new Set(['skeletal', 'arterial', 'venous']);
  const parts = atlas.parts.filter(part => systems.has(part.system) &&
    part.bounds[1][1] * scale + offset[1] >= region[0][1] &&
    part.bounds[0][1] * scale + offset[1] <= region[1][1]);
  const chunks = new Map(await Promise.all([...new Set(parts.map(part => part.chunk))].map(async index =>
    [index, await readChunk(atlas.chunks[index], fetcher)])));
  const meshes = original.meshes.filter(mesh => !['bone', 'vessels'].includes(mesh.layer));
  const blocks = [new Uint8Array(buffer)];
  let byteLength = buffer.byteLength;
  for (const part of parts) {
    const chunk = chunks.get(part.chunk);
    const source = new Float32Array(chunk, part.positions, part.vertexCount * 3);
    const positions = Float32Array.from(source, (value, index) => value * scale + offset[index % 3]);
    const sourceIndices = new Uint32Array(chunk, part.indices, part.indexCount);
    const kept = [];
    // Retain the same torso extent as the simulator, including long vessels that
    // continue into the neck/abdomen. Do not bring the atlas legs into this view.
    for (let index = 0; index < sourceIndices.length; index += 3) {
      const triangle = sourceIndices.subarray(index, index + 3);
      if (triangle.every(vertex => positions[vertex * 3 + 1] >= region[0][1] &&
          positions[vertex * 3 + 1] <= region[1][1])) kept.push(...triangle);
    }
    if (!kept.length) continue;
    const indices = new Uint32Array(kept);
    const bone = part.system === 'skeletal';
    meshes.push({ name: part.id, layer: bone ? 'bone' : 'vessels',
      source: /vertebra/i.test(part.name) ? 'Spine' : 'Exploration',
      positionOffset: byteLength, positionCount: positions.length,
      indexOffset: byteLength + positions.byteLength, indexCount: indices.length,
      color: bone ? [0.85, 0.78, 0.65] : part.system === 'arterial' ? [0.8, 0.345, 0.302] : [0.388, 0.557, 0.686],
      slice: false });
    blocks.push(new Uint8Array(positions.buffer), new Uint8Array(indices.buffer));
    byteLength += positions.byteLength + indices.byteLength;
  }
  const combined = new Uint8Array(byteLength);
  let cursor = 0;
  for (const block of blocks) { combined.set(block, cursor); cursor += block.byteLength; }
  return [{ ...original, displayMeshes: meshes, binarySHA256: await digest(combined.buffer) }, combined.buffer, poses];
}
