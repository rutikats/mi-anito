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

export type Questionnaire = {
  id: string;
  title: string;
  category: string;
  estimatedMinutes: number;
  version: number;
  sections: { id: string; title: string }[];
  questions: Question[];
  dimensions: Dimension[];
  scoringRules: ScoringRule[];
};

const intelligenceOptions = [
  { id: "int-1", label: "בכלל לא נכון", value: 1 },
  { id: "int-2", label: "מעט נכון", value: 2 },
  { id: "int-3", label: "לפעמים נכון", value: 3 },
  { id: "int-4", label: "די נכון", value: 4 },
  { id: "int-5", label: "מאוד נכון", value: 5 }
];

const intelligenceDimensions: Dimension[] = [
  { id: "linguistic", name: "מילולית", color: "coral", icon: "Aa", description: "היכולת שלך לשחק עם מילים, להסביר רעיונות ולספר סיפור." },
  { id: "logical", name: "לוגית־מתמטית", color: "blue", icon: "∑", description: "הדרך שבה את מזהה דפוסים, מנתחת ומחפשת פתרונות." },
  { id: "visual", name: "מרחבית־חזותית", color: "mint", icon: "◇", description: "היכולת שלך לחשוב בתמונות, צורות, צבעים ומרחב." },
  { id: "musical", name: "מוזיקלית", color: "gold", icon: "♫", description: "הרגישות שלך לקצב, צליל, מנגינה והבעה דרך מוזיקה." },
  { id: "bodily", name: "גופנית־תנועתית", color: "coral", icon: "↗", description: "הדרך שבה הגוף, התנועה והעשייה עוזרים לך ללמוד." },
  { id: "interpersonal", name: "בין־אישית", color: "blue", icon: "♡", description: "היכולת שלך להבין אנשים, לשתף פעולה ולבנות קשר." },
  { id: "intrapersonal", name: "תוך־אישית", color: "mint", icon: "◉", description: "היכולת שלך להכיר את עצמך, להקשיב פנימה ולכוון את עצמך." },
  { id: "naturalistic", name: "טבעית", color: "gold", icon: "✿", description: "החיבור שלך לטבע, לסביבה ולזיהוי תופעות בעולם." }
];

const intelligencePrompts: Record<string, { dimensionId: string; prompts: string[] }> = {
  linguistic: { dimensionId: "linguistic", prompts: ["אני נהנית לקרוא, לכתוב או לספר סיפורים.", "קל לי להסביר רעיון מורכב במילים פשוטות."] },
  logical: { dimensionId: "logical", prompts: ["אני אוהבת לחפש דפוסים, סדר והיגיון בדברים.", "כשיש בעיה, אני מפרקת אותה לחלקים ומחפשת פתרון."] },
  visual: { dimensionId: "visual", prompts: ["אני זוכרת דברים טוב יותר כשאני רואה אותם בתמונה או בתרשים.", "קל לי לדמיין איך דברים נראים או מסודרים במרחב."] },
  musical: { dimensionId: "musical", prompts: ["אני שמה לב למנגינות, מקצבים וצלילים סביבי.", "מוזיקה עוזרת לי לזכור, להתרכז או לבטא את עצמי."] },
  bodily: { dimensionId: "bodily", prompts: ["אני מבינה דברים טוב יותר כשאני מתנסה או עושה בעצמי.", "תנועה, משחק או שימוש בידיים עוזרים לי לחשוב."] },
  interpersonal: { dimensionId: "interpersonal", prompts: ["אני קולטת בקלות מה אנשים אחרים מרגישים או צריכים.", "אני נהנית ללמוד יחד, להקשיב ולבנות רעיון עם אחרים."] },
  intrapersonal: { dimensionId: "intrapersonal", prompts: ["אני יודעת לזהות מה אני מרגישה ומה עוזר לי להתקדם.", "אני אוהבת לעצור, לחשוב על חוויה ולהפיק ממנה תובנה."] },
  naturalistic: { dimensionId: "naturalistic", prompts: ["אני סקרנית לגבי הטבע, בעלי חיים ותופעות בסביבה.", "אני שמה לב להבדלים, למיון ולקשרים בין דברים בעולם."] }
};

const intelligenceQuestions: Question[] = Object.entries(intelligencePrompts).flatMap(([key, item], index) =>
  item.prompts.map((prompt, promptIndex) => ({
    id: `int-${index + 1}-${promptIndex + 1}`,
    sectionId: index < 4 ? "ways-of-thinking" : "ways-of-connecting",
    type: "likert" as const,
    prompt,
    required: true,
    options: intelligenceOptions.map((option) => ({ ...option, id: `${key}-${option.id}` }))
  }))
);

export const intelligenceQuestionnaire: Questionnaire = {
  id: "intelligences",
  title: "האינטליגנציות שלי",
  category: "פדגוגיה מעשית",
  estimatedMinutes: 7,
  version: 1,
  sections: [
    { id: "ways-of-thinking", title: "איך אני חושבת ולומדת?" },
    { id: "ways-of-connecting", title: "איך אני מחוברת לעולם?" }
  ],
  questions: intelligenceQuestions,
  dimensions: intelligenceDimensions,
  scoringRules: intelligenceQuestions.map((question) => {
    const dimensionIndex = Number(question.id.split("-")[1]) - 1;
    return { questionId: question.id, dimensionId: Object.values(intelligencePrompts)[dimensionIndex].dimensionId, weight: 1, reverseScored: false };
  })
};
