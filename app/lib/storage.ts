import type { OrganId } from "./anatomy-data";

export type LessonStatus = "pending" | "progress" | "completed";

export type StudentNote = {
  id: string;
  title: string;
  content: string;
  organId: OrganId;
  tags: string[];
  important: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UmaSettings = {
  autoRotate: boolean;
  showViewerTips: boolean;
  confirmNoteDelete: boolean;
};

export type StudentData = {
  favorites: OrganId[];
  recentOrgans: OrganId[];
  lastOrgan: OrganId | null;
  exploredOrgans: OrganId[];
  lessonProgress: Record<string, LessonStatus>;
  quizScores: Partial<Record<OrganId, number>>;
  notes: StudentNote[];
  settings: UmaSettings;
};

export const STORAGE_KEYS = {
  favorites: "uma-anatomy-v1-favorites",
  recentOrgans: "uma-anatomy-v1-recent-organs",
  lastOrgan: "uma-anatomy-v1-last-organ",
  exploredOrgans: "uma-anatomy-v1-explored-organs",
  lessonProgress: "uma-anatomy-v1-lesson-progress",
  quizScores: "uma-anatomy-v1-quiz-scores",
  notes: "uma-anatomy-v1-notes",
  settings: "uma-anatomy-v1-settings",
} as const;

export const DEFAULT_STUDENT_DATA: StudentData = {
  favorites: [],
  recentOrgans: [],
  lastOrgan: null,
  exploredOrgans: [],
  lessonProgress: {},
  quizScores: {},
  notes: [],
  settings: {
    autoRotate: true,
    showViewerTips: true,
    confirmNoteDelete: true,
  },
};

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be disabled or full. The in-memory experience still works.
  }
}

export function loadStudentData(): StudentData {
  const settings = safeRead<Partial<UmaSettings>>(STORAGE_KEYS.settings, {});
  return {
    favorites: safeRead(STORAGE_KEYS.favorites, DEFAULT_STUDENT_DATA.favorites),
    recentOrgans: safeRead(STORAGE_KEYS.recentOrgans, DEFAULT_STUDENT_DATA.recentOrgans),
    lastOrgan: safeRead(STORAGE_KEYS.lastOrgan, DEFAULT_STUDENT_DATA.lastOrgan),
    exploredOrgans: safeRead(STORAGE_KEYS.exploredOrgans, DEFAULT_STUDENT_DATA.exploredOrgans),
    lessonProgress: safeRead(STORAGE_KEYS.lessonProgress, DEFAULT_STUDENT_DATA.lessonProgress),
    quizScores: safeRead(STORAGE_KEYS.quizScores, DEFAULT_STUDENT_DATA.quizScores),
    notes: safeRead(STORAGE_KEYS.notes, DEFAULT_STUDENT_DATA.notes),
    settings: { ...DEFAULT_STUDENT_DATA.settings, ...settings },
  };
}

export function saveStudentData(data: StudentData) {
  safeWrite(STORAGE_KEYS.favorites, data.favorites);
  safeWrite(STORAGE_KEYS.recentOrgans, data.recentOrgans);
  safeWrite(STORAGE_KEYS.lastOrgan, data.lastOrgan);
  safeWrite(STORAGE_KEYS.exploredOrgans, data.exploredOrgans);
  safeWrite(STORAGE_KEYS.lessonProgress, data.lessonProgress);
  safeWrite(STORAGE_KEYS.quizScores, data.quizScores);
  safeWrite(STORAGE_KEYS.notes, data.notes);
  safeWrite(STORAGE_KEYS.settings, data.settings);
}

export function clearStoredStudentData() {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore unavailable storage and reset the in-memory state.
    }
  });
}
