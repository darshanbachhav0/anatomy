import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Registry } from './anatomy/registry';
import { loadManifest } from './engine/assets';
import { Engine } from './engine/Engine';
import { buildIndex } from './search/search';
import { getState, restorePreferences } from './state/store';
import { App } from './ui/App';
import { ServicesContext } from './ui/context';
import { t } from './i18n';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource-variable/source-serif-4/opsz.css';
import './styles/tokens.css';
import './styles/app.css';
import './styles/uma.css';

async function boot() {
  restorePreferences();
  document.documentElement.lang = getState().lang;
  const root = createRoot(document.getElementById('root')!);
  if (!hasWebGL()) {
    root.render(<p className="ds-fatal">{t().fatalWebgl}</p>);
    window.parent.postMessage({ type: 'uma-dental-error' }, window.location.origin);
    return;
  }
  const manifest = await loadManifest();
  const registry = new Registry(manifest);
  const engine = new Engine(registry);
  const searchIndex = buildIndex(registry);
  if (import.meta.env.DEV) Object.assign(window, { ds: { registry, engine } });
  root.render(
    <StrictMode>
      <ServicesContext.Provider value={{ registry, engine, searchIndex }}>
        <App />
      </ServicesContext.Provider>
    </StrictMode>,
  );
  window.parent.postMessage({ type: 'uma-dental-ready' }, window.location.origin);
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

boot().catch((e) => {
  window.parent.postMessage({ type: 'uma-dental-error' }, window.location.origin);
  console.error(e);
  const p = document.createElement('p');
  p.className = 'ds-fatal';
  p.textContent = t().fatalStart;
  document.getElementById('root')!.replaceChildren(p);
});
