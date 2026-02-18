import { Module, Section, ReportRow, AttemptHistoryRow } from "./types";

export const sections: Section[] = [
  {
    id: "level-1",
    level: "Level 1",
    title: "Foundations",
    description: "Core paid media concepts for new hires.",
    order: 1,
    finalExam: [
      {
        id: "l1-final-1",
        kind: "mcq",
        prompt: "Which metric best reflects landing page effectiveness?",
        options: [
          { id: "a", label: "Click-through rate" },
          { id: "b", label: "Conversion rate" },
          { id: "c", label: "Impressions" }
        ],
        multi: false,
        points: 10
      }
    ]
  },
  {
    id: "level-2",
    level: "Level 2",
    title: "Planning & Structuring",
    description: "Build campaigns with clear intent and budget control.",
    order: 2,
    finalExam: [
      {
        id: "l2-final-1",
        kind: "short_text",
        prompt: "Name one signal that indicates creative fatigue.",
        placeholder: "Type your answer...",
        points: 10
      }
    ]
  }
];

export const modules: Module[] = [
  {
    id: "module-1",
    sectionId: "level-1",
    title: "Paid Media System Map",
    description: "Understand the flow from audience to conversion.",
    order: 1,
    passingScore: 80,
    content: [
      {
        id: "c1",
        type: "text",
        data: {
          text: "Paid media systems start with a clear offer, flow through targeting, and end at conversion measurement."
        }
      },
      {
        id: "c2",
        type: "callout",
        data: {
          text: "Principle: Always define success metrics before launching spend."
        }
      },
      {
        id: "c3",
        type: "diagram",
        data: {
          mermaid: "graph TD; Offer-->Targeting; Targeting-->Creative; Creative-->Landing; Landing-->Conversion; Conversion-->Reporting;"
        }
      },
      {
        id: "c3b",
        type: "media",
        data: {
          kind: "video",
          url: "/sample-walkthrough.mp4",
          caption: "Replace with your internal walkthrough video."
        }
      },
      {
        id: "c4",
        type: "table",
        data: {
          headers: ["Stage", "Key Question", "Owner"],
          rows: [
            ["Offer", "What outcome are we selling?", "Strategy"],
            ["Creative", "What message wins attention?", "Creative"],
            ["Conversion", "Where is the drop-off?", "Performance"]
          ]
        }
      }
    ],
    practice: [
      {
        id: "p1",
        kind: "mcq",
        prompt: "Which stage validates whether ads work?",
        options: [
          { id: "a", label: "Offer" },
          { id: "b", label: "Conversion" },
          { id: "c", label: "Reporting" }
        ],
        multi: false
      },
      {
        id: "p2",
        kind: "short_text",
        prompt: "Write a one-sentence definition of a success metric.",
        placeholder: "Your definition..."
      },
      {
        id: "p3",
        kind: "drag_drop",
        prompt: "Match each role to the stage they own.",
        buckets: [
          { id: "b1", label: "Strategy" },
          { id: "b2", label: "Creative" },
          { id: "b3", label: "Performance" }
        ],
        items: [
          { id: "i1", label: "Offer" },
          { id: "i2", label: "Creative" },
          { id: "i3", label: "Conversion" }
        ]
      }
    ],
    test: [
      {
        id: "t1",
        kind: "mcq",
        prompt: "Which stage is most responsible for message-market fit?",
        options: [
          { id: "a", label: "Targeting" },
          { id: "b", label: "Creative" },
          { id: "c", label: "Reporting" }
        ],
        multi: false,
        correct: ["b"],
        points: 10
      }
    ]
  },
  {
    id: "module-2",
    sectionId: "level-1",
    title: "Signal Hygiene",
    description: "Keep your tracking and reporting clean.",
    order: 2,
    passingScore: 80,
    content: [
      {
        id: "c5",
        type: "text",
        data: {
          text: "Signal hygiene means ensuring events, UTMs, and naming conventions stay consistent."
        }
      },
      {
        id: "c5b",
        type: "media",
        data: {
          kind: "audio",
          url: "/sample-audio.mp3",
          caption: "Replace with your internal audio briefing."
        }
      },
      {
        id: "c6",
        type: "example",
        data: {
          title: "Naming Template",
          text: "Client_Product_Audience_Goal_Q1"
        }
      }
    ],
    practice: [
      {
        id: "p4",
        kind: "mcq",
        prompt: "Which UTM parameter tracks ad variations?",
        options: [
          { id: "a", label: "utm_campaign" },
          { id: "b", label: "utm_content" },
          { id: "c", label: "utm_source" }
        ],
        multi: false
      }
    ],
    test: [
      {
        id: "t2",
        kind: "short_text",
        prompt: "List one reason to standardize naming conventions.",
        placeholder: "Your answer...",
        acceptable: ["clarity", "consistency", "reporting", "attribution"],
        points: 10
      }
    ]
  }
];

export const reportRows: ReportRow[] = [
  {
    label: "Level 1",
    completionRate: 0.62,
    averageScore: 86,
    passCount: 14,
    failCount: 3
  },
  {
    label: "Module: Paid Media System Map",
    completionRate: 0.8,
    averageScore: 88,
    passCount: 17,
    failCount: 2
  }
];

export const attemptHistory: AttemptHistoryRow[] = [
  {
    id: "attempt-1",
    userLabel: "Demo User",
    targetLabel: "Paid Media System Map",
    kind: "MODULE_TEST",
    score: 10,
    maxScore: 10,
    passed: true,
    createdAt: "2026-02-18T02:30:00.000Z"
  }
];
