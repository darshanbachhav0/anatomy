import * as THREE from "three";
import gsap from "gsap";
import type { DissectionConfig, DissectionStructure } from "../dissection-data";

type MeshMaterial = THREE.Material | THREE.Material[];

type MeshOriginalState = {
  material: MeshMaterial;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  visible: boolean;
};

type MaterialVisualState = {
  material: THREE.Material;
  color?: THREE.Color;
  emissive?: THREE.Color;
  emissiveIntensity?: number;
};

type StructureBinding = {
  definition: DissectionStructure;
  meshes: THREE.Mesh[];
};

export type DissectionSnapshot = {
  enabled: boolean;
  supported: boolean;
  selectedStructureId: string | null;
  hoveredStructureId: string | null;
  isolatedStructureId: string | null;
  removedStructureIds: string[];
  availableStructureIds: string[];
  missingStructureIds: string[];
  activeStage: number;
  canUndo: boolean;
  canRedo: boolean;
};

export const EMPTY_DISSECTION_SNAPSHOT: DissectionSnapshot = {
  enabled: false,
  supported: false,
  selectedStructureId: null,
  hoveredStructureId: null,
  isolatedStructureId: null,
  removedStructureIds: [],
  availableStructureIds: [],
  missingStructureIds: [],
  activeStage: 0,
  canUndo: false,
  canRedo: false,
};

export class DissectionEngine {
  private config: DissectionConfig | null = null;
  private pivot: THREE.Group | null = null;
  private bindings = new Map<string, StructureBinding>();
  private meshStructures = new Map<THREE.Mesh, string>();
  private originals = new Map<THREE.Mesh, MeshOriginalState>();
  private visuals: MaterialVisualState[] = [];
  private enabled = false;
  private selectedStructureId: string | null = null;
  private hoveredStructureId: string | null = null;
  private isolatedStructureId: string | null = null;
  private removed = new Set<string>();
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private activeStage = 0;
  private animations = new Map<string, gsap.core.Timeline>();
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  constructor(
    private readonly onChange: (snapshot: DissectionSnapshot) => void,
    private readonly onRenderNeeded: (seconds?: number) => void,
  ) {}

  attach(pivot: THREE.Group, meshes: THREE.Mesh[], config: DissectionConfig | null) {
    this.detach();
    this.pivot = pivot;
    this.config = config;
    this.activeStage = config?.stages[0]?.id ?? 0;

    if (config) {
      for (const structure of config.structures) {
        const matched = meshes.filter((mesh) => structure.meshNames.includes(mesh.name));
        this.bindings.set(structure.id, { definition: structure, meshes: matched });
        matched.forEach((mesh) => this.meshStructures.set(mesh, structure.id));
      }
    }
    this.notify();
  }

  detach() {
    this.restoreOriginalModel();
    this.config = null;
    this.pivot = null;
    this.bindings.clear();
    this.meshStructures.clear();
    this.enabled = false;
    this.clearState();
    this.notify();
  }

  dispose() {
    this.restoreOriginalModel();
    this.config = null;
    this.pivot = null;
    this.bindings.clear();
    this.meshStructures.clear();
    this.enabled = false;
    this.clearState();
  }

