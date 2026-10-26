import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
const root = path.resolve('public/echo');
const phrases = new Set();
function collectData(value) {
  if (typeof value === 'string') collect(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(collectData);
}
function collect(value) {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length < 3 || text.length > 1800 || !/[a-zA-Z]{2}/.test(text) || (!/\s/.test(text) && !/^[A-Z][a-z]{2,}$/.test(text)) || /[{}]|https?:|data:|\b(?:function|const|return|uniform|vec[234]|document\.)\b/.test(text)) return;
  if (/<[^>]+>/.test(text)) { for (const part of text.replace(/<[^>]+>/g, '\n').split('\n')) collect(part); return; }
  phrases.add(text);
}
async function scan(directory) {
  for (const file of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, file.name);
    if (file.isDirectory()) { await scan(filename); continue; }
    if (/three-|meshopt|anatomy-wire|uma-es|translations-es/.test(file.name)) continue;
    if (file.name.endsWith('.js')) {
      const tree = ts.createSourceFile(filename, await readFile(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
      function visit(node) {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) collect(node.text);
        if (ts.isNoSubstitutionTemplateLiteral(node) && /^[\[{]/.test(node.text)) {
          try { collectData(JSON.parse(node.text)); } catch {}
        }
        ts.forEachChild(node, visit);
      }
      visit(tree);
    } else if (/\.json$/.test(file.name)) {
      const visit = value => { if (typeof value === 'string') collect(value); else if (value && typeof value === 'object') Object.values(value).forEach(visit); };
      visit(JSON.parse(await readFile(filename, 'utf8')));
    } else if (file.name.endsWith('.html')) {
      const source = (await readFile(filename, 'utf8')).replace(/<(script|style)[\s\S]*?<\/\1>/g, '');
      for (const match of source.matchAll(/>([^<>]+)</g)) collect(match[1]);
      for (const match of source.matchAll(/(?:title|aria-label|placeholder|alt)="([^"]+)"/g)) collect(match[1]);
    }
  }
}
await scan(root);
let translations = {};
try { translations = JSON.parse(await readFile('outputs/echo-translations.json', 'utf8')); } catch {}
const pending = [...phrases].filter(phrase => !translations[phrase]);
console.log(`${phrases.size} textos; ${pending.length} pendientes.`);
let batch = [];
let failures = [];
async function translateBatch() {
  if (!batch.length) return;
  const original = batch;
  batch = [];
  const content = original.map((text, index) => `${index + 1}) ${text}`).join('\n');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: 'es', dt: 't', q: content })) url.searchParams.set(key, value);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`Traducción: ${response.status}`);
    const data = await response.json();
    const translated = data[0].map(part => part[0]).join('');
    const matches = [...translated.matchAll(/(?:^|\n)\s*(\d+)\)\s*([\s\S]*?)(?=\n\s*\d+\)|$)/g)];
    if (matches.length !== original.length) throw new Error('El número de segmentos no coincide');
    for (const match of matches) translations[original[Number(match[1]) - 1]] = match[2].trim();
    await writeFile('outputs/echo-translations.json', JSON.stringify(translations, null, 2));
    console.log(`${Object.keys(translations).length} textos traducidos`);
  } catch (error) { failures.push(...original); console.error(String(error)); }
}
for (const phrase of pending) {
  if (batch.join('\n').length + phrase.length > 3300) await translateBatch();
  batch.push(phrase);
}
await translateBatch();
for (const [source, spanish] of Object.entries(translations)) {
  let corrected = spanish;
  if (/\bLV\b/.test(source)) corrected = corrected.replace(/\bBT\b/g, 'VI');
  if (/\bRV\b/.test(source)) corrected = corrected.replace(/(?:la |el )?(?:casa rodante|vehículo recreativo|caravana)/gi, 'VD').replace(/\bRV\b/g, 'VD');
  if (/\bMR\b/.test(source)) corrected = corrected.replace(/\bRM\b/g, 'IM');
  translations[source] = corrected;
}
await writeFile(path.join(root, 'translations-es.js'), `window.UMA_ECHO_TRANSLATIONS=${JSON.stringify(translations)};\n`);
await writeFile('outputs/echo-translation-pending.json', JSON.stringify(failures, null, 2));
console.log(JSON.stringify({ translated: Object.keys(translations).length, pending: failures.length }));
if (failures.length) process.exitCode = 1;
