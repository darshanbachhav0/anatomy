/** Each UMA tab loads its own initial scene, without first downloading the body. */
export function initialResource(catalog, search) {
  const params = new URLSearchParams(search);
  const mode = params.get('mode') === 'motion' ? 'motion' : 'explore';
  const requested = catalog.find(row => row.id === params.get('asset'));
  const entry = requested && (mode !== 'motion' || requested.animated) ? requested
    : mode === 'motion' ? catalog.find(row => row.animated)
    : catalog.find(row => row.scene && row.source === 'level1') || catalog.find(row => row.scene);
  return { mode: entry?.animated ? 'motion' : mode, entry };
}