  setEnabled(enabled: boolean) {
    if (!this.config || !this.pivot) return false;
    if (this.enabled === enabled) return this.enabled;

    if (enabled) {
      this.enabled = true;
      this.cloneInteractiveMaterials();
    } else {
      this.reset(false);
      this.restoreOriginalModel();
      this.enabled = false;
    }
    this.notify();
    this.onRenderNeeded(0.25);
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  snapshot(): DissectionSnapshot {
    const availableStructureIds = [...this.bindings]
      .filter(([, binding]) => binding.meshes.length > 0)
      .map(([id]) => id);
    const missingStructureIds = [...this.bindings]
      .filter(([, binding]) => binding.meshes.length === 0)
      .map(([id]) => id);
    return {
      enabled: this.enabled,
      supported: Boolean(this.config),
      selectedStructureId: this.selectedStructureId,
      hoveredStructureId: this.hoveredStructureId,
      isolatedStructureId: this.isolatedStructureId,
      removedStructureIds: [...this.removed],
      availableStructureIds,
      missingStructureIds,
      activeStage: this.activeStage,
      canUndo: this.undoStack.length > 0,
      canRedo: this.redoStack.length > 0,
    };
  }

  pick(x: number, y: number, camera: THREE.Camera, width: number, height: number) {
    if (!this.enabled) return null;
    this.pointer.set((x / Math.max(width, 1)) * 2 - 1, -(y / Math.max(height, 1)) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, camera);
    const targets = [...this.meshStructures.keys()].filter((mesh) => mesh.visible);
    const intersection = this.raycaster.intersectObjects(targets, false)[0];
    return intersection ? this.meshStructures.get(intersection.object as THREE.Mesh) ?? null : null;
  }

  select(structureId: string | null) {
    if (!this.enabled || (structureId && !this.bindings.has(structureId))) structureId = null;
    if (this.selectedStructureId === structureId) return;
    this.selectedStructureId = structureId;
    this.updateHighlights();
    this.notify();
    this.onRenderNeeded(0.25);
  }

  hover(structureId: string | null) {
    if (!this.enabled || (structureId && !this.bindings.has(structureId))) structureId = null;
    if (this.hoveredStructureId === structureId) return;
    this.hoveredStructureId = structureId;
    this.updateHighlights();
    this.notify();
    this.onRenderNeeded(0.2);
  }

  remove(structureId: string, recordHistory = true) {
    const binding = this.bindings.get(structureId);
    if (!this.enabled || !binding?.definition.removable || !binding.meshes.length || this.removed.has(structureId)) return false;
    this.killAnimation(structureId);
    this.removed.add(structureId);
    if (recordHistory) {
      this.undoStack.push(structureId);
      this.redoStack = [];
    }
    if (this.isolatedStructureId === structureId) this.isolatedStructureId = null;

    const directions = binding.meshes.map((mesh) => this.outwardDirection(mesh));
    const progress = { value: 0 };
    const timeline = gsap.timeline({
      onUpdate: () => {
        binding.meshes.forEach((mesh, index) => {
          const original = this.originals.get(mesh);
          if (!original) return;
          mesh.position.copy(original.position).addScaledVector(directions[index], progress.value * 0.38);
          this.meshMaterials(mesh).forEach((material) => {
            material.transparent = true;
            material.opacity = 1 - progress.value;
            material.depthWrite = progress.value < 0.55;
          });
        });
        this.onRenderNeeded();
      },
      onComplete: () => {
        binding.meshes.forEach((mesh) => (mesh.visible = false));
        this.animations.delete(structureId);
        this.resolveIsolationVisibility();
        this.onRenderNeeded(0.15);
      },
    }).to(progress, { value: 1, duration: 0.46, ease: "power2.inOut" });
    this.animations.set(structureId, timeline);
    this.selectedStructureId = null;
    this.updateHighlights();
    this.notify();
    return true;
  }

  restore(structureId: string, keepRedo = false) {
    const binding = this.bindings.get(structureId);
    if (!binding?.meshes.length || !this.removed.has(structureId)) return false;
    this.killAnimation(structureId);
    this.removed.delete(structureId);
    if (this.isolatedStructureId && this.isolatedStructureId !== structureId) this.isolatedStructureId = null;
    if (!keepRedo) {
      this.undoStack = this.undoStack.filter((id) => id !== structureId);
      this.redoStack = this.redoStack.filter((id) => id !== structureId);
    }

    const directions = binding.meshes.map((mesh) => this.outwardDirection(mesh));
    const progress = { value: 0 };
    binding.meshes.forEach((mesh, index) => {
      const original = this.originals.get(mesh);
      if (!original) return;
      mesh.visible = true;
      mesh.position.copy(original.position).addScaledVector(directions[index], 0.38);
      this.meshMaterials(mesh).forEach((material) => {
        material.transparent = true;
        material.opacity = 0;
      });
    });
    const timeline = gsap.timeline({
      onUpdate: () => {
        binding.meshes.forEach((mesh, index) => {
          const original = this.originals.get(mesh);
          if (!original) return;
          mesh.position.copy(original.position).addScaledVector(directions[index], (1 - progress.value) * 0.38);
          this.meshMaterials(mesh).forEach((material) => {
            material.opacity = progress.value;
            material.depthWrite = progress.value > 0.45;
          });
        });
        this.onRenderNeeded();
      },
      onComplete: () => {
        binding.meshes.forEach((mesh) => this.restoreMeshVisualState(mesh));
        this.animations.delete(structureId);
        this.onRenderNeeded(0.15);
      },
    }).to(progress, { value: 1, duration: 0.42, ease: "power2.out" });
    this.animations.set(structureId, timeline);
    this.resolveIsolationVisibility();
    this.updateHighlights();
    this.notify();
    return true;
  }

  undo() {
    const structureId = this.undoStack.pop();
    if (!structureId) return false;
    this.redoStack.push(structureId);
    const restored = this.restore(structureId, true);
    this.notify();
    return restored;
  }

  redo() {
    const structureId = this.redoStack.pop();
    if (!structureId) return false;
    const removed = this.remove(structureId, false);
    if (removed) this.undoStack.push(structureId);
    this.notify();
    return removed;
  }

  reset(notify = true) {
    this.animations.forEach((timeline) => timeline.kill());
    this.animations.clear();
    this.removed.clear();
    this.clearState();
    this.bindings.forEach((binding) => binding.meshes.forEach((mesh) => this.restoreMeshVisualState(mesh)));
    this.updateHighlights();
    if (notify) this.notify();
    this.onRenderNeeded(0.25);
  }

  applyStage(stageId: number) {
    const stage = this.config?.stages.find((item) => item.id === stageId);
    if (!this.enabled || !stage) return false;
    this.reset(false);
    this.activeStage = stage.id;
    stage.removedStructureIds.forEach((id) => this.setRemovedImmediate(id));
    this.notify();
    this.onRenderNeeded(0.25);
    return true;
  }

  isolate(structureId: string) {
    if (!this.enabled || !this.bindings.has(structureId)) return false;
    this.isolatedStructureId = this.isolatedStructureId === structureId ? null : structureId;
    this.resolveIsolationVisibility();
    this.notify();
    this.onRenderNeeded(0.25);
    return this.isolatedStructureId === structureId;
  }

  structureCenter(structureId: string) {
    const binding = this.bindings.get(structureId);
    if (!binding?.meshes.length) return null;
    const box = new THREE.Box3();
    binding.meshes.forEach((mesh) => box.expandByObject(mesh));
    return box.isEmpty() ? null : box.getCenter(new THREE.Vector3());
  }

  private cloneInteractiveMaterials() {
    this.bindings.forEach((binding) => {
      binding.meshes.forEach((mesh) => {
        if (this.originals.has(mesh)) return;
        this.originals.set(mesh, {
          material: mesh.material as MeshMaterial,
          position: mesh.position.clone(),
          quaternion: mesh.quaternion.clone(),
          scale: mesh.scale.clone(),
          visible: mesh.visible,
        });
        const originals = this.meshMaterials(mesh);
        const clones = originals.map((material) => material.clone());
        mesh.material = (Array.isArray(mesh.material) ? clones : clones[0]) as MeshMaterial;
        clones.forEach((material) => {
          const visual: MaterialVisualState = { material };
          if ("color" in material && material.color instanceof THREE.Color) visual.color = material.color.clone();
          if (material instanceof THREE.MeshStandardMaterial) {
            visual.emissive = material.emissive.clone();
            visual.emissiveIntensity = material.emissiveIntensity;
          }
          this.visuals.push(visual);
        });
      });
    });
  }

  private restoreOriginalModel() {
    this.animations.forEach((timeline) => timeline.kill());
    this.animations.clear();
    this.originals.forEach((original, mesh) => {
      this.meshMaterials(mesh).forEach((material) => material.dispose());
      mesh.material = original.material;
      mesh.position.copy(original.position);
      mesh.quaternion.copy(original.quaternion);
      mesh.scale.copy(original.scale);
      mesh.visible = original.visible;
    });
    this.originals.clear();
    this.visuals = [];
  }

  private restoreMeshVisualState(mesh: THREE.Mesh) {
    const original = this.originals.get(mesh);
    if (!original) return;
    mesh.position.copy(original.position);
    mesh.quaternion.copy(original.quaternion);
    mesh.scale.copy(original.scale);
    mesh.visible = original.visible;
    this.meshMaterials(mesh).forEach((material) => {
      material.transparent = false;
      material.opacity = 1;
      material.depthWrite = true;
      material.needsUpdate = true;
    });
  }

  private updateHighlights() {
    for (const visual of this.visuals) {
      if (visual.color && "color" in visual.material && visual.material.color instanceof THREE.Color) visual.material.color.copy(visual.color);
      if (visual.emissive && visual.material instanceof THREE.MeshStandardMaterial) {
        visual.material.emissive.copy(visual.emissive);
        visual.material.emissiveIntensity = visual.emissiveIntensity ?? 0;
      }
    }
    this.bindings.forEach((binding, structureId) => {
      const selected = structureId === this.selectedStructureId;
      const hovered = structureId === this.hoveredStructureId;
      if (!selected && !hovered) return;
      binding.meshes.forEach((mesh) => this.meshMaterials(mesh).forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.emissive.set(selected ? 0xe5154f : 0xb84c70);
          material.emissiveIntensity = selected ? 0.42 : 0.18;
        } else if ("color" in material && material.color instanceof THREE.Color) {
          material.color.lerp(new THREE.Color(0xe5154f), selected ? 0.28 : 0.12);
        }
      }));
    });
  }

  private resolveIsolationVisibility() {
    this.bindings.forEach((binding, structureId) => binding.meshes.forEach((mesh) => {
      const original = this.originals.get(mesh);
      const allowed = !this.isolatedStructureId || this.isolatedStructureId === structureId;
      mesh.visible = Boolean(original?.visible) && allowed && !this.removed.has(structureId);
    }));
  }

  private setRemovedImmediate(structureId: string) {
    const binding = this.bindings.get(structureId);
    if (!binding?.definition.removable) return;
    this.removed.add(structureId);
    binding.meshes.forEach((mesh) => (mesh.visible = false));
  }

  private outwardDirection(mesh: THREE.Mesh) {
    const center = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
    const pivotCenter = this.pivot ? new THREE.Box3().setFromObject(this.pivot).getCenter(new THREE.Vector3()) : new THREE.Vector3();
    const worldDirection = center.sub(pivotCenter);
    if (worldDirection.lengthSq() < 1e-5) worldDirection.set(0, 0, 1);
    worldDirection.normalize();
    const parentQuaternion = mesh.parent?.getWorldQuaternion(new THREE.Quaternion()) ?? new THREE.Quaternion();
    return worldDirection.applyQuaternion(parentQuaternion.invert()).normalize();
  }

  private meshMaterials(mesh: THREE.Mesh) {
    return (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.Material[];
  }

  private killAnimation(structureId: string) {
    this.animations.get(structureId)?.kill();
    this.animations.delete(structureId);
  }

  private clearState() {
    this.selectedStructureId = null;
    this.hoveredStructureId = null;
    this.isolatedStructureId = null;
    this.removed.clear();
    this.undoStack = [];
    this.redoStack = [];
    this.activeStage = this.config?.stages[0]?.id ?? 0;
  }

  private notify() {
    this.onChange(this.snapshot());
  }
}
