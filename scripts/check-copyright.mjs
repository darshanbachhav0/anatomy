import { readFile } from 'node:fs/promises';
const register = JSON.parse(await readFile(new URL('../compliance/rights-register.json', import.meta.url), 'utf8'));
const unresolved = register.items.filter(item => item.status !== 'VERIFIED');
console.log(`Copyright evidence register: ${unresolved.length} unresolved content/permission/distribution records.`);
for (const item of unresolved) console.log(`${item.id}: ${item.status} — ${item.component}\n  Needed: ${item.requiredEvidence}`);
if (process.argv.includes('--release') && unresolved.length) {
  console.error('Public/commercial release is not cleared by this check. Normal website behavior is unchanged; obtain and review the evidence before release.');
  process.exitCode = 1;
}
