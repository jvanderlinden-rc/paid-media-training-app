export type ContentBlock =
  | { id: string; type: "text"; data: { text: string } }
  | { id: string; type: "callout"; data: { text: string } }
  | { id: string; type: "diagram"; data: { mermaid: string } }
  | { id: string; type: "media"; data: { kind: "video" | "audio"; url: string; caption?: string } }
  | { id: string; type: "table"; data: { headers: string[]; rows: string[][] } }
  | { id: string; type: "example"; data: { title: string; text: string } };

export type Exercise =
  | {
      id: string;
      kind: "mcq";
      prompt: string;
      options: { id: string; label: string }[];
      multi: boolean;
      correct?: string[];
    }
  | {
      id: string;
      kind: "short_text";
      prompt: string;
      placeholder: string;
      acceptable?: string[];
    }
  | {
      id: string;
      kind: "drag_drop";
      prompt: string;
      buckets: { id: string; label: string }[];
      items: { id: string; label: string }[];
      correctBuckets?: Record<string, string>;
    };

export type Question = Exercise & {
  points: number;
};

export type Module = {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  order: number;
  passingScore: number;
  content: ContentBlock[];
  practice: Exercise[];
  test: Question[];
};

export type Section = {
  id: string;
  level: string;
  title: string;
  description: string;
  order: number;
  finalExam: Question[];
};

export type ReportRow = {
  label: string;
  completionRate: number;
  averageScore: number;
  passCount: number;
  failCount: number;
};

export type AttemptHistoryRow = {
  id: string;
  userLabel: string;
  targetLabel: string;
  kind: string;
  score: number;
  maxScore: number;
  passed: boolean;
  createdAt: string;
};
