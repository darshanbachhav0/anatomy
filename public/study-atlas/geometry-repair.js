/** Repair mesh-wide winding inversions left by the source atlas exporter.
 * Positions, normals, UVs, tangents and skinning data remain unchanged.
 * @param {import('three').BufferGeometry} geometry
 */
export function repairSurfaceWinding(geometry) {
  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');
  const index = geometry.getIndex();
  if (!position || !normal || !index) return false;
  let agreeingArea = 0, opposingArea = 0;
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2);
    const ux = position.getX(b) - position.getX(a), uy = position.getY(b) - position.getY(a), uz = position.getZ(b) - position.getZ(a);
    const vx = position.getX(c) - position.getX(a), vy = position.getY(c) - position.getY(a), vz = position.getZ(c) - position.getZ(a);
    const nx = normal.getX(a) + normal.getX(b) + normal.getX(c);
    const ny = normal.getY(a) + normal.getY(b) + normal.getY(c);
    const nz = normal.getZ(a) + normal.getZ(b) + normal.getZ(c);
    const length = Math.hypot(nx, ny, nz);
    if (!length) continue;
    const agreement = ((uy * vz - uz * vy) * nx + (uz * vx - ux * vz) * ny + (ux * vy - uy * vx) * nz) / length;
    if (agreement < 0) opposingArea -= agreement;
    else agreeingArea += agreement;
  }
  // Ignore isolated irregular triangles; require a >95% area-weighted inversion.
  if (opposingArea <= 0 || opposingArea <= 19 * agreeingArea) return false;
  for (let i = 0; i < index.count; i += 3) {
    const second = index.getX(i + 1);
    index.setX(i + 1, index.getX(i + 2));
    index.setX(i + 2, second);
  }
  index.needsUpdate = true;
  return true;
}
