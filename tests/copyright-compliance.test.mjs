import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = file => readFile(new URL(file, root), 'utf8');
const sha = value => createHash('sha256').update(value).digest('hex');
const manifest = JSON.parse(await read('public/third-party-notices/manifest.json'));

test('notice inventory covers the exact lockfile including nested and optional packages', async () => {
  const bytes = await readFile(new URL('package-lock.json', root));
  const lock = JSON.parse(bytes);
  assert.equal(manifest.lockfileSHA256, sha(bytes));
  assert.deepEqual(manifest.packages.map(p => p.location).sort(), Object.keys(lock.packages).filter(Boolean).sort());
  assert.ok(manifest.embeddedNotices.length >= 100, 'Next bundled notices must be retained');
  const result = spawnSync(process.execPath, ['scripts/generate-third-party-notices.mjs', '--check'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});

test('full Lucide/Feather notices and custom GSAP copyright survive bundling', async () => {
  const lucide = manifest.packages.find(p => p.location === 'node_modules/lucide-react');
  const originals = await Promise.all(lucide.notices.map(n => read(`public/third-party-notices/${n.file}`)));
  const source = await read('node_modules/lucide-react/LICENSE');
  assert.ok(originals.includes(source));
  assert.match(source, /Feather/);
  const gsap = manifest.packages.find(p => p.name === 'gsap');
  assert.notEqual(gsap.declaredLicense, 'MIT');
  const gsapText = (await Promise.all(gsap.notices.map(n => read(`public/third-party-notices/${n.file}`)))).join('\n');
  assert.match(gsapText, /Copyright 2008-2026, GreenSock/);
  assert.match(gsapText, /https:\/\/gsap.com\/standard-license/);
});

test('copied decoders remain unchanged and full codec/font licenses accompany them', async () => {
  const records = JSON.parse(await read('public/licenses/third-party-sources.json'));
  assert.equal(records.unchangedCopies.length, 6);
  for (const copy of records.unchangedCopies) {
    const bytes = await readFile(new URL(copy.file, root));
    assert.equal(sha(bytes), copy.sha256, copy.file);
    assert.deepEqual(bytes, await readFile(new URL(copy.matches, root)), copy.file);
  }
  for (const license of records.licenses) {
    for (const file of license.files) assert.equal(sha(await read(file)), license.sha256, file);
  }
  assert.match(await read('public/draco/LICENSE.txt'), /Apache License/);
  assert.match(await read('public/basis/LICENSE.txt'), /Apache License/);
  assert.match(await read('public/study-atlas/vendor/three/addons/libs/Meshoptimizer-LICENSE.txt'), /Permission is hereby granted/);
  for (const font of ['DM-Sans', 'Cormorant-Garamond']) assert.match(await read(`public/licenses/${font}-OFL.txt`), /SIL OPEN FONT LICENSE Version 1.1/);
});

test('Git preserves checksum-verified upstream bytes across Windows and Linux', async () => {
  const records = JSON.parse(await read('public/licenses/third-party-sources.json'));
  const recovered = JSON.parse(await read('compliance/package-notice-sources.json'));
  const files = new Set([
    ...records.licenses.flatMap(record => record.files),
    ...records.unchangedCopies.map(record => record.file),
    ...recovered.records.flatMap(record => record.notices.map(notice => notice.file)),
  ]);
  for (const file of files) {
    const bytes = await readFile(new URL(file, root));
    const original = spawnSync('git', ['hash-object', '--stdin'], { cwd: root, input: bytes, encoding: 'utf8' });
    assert.equal(original.status, 0, original.stderr);
    for (const autocrlf of ['true', 'false']) {
      const filtered = spawnSync('git', ['-c', `core.autocrlf=${autocrlf}`, 'hash-object', `--path=${file}`, '--stdin'], { cwd: root, input: bytes, encoding: 'utf8' });
      assert.equal(filtered.status, 0, filtered.stderr);
      assert.equal(filtered.stdout, original.stdout, `${file}: Git changed upstream bytes with core.autocrlf=${autocrlf}`);
    }
  }
});

test('every Echo creator, source and adaptation statement has script-free credit access', async () => {
  const credits = JSON.parse(await read('public/echo/assets/credits.json'));
  const spanish = JSON.parse(await read('public/echo/spanish-overrides.json'));
  const page = await read('public/echo/credits.html');
  const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  for (const item of [...credits.figuresAndAnatomy, ...credits.videos]) {
    for (const value of [spanish[item.title] ?? item.title, item.creator, item.sourceURL, item.license, spanish[item.detail ?? item.modifications] ?? item.detail ?? item.modifications]) {
      if (value) assert.ok(page.includes(escape(value)), value);
    }
  }
  for (const file of ['public/echo/index.html', 'public/echo/calculators/index.html']) {
    const html = await read(file);
    assert.equal(html.split('src="/echo/credits.js"').length - 1, 1);
    assert.equal(html.split('href="/echo/credits.css"').length - 1, 1);
    assert.doesNotMatch(html, /id="about"|id="about-button"/);
  }
  assert.match(await read('app/components/profile/AboutView.tsx'), /href="\/third-party-notices\/index.html"/);
});

test('unknown rights never silently clear a release or block ordinary development', () => {
  const status = spawnSync(process.execPath, ['scripts/check-copyright.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(status.status, 0);
  const release = spawnSync(process.execPath, ['scripts/check-copyright.mjs', '--release'], { cwd: root, encoding: 'utf8' });
  assert.equal(release.status, 1);
  assert.match(release.stdout, /C01: UNKNOWN/);
  assert.match(release.stderr, /not cleared/);
});
