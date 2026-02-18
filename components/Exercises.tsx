"use client";

import { useMemo, useState } from "react";
import { Exercise, Question } from "@/lib/types";

function McqExercise({ exercise }: { exercise: Exercise & { kind: "mcq" } }) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="exercise">
      <strong>{exercise.prompt}</strong>
      <div className="stack">
        {exercise.options.map((option) => {
          const checked = selected.includes(option.id);
          return (
            <label key={option.id}>
              <input
                type={exercise.multi ? "checkbox" : "radio"}
                name={exercise.id}
                checked={checked}
                onChange={() => {
                  if (exercise.multi) {
                    setSelected((prev) =>
                      prev.includes(option.id)
                        ? prev.filter((id) => id !== option.id)
                        : [...prev, option.id]
                    );
                  } else {
                    setSelected([option.id]);
                  }
                }}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ShortTextExercise({ exercise }: { exercise: Exercise & { kind: "short_text" } }) {
  const [text, setText] = useState("");
  return (
    <div className="exercise">
      <strong>{exercise.prompt}</strong>
      <textarea
        rows={3}
        placeholder={exercise.placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <div className="notice">Your answer is stored when you submit the module test.</div>
    </div>
  );
}

function DragDropExercise({ exercise }: { exercise: Exercise & { kind: "drag_drop" } }) {
  const [assignments, setAssignments] = useState<Record<string, string | null>>(
    Object.fromEntries(exercise.items.map((item) => [item.id, null]))
  );

  const itemsById = useMemo(
    () => Object.fromEntries(exercise.items.map((item) => [item.id, item])),
    [exercise.items]
  );

  return (
    <div className="exercise">
      <strong>{exercise.prompt}</strong>
      <div className="drag-zone">
        {exercise.items.map((item) => (
          <div
            key={item.id}
            className="drag-item"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", item.id);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className="drag-zone">
        {exercise.buckets.map((bucket) => (
          <div
            key={bucket.id}
            className="drop-bucket"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const itemId = event.dataTransfer.getData("text/plain");
              if (!itemId) return;
              setAssignments((prev) => ({ ...prev, [itemId]: bucket.id }));
            }}
          >
            <strong>{bucket.label}</strong>
            <div className="notice">
              {Object.entries(assignments)
                .filter(([, bucketId]) => bucketId === bucket.id)
                .map(([itemId]) => itemsById[itemId]?.label)
                .join(", ") || "Drop items here"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Exercises({ title, items }: { title: string; items: Exercise[] | Question[] }) {
  return (
    <div className="stack">
      <h3>{title}</h3>
      {items.map((exercise) => {
        switch (exercise.kind) {
          case "mcq":
            return <McqExercise key={exercise.id} exercise={exercise} />;
          case "short_text":
            return <ShortTextExercise key={exercise.id} exercise={exercise} />;
          case "drag_drop":
            return <DragDropExercise key={exercise.id} exercise={exercise} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
