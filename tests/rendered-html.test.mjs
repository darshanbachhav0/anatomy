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

  for (const label of ["Explorar", "Sistemas", "Lecciones", "Biblioteca", "Apuntes"]) {
    assert.match(navigation, new RegExp(label));
  }
  for (const key of ["favorites", "recent-organs", "last-organ", "lesson-progress", "quiz-scores", "notes", "settings"]) {
    assert.match(storage, new RegExp(`uma-anatomy-v1-${key}`));
  }
  assert.match(lessons, /Quiz/);
  assert.match(lessons, /Marcar completada/);
  assert.match(notes, /Nuevo apunte/);
  assert.match(notes, /ConfirmModal/);
  assert.match(library, /Glosario/);
  assert.match(library, /Fichas anatómicas/);
  assert.match(profile, /Mi progreso/);
  assert.match(profile, /Configuración/);
});

test("integra un modo disección reutilizable sin inventar estructuras ausentes", async () => {
  const [data, engine, viewer, panel, organViewer, hotspots, inspector] = await Promise.all([
    readFile(new URL("../app/lib/dissection-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/three/dissection-engine.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/three/viewer.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/dissection/DissectionPanel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/OrganViewer.tsx", import.meta.url), "utf8"),
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
  assert.match(panel, /Modo disección activo/);
  assert.match(panel, /config\.organLabel/);
  assert.match(organViewer, /Disección próximamente disponible/);
  assert.match(organViewer, /accessibleHotspots/);
  assert.match(hotspots, /setDissectionContext/);
  assert.match(inspector, /Jerarquía completa/);
  assert.match(inspector, /Nodos con malla/);
});
