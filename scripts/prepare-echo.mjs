import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root = path.resolve('public/echo');
// Use the same reviewed dictionary for the first paint and dynamic content.
const locale = vm.createContext({ window: {}, document: { readyState: 'loading', addEventListener() {} } });
for (const file of ['translations-es.js', 'uma-es.js']) {
  vm.runInContext(await readFile(path.join(root, file), 'utf8'), locale);
}
const translate = vm.runInContext('translate', locale);
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, '\u00a0');
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function localizeHtml(source) {
  return source.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[^]*?-->|<[^>]+>|[^<]+/gi, token => {
    if (/^<(?:script|style)\b|^<!--/i.test(token)) return token;
    if (token.startsWith('<')) return token.replace(/\b(aria-label|title|placeholder|alt)="([^"]*)"/g, (_, name, value) => `${name}="${escape(translate(decode(value)))}"`);
    return escape(translate(decode(token)));
  });
}
for (const page of ['index.html', 'calculators/index.html']) {
  const target = path.join(root, page);
  let source = await readFile(target, 'utf8');
  source = source.replace(/<script\b[^>]*src="[^"]*usage-analytics[^>]*><\/script>/g, '');
  source = source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, script => script.includes('__CF$cv$params') ? '' : script);
  source = source.replace(/<link[^>]*(?:rel="(?:canonical|manifest|alternate|icon|apple-touch-icon)")[^>]*>/g, '');
  source = source.replace(/<meta[^>]*(?:property="og:|name="(?:twitter:|google-site-verification|msvalidate))[^>]*>/g, '');
  source = source.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  source = source.replace(/href="\/(?!\/|echo\/)([^"]*)"/g, (_, route) => route.startsWith('assets/') || route === '' || route.startsWith('calculators/') ? `href="/echo/${route}"` : `href="https://echosuite.app/${route}" target="_blank" rel="noopener noreferrer"`);
  source = source.replace('<html lang="en">', '<html lang="es-PE">');
  source = source.replace(/<title>[^<]*<\/title>/, `<title>${page.startsWith('calculators') ? 'Calculadoras' : 'Simulador'} de ecocardiografía | UMA</title>`);
  source = source.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, '<meta name="description" content="Laboratorio educativo UMA: simulador 3D de ecocardiografía, 15 vistas, práctica con sonda y calculadoras." />');
  source = source.replace('content="#f3f0e9"', 'content="#e5154f"');
  if (!source.includes('/echo/uma-es.js')) source = source.replace('</head>', '<link rel="stylesheet" href="/echo/uma.css"><script src="/echo/uma-es.js" defer></script></head>');
  if (!source.includes('/echo/translations-es.js')) source = source.replace('<script src="/echo/uma-es.js"', '<script src="/echo/translations-es.js" defer></script><script src="/echo/uma-es.js"');
  source = source.replace(/<script src="\/echo\/translations-es.js"[^>]*><\/script>/g, '');
  source = source.replace('<script type="module"', '<script src="/echo/translations-es.js"></script><script type="module"');
  source = source.replaceAll('href="/echo/"', 'href="/echo/index.html"').replaceAll('href="/echo/calculators/"', 'href="/echo/calculators/index.html"');
  await writeFile(target, localizeHtml(source));
}
for (const name of await readdir(path.join(root, 'assets'))) {
  if (!name.endsWith('.js')) continue;
  const target = path.join(root, 'assets', name);
  let source = await readFile(target, 'utf8');
  source = source.replace('if("serviceWorker"in navigator)', 'if(false)');
  source = source.replaceAll('"/assets/', '"/echo/assets/').replaceAll('"/calculators/', '"/echo/calculators/');
  source = source.replaceAll('"/echo/calculators/"', '"/echo/calculators/index.html"');
  if (name === 'main-C-2WEaYv.js') source = source.replace('for(const r of e){const n=bt(r);', 'for(const r of e){const n=bt(r+" "+(window.UMA_ECHO_TRANSLATIONS?.[r]??""));');
  await writeFile(target, source);
}
console.log('Integración UMA preparada; analítica y registro global de service worker desactivados.');
