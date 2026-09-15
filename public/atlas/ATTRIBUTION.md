# Anatomy data attribution

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- License: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html (updated 2025-02-27)
- Dataset: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- License terms: https://creativecommons.org/licenses/by/4.0/
- Source geometry: `isa_BP3D_4.0_obj_99.zip`, BodyParts3D 4.0.
- English names and relationships: IS-A and PART-OF concept, element, and inclusion tables from the same archive.
- Publication: Mitsuhashi et al. (2009), BodyParts3D: 3D structure database for anatomical concepts. https://doi.org/10.1093/nar/gkn613

Adaptations: axes and units converted from millimeters/Z-up to meters/Y-up; translated to rest at the stage; geometry simplified using meshoptimizer with 0.2% relative error limit per structure; normals quantized to signed 16-bit; packed into binary chunks; curated display system groupings and colors. The source contains 2,234 individual OBJ meshes; all remain represented. The combined hierarchy contains 3,432 named FMA concepts, which may reference multiple meshes. Original source identity is preserved in the manifest.

Source OBJ comments mention an older CC BY-SA 2.1 Japan license. The official current database license linked above supersedes that legacy text and explicitly permits redistribution and adaptation under CC BY 4.0.

BodyParts3D represents an adult male reference anatomy based on TARO MRI and anatomical illustration refinements. It is not a complete model of every possible human anatomical structure or variation. This interface is educational and is not a clinical tool.

## UMA integration

Integrated from https://github.com/ashemag/human-atlas at revision
`1c38bf35c254a891200d3cedecfd57abebe83d8d`. Viewer code is MIT licensed;
the original notice is preserved in `/atlas/LICENSE.txt`.

UMA modifications: Spanish interface and curated Spanish labels, UMA colors,
camera framing for separate panels, independent structure hiding/restoration,
undo/redo, a heart study area, lazy loading within the existing platform,
and explicit educational limitations. Geometry is unchanged from this source revision.

Catalog corrections applied by `scripts/import-human-atlas.mjs`:
- Cerebral ventricular structures FJ1730, FJ1731, FJ1752, FJ1767 and FJ1814 moved
  from the cardiac display group to the nervous group.
- Cardiac papillary muscles FJ2418, FJ2419, FJ2429, FJ2430 and FJ2437 assigned to
  the cardiac display group.
- Mitral valve concept FMA7235 restricted to its two modeled leaflets,
  FJ2420 and FJ2432; aortic cusps are not presented as mitral leaflets.
- Ventricular wall FJ2428 included in the heart study assembly FMA7088.

Not every specialized source label has a curated Spanish translation. Original
English names and FMA/FJ identifiers remain visible and searchable. Cavity meshes
represent reference volumes, not solid tissue. Hiding a mesh is not a simulated
surgical incision. Clinical validation has not been performed.

## Historical assets (not included in the current release)

Earlier repository revisions included female reference anatomy: Kristen Browne and Heidi Schlehlein, Human Reference Atlas / HuBMAP, *3D Reference Organ Set for Female v1.5* (2023). CC BY 4.0. Geometry adapted for this viewer.

- Source DOI: https://doi.org/10.48539/HBM352.BTSQ.586
- Dataset: https://lod.humanatlas.io/ref-organ/united-female/v1.5
- Original GLB: https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.5/assets/3d-vh-f-united.glb
- License: https://creativecommons.org/licenses/by/4.0/

Adaptations: translated native meter/Y-up coordinates onto the stage, coincident vertices welded and source normals averaged, geometry simplified with a 0.2% per-structure relative error bound, and normals quantized. Colors and display systems are curated for this interface. All 888 source meshes are represented, with 1,073 source nodes available as selectable individual or compound concepts.

This is a reference assembly with whole-body surface and selected organs, including female reproductive anatomy. Its skeleton and muscle coverage is partial. It is not a complete model of every human structure or a single-person scan. Eight placenta/umbilical structures are classified under Pregnancy reference and hidden by default.
