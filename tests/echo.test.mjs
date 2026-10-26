import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const root = new URL("../public/echo/", import.meta.url);
const read = (file) => readFile(new URL(file, root), "utf8");
const context = vm.createContext({
  window: {},
  document: { readyState: "loading", addEventListener() {} },
});
vm.runInContext(await read("translations-es.js"), context);
vm.runInContext(await read("uma-es.js"), context);
const translate = (value) => vm.runInContext(`translate(${JSON.stringify(value)})`, context);

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
