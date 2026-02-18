import { Question } from "@/lib/types";
import { AnswerValue } from "@/components/Exercises";

export type GradedAnswer = {
  questionId: string;
  correct: boolean;
  score: number;
  response: AnswerValue;
};

export function gradeModuleTest({
  questions,
  answers
}: {
  questions: Question[];
  answers: Record<string, AnswerValue | undefined>;
}) {
  let score = 0;
  let maxScore = 0;
  const graded: GradedAnswer[] = [];

  for (const question of questions) {
    const answer = answers[question.id];
    maxScore += question.points;

    let correct = false;
    if (question.kind === "mcq" && answer?.kind === "mcq") {
      const expected = new Set(question.correct ?? []);
      const received = new Set(answer.value);
      correct = expected.size === received.size && [...expected].every((id) => received.has(id));
    }

    if (question.kind === "short_text" && answer?.kind === "short_text") {
      const acceptable = (question.acceptable ?? []).map((item) => item.toLowerCase());
      const response = answer.value.toLowerCase();
      correct = acceptable.some((item) => response.includes(item));
    }

    if (question.kind === "drag_drop" && answer?.kind === "drag_drop") {
      const expected = question.correctBuckets as Record<string, string> | undefined;
      if (expected) {
        correct = Object.entries(expected).every(
          ([itemId, bucketId]) => answer.value[itemId] === bucketId
        );
      }
    }

    const earned = correct ? question.points : 0;
    score += earned;
    graded.push({
      questionId: question.id,
      correct,
      score: earned,
      response: answer ?? { kind: question.kind, value: "" as any }
    });
  }

  return { score, maxScore, graded };
}
