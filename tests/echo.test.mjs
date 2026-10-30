import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";
import { useExplorationAnatomy, registration } from '../public/echo/atlas-anatomy.js';

const root = new URL("../public/echo/", import.meta.url);
const read = (file) => readFile(new URL(file, root), "utf8");
const context = vm.createContext({
  window: {},
  document: { readyState: "loading", addEventListener() {} },
});
vm.runInContext(await read("translations-es.js"), context);
vm.runInContext(await read("uma-es.js"), context);
const translate = (value) => vm.runInContext(`translate(${JSON.stringify(value)})`, context);

test('Exploration display anatomy preserves original scanning meshes and poses', async () => {
  const original = JSON.parse(await read('assets/anatomy.json'));
  const bytes = await readFile(new URL('assets/anatomy.bin', root));
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const poses = JSON.parse(await read('assets/poses.json'));
  const atlas = JSON.parse(await readFile(new URL('../atlas/models/atlas.json', root), 'utf8'));
  const fetcher = async url => new Response(await readFile(new URL(`../${url.slice(1)}`, root)));
  const [manifest, combined, resultPoses] = await useExplorationAnatomy([original, buffer, poses], fetcher);
  assert.equal(resultPoses, poses);
  assert.equal(manifest.meshes, original.meshes);
  assert.deepEqual(new Uint8Array(combined, 0, buffer.byteLength), new Uint8Array(buffer));
  const retained = original.meshes.filter(mesh => !['bone', 'vessels'].includes(mesh.layer));
  assert.deepEqual(manifest.displayMeshes.slice(0, retained.length), retained);
  const atlasIds = new Set(atlas.parts.map(part => part.id));
  const additions = manifest.displayMeshes.slice(retained.length);
  assert.ok(additions.length > 100);
  assert.ok(additions.every(mesh => atlasIds.has(mesh.name)));
  assert.ok(additions.some(mesh => mesh.layer === 'bone'));
  assert.ok(additions.some(mesh => mesh.layer === 'vessels'));
  const transform = registration(atlas, original, buffer);
  assert.ok(transform.scale > .9 && transform.scale < 1.2);
  assert.ok(transform.offset[1] < -.7 && transform.offset[1] > -1.1);
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', combined)), n => n.toString(16).padStart(2, '0')).join('');
  assert.equal(manifest.binarySHA256, hash);
  await assert.rejects(useExplorationAnatomy([original, new ArrayBuffer(buffer.byteLength), poses], fetcher), /integridad/);
});

test('removed about box does not remain in either echo page', async () => {
  for (const page of ['index.html', 'calculators/index.html']) {
    assert.doesNotMatch(await read(page), /id="about"|id="about-button"|Explora la ecocardiografía\./);
  }
});

test("Spanish localization is idempotent, including translated English prefixes", () => {
  for (const text of ["Volume", "Cancel", "Reference view", "Clear", "Ejection fraction", "Body surface area"]) {
    const spanish = translate(text);
    assert.notEqual(spanish, text);
    assert.equal(translate(spanish), spanish);
  }
  assert.equal(translate("Volume: 50 ml"), "Volumen: 50 ml");
  assert.equal(translate("Volumen: 50 ml"), "Volumen: 50 ml");
  assert.equal(translate("Slide toward the patient’s left"), "Desliza hacia la izquierda del paciente");
});

test("dynamic simulation descriptions and core controls are Spanish", () => {
  const text = translate("Live practice: simulated echo image at 22.00 centimetres. Rotation 25.0 degrees, fan 0.0 degrees, rock 0.0 degrees.");
  assert.match(text, /imagen ecográfica simulada a 22.00 centímetros/);
  assert.match(text, /Rotación 25.0 grados, inclinación 0.0 grados, balanceo 0.0 grados/);
  assert.equal(translate("Skip"), "Omitir");
  assert.equal(translate("LVOT diameter"), "Diámetro del TSVI");
});

test("standalone pages use local routes, UMA assets and no upstream analytics", async () => {
  for (const page of ["index.html", "calculators/index.html"]) {
    const html = await read(page);
    assert.match(html, /lang="es-PE"/);
    assert.match(html, /href="\/echo\/index.html"/);
    assert.match(html, /href="\/echo\/calculators\/index.html"/);
    assert.match(html, /\/echo\/translations-es.js/);
    assert.match(html, /\/echo\/uma.css/);
    assert.match(html, />Calculadoras<\/a>/);
    assert.match(html, /aria-label="Espacio de trabajo"/);
    assert.doesNotMatch(html, />Probe Lab<|>Calculators<|aria-label="Switch to dark mode"/);
    assert.doesNotMatch(html, /src="[^"]*usage-analytics/);
    assert.doesNotMatch(html, /href="\/echo\/(?:calculators\/)?"/);
  }
});

test("original anatomy, volumetric shader and required attribution are bundled", async () => {
  for (const file of ["assets/anatomy.bin", "assets/anatomy.json", "assets/sim/HeartVolume.png", "assets/sim/VesselVolume.png", "assets/sim/AorticTrial.rgba", "assets/sim/bmode.frag", "assets/credits.json", "assets/ATTRIBUTION.txt"]) {
    assert.ok((await stat(new URL(file, root))).size > 100, file);
  }
  const poses = JSON.parse(await read("assets/poses.json"));
  assert.equal(poses.views.length, 15);
  const media = JSON.parse(await read("assets/media/catalog.json"));
  assert.equal(media.clips.length, 15);
  for (const clip of media.clips) {
    assert.ok(clip.attribution.creator);
    assert.ok(clip.attribution.license);
    assert.ok((await stat(new URL(clip.url, root))).size > 1000, clip.url);
  }
});

test("calculator search indexes translated names without changing equations", async () => {
  const source = await read("assets/main-C-2WEaYv.js");
  assert.match(source, /window\.UMA_ECHO_TRANSLATIONS\?\.\[r\]/);
});
