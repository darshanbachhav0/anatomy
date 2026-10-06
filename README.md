# vinext-starter

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Odontología UMA

The **Odontología** tab contains a locally hosted adaptation of
[Dental Scope](https://github.com/Yoosseph/dental-scope), with its Spanish
interface, UMA colors, tooth selection, internal anatomy, layers and sections.
Source, models and attribution are in `vendor/dental-scope/`. See
`vendor/dental-scope/UMA-INTEGRATION.md` for the pinned revision and modifications.

Install the whole project from this directory with `npm ci`. Start locally on
port 3001 with `npm run dev -- --port 3001`. Both `npm run dev` and `npm run build`
automatically build the dental viewer into `public/dental/`; `build:next` also
includes it. The same `npm ci` / `npm run build` workflow includes the module on
Render. Commit the source in `vendor/` and the root lockfile; generated files in
`public/dental/` are ignored. After editing dental source, run
`npm run build:dental` and refresh the browser.

`npm run test:dental` runs the dental test suite. Licenses and credits remain
available inside the viewer and at `/dental/CREDITS.md`.

On Windows, use `npm run dev -- --port 3001` for local preview. The current
Vinext 0.0.50 production server indexes nested assets with Windows path
separators, causing 404s under `npm start` on Windows; the Linux deployment
uses URL-compatible separators.

## Exploración y Movimientos

Las pestañas **Exploración** y **Movimientos** integran el proyecto local entregado
en `simulator`, con interfaz en español y colores UMA. El visor y todos sus recursos
están ahora en `public/study-atlas/`; no necesitan un segundo servidor ni instalación.
El contenedor React está en `app/components/study-atlas/StudyAtlasView.tsx`.

Exploración abre el cuerpo humano con sistemas, configuraciones masculina/femenina,
preparaciones, selección, aislamiento, opacidad y corte. Movimientos abre directamente
una de las 58 animaciones e incluye búsqueda, regiones, pausa, velocidad y línea temporal.
Las pestañas existentes de órganos, atlas, odontología y estudio se conservan.

Incluye la carpeta completa `public/study-atlas/` al subir el proyecto: contiene
aproximadamente 960 MB, con modelos, texturas, datos y dependencias locales.
Los archivos `.glb.part000`, `.glb.part001`, etc. son partes necesarias de los dos
modelos grandes; no se deben renombrar ni eliminar. `npm run build` copia los recursos
al resultado de producción. Tailwind escanea únicamente `app/` para no procesar
las partes binarias como texto.

Verificación: `npm run test:study-atlas` comprueba las escenas iniciales, los 58
movimientos, tamaños de modelos, partes y rutas a texturas. `npm test` incluye estas
comprobaciones junto con las pruebas existentes.

El original se conserva como copia de recuperación local, excluida de Git, en
`outputs/simulator-original-2026-10-06/`. No se utiliza al ejecutar ni al compilar.
Los modelos y textos proceden del paquete aportado, sin nuevas afirmaciones anatómicas.
Se mantiene la licencia de Three.js en `public/study-atlas/vendor/three/LICENSE.txt`.
Esta integración no concede derechos adicionales sobre los recursos del atlas;
conserva los permisos y condiciones del material de origen antes de publicarlo.

## Enlaces del proyecto

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
