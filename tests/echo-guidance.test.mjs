import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { Vector3 } from 'three';

const root = new URL('../public/echo/', import.meta.url);
const read = name => readFile(new URL(name, root), 'utf8');
const locale = vm.createContext({ window: {}, document: { readyState: 'loading', addEventListener() {} } });
for (const file of ['translations-es.js', 'uma-es.js']) vm.runInContext(await read(file), locale);
const translate = value => vm.runInContext(`translate(${JSON.stringify(value)})`, locale);

// Exercise the direction/clock generators from the actual simulator bundle.
// Static dictionary checks alone miss the guidance assembled from these outputs.
const loader = await read('assets/lab-QITkds_9.js');
const bundle = loader.match(/\.\/(main-[\w-]+\.js)/)?.[1];
assert.ok(bundle, 'The active laboratory bundle must be identified');
const source = await read(`assets/${bundle}`);
const tree = ts.createSourceFile(bundle, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const functions = tree.statements.filter(ts.isFunctionDeclaration);
const direction = functions.find(node => node.getText(tree).includes('"up toward the head"'));
const clock = functions.find(node => node.getText(tree).includes('o’clock'));
assert.ok(direction?.name && clock?.name, 'Locate the actual runtime guidance generators');
const generator = vm.createContext({ Ke: () => ({ cranial: new Vector3(0, 1, 0), left: new Vector3(1, 0, 0) }) });
vm.runInContext(`${direction.getText(tree)}\n${clock.getText(tree)}\nglobalThis.guidance = { direction: ${direction.name.text}, clock: ${clock.name.text} };`, generator);

test('all emitted probe slide and tail directions are Spanish, including the reported headline', () => {
  assert.equal(translate('Slide up toward the head'), 'Desliza hacia arriba, en dirección a la cabeza');
  const emitted = new Set();
  for (const x of [-1, 0, 1]) for (const y of [-1, 0, 1]) {
    if (!x && !y) continue;
    const suffix = generator.guidance.direction(new Vector3(x, y, 0), new Vector3(0, 0, 1));
    emitted.add(suffix);
    for (const prefix of ['Slide ', 'Move the tail ']) {
      const english = prefix + suffix;
      const spanish = translate(english);
      assert.notEqual(spanish, english);
      assert.doesNotMatch(spanish, /Slide|Move the tail|toward|patient|head|feet|left|right/);
      assert.match(spanish, /^(Desliza|Mueve el extremo) hacia/);
      assert.equal(translate(spanish), spanish);
      assert.equal(translate(english.replaceAll('’', "'")), spanish);
    }
  }
  assert.equal(emitted.size, 8, 'Cover cardinal and all diagonal directions');
});

test('all 24 emitted clock positions translate in both rotation directions', () => {
  const positions = new Set();
  for (let index = 0; index < 24; index++) {
    const angle = index * Math.PI / 12;
    const position = generator.guidance.clock({ x: Math.sin(angle), y: Math.cos(angle) });
    positions.add(position);
    for (const direction of ['clockwise', 'anticlockwise']) {
      const spanish = translate(`Rotate ${direction} to ${position}`);
      assert.match(spanish, direction === 'clockwise' ? /^Gira en sentido horario/ : /^Gira en sentido antihorario/);
      assert.ok(spanish.endsWith(position.replace(' o’clock', '')), position);
      assert.doesNotMatch(spanish, /Rotate|clockwise|anticlockwise|o.clock/);
      assert.equal(translate(spanish), spanish);
    }
  }
  assert.equal(positions.size, 24);
});

test('generated depth, practice labels, metrics and failures preserve their variable values', () => {
  assert.equal(translate('Aim 17.0 cm'), 'Objetivo: 17.0 cm');
  assert.equal(translate('Aim 12–24 cm'), 'Objetivo: 12–24 cm');
  assert.equal(translate('Practice target · RV inflow'), 'Objetivo de práctica · Entrada del VD');
  assert.equal(translate('Practice · RV inflow'), 'Práctica · Entrada del VD');
  assert.equal(translate('Contact 1.2 cm · Tilt 4.5° · Marker 6.7°'), 'Contacto 1.2 cm · Inclinación 4.5° · Marcador 6.7°');
  assert.equal(translate('Sim asset bmode.frag unavailable'), 'No está disponible el recurso bmode.frag de la simulación');
  assert.equal(translate('The probe lab could not load. Failed to fetch Reload to try again.'), 'No se pudo cargar el laboratorio de ecocardiografía. Recarga la página para volver a intentarlo.');
});

test('all dynamic calculator templates keep every placeholder and numerical constant', async () => {
  const templates = JSON.parse(await read('spanish-templates.json'));
  const slots = value => [...value.matchAll(/\{(\d+)\}/g)].map(m => m[1]).sort();
  const numbers = value => value.replace(/\{\d+\}/g, '').match(/\d+(?:[.,]\d+)*/g) ?? [];
  for (const [english, spanish] of Object.entries(templates)) {
    assert.deepEqual(slots(spanish), slots(english), english);
    assert.deepEqual(numbers(spanish), numbers(english), english);
    const example = english.replace(/\{(\d+)\}/g, (_, index) => `${100 + Number(index)}.25`);
    const translated = translate(example);
    assert.notEqual(translated, example, english);
    for (const index of slots(english)) assert.ok(translated.includes(`${100 + Number(index)}.25`), english);
    assert.equal(translate(translated), translated, english);
  }
});

test('validation and result branches translate with real changing measurements and missing-field lists', () => {
  assert.equal(translate('Must be at least 3 cm'), 'Debe ser al menos 3 cm');
  assert.equal(translate('Must be at least 7.5 cm'), 'Debe ser al menos 7.5 cm');
  assert.equal(translate('Above the plausible range (up to 250 cm) — check the units and the decimal point'), 'Supera el intervalo plausible (hasta 250 cm): comprueba las unidades y el separador decimal');
  assert.equal(translate('Add Height, Weight to calculate.'), 'Añade Estatura, Peso para calcular.');
  assert.equal(translate('4/16 segments scored · 12 not visualized'), '4/16 segmentos puntuados · 12 no visualizados');
  assert.equal(translate('RF is in the severe quantitative range.'), 'La fracción regurgitante está en el intervalo cuantitativo grave.');
});
