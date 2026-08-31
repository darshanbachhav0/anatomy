"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { Organ } from "../../lib/anatomy-data";
import { createQuiz } from "../../lib/lesson-data";

export function Quiz({ organ, onComplete, onBack }: { organ: Organ; onComplete: (score: number) => void; onBack: () => void }) {
  const questions = useMemo(() => createQuiz(organ), [organ]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const question = questions[questionIndex];

  const answer = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setCorrect((value) => value + 1);
  };

  const next = () => {
    const finalCorrect = correct;
    if (questionIndex === questions.length - 1) {
      const score = Math.round((finalCorrect / questions.length) * 100);
      setResult(score);
      onComplete(score);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelected(null);
  };

  const retry = () => {
    setQuestionIndex(0);
    setSelected(null);
    setCorrect(0);
    setResult(null);
  };

  if (result !== null) {
    return (
      <section className="quiz-result" aria-live="polite">
        <span className="quiz-score">{result}%</span>
        <h2>Resultado</h2>
        <p>{correct} / {questions.length} respuestas correctas</p>
        <div className="detail-actions">
          <button type="button" className="secondary-action" onClick={retry}><RotateCcw size={15} /> Reintentar</button>
          <button type="button" className="primary-action" onClick={onBack}>Volver a la lección</button>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-shell">
      <div className="quiz-progress"><span>Pregunta {questionIndex + 1} de {questions.length}</span><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
      <h2>{question.prompt}</h2>
      <div className="quiz-options">
        {question.options.map((option, index) => {
          const state = selected === null ? "" : index === question.correctIndex ? "correct" : selected === index ? "incorrect" : "muted";
          return <button type="button" className={state} key={option} onClick={() => answer(index)} disabled={selected !== null}><b>{String.fromCharCode(65 + index)}.</b>{option}</button>;
        })}
      </div>
      {selected !== null && (
        <div className={`answer-feedback ${selected === question.correctIndex ? "correct" : "incorrect"}`} role="status">
          {selected === question.correctIndex ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <div><b>{selected === question.correctIndex ? "Correcto" : "Incorrecto"}</b><p>{question.explanation}</p></div>
        </div>
      )}
      {selected !== null && <button type="button" className="primary-action" onClick={next}>{questionIndex === questions.length - 1 ? "Ver resultado" : "Siguiente pregunta"}<ArrowRight size={15} /></button>}
    </section>
  );
}
