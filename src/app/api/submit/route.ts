import { NextResponse } from "next/server";
import { intelligenceQuestionnaire, questionnaire, type Questionnaire } from "@/lib/questionnaire";

export async function POST(request: Request) {
  const body = (await request.json()) as { answers?: Record<string, number>; questionnaireId?: string };
  const selectedQuestionnaire: Questionnaire = body.questionnaireId === intelligenceQuestionnaire.id ? intelligenceQuestionnaire : questionnaire;
  const answers = body.answers ?? {};
  const missing = selectedQuestionnaire.questions.filter((question) => question.required && typeof answers[question.id] !== "number");

  if (missing.length > 0) {
    return NextResponse.json({ error: "יש שאלות שעדיין מחכות לתשובה.", missing: missing.map((question) => question.id) }, { status: 400 });
  }

  const results = selectedQuestionnaire.dimensions.map((dimension) => {
    const rules = selectedQuestionnaire.scoringRules.filter((rule) => rule.dimensionId === dimension.id);
    const weightedTotal = rules.reduce((sum, rule) => {
      const value = answers[rule.questionId];
      const normalized = rule.reverseScored ? 6 - value : value;
      return sum + normalized * rule.weight;
    }, 0);
    const max = rules.reduce((sum, rule) => sum + 5 * rule.weight, 0);
    const score = Math.round((weightedTotal / max) * 100);
    const band = score >= 75 ? "בולטת אצלך" : score >= 45 ? "מתפתחת אצלך" : "כדאי לתת לה מקום";
    return { dimensionId: dimension.id, score, band };
  });

  return NextResponse.json({ results });
}
