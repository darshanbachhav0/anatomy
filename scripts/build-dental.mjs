import { spawnSync } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// npm supplies its CLI path on Windows and Unix; avoid shell-dependent env syntax.
const project = new URL("../", import.meta.url);
const result = spawnSync(process.execPath, [process.env.npm_execpath, "run", "build", "--workspace", "dental-scope"], {
  cwd: fileURLToPath(project),
  stdio: "inherit",
  env: {
    ...process.env,
    DS_BASE: "./", // Hash routes keep every model URL inside /dental/.
    DS_PREVIEW: "1",
    VITE_DS_REPO_URL: "https://github.com/Yoosseph/dental-scope",
  },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const output = new URL("public/dental/", project);
await mkdir(new URL("docs/", output), { recursive: true });
for (const file of ["LICENSE", "CREDITS.md", "UMA-INTEGRATION.md", "docs/assets.md", "docs/sources.md"]) {
  await copyFile(new URL(`vendor/dental-scope/${file}`, project), new URL(file, output));
}
console.log("Odontología UMA: visor, modelos y atribuciones preparados en public/dental.");
