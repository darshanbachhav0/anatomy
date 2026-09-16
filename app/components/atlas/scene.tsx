"use client";
// Adapted from ashemag/human-atlas (MIT). See public/atlas/LICENSE.txt.
import { useEffect, useRef } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createExplosionLayout } from './explosion-layout';
import { decodeModelResponse } from './model-download';
import { PointerTap } from './pointer-tap';
import { SYSTEMS, type Atlas, type SceneState } from './anatomy';
import { visibleParts, displayName } from './catalog';
interface Props {
    atlas: Atlas;
    state: SceneState;
    onSelect: (id: string) => void;
    onProgress: (n: number) => void;
    onError: (s: string) => void;
}
export default function AnatomyScene({ atlas, state, onSelect, onProgress, onError }: Props) {
    const host = useRef<HTMLDivElement>(null), latest = useRef(state), select = useRef(onSelect);
    useEffect(() => { latest.current = state; select.current = onSelect; }, [state, onSelect]);
    useEffect(() => {
        const el = host.current!;
        let disposed = false, frame = 0, dirty = true, ready = false, lastFitKey = '', lastFocus = 0, lastZoom = 0, layoutKey = '', amount = 0;
        let lastState: SceneState | null = null;
        const abort = new AbortController();
        let renderer: T.WebGLRenderer;
        try {
            renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
        }
        catch {
            onError('No se pudo iniciar el visor 3D. Prueba un navegador con WebGL habilitado.');
            return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.5 : 2));
        renderer.setClearColor('#f6f6f8');
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        el.appendChild(renderer.domElement);
        renderer.domElement.setAttribute('role', 'img');
        renderer.domElement.setAttribute('aria-label', 'Anatomía humana interactiva. Arrastra para girar, usa la rueda o pellizca para acercar y toca una estructura para seleccionarla.');
        const scene = new T.Scene(), camera = new T.PerspectiveCamera(34, 1, .005, 100), controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(1.4, 1.05, 3.6);
        controls.target.set(0, .85, 0);
        controls.enableDamping = true;
        controls.dampingFactor = .085;
        controls.minDistance = .07;
        controls.maxDistance = 40;
        controls.maxPolarAngle = Math.PI * .96;
        controls.addEventListener('change', () => { dirty = true; });
        const pmrem = new T.PMREMGenerator(renderer), room = new RoomEnvironment(), env = pmrem.fromScene(room, .04);
        scene.environment = env.texture;
        room.dispose();
        pmrem.dispose();
        scene.add(new T.HemisphereLight(0xffffff, 0xa7acb2, 1.05));
        const key = new T.DirectionalLight(0xfffaf4, 2.3);
        key.position.set(-2, 4, 3);
        scene.add(key);
        const rim = new T.DirectionalLight(0xe9f0ff, 1.8);
        rim.position.set(2, 2, -3);
        scene.add(rim);
        const ground = new T.Mesh(new T.CircleGeometry(30, 96), new T.MeshStandardMaterial({ color: 0xd5d9dc, roughness: 1 }));
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -.019;
        scene.add(ground);
        const platform = new T.Mesh(new T.CylinderGeometry(.68, .7, .028, 100), new T.MeshStandardMaterial({ color: 0xeeeeec, metalness: .12, roughness: .67 }));
        platform.position.y = -.016;
        scene.add(platform);
        const ring = new T.Mesh(new T.RingGeometry(.63, .632, 128), new T.MeshBasicMaterial({ color: 0x8c969f, transparent: true, opacity: .4, side: T.DoubleSide }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = .001;
        scene.add(ring);
        const innerRing = new T.Mesh(new T.RingGeometry(.55, .551, 128), new T.MeshBasicMaterial({ color: 0xa4aeb8, transparent: true, opacity: .16, side: T.DoubleSide }));
        innerRing.rotation.x = -Math.PI / 2;
        innerRing.position.y = .001;
        scene.add(innerRing);
        const width = T.MathUtils.ceilPowerOfTwo(atlas.parts.length), data = new Float32Array(width * 4), partTexture = new T.DataTexture(data, width, 1, T.RGBAFormat, T.FloatType);
        partTexture.needsUpdate = true;
        const selectedData = new Uint8Array(width * 4), selectionTexture = new T.DataTexture(selectedData, width, 1);
        selectionTexture.needsUpdate = true;
        const materials: T.Material[] = [], geometries: T.BufferGeometry[] = [], pickers: (T.Mesh | undefined)[] = [], centers = atlas.parts.map(p => new T.Vector3().fromArray(p.bounds[0]).add(new T.Vector3().fromArray(p.bounds[1])).multiplyScalar(.5));
        const offsets: T.Vector3[] = [], bounds = atlas.parts.map(p => new T.Box3(new T.Vector3().fromArray(p.bounds[0]), new T.Vector3().fromArray(p.bounds[1])));
        const pickerMaterial = new T.MeshBasicMaterial({ side: T.DoubleSide });
        const markerPositions = new Float32Array(atlas.parts.length * 3), markerGeometry = new T.BufferGeometry();
        markerGeometry.setAttribute('position', new T.BufferAttribute(markerPositions, 3));
        const markerMaterial = new T.PointsMaterial({ color: 0x64748b, size: 5, sizeAttenuation: false, transparent: true, opacity: .72, depthTest: false });
        markerMaterial.onBeforeCompile = shader => { shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;'); };
        const markers = new T.Points(markerGeometry, markerMaterial);
        markers.frustumCulled = false;
        markers.renderOrder = 10;
        markers.visible = false;
        scene.add(markers);
        const hover = document.createElement('div');
        hover.className = 'atlas-part-hover';
        hover.setAttribute('role', 'tooltip');
        hover.hidden = true;
        el.appendChild(hover);
        type Target = {
            index: number;
            x: number;
            y: number;
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
        let targets: Target[] = [];
        const projected = new T.Vector3();
        const findTarget = (x: number, y: number, radius: number) => {
            let best = -1, score = Infinity;
            for (const t of targets) {
                const dx = Math.max(t.left - x, 0, x - t.right), dy = Math.max(t.top - y, 0, y - t.bottom), distance = Math.hypot(dx, dy);
                if (distance > radius)
                    continue;
                const candidate = distance + Math.hypot(t.x - x, t.y - y) * .025;
                if (candidate < score) {
                    score = candidate;
                    best = t.index;
                }
            }
            return best;
        };
        const materialFor = (system: string) => {
            const m = new T.MeshStandardMaterial({ color: SYSTEMS.find(s => s.id === system)?.color ?? '#aebbb8', metalness: .08, roughness: .53, side: T.DoubleSide, transparent: system === 'integumentary', opacity: system === 'integumentary' ? .1 : 1, depthWrite: system !== 'integumentary' });
            m.onBeforeCompile = shader => {
                shader.uniforms.partState = { value: partTexture };
                shader.uniforms.selectionState = { value: selectionTexture };
                shader.uniforms.stateWidth = { value: width };
                shader.vertexShader = 'attribute float partIndex; uniform sampler2D partState; uniform sampler2D selectionState; uniform float stateWidth; varying float partVisible; varying float partSelected;\n' + shader.vertexShader;
                shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvec2 stateUv = vec2((partIndex + 0.5) / stateWidth, 0.5); vec4 state = texture2D(partState, stateUv); transformed += state.xyz; partVisible = state.w; partSelected = texture2D(selectionState, stateUv).r;');
                shader.fragmentShader = 'varying float partVisible; varying float partSelected;\n' + shader.fragmentShader;
                shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (partVisible < 0.5) discard;');
                shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.79, 0.025, 0.12), partSelected * 0.75);');
            };
            materials.push(m);
            return m;
        };
        const mats = new Map(SYSTEMS.map(s => [s.id, materialFor(s.id)]));
        let loaded = 0;
        const loadChunk = async (ci: number) => {
            const chunk = atlas.chunks[ci], compressed = !!chunk.gzip && typeof DecompressionStream !== 'undefined';
            const response = await fetch(compressed ? chunk.gzip! : chunk.url, { signal: abort.signal });
            const buffer = await decodeModelResponse(response, chunk.bytes, compressed);
            if (disposed)
                return;
            const groups = new Map<string, T.BufferGeometry[]>();
            atlas.parts.forEach((p, i) => {
                if (p.chunk !== ci)
                    return;
                const g = new T.BufferGeometry();
                g.setAttribute('position', new T.BufferAttribute(new Float32Array(buffer, p.positions, p.vertexCount * 3), 3));
                // GPU normalized signed-short normals keep the complete atlas compact in memory.
                g.setAttribute('normal', new T.BufferAttribute(new Int16Array(buffer, p.normals, p.vertexCount * 3), 3, true));
                g.setIndex(new T.BufferAttribute(new Uint32Array(buffer, p.indices, p.indexCount), 1));
                g.boundingBox = bounds[i].clone();
                g.computeBoundingSphere();
                const pick = new T.Mesh(g, pickerMaterial);
                pick.matrixAutoUpdate = false;
                pickers[i] = pick;
                geometries.push(g);
                g.setAttribute('partIndex', new T.BufferAttribute(new Float32Array(p.vertexCount).fill(i), 1));
                const list = groups.get(p.system) ?? [];
                list.push(g);
                groups.set(p.system, list);
            });
            groups.forEach((gs, system) => { const geometry = mergeGeometries(gs, false); if (!geometry)
                throw new Error('No se pudo ensamblar la geometría anatómica.'); geometries.push(geometry); const mesh = new T.Mesh(geometry, mats.get(system as never)); mesh.frustumCulled = false; scene.add(mesh); });
            lastState = null;
            loaded++;
            onProgress(Math.round(loaded / atlas.chunks.length * 100));
            dirty = true;
        };
        (async () => { try {
            let cursor = 0;
            await Promise.all(Array.from({ length: 3 }, async () => { while (cursor < atlas.chunks.length) {
                const i = cursor++;
                await loadChunk(i);
            } }));
            if (!disposed) {
                ready = true;
                dirty = true;
            }
        }
            catch {
            abort.abort();
            if (!disposed)
                onError('No se pudo cargar la anatomía completa. Comprueba la conexión y pulsa Reintentar visor.');
        } })();
        const fit = (view: string, selectionOnly = false) => {
            const s = latest.current, visibleIds = new Set(visibleParts(atlas, s).map(p => p.id)), selection = new Set(s.selected), box = new T.Box3();
            atlas.parts.forEach((p, i) => { if (visibleIds.has(p.id) && (!selectionOnly || selection.has(p.id)))
                box.union(bounds[i].clone().translate(new T.Vector3(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]))); });
            if (box.isEmpty())
                return;
            const center = box.getCenter(new T.Vector3()), size = box.getSize(new T.Vector3()).multiplyScalar(.5);
            if (amount > .8)
                view = 'front';
            const direction = (view === 'front' ? new T.Vector3(0, .02, 1) : view === 'back' ? new T.Vector3(0, .02, -1) : view === 'side' ? new T.Vector3(1, .02, 0) : new T.Vector3(.35, .06, 1)).normalize();
            const right = new T.Vector3().crossVectors(new T.Vector3(0, 1, 0), direction).normalize(), up = new T.Vector3().crossVectors(direction, right);
            const extent = (axis: T.Vector3) => Math.abs(axis.x) * size.x + Math.abs(axis.y) * size.y + Math.abs(axis.z) * size.z;
            const tangent = Math.tan(T.MathUtils.degToRad(camera.fov / 2)), distance = Math.max(.07, Math.max(extent(up) / tangent, extent(right) / (tangent * Math.max(.1, camera.aspect))) * 1.18 + extent(direction));
            controls.maxDistance = Math.max(40, distance * 3);
            controls.target.copy(center);
            camera.position.copy(center).addScaledVector(direction, distance);
            controls.update();
            dirty = true;
        };
        const resize = () => { if (!el.clientWidth || !el.clientHeight)
            return; layoutKey = ''; lastState = null; lastFitKey = ''; renderer.setPixelRatio(Math.min(devicePixelRatio, el.clientWidth < 768 || el.clientHeight < 600 ? 1.5 : 2)); camera.aspect = el.clientWidth / el.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(el.clientWidth, el.clientHeight); dirty = true; };
        const observer = new ResizeObserver(resize);
        observer.observe(el);
        const raycaster = new T.Raycaster(), pointer = new T.Vector2(), tap = new PointerTap(), worldBox = new T.Box3(), hitPoint = new T.Vector3();
        const down = (e: PointerEvent) => { hover.hidden = true; tap.down(e.pointerId, e.clientX, e.clientY, e.pointerType === 'touch' ? 12 : 5); };
        const move = (e: PointerEvent) => { tap.move(e.pointerId, e.clientX, e.clientY); if (e.buttons || amount < .5 || e.pointerType === 'touch') {
            hover.hidden = true;
            return;
        } const rect = el.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top, index = findTarget(x, y, 12); hover.hidden = index < 0; renderer.domElement.style.cursor = index < 0 ? 'grab' : 'pointer'; if (index >= 0) {
            hover.textContent = displayName(atlas.parts[index].name);
            hover.style.left = `${Math.max(8, Math.min(x + 14, el.clientWidth - 260))}px`;
            hover.style.top = `${Math.max(8, Math.min(y + 18, el.clientHeight - 55))}px`;
        } };
        const cancel = (e: PointerEvent) => tap.cancel(e.pointerId);
        const up = (e: PointerEvent) => {
            const validTap = tap.up(e.pointerId, e.clientX, e.clientY);
            if (!validTap || !ready)
                return;
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
            raycaster.setFromCamera(pointer, camera);
            let nearest = Infinity, found = -1;
            const hasSolid = atlas.parts.some((p, i) => p.system !== 'integumentary' && data[i * 4 + 3] > .5);
            pickers.forEach((mesh, i) => { if (!mesh || data[i * 4 + 3] < .5 || (hasSolid && atlas.parts[i].system === 'integumentary'))
                return; worldBox.copy(bounds[i]).translate(mesh.position); if (!raycaster.ray.intersectBox(worldBox, hitPoint))
                return; const hits = raycaster.intersectObject(mesh, false); if (hits[0] && hits[0].distance < nearest) {
                nearest = hits[0].distance;
                found = i;
            } });
            if (found < 0 && amount > .45)
                found = findTarget(e.clientX - rect.left, e.clientY - rect.top, e.pointerType === 'touch' ? 24 : 16);
            if (found >= 0) {
                hover.hidden = true;
                select.current(atlas.parts[found].id);
            }
        };
        renderer.domElement.addEventListener('pointerdown', down);
        renderer.domElement.addEventListener('pointermove', move);
        renderer.domElement.addEventListener('pointerup', up);
        renderer.domElement.addEventListener('pointercancel', cancel);
        let previousTime = performance.now(), lastExtent = -1;
        const animate = () => {
            if (disposed)
                return;
            frame = requestAnimationFrame(animate);
            const now = performance.now(), dt = Math.min((now - previousTime) / 1000, .05), s = latest.current;
            previousTime = now;
            const changed = lastState?.visible !== s.visible || lastState?.selected !== s.selected || lastState?.isolate !== s.isolate || lastState?.hidden !== s.hidden || lastState?.scope !== s.scope;
            const moving = Math.abs(amount - s.explode) > .0001;
            if (moving) {
                amount = T.MathUtils.damp(amount, s.explode, 8, dt);
                dirty = true;
            }
            if (changed || moving || lastExtent < 0) {
                const selection = new Set(s.selected), parts = visibleParts(atlas, s), visibleIds = new Set(parts.map(p => p.id));
                const nextLayoutKey = parts.map(p => p.id).join(',') + ':' + camera.aspect.toFixed(3);
                if (nextLayoutKey !== layoutKey) {
                    const layout = createExplosionLayout(parts, camera.aspect);
                    atlas.parts.forEach((p, i) => { const cell = layout.cells.get(p.id); offsets[i] = cell ? new T.Vector3(cell.x, cell.y + .85, 0) : centers[i].clone(); });
                    layoutKey = nextLayoutKey;
                }
                const spread = s.scope?.length ? .18 : 1;
                atlas.parts.forEach((p, i) => {
                    const c = centers[i], destination = offsets[i];
                    let dx = 0, dy = 0, dz = 0;
                    if (amount <= .45) {
                        const t = amount / .45;
                        const group = SYSTEMS.findIndex(sys => sys.id === p.system);
                        const angle = group / SYSTEMS.length * Math.PI * 2;
                        dx = Math.sin(angle) * t * .48 * spread;
                        dy = (c.y - .85) * t * .28 * spread;
                        dz = Math.cos(angle) * t * .48 * spread;
                    }
                    else {
                        const t = (amount - .45) / .55, group = SYSTEMS.findIndex(sys => sys.id === p.system), angle = group / SYSTEMS.length * Math.PI * 2;
                        dx = T.MathUtils.lerp(Math.sin(angle) * .48 * spread, destination.x - c.x, t);
                        dy = T.MathUtils.lerp((c.y - .85) * .28 * spread, destination.y - c.y, t);
                        dz = T.MathUtils.lerp(Math.cos(angle) * .48 * spread, -c.z, t);
                    }
                    const selected = selection.has(p.id);
                    data.set([dx, dy, dz, visibleIds.has(p.id) ? 1 : 0], i * 4);
                    selectedData[i * 4] = selected ? 255 : 0;
                    markerPositions.set(data[i * 4 + 3] > .5 ? [c.x + dx, c.y + dy, c.z + dz] : [10000, 10000, 10000], i * 3);
                    const mesh = pickers[i];
                    if (mesh) {
                        mesh.position.set(dx, dy, dz);
                        mesh.updateMatrix();
                        mesh.updateMatrixWorld(true);
                    }
                });
                partTexture.needsUpdate = true;
                selectionTexture.needsUpdate = true;
                markerGeometry.attributes.position.needsUpdate = true;
                lastState = s;
                lastExtent = amount;
                dirty = true;
            }
            const fitKey = [s.view, s.reset, s.scope?.join(','), s.visible.join(','), s.hidden.join(','), s.isolate ? s.selected.join(',') : 'all', camera.aspect].join('|');
            if (fitKey !== lastFitKey || moving) {
                fit(s.view);
                lastFitKey = fitKey;
            }
            if (s.focus !== lastFocus) {
                fit(s.view, true);
                lastFocus = s.focus;
            }
            if (s.zoom !== lastZoom) {
                camera.position.sub(controls.target).multiplyScalar(Math.pow(.8, s.zoom - lastZoom)).clampLength(controls.minDistance, controls.maxDistance).add(controls.target);
                lastZoom = s.zoom;
                controls.update();
                dirty = true;
            }
            controls.enableRotate = amount < .8;
            controls.mouseButtons.LEFT = amount < .8 ? T.MOUSE.ROTATE : T.MOUSE.PAN;
            controls.touches.ONE = amount < .8 ? T.TOUCH.ROTATE : T.TOUCH.PAN;
            ground.visible = platform.visible = ring.visible = innerRing.visible = amount < .5 && !s.isolate && !s.scope;
            markers.visible = amount > .75;
            controls.autoRotate = s.rotate && amount < .4;
            controls.autoRotateSpeed = .65;
            controls.update();
            if (controls.autoRotate)
                dirty = true;
            if (dirty) {
                renderer.render(scene, camera);
                targets = [];
                if (amount > .45) {
                    const hasSolid = atlas.parts.some((p, i) => p.system !== 'integumentary' && data[i * 4 + 3] > .5);
                    atlas.parts.forEach((p, i) => { if (data[i * 4 + 3] < .5 || (hasSolid && p.system === 'integumentary'))
                        return; let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity; for (let corner = 0; corner < 8; corner++) {
                        projected.set(p.bounds[(corner & 1) ? 1 : 0][0] + data[i * 4], p.bounds[(corner & 2) ? 1 : 0][1] + data[i * 4 + 1], p.bounds[(corner & 4) ? 1 : 0][2] + data[i * 4 + 2]).project(camera);
                        const x = (projected.x + 1) * el.clientWidth / 2, y = (1 - projected.y) * el.clientHeight / 2;
                        left = Math.min(left, x);
                        right = Math.max(right, x);
                        top = Math.min(top, y);
                        bottom = Math.max(bottom, y);
                    } projected.copy(centers[i]).add(new T.Vector3(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])).project(camera); if (projected.z < -1 || projected.z > 1)
                        return; targets.push({ index: i, x: (projected.x + 1) * el.clientWidth / 2, y: (1 - projected.y) * el.clientHeight / 2, left, right, top, bottom }); });
                }
                dirty = false;
            }
        };
        animate();
        const contextLost = (e: Event) => { e.preventDefault(); onError('Tu dispositivo interrumpió la sesión 3D. Pulsa Reintentar para continuar.'); };
        renderer.domElement.addEventListener('webglcontextlost', contextLost);
        return () => { disposed = true; abort.abort(); cancelAnimationFrame(frame); observer.disconnect(); controls.dispose(); pickerMaterial.dispose(); renderer.domElement.removeEventListener('pointerdown', down); renderer.domElement.removeEventListener('pointermove', move); renderer.domElement.removeEventListener('pointerup', up); renderer.domElement.removeEventListener('pointercancel', cancel); renderer.domElement.removeEventListener('webglcontextlost', contextLost); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); scene.traverse(o => { if (o instanceof T.Mesh && !geometries.includes(o.geometry)) {
            o.geometry.dispose();
            const ms = Array.isArray(o.material) ? o.material : [o.material];
            ms.forEach(m => m.dispose());
        } }); env.dispose(); partTexture.dispose(); selectionTexture.dispose(); markerGeometry.dispose(); markerMaterial.dispose(); hover.remove(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); };
    }, [atlas, onError, onProgress]);
    return <div className="atlas-scene" ref={host}/>;
}
