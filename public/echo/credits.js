// UMA integration code. Original EchoSuite software/media retain their own rights.
// This module is intentionally separate from the simulator and calculator engines.
const creditsURL = new URL('./assets/credits.json', import.meta.url);
let dialog;
let loading;
let returnFocus;

function element(tag, text) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  return node;
}

function link(label, value) {
  if (!value) return element('span', label);
  let url;
  try { url = new URL(value); } catch { return element('span', label); }
  if (!['https:', 'http:'].includes(url.protocol)) return element('span', label);
  const anchor = element('a', label);
  anchor.href = url.href;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

function createDialog() {
  const node = element('dialog');
  node.id = 'uma-echo-credits-dialog';
  node.className = 'uma-echo-credits-dialog';
  node.setAttribute('aria-labelledby', 'uma-echo-credits-title');
  const header = element('header');
  const title = element('h2', 'Fuentes y licencias');
  title.id = 'uma-echo-credits-title';
  const close = element('button', 'Cerrar');
  close.type = 'button';
  close.addEventListener('click', () => node.close());
  header.append(title, close);
  node.append(header, element('p', 'Software y superposiciones educativas originales de EchoSuite © Mohammed Kamareddine, MD. La adaptación UMA conserva las licencias individuales de la anatomía, las imágenes y los vídeos.'));
  const original = element('p');
  original.append(link('EchoSuite y su autor', 'https://echosuite.app/about'));
  node.append(original);
  const contents = element('div');
  contents.dataset.umaCreditsContents = '';
  node.append(contents);
  const notices = element('p');
  for (const [label, href] of [
    ['Procedencia de la adaptación', '/echo/ADAPTACION-UMA.md'],
    ['Atribución de la anatomía', '/echo/assets/ATTRIBUTION.txt'],
    ['Three.js', '/echo/assets/THREE-LICENSE.txt'],
    ['Fuente Michroma', '/echo/assets/Michroma-OFL.txt'],
    ['Todos los avisos de terceros', '/third-party-notices/index.html'],
  ]) {
    const anchor = element('a', label);
    anchor.href = href;
    notices.append(anchor, document.createTextNode(' · '));
  }
  node.append(notices);
  node.addEventListener('click', event => {
    if (event.target !== node) return;
    const bounds = node.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) node.close();
  });
  node.addEventListener('close', () => returnFocus?.focus());
  document.body.append(node);
  return node;
}

async function loadCredits() {
  const contents = dialog.querySelector('[data-uma-credits-contents]');
  contents.replaceChildren(element('p', 'Cargando fuentes…'));
  try {
    const response = await fetch(creditsURL);
    if (!response.ok) throw new Error(`Credits: ${response.status}`);
    const data = await response.json();
    const groups = [];
    for (const [key, label] of [['figuresAndAnatomy', 'Figuras y anatomía'], ['videos', 'Vídeos clínicos']]) {
      const group = element('section');
      group.append(element('h3', label));
      for (const credit of data[key] ?? []) {
        const item = element('article');
        item.append(element('h4', credit.title), element('p', credit.creator), element('p', credit.detail ?? credit.modifications));
        const links = element('p');
        links.append(link('Fuente original', credit.sourceURL), document.createTextNode(' · '), link(credit.license ?? 'Licencia por verificar', credit.licenseURL));
        item.append(links);
        group.append(item);
      }
      groups.push(group);
    }
    contents.replaceChildren(...groups);
  } catch {
    const retry = element('button', 'Volver a cargar las fuentes');
    retry.type = 'button';
    retry.addEventListener('click', () => { loading = loadCredits(); });
    contents.replaceChildren(element('p', 'No se pudieron cargar las fuentes. Los avisos originales siguen disponibles en los enlaces de abajo.'), retry);
    loading = undefined;
  }
}

export function openCredits(trigger = document.activeElement) {
  dialog ??= createDialog();
  returnFocus = trigger;
  if (!dialog.open) dialog.showModal();
  loading ??= loadCredits();
  return loading;
}

// Existing calculator buttons keep their appearance, labels and layout.
document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[data-open-credits]');
  if (!trigger) return;
  event.preventDefault();
  openCredits(trigger);
});
