// Reproducible asset import; source: ashemag/human-atlas, MIT / BodyParts3D CC BY 4.0.
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

const source = resolve(process.argv[2] ?? '.atlas-reference');
const destination = resolve('public/atlas/models');
const atlas = JSON.parse(await readFile(resolve(source, 'public/models/atlas.json'), 'utf8'));
await mkdir(destination, { recursive: true });
for (const chunk of atlas.chunks) {
  for (const key of ['url', 'gzip']) {
    if (!chunk[key]) continue;
    const filename = basename(chunk[key]);
    await copyFile(resolve(source, 'public/models', filename), resolve(destination, filename));
    chunk[key] = `/atlas/models/${filename}`;
  }
}

// The source grouping matches the word "ventricle", including brain ventricles.
const brainVentricles = new Set(['FJ1730', 'FJ1731', 'FJ1752', 'FJ1767', 'FJ1814']);
const papillaryMuscles = new Set(['FJ2418', 'FJ2419', 'FJ2429', 'FJ2430', 'FJ2437']);
for (const part of atlas.parts) {
  if (brainVentricles.has(part.id)) part.system = 'nervous';
  if (papillaryMuscles.has(part.id)) part.system = 'cardiac';
}
// Keep the mitral concept limited to its two modeled leaflets. The upstream
// membership also included two aortic cusps under this concept.
atlas.concepts.find(concept => concept.id === 'FMA7235').elements = ['FJ2420', 'FJ2432'];
const heart = atlas.concepts.find(concept => concept.id === 'FMA7088');
if (!heart.elements.includes('FJ2428')) heart.elements.push('FJ2428');
await writeFile(resolve(destination, 'atlas.json'), JSON.stringify(atlas));
console.log(`Imported ${atlas.parts.length} meshes, ${atlas.concepts.length} concepts and ${atlas.chunks.length} local geometry chunks.`);
