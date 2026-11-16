# Eye texture correction

The base color is derived from image 0 embedded in `public/models/eyeball.glb`.
On 2026-11-16, the built-in image generation editor supplied localized sclera
repairs. Only two feathered patches were composited into the original 2048×2048
texture: (1205, 365, 185, 135) and (980, 0, 195, 140), in pixel coordinates.
All other texture regions were retained; the result is lossless WebP.

Edit prompt: remove the erroneous gray-rimmed black spots on the sclera,
replace them with matching ivory/pale pink sclera, and preserve the UV layout,
real iris, pupil, muscle textures and other islands.

The viewer substitutes this base color only for the eye. A follow-up repair in
`app/lib/three/eye-surface.ts` fills the false pupil recess with a quadratic
surface fitted to surrounding intact sclera, blends its normals at the boundary,
and samples intact sclera color across the old UV seam. Normal-map and roughness
artifacts are suppressed locally. The original GLB file and UVs are retained;
the repaired geometry exists in the viewer. This cosmetic repair
does not establish or change the underlying asset's rights; the existing
rights-register entry for the source eye model continues to apply.
