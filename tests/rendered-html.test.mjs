import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renderiza la experiencia anatómica de UMA en español", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="es-PE">/i);
  assert.match(html, /<title>Atlas Anatómico 3D \| UMA<\/title>/i);
  assert.match(html, /src="\/uma-logo\.jpg"/i);
  assert.match(html, /UMA Universidad María Auxiliadora/);
  assert.match(html, /Explorar/);
  assert.match(html, /Exploración/);
  assert.match(html, /Movimientos/);
  assert.match(html, /Biblioteca de órganos/);
  assert.match(html, /Corazón/);
  assert.match(html, /Datos esenciales/);
  assert.match(html, /og-uma\.png/);
  assert.doesNotMatch(html, /Anatomy Atelier/);
});

test("mantiene centralizados el contenido en español y la identidad UMA", async () => {
  const [app, navigation, data, css, layout] = await Promise.all([
    readFile(new URL("../app/components/AnatomyApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/navigation/MainNavigation.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/anatomy-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(app, /\/uma-logo\.jpg/);
  assert.match(app, /Atlas Anatómico 3D/);
  assert.match(navigation, /Navegación principal/);
  assert.match(data, /name: "Corazón"/);
  assert.match(data, /name: "Cerebro"/);
  assert.match(data, /name: "Pulmones"/);
  assert.match(data, /name: "Hígado"/);
  assert.match(data, /name: "Riñones"/);
  assert.match(css, /--uma-pink: #e5154f/);
  assert.match(layout, /<html lang="es-PE">/);
  assert.match(layout, /url: "\/og-uma\.png"/);
});

test("incluye navegación funcional, módulos educativos y persistencia versionada", async () => {
  const [navigation, storage, lessons, notes, library, profile] = await Promise.all([
    readFile(new URL("../app/components/navigation/MainNavigation.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/storage.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/lessons/LessonsView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/notes/NotesView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/library/LibraryView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/navigation/ProfileMenu.tsx", import.meta.url), "utf8"),
  ]);

  for (const label of ["Explorar", "Lecciones", "Biblioteca", "Apuntes"]) {
    assert.match(navigation, new RegExp(label));
  }
  assert.doesNotMatch(navigation, /Sistemas/);
  for (const key of ["favorites", "recent-organs", "last-organ", "lesson-progress", "quiz-scores", "notes", "settings"]) {
    assert.match(storage, new RegExp(`uma-anatomy-v1-${key}`));
  }
  assert.match(lessons, /Quiz/);
  assert.match(lessons, /Marcar completada/);
  assert.match(notes, /Nuevo apunte/);
  assert.match(notes, /ConfirmModal/);
  assert.match(library, /Glosario/);
  assert.match(library, /Fichas anatómicas/);
  assert.match(library, /Libros/);
  assert.match(library, /anatomyBooks/);
  assert.match(profile, /Mi progreso/);
  assert.match(profile, /Configuración/);
});

test("integra un modo disección reutilizable sin inventar estructuras ausentes", async () => {
  const [data, engine, viewer, hotspots, inspector] = await Promise.all([
    readFile(new URL("../app/lib/dissection-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/three/dissection-engine.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/three/viewer.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/three/hotspots.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/inspect-glb.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(data, /meshCount: 1/);
  assert.match(data, /internalStructures: \[\]/);
  assert.match(data, /removable: false/);
  assert.match(data, /tripo_node_9c16954f-d29a-4a4b-baf4-ba02eda23201/);
  assert.match(data, /No existen piezas internas separadas/);
  for (const operation of ["remove", "restore", "undo", "redo", "applyStage", "isolate", "structureCenter"]) {
    assert.match(engine, new RegExp(`\\b${operation}\\(`));
  }
  assert.match(viewer, /setDissectionEnabled/);
  assert.match(viewer, /focusDissectionStructure/);
  assert.match(hotspots, /setDissectionContext/);
  assert.match(inspector, /Jerarquía completa/);
  assert.match(inspector, /Nodos con malla/);
});

test("el visor de Explorar muestra el órgano sin puntos ni herramientas retiradas", async () => {
  const organViewer = await readFile(new URL("../app/components/OrganViewer.tsx", import.meta.url), "utf8");
  assert.match(organViewer, /setOrgan\(organ\.model, \[\], organ\.accent\)/);
  for (const label of ["Corte", "Capas"]) assert.match(organViewer, new RegExp(`label: "${label}"`));
  for (const label of ["Girar", "Acercar", "Aislar", "Disección", "Comparar", "Reiniciar", "Giro automático"]) {
    assert.doesNotMatch(organViewer, new RegExp(label));
  }
});

test("los 9 órganos usan la información del documento EXPLORAR ANATOMÍA", async () => {
  const [data, lessons, panel] = await Promise.all([
    readFile(new URL("../app/lib/anatomy-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/lesson-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AnatomyApp.tsx", import.meta.url), "utf8"),
  ]);
  for (const fact of ["nodo sinoauricular", "86 mil millones de neuronas", "escotadura cardíaca", "doble entrada sanguínea", "un millón de nefronas", "Los conos permiten distinguir colores", "pliegues circulares", "precursores inactivos", "órgano de mayor superficie"]) {
    assert.match(data, new RegExp(fact));
  }
  for (const field of ["innervation", "venousDrainage", "references", "summary"]) {
    assert.equal(data.match(new RegExp(`\n    ${field}: `, "g"))?.length, 9, field);
  }
  for (const label of ["Inervación", "Vascularización", "Sustento"]) assert.match(panel, new RegExp(label));
  assert.doesNotMatch(lessons, /de \$\{organ\.name\.toLowerCase\(\)\}/);
});

test("la biblioteca enlaza libros y artículos de investigación para cada órgano", async () => {
  const [resources, library] = await Promise.all([
    readFile(new URL("../app/lib/organ-resources.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/library/LibraryView.tsx", import.meta.url), "utf8"),
  ]);
  for (const organ of ["heart", "brain", "lungs", "liver", "kidneys", "eyeball", "intestine", "pancreas", "skin"]) {
    const block = resources.slice(resources.indexOf(`\n  ${organ}: {`), resources.indexOf("\n  },", resources.indexOf(`\n  ${organ}: {`)));
    const [books, papers] = block.split("papers: [");
    const urls = (text) => [...text.matchAll(/url: "(https?:\/\/[^"]+)"/g)].map((match) => match[1]);
    assert.ok(urls(books).length >= 3, `${organ}: libros`);
    assert.ok(urls(papers).length >= 3, `${organ}: artículos`);
    assert.equal(new Set(urls(block)).size, urls(block).length, `${organ}: enlaces repetidos`);
    assert.match(papers, /language: "es"/, `${organ}: artículo en español`);
  }
  assert.match(library, /OrganResourcesPanel/);
  assert.match(library, /Bibliografía/);
  assert.match(library, /\{ id: "papers", label: "Artículos" \}/);
});
