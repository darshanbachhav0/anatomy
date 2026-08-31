"use client";

import { useCallback, useEffect, useState } from "react";
import type { OrganId } from "../lib/anatomy-data";
import {
  clearStoredStudentData,
  DEFAULT_STUDENT_DATA,
  loadStudentData,
  saveStudentData,
  type LessonStatus,
  type StudentData,
  type StudentNote,
  type UmaSettings,
} from "../lib/storage";

export function useUmaStudentData() {
  const [data, setData] = useState<StudentData>(DEFAULT_STUDENT_DATA);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setData(loadStudentData());
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const update = useCallback((change: (current: StudentData) => StudentData) => {
    setData((current) => {
      const next = change(current);
      saveStudentData(next);
      return next;
    });
  }, []);

  const viewOrgan = useCallback((organId: OrganId) => update((current) => ({
    ...current,
    lastOrgan: organId,
    recentOrgans: [organId, ...current.recentOrgans.filter((id) => id !== organId)].slice(0, 5),
    exploredOrgans: current.exploredOrgans.includes(organId)
      ? current.exploredOrgans
      : [...current.exploredOrgans, organId],
  })), [update]);

  const toggleFavorite = useCallback((organId: OrganId) => update((current) => ({
    ...current,
    favorites: current.favorites.includes(organId)
      ? current.favorites.filter((id) => id !== organId)
      : [...current.favorites, organId],
  })), [update]);

  const setLessonStatus = useCallback((lessonId: string, status: LessonStatus) => update((current) => ({
    ...current,
    lessonProgress: { ...current.lessonProgress, [lessonId]: status },
  })), [update]);

  const saveQuizScore = useCallback((organId: OrganId, score: number) => update((current) => ({
    ...current,
    quizScores: {
      ...current.quizScores,
      [organId]: Math.max(score, current.quizScores[organId] ?? 0),
    },
  })), [update]);

  const saveNote = useCallback((note: StudentNote) => update((current) => {
    const exists = current.notes.some((item) => item.id === note.id);
    return {
      ...current,
      notes: exists
        ? current.notes.map((item) => item.id === note.id ? note : item)
        : [note, ...current.notes],
    };
  }), [update]);

  const deleteNote = useCallback((noteId: string) => update((current) => ({
    ...current,
    notes: current.notes.filter((note) => note.id !== noteId),
  })), [update]);

  const updateSettings = useCallback((settings: Partial<UmaSettings>) => update((current) => ({
    ...current,
    settings: { ...current.settings, ...settings },
  })), [update]);

  const resetLearning = useCallback(() => update((current) => ({
    ...current,
    lessonProgress: {},
    quizScores: {},
  })), [update]);

  const clearAll = useCallback(() => {
    clearStoredStudentData();
    setData(DEFAULT_STUDENT_DATA);
  }, []);

  return {
    data,
    hydrated,
    viewOrgan,
    toggleFavorite,
    setLessonStatus,
    saveQuizScore,
    saveNote,
    deleteNote,
    updateSettings,
    resetLearning,
    clearAll,
  };
}
