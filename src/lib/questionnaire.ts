export type QuestionType = "likert" | "single_choice" | "yes_no" | "text";

export type Question = {
  id: string;
  sectionId: string;
  type: QuestionType;
  prompt: string;
  required: boolean;
  options: { id: string; label: string; value: number }[];
};

export type ScoringRule = {
  questionId: string;
  dimensionId: string;
  weight: number;
  reverseScored: boolean;
};

export type Dimension = {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
};

export const questionnaire = {
  id: "getting-to-know-me",
  title: "המצפן האישי שלי",
  category: "היכרות עצמית",
  estimatedMinutes: 5,
  version: 1,
  sections: [
    { id: "daily", title: "איך אני מתנהל ביום יום?" },
    { id: "people", title: "איך אני עם אנשים?" }
  ],
  questions: [
    {
      id: "q1",
      sectionId: "daily",
      type: "likert" as const,
      prompt: "כשיש לי משימה חדשה, אני אוהב/ת להתחיל ולגלות תוך כדי.",
      required: true,
      options: [
        { id: "q1-1", label: "בכלל לא נכון", value: 1 },
        { id: "q1-2", label: "לא כל כך", value: 2 },
        { id: "q1-3", label: "לפעמים", value: 3 },
        { id: "q1-4", label: "די נכון", value: 4 },
        { id: "q1-5", label: "מאוד נכון", value: 5 }
      ]
    },
    {
      id: "q2",
      sectionId: "daily",
      type: "likert" as const,
      prompt: "אני מצליח/ה להתרכז גם כשיש סביבי רעש או הסחות דעת.",
      required: true,
      options: [
        { id: "q2-1", label: "בכלל לא נכון", value: 1 },
        { id: "q2-2", label: "לא כל כך", value: 2 },
        { id: "q2-3", label: "לפעמים", value: 3 },
        { id: "q2-4", label: "די נכון", value: 4 },
        { id: "q2-5", label: "מאוד נכון", value: 5 }
      ]
    },
    {
      id: "q3",
      sectionId: "people",
      type: "likert" as const,
      prompt: "קל לי לשתף אחרים ברעיונות ובמחשבות שלי.",
      required: true,
      options: [
        { id: "q3-1", label: "בכלל לא נכון", value: 1 },
        { id: "q3-2", label: "לא כל כך", value: 2 },
        { id: "q3-3", label: "לפעמים", value: 3 },
        { id: "q3-4", label: "די נכון", value: 4 },
        { id: "q3-5", label: "מאוד נכון", value: 5 }
      ]
    },
    {
      id: "q4",
      sectionId: "people",
      type: "likert" as const,
      prompt: "כשחבר/ה צריך/ה עזרה, אני שם/ה לב ומנסה לעזור.",
      required: true,
      options: [
        { id: "q4-1", label: "בכלל לא נכון", value: 1 },
        { id: "q4-2", label: "לא כל כך", value: 2 },
        { id: "q4-3", label: "לפעמים", value: 3 },
        { id: "q4-4", label: "די נכון", value: 4 },
        { id: "q4-5", label: "מאוד נכון", value: 5 }
      ]
    }
  ] satisfies Question[],
  dimensions: [
    { id: "initiative", name: "יוזמה וסקרנות", color: "coral", icon: "✦", description: "היכולת שלך לנסות, לגלות ולצאת לדרך." },
    { id: "focus", name: "מיקוד והתמדה", color: "blue", icon: "◒", description: "הדרך שבה את/ה שומר/ת על ריכוז ומתקדם/ת." },
    { id: "connection", name: "חיבור לאחרים", color: "mint", icon: "♡", description: "הרגישות והפתיחות שאת/ה מביא/ה לקשרים." }
  ] satisfies Dimension[],
  scoringRules: [
    { questionId: "q1", dimensionId: "initiative", weight: 1, reverseScored: false },
    { questionId: "q2", dimensionId: "focus", weight: 1, reverseScored: false },
    { questionId: "q3", dimensionId: "connection", weight: 1, reverseScored: false },
    { questionId: "q4", dimensionId: "connection", weight: 1, reverseScored: false }
  ] satisfies ScoringRule[]
};

export type Questionnaire = typeof questionnaire;
