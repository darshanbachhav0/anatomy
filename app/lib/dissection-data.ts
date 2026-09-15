import type { Hotspot, OrganId } from "./anatomy-data";

export type DissectionStructureInfo = {
  location: string;
  function: string;
  note?: string;
};

export type DissectionStructure = {
  id: string;
  label: string;
  meshNames: string[];
  description: string;
  removable: boolean;
  stage: number;
  children?: string[];
  restoreOrder: number;
  info: DissectionStructureInfo;
};

export type DissectionStage = {
  id: number;
  label: string;
  description: string;
  removedStructureIds: string[];
};

export type DissectionModelReport = {
  meshCount: number;
  meshNames: string[];
  internalStructures: string[];
  limitation: string;
};

export type DissectionConfig = {
  organId: OrganId;
  organLabel: string;
  structures: DissectionStructure[];
  stages: DissectionStage[];
  internalHotspots: Hotspot[];
  modelReport: DissectionModelReport;
};

const heartDissection: DissectionConfig = {
  organId: "heart",
  organLabel: "Corazón",
  structures: [
    {
      id: "heart-unified-exterior",
      label: "Superficie externa unificada",
      meshNames: [
        "tripo_node_9c16954f-d29a-4a4b-baf4-ba02eda23201",
        "tripo_mesh_9c16954f-d29a-4a4b-baf4-ba02eda23201",
      ],
      description: "Superficie visible completa del corazón contenida en una única malla continua.",
      removable: false,
      stage: 0,
      restoreOrder: 0,
      info: {
        location: "Mediastino medio, dentro del pericardio y detrás del esternón.",
        function: "Representa la morfología externa del corazón y el origen visible de los grandes vasos.",
        note: "El archivo actual no separa paredes, cámaras, válvulas ni vasos en piezas independientes.",
      },
    },
  ],
  stages: [
    {
      id: 0,
      label: "Corazón completo",
      description: "Vista superficial disponible en el modelo actual.",
      removedStructureIds: [],
    },
  ],
  internalHotspots: [],
  modelReport: {
    meshCount: 1,
    meshNames: ["tripo_node_9c16954f-d29a-4a4b-baf4-ba02eda23201"],
    internalStructures: [],
    limitation: "El GLB contiene una sola malla exterior. No existen piezas internas separadas que puedan retirarse sin ocultar el corazón completo.",
  },
};

export const dissectionConfigs: Partial<Record<OrganId, DissectionConfig>> = {
  heart: heartDissection,
};

export function getDissectionConfig(organId: OrganId) {
  return dissectionConfigs[organId] ?? null;
}
