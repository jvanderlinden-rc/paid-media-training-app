"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/lib/types";
import { AnswerValue, TestRenderer } from "@/components/Exercises";
import { gradeModuleTest } from "@/lib/grading";
import { getDemoUserId, isStepCompleted, setModuleCompleted } from "@/lib/progressClient";

export default function ModuleTestClient({
  moduleId,
  levelId,
  questions,
  passingScore
}: {
  moduleId: string;
  levelId: string;
  questions: Question[];
  passingScore: number;
}) {
  const router = useRouter();
  const practiceComplete = isStepCompleted(moduleId, "practice");
  const [answers, setAnswers] = useState<Record<string, AnswerValue | undefined>>({});
  const [result, setResult] = useState<{ score: number; maxScore: number } | null>(null);

  const canSubmit = useMemo(
    () => questions.every((q) => answers[q.id]),
    [answers, questions]
  );

  if (!practiceComplete) {
    return <div className="callout">Complete the practice first to unlock the test.</div>;
  }

  return (
    <div className="stack">
      <TestRenderer
        items={questions}
        onAnswer={(id, answer) => setAnswers((prev) => ({ ...prev, [id]: answer }))}
      />

      <button
        className="button"
        disabled={!canSubmit}
        onClick={async () => {
          const graded = gradeModuleTest({ questions, answers });
          setResult({ score: graded.score, maxScore: graded.maxScore });
          const percentage = Math.round((graded.score / Math.max(1, graded.maxScore)) * 100);
          await fetch("/api/attempts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: getDemoUserId(),
              moduleId,
              sectionId: levelId,
              kind: "MODULE_TEST",
              score: graded.score,
              maxScore: graded.maxScore,
              passed: percentage >= passingScore,
              answers: graded.graded.map((item) => ({
                questionId: item.questionId,
                response: item.response,
                correct: item.correct,
                score: item.score
              }))
            })
          });
          if (percentage >= passingScore) {
            await setModuleCompleted(moduleId, levelId);
            router.push(`/levels/${levelId}`);
          }
        }}
      >
        Submit Module Test
      </button>

      {result && (
        <div className="callout">
          Score: {Math.round((result.score / Math.max(1, result.maxScore)) * 100)}% (minimum
          required: {passingScore}%).
        </div>
      )}
    </div>
  );
}
