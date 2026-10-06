import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { actions, getState, initialState, restorePreferences, setState } from './store';

describe('UMA Spanish-only interface', () => {
  beforeEach(() => setState({ ...initialState }));
  afterEach(() => vi.unstubAllGlobals());

  it('ignores saved and URL languages while restoring other preferences', () => {
    const saved = new Map([['ds.lang', 'de'], ['ds.theme', 'dark'], ['ds.numbering', 'palmer']]);
    vi.stubGlobal('location', { search: '?lang=sv' });
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => saved.set(key, value),
    });
    expect(initialState.lang).toBe('es');
    restorePreferences();
    expect(getState()).toMatchObject({ lang: 'es', theme: 'dark', numbering: 'palmer' });
    expect(saved.get('ds.lang')).toBe('es');
    actions.setLang('de');
    expect(getState().lang).toBe('es');
  });

  it('keeps Spanish when browser storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('Storage blocked'); },
      setItem: () => { throw new Error('Storage blocked'); },
    });
    restorePreferences();
    expect(getState().lang).toBe('es');
  });
});

describe('orbit mode inside a tooth', () => {
  beforeEach(() => setState({ ...initialState }));

  it('switches to the free orbit inside a tooth and back to fixed when leaving', () => {
    expect(getState().orbitMode).toBe('fixed');
    actions.enterDissect(36);
    expect(getState().orbitMode).toBe('free');
    actions.enterDissect(37); // moving to another tooth stays free
    expect(getState().orbitMode).toBe('free');
    actions.exitDissect();
    expect(getState().orbitMode).toBe('fixed');
  });

  it('keeps a mode the user picks inside the tooth', () => {
    actions.enterDissect(36);
    actions.setOrbitMode('fixed');
    actions.exitDissect();
    expect(getState().orbitMode).toBe('fixed');
    actions.enterDissect(36);
    actions.setOrbitMode('free');
    actions.exitDissect();
    expect(getState().orbitMode).toBe('free');
  });
});
