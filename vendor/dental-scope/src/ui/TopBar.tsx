import { useT } from '../i18n';
import { actions, useApp } from '../state/store';
import { IconInfo, IconMoon, IconSearch, IconSun } from './icons';

export function TopActions() {
  const theme = useApp((s) => s.theme);
  const m = useT();
  return (
    <div className="ds-top-actions">
      <button type="button" className="ds-search-trigger" onClick={() => actions.openSearch(true)} aria-label={m.searchAnatomy} aria-keyshortcuts="/">
        <IconSearch />
        <span>{m.searchAnatomy}</span>
        <kbd>/</kbd>
      </button>
      <button type="button" className="ds-icon-btn" onClick={() => actions.setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? m.toLight : m.toDark} title={m.theme}>
        {theme === 'dark' ? <IconSun /> : <IconMoon />}
      </button>
      <button type="button" className="ds-icon-btn" onClick={() => actions.openAbout(true)} aria-label={m.aboutAria} title={m.about}>
        <IconInfo />
      </button>
    </div>
  );
}
