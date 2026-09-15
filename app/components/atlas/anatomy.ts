export type SystemId = 'skeletal' | 'muscular' | 'arterial' | 'venous' | 'nervous' | 'digestive' | 'respiratory' | 'urinary' | 'reproductive' | 'lymphatic' | 'endocrine' | 'integumentary' | 'connective' | 'sensory' | 'cardiac';
export const SYSTEMS: {
    id: SystemId;
    name: string;
    color: string;
    description: string;
}[] = [
    {
        "id": "skeletal",
        "name": "Esqueleto",
        "color": "#d8c7a6",
        "description": "Los huesos sostienen el cuerpo, protegen los órganos y proporcionan puntos de inserción a los músculos."
    },
    {
        "id": "muscular",
        "name": "Músculos",
        "color": "#ad6259",
        "description": "Los músculos esqueléticos generan movimiento, estabilizan la postura y producen calor."
    },
    {
        "id": "cardiac",
        "name": "Corazón",
        "color": "#c95873",
        "description": "El corazón impulsa la sangre. Sus cámaras y válvulas organizan el flujo a través de la circulación pulmonar y sistémica."
    },
    {
        "id": "sensory",
        "name": "Órganos sensoriales",
        "color": "#99bcc5",
        "description": "Estructuras de la visión, la audición y el equilibrio, conectadas con el sistema nervioso."
    },
    {
        "id": "arterial",
        "name": "Arterias",
        "color": "#cc584d",
        "description": "Las arterias conducen sangre desde el corazón hacia los tejidos o los pulmones."
    },
    {
        "id": "venous",
        "name": "Venas",
        "color": "#638eaf",
        "description": "Las venas devuelven la sangre al corazón desde los tejidos y los pulmones."
    },
    {
        "id": "nervous",
        "name": "Sistema nervioso",
        "color": "#d9b25d",
        "description": "El encéfalo, la médula espinal y los nervios procesan señales y coordinan las funciones del cuerpo."
    },
    {
        "id": "respiratory",
        "name": "Sistema respiratorio",
        "color": "#c08d9d",
        "description": "Las vías respiratorias conducen aire a los pulmones, donde se intercambian oxígeno y dióxido de carbono."
    },
    {
        "id": "digestive",
        "name": "Sistema digestivo",
        "color": "#bb966f",
        "description": "El tubo digestivo y sus órganos asociados procesan alimentos y absorben nutrientes y agua."
    },
    {
        "id": "urinary",
        "name": "Sistema urinario",
        "color": "#b87866",
        "description": "Los riñones filtran la sangre y regulan el equilibrio de líquidos. La orina pasa por los uréteres hacia la vejiga."
    },
    {
        "id": "lymphatic",
        "name": "Sistema linfático",
        "color": "#829e79",
        "description": "Los vasos linfáticos devuelven líquido de los tejidos a la circulación. Los órganos linfoides participan en la respuesta inmunitaria."
    },
    {
        "id": "endocrine",
        "name": "Sistema endocrino",
        "color": "#be97b3",
        "description": "Las glándulas endocrinas liberan hormonas que coordinan procesos como el metabolismo, el crecimiento y la reproducción."
    },
    {
        "id": "reproductive",
        "name": "Sistema reproductor",
        "color": "#ba8c93",
        "description": "Este modelo representa anatomía masculina: estructuras relacionadas con la producción y el transporte de espermatozoides."
    },
    {
        "id": "integumentary",
        "name": "Superficie corporal",
        "color": "#c7a58c",
        "description": "La superficie corporal proporciona una referencia exterior. Se muestra translúcida para facilitar la exploración."
    },
    {
        "id": "connective",
        "name": "Tejido conectivo",
        "color": "#99b7ad",
        "description": "Cartílagos, ligamentos y otros tejidos conectivos sostienen, unen y separan estructuras."
    }
];
export interface Part {
    id: string;
    name: string;
    conceptId: string;
    system: SystemId;
    chunk: number;
    positions: number;
    normals: number;
    indices: number;
    vertexCount: number;
    indexCount: number;
    bounds: [
        number[],
        number[]
    ];
}
export interface Concept {
    id: string;
    name: string;
    elements: string[];
}
export interface Atlas {
    version: string;
    sex?: 'male';
    source?: string;
    scope?: string;
    parts: Part[];
    concepts: Concept[];
    chunks: {
        url: string;
        bytes: number;
        gzip?: string;
        gzipBytes?: number;
    }[];
    triangles: number;
}
export type View = 'three-quarter' | 'front' | 'back' | 'side';
export interface SceneState {
    hidden: string[];
    scope: string[] | null;
    focus: number;
    zoom: number;
    inspectorOpen?: boolean;
    explode: number;
    visible: SystemId[];
    selected: string[];
    isolate: boolean;
    view: View;
    rotate: boolean;
    reset: number;
}
export const DEFAULT_VISIBLE: SystemId[] = ['cardiac', 'sensory', 'skeletal', 'muscular', 'arterial', 'venous', 'nervous', 'respiratory', 'digestive', 'urinary', 'lymphatic', 'endocrine', 'reproductive', 'connective'];
export const EXPLANATIONS: Record<string, string> = {
    "heart": "Órgano muscular del tórax. Su lado derecho impulsa sangre hacia los pulmones y su lado izquierdo hacia la circulación sistémica.",
    "liver": "Órgano situado bajo el diafragma derecho. Procesa nutrientes, produce bilis y sintetiza proteínas de la sangre.",
    "brain": "Órgano central del sistema nervioso. Sus regiones participan en la percepción, el movimiento, la memoria y la regulación corporal.",
    "stomach": "Cámara muscular entre el esófago y el intestino delgado. Almacena y mezcla alimentos antes de su paso al duodeno.",
    "spleen": "Órgano linfoide del abdomen superior izquierdo. Filtra la sangre y participa en las respuestas inmunitarias.",
    "pancreas": "Órgano abdominal con funciones digestivas y endocrinas. Produce enzimas y hormonas como la insulina y el glucagón.",
    "urinary bladder": "Reservorio muscular de la pelvis que almacena la orina procedente de los riñones.",
    "trachea": "Vía aérea que conecta la laringe con los bronquios. Sus cartílagos ayudan a mantenerla abierta.",
    "diaphragm": "Músculo que separa el tórax del abdomen y participa en la inspiración.",
    "mitral valve": "Válvula entre la aurícula izquierda y el ventrículo izquierdo. Aquí se representan sus dos valvas.",
    "tricuspid valve": "Válvula entre la aurícula derecha y el ventrículo derecho.",
    "aortic valve": "Válvula entre el ventrículo izquierdo y la aorta.",
    "pulmonary valve": "Válvula entre el ventrículo derecho y el tronco pulmonar."
};
export function explanation(name: string, system: SystemId) { return EXPLANATIONS[name.toLowerCase()] ?? SYSTEMS.find(s => s.id === system)?.description ?? ''; }
