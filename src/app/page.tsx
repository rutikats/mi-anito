"use client";

import { useMemo, useState } from "react";
import { intelligenceQuestionnaire, questionnaire, type Questionnaire } from "@/lib/questionnaire";

type View = "welcome" | "lesson-builder" | "self-menu" | "pedagogy" | "library" | "quiz" | "results" | "admin";
type Result = { dimensionId: string; score: number; band: string };

export default function Home() {
  const [view, setView] = useState<View>("welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<Questionnaire>(questionnaire);

  const question = activeQuestionnaire.questions[step];
  const answeredCount = Object.keys(answers).length;
  const activeSection = useMemo(() => activeQuestionnaire.sections.find((section) => section.id === question?.sectionId), [activeQuestionnaire, question]);

  function begin() {
    setView("library");
    setError("");
  }

  function choose(value: number) {
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setError("");
  }

  function next() {
    if (question.required && typeof answers[question.id] !== "number") {
      setError("כדאי לבחור תשובה כדי להמשיך");
      return;
    }
    if (step < activeQuestionnaire.questions.length - 1) setStep((current) => current + 1);
    else submit();
  }

  async function submit() {
    setView("results");
    setError("");
    const response = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers, questionnaireId: activeQuestionnaire.id }) });
    const data = (await response.json()) as { results?: Result[]; error?: string };
    if (!response.ok || !data.results) {
      setError(data.error ?? "לא הצלחנו לחשב את התוצאה.");
      setView("quiz");
      return;
    }
    setResults(data.results);
  }

  function reset() {
    setView("welcome");
    setStep(0);
    setAnswers({});
    setResults([]);
    setError("");
    setActiveQuestionnaire(questionnaire);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <button className="brand" onClick={reset} aria-label="חזרה לדף הבית">
          <span className="brand-mark">✦</span>
          <span><strong>MiAniTo</strong><small>לומדים להכיר את עצמנו</small></span>
        </button>
        <div className="header-actions">
          {view !== "welcome" && <button className="header-link" onClick={() => setView("library")}>השאלונים שלי</button>}
          <button className="avatar" onClick={() => setView("admin")} aria-label="פתיחת תפריט מנהל">מ</button>
        </div>
      </header>

      {view === "welcome" && <WelcomeScreen onBuildLesson={() => setView("lesson-builder")} onBuildSelf={() => setView("self-menu")} onAdmin={() => setView("admin")} />}
      {view === "lesson-builder" && <LessonBuilderScreen onBack={() => setView("welcome")} />}
      {view === "self-menu" && <SelfMenuScreen onBack={() => setView("welcome")} onTeacherQuiz={() => { setActiveQuestionnaire(questionnaire); setAnswers({}); setStep(0); setView("quiz"); }} onPedagogy={() => setView("pedagogy")} />}
      {view === "pedagogy" && <PedagogyScreen onBack={() => setView("self-menu")} onStart={() => { setActiveQuestionnaire(intelligenceQuestionnaire); setAnswers({}); setStep(0); setView("quiz"); }} />}
      {view === "library" && <LibraryScreen onStart={() => { setActiveQuestionnaire(questionnaire); setAnswers({}); setStep(0); setView("quiz"); }} />}
      {view === "quiz" && <QuizScreen question={question} step={step} total={activeQuestionnaire.questions.length} activeSection={activeSection?.title ?? ""} answer={answers[question.id]} error={error} onChoose={choose} onBack={() => { if (step > 0) { setStep((current) => current - 1); setError(""); } }} onNext={next} />}
      {view === "results" && <ResultsScreen results={results} activeQuestionnaire={activeQuestionnaire} onReset={reset} />}
      {view === "admin" && <AdminScreen onExit={() => setView("welcome")} />}
    </main>
  );
}

function WelcomeScreen({ onBuildLesson, onBuildSelf, onAdmin }: { onBuildLesson: () => void; onBuildSelf: () => void; onAdmin: () => void }) {
  return <section className="welcome-page">
    <div className="welcome-art" aria-hidden="true"><div className="line-art line-one" /><div className="line-art line-two" /><span className="art-dot coral-dot" /><span className="art-dot gold-dot" /><span className="art-star">✦</span></div>
    <div className="welcome-copy">
      <span className="eyebrow">מרחב למידה, יצירה והתפתחות</span>
      <h1>מה תרצי<br /><em>לבנות היום?</em></h1>
      <p>כלים חכמים שיעזרו לך לבנות שיעורים טובים יותר — ולבנות את עצמך כמורה.</p>
      <div className="home-options">
        <button className="home-option lesson-option" onClick={onBuildLesson}><span className="home-option-icon">▱</span><span><strong>לבנות שיעור</strong><small>מתכנון ראשוני ועד שיעור מוכן</small></span><b>←</b></button>
        <button className="home-option self-option" onClick={onBuildSelf}><span className="home-option-icon">✦</span><span><strong>לבנות את עצמך</strong><small>להכיר את הסגנון והחוזקות שלך</small></span><b>←</b></button>
      </div>
      <button className="text-button" onClick={onAdmin}>כניסה למנהלים</button>
    </div>
    <div className="welcome-footer"><span>מרחב בטוח להיכרות עצמית</span><span className="footer-dots">•••</span><span>התשובות שלך נשארות שלך</span></div>
  </section>;
}

function LessonBuilderScreen({ onBack }: { onBack: () => void }) {
  return <section className="content-page builder-landing"><button className="back-link" onClick={onBack}>→ חזרה לבחירה</button><div className="page-intro"><span className="eyebrow">לבנות שיעור</span><h1>השיעור שלך<br /><em>מתחיל כאן.</em></h1><p>בקרוב תבני שיעור שלם, מדויק ומותאם לכיתה שלך.</p></div><div className="coming-soon-card lesson-coming"><span className="coming-icon">▱</span><div><h2>בונה השיעורים בדרך</h2><p>נבנה יחד מטרות, רצף פעילות, שאלות טובות ורעיונות שיהפכו את השיעור לחוויה.</p><div className="coming-steps"><span>01 מטרות</span><span>02 פעילות</span><span>03 סיכום</span></div></div><button className="pill-button ghost" onClick={onBack}>בינתיים, לחזור</button></div></section>;
}

function SelfMenuScreen({ onBack, onTeacherQuiz, onPedagogy }: { onBack: () => void; onTeacherQuiz: () => void; onPedagogy: () => void }) {
  return <section className="content-page self-menu-page"><button className="back-link" onClick={onBack}>→ חזרה לבית</button><div className="page-intro"><span className="eyebrow">לבנות את עצמך</span><h1>מכירה את עצמך<br /><em>כמורה?</em></h1><p>שתי דרכים להעמיק, לדייק ולצמוח בתוך העשייה שלך.</p></div><div className="self-choice-grid"><button className="self-choice teacher-choice" onClick={onTeacherQuiz}><span className="choice-art">✦</span><span className="choice-tag">מסע אישי</span><h2>המורה שאת</h2><p>שאלון עומק שיעזור לך להבין איזה שיעור נכון לך לבנות, מה להוסיף, ובמה כדאי להתמקד.</p><strong>לצאת למסע <span>←</span></strong></button><button className="self-choice pedagogy-choice" onClick={onPedagogy}><span className="choice-art">◒</span><span className="choice-tag">ארגז כלים</span><h2>פדגוגיה מעשית</h2><p>נושאים, רעיונות ושאלונים קצרים שיעזרו לך להרחיב את המבט הפדגוגי שלך.</p><strong>לגלות כלים <span>←</span></strong></button></div></section>;
}

function PedagogyScreen({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return <section className="content-page pedagogy-page"><button className="back-link" onClick={onBack}>→ חזרה לבנות את עצמך</button><div className="page-intro"><span className="eyebrow">פדגוגיה מעשית</span><h1>כלים קטנים,<br /><em>שינוי גדול.</em></h1><p>בחרי נושא שמסקרן אותך. כל שאלון מסתיים בתובנות שאפשר לקחת ישר לכיתה.</p></div><div className="topic-grid"><button className="topic-card intelligence-topic" onClick={onStart}><span className="topic-icon">✦</span><span className="topic-status">שאלון · 5 דקות</span><h2>האינטליגנציות שלי</h2><p>באילו דרכי חשיבה את חזקה? ואילו כדאי לך לטפח?</p><span className="topic-link">מתחילות <b>←</b></span></button><button className="topic-card"><span className="topic-icon">♡</span><span className="topic-status">בקרוב · 7 דקות</span><h2>למידה רגשית־חברתית</h2><p>איך יוצרים מרחב שמאפשר לתלמידים להרגיש, לשאול ולהשתתף?</p><span className="topic-link">לפרטים <b>←</b></span></button><button className="topic-card"><span className="topic-icon">◈</span><span className="topic-status">בקרוב · 6 דקות</span><h2>למידה דיפרנציאלית</h2><p>איך מתכננים שיעור שנותן מקום לקצב ולסגנון של כל תלמידה?</p><span className="topic-link">לפרטים <b>←</b></span></button><button className="topic-card"><span className="topic-icon">↗</span><span className="topic-status">בקרוב · 4 דקות</span><h2>הערכה שמקדמת למידה</h2><p>להפוך משוב לכלי שמניע סקרנות, התנסות והתקדמות.</p><span className="topic-link">לפרטים <b>←</b></span></button></div></section>;
}

function LibraryScreen({ onStart }: { onStart: () => void }) {
  return <section className="content-page">
    <div className="page-intro"><span className="eyebrow">הספרייה שלי</span><h1>שלום, מאיה <span className="wave">👋</span></h1><p>מוכנים למסע קצר של גילוי?</p></div>
    <div className="card-grid">
      <article className="questionnaire-card featured-card">
        <div className="card-illustration"><span className="sparkle">✦</span><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="face">◡</span></div>
        <div className="card-body"><div className="card-meta"><span className="tag coral-tag">חדש</span><span>כ־5 דקות</span></div><h2>{questionnaire.title}</h2><p>שאלון קצר שיעזור לך לזהות את החוזקות והסגנון הייחודי שלך.</p><button className="pill-button primary" onClick={onStart}>מתחילים עכשיו <span>←</span></button></div>
      </article>
      <article className="questionnaire-card locked-card"><span className="lock">♢</span><h3>השאלון הבא בדרך</h3><p>עוד שאלונים מסקרנים<br />יתווספו בקרוב.</p></article>
    </div>
    <div className="privacy-note"><span>◉</span><div><strong>הפרטיות שלך חשובה לנו</strong><p>אין תשובות נכונות או לא נכונות. זהו מרחב רק בשבילך.</p></div></div>
  </section>;
}

function QuizScreen({ question, step, total, activeSection, answer, error, onChoose, onBack, onNext }: { question: Questionnaire["questions"][number]; step: number; total: number; activeSection: string; answer?: number; error: string; onChoose: (value: number) => void; onBack: () => void; onNext: () => void }) {
  return <section className="quiz-page">
    <div className="quiz-top"><div><span className="eyebrow">{activeSection}</span><div className="question-count">שאלה {String(step + 1).padStart(2, "0")} <span>מתוך {String(total).padStart(2, "0")}</span></div></div><div className="progress-ring" style={{ background: `conic-gradient(var(--coral) 0 ${((step + 1) / total) * 100}%, #dce8f1 ${((step + 1) / total) * 100}% 100%)` }}><span>{Math.round(((step + 1) / total) * 100)}%</span></div></div>
    <div className="progress-bar"><span style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
    <div className="question-wrap"><span className="question-kicker">קחי רגע לחשוב...</span><h1>{question.prompt}</h1><p className="question-hint">אין תשובה נכונה או לא נכונה</p>
      <div className="answer-scale">{question.options.map((option) => <button key={option.id} className={`answer-option ${answer === option.value ? "selected" : ""}`} onClick={() => onChoose(option.value)}><span className="answer-number">{option.value}</span><span>{option.label}</span></button>)}</div>
      {error && <p className="error-message">{error}</p>}
    </div>
    <div className="quiz-footer"><button className="pill-button back-button" onClick={onBack} disabled={step === 0}>→ חזרה</button><span className="keyboard-hint">אפשר לשנות תשובה בכל שלב</span><button className="pill-button primary large next-button" onClick={onNext}>{step === total - 1 ? "מסיימים" : "המשך"} <span>←</span></button></div>
  </section>;
}

function ResultsScreen({ results, activeQuestionnaire, onReset }: { results: Result[]; activeQuestionnaire: Questionnaire; onReset: () => void }) {
  const isIntelligence = activeQuestionnaire.id === intelligenceQuestionnaire.id;
  const sortedResults = [...results].sort((a, b) => b.score - a.score);
  const topScore = sortedResults[0]?.score ?? 0;
  const groups = isIntelligence ? [
    { key: "strong", title: "בולטות במיוחד", description: "הכוחות שקל לך להביא איתך לכיתה וללמידה.", results: sortedResults.filter((result) => result.score >= topScore - 7) },
    { key: "developing", title: "חוזקות משמעותיות", description: "יכולות שיש להן מקום טוב אצלך, ואפשר להמשיך להרחיב.", results: sortedResults.filter((result) => result.score < topScore - 7 && result.score >= 45) },
    { key: "growth", title: "כיוונים לפיתוח", description: "הזדמנויות להתנסות בדרך חדשה — לא חולשות, אלא אפשרויות.", results: sortedResults.filter((result) => result.score < 45) }
  ].filter((group) => group.results.length > 0) : [];
  const scoreCard = (result: Result) => { const dimension = activeQuestionnaire.dimensions.find((item) => item.id === result.dimensionId)!; return <article className={`score-card ${dimension.color}`} key={result.dimensionId}><div className="score-icon">{dimension.icon}</div><div><span className="score-label">{result.band}</span><h2>{dimension.name}</h2><p>{dimension.description}</p></div><div className="score-meter"><div className="meter-track"><span style={{ width: `${result.score}%` }} /></div><strong>{result.score}<small>/100</small></strong></div></article>; };
  return <section className="results-page"><div className="results-heading"><div className="result-badge">✦</div><span className="eyebrow">{isIntelligence ? "המפה הפדגוגית שלך" : "המסע שלך הושלם"}</span><h1>{isIntelligence ? <>החשיבה שלך<br /><em>מגוונת ועשירה.</em></> : <>יש לך מצפן<br /><em>ממש מיוחד.</em></>}</h1><p>{isIntelligence ? "אין אינטליגנציה אחת טובה מאחרת. לכן חילקנו את התוצאה לכמה רמות חוזק, כדי שתראי את התמונה המלאה שלך." : "הנה כמה דברים שגילינו על הדרך שבה את/ה פועל/ת בעולם."}</p></div>
    {isIntelligence ? <div className="result-groups">{groups.map((group) => <section className={`result-group ${group.key}`} key={group.key}><div className="result-group-heading"><div><span className="group-kicker">{group.results.length} {group.results.length === 1 ? "תחום" : "תחומים"}</span><h2>{group.title}</h2><p>{group.description}</p></div><span className="group-rule" /></div><div className="results-grid">{group.results.map(scoreCard)}</div></section>)}</div> : <div className="results-grid">{results.map(scoreCard)}</div>}
    <div className="results-actions"><button className="pill-button primary large" onClick={onReset}>חזרה לבית <span>←</span></button><button className="text-button" onClick={onReset}>לשמור על פרטיות ולצאת</button></div>
  </section>;
}

type AdminTab = "overview" | "builder" | "assignments" | "analytics";

function AdminScreen({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [title, setTitle] = useState(questionnaire.title);
  const [category, setCategory] = useState(questionnaire.category);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [questionPrompt, setQuestionPrompt] = useState(questionnaire.questions[0].prompt);
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const [notice, setNotice] = useState("");

  const currentQuestion = questionnaire.questions[selectedQuestion];
  const hasCompleteScoring = questionnaire.questions.every((question) => questionnaire.scoringRules.some((rule) => rule.questionId === question.id));
  const publishChecks = [
    { label: "שם וקטגוריה הוגדרו", complete: Boolean(title.trim() && category.trim()) },
    { label: "לכל שאלה יש אפשרויות תשובה", complete: questionnaire.questions.every((question) => question.options.length > 0) },
    { label: "לכל שאלה יש כלל ניקוד", complete: hasCompleteScoring },
    { label: "מימדים וטווחי פרשנות מוגדרים", complete: questionnaire.dimensions.length > 0 }
  ];
  const canPublish = publishChecks.every((check) => check.complete);

  function selectQuestion(index: number) {
    setSelectedQuestion(index);
    setQuestionPrompt(questionnaire.questions[index].prompt);
    setSaved(false);
  }

  function saveQuestion() {
    setSaved(true);
    setNotice("השינויים נשמרו כטיוטה חדשה. הגרסה שפורסמה נשארת ללא שינוי.");
  }

  function publish() {
    if (!canPublish) {
      setNotice("אי אפשר לפרסם עדיין. השלימו את כל בדיקות הפרסום.");
      return;
    }
    setPublished(true);
    setNotice("הגרסה החדשה פורסמה בהצלחה והיא זמינה לשיבוץ.");
  }

  return <section className="admin-page">
    <div className="admin-heading"><div><span className="eyebrow">מרחב ניהול</span><h1>בוקר טוב, מנהל/ת</h1><p>כאן בונים חוויות של גילוי.</p></div><button className="pill-button ghost" onClick={onExit}>יציאה לתצוגת תלמיד</button></div>
    <nav className="admin-tabs" aria-label="ניווט במרחב הניהול">
      {([["overview", "סקירה"], ["builder", "בונה שאלונים"], ["assignments", "שיבוצים"], ["analytics", "נתונים"]] as [AdminTab, string][]).map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}
    </nav>
    {notice && <div className="admin-toast" role="status"><span>✓</span>{notice}<button onClick={() => setNotice("")} aria-label="סגירת הודעה">×</button></div>}
    {tab === "overview" && <AdminOverview onBuilder={() => setTab("builder")} />}
    {tab === "assignments" && <AssignmentsPanel />}
    {tab === "analytics" && <AnalyticsPanel />}
    {tab === "builder" && <div className="builder-layout">
      <div className="builder-main">
        <div className="builder-title-row"><div><span className="eyebrow">גרסה {questionnaire.version}.1 · טיוטה</span><h2>בונה השאלון</h2></div><div className="builder-actions"><button className="pill-button ghost" onClick={saveQuestion}>שמירה כטיוטה</button><button className="pill-button primary" onClick={publish}>פרסום</button></div></div>
        <div className="builder-card metadata-card"><div className="section-heading"><span className="section-number">01</span><div><h3>פרטי השאלון</h3><p>הפרטים שיופיעו לתלמידים בספרייה.</p></div></div><div className="form-grid"><label>שם השאלון<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>קטגוריה<input value={category} onChange={(event) => setCategory(event.target.value)} /></label><label>זמן משוער<input value={`${questionnaire.estimatedMinutes} דקות`} readOnly /></label></div></div>
        <div className="builder-card"><div className="section-heading"><span className="section-number">02</span><div><h3>שאלות</h3><p>שאלה אחת תופיע בכל מסך לתלמיד.</p></div><span className="section-count">{questionnaire.questions.length} שאלות</span></div><div className="question-list">{questionnaire.questions.map((item, index) => <button key={item.id} className={`question-list-item ${index === selectedQuestion ? "selected" : ""}`} onClick={() => selectQuestion(index)}><span className="question-index">{String(index + 1).padStart(2, "0")}</span><span>{item.prompt}</span><b>{item.type === "likert" ? "סולם 1–5" : item.type}</b></button>)}</div><div className="question-editor"><label>נוסח השאלה<textarea value={questionPrompt} onChange={(event) => setQuestionPrompt(event.target.value)} /></label><div className="editor-row"><label>סוג תשובה<select defaultValue={currentQuestion.type}><option value="likert">סולם דירוג 1–5</option><option value="single_choice">בחירה יחידה</option><option value="yes_no">כן / לא</option></select></label><label className="checkbox-label"><input type="checkbox" defaultChecked={currentQuestion.required} /> שאלה חובה</label><button className="small-action" onClick={saveQuestion}>שמירת שאלה</button></div><div className="option-chips">{currentQuestion.options.map((option) => <span key={option.id}>{option.value} · {option.label}</span>)}</div></div></div>
        <div className="builder-card"><div className="section-heading"><span className="section-number">03</span><div><h3>ניקוד ומימדים</h3><p>כל תשובה מחוברת למימד ולמשקל.</p></div><button className="small-action">+ כלל ניקוד</button></div><div className="rules-table"><div className="rules-row rules-head"><span>שאלה</span><span>מימד</span><span>משקל</span><span>היפוך</span></div>{questionnaire.scoringRules.map((rule) => <div className="rules-row" key={rule.questionId}><span>{rule.questionId.toUpperCase()}</span><select defaultValue={rule.dimensionId}>{questionnaire.dimensions.map((dimension) => <option key={dimension.id} value={dimension.id}>{dimension.name}</option>)}</select><input type="number" defaultValue={rule.weight} min="0.1" max="5" step="0.1" /><input type="checkbox" defaultChecked={rule.reverseScored} /></div>)}</div></div>
        <div className="builder-card"><div className="section-heading"><span className="section-number">04</span><div><h3>טווחי פרשנות</h3><p>הטקסט שיופיע לפי התוצאה של כל מימד.</p></div></div><div className="band-list">{["נמוך · 0–44", "בינוני · 45–74", "גבוה · 75–100"].map((band, index) => <label key={band}><span>{band}</span><input defaultValue={["כדאי לתת לזה מקום", "מתפתח אצלך", "בולט אצלך"][index]} /></label>)}</div></div>
      </div>
      <aside className="publish-sidebar"><div className="publish-card"><div className="publish-card-heading"><span className={`publish-icon ${canPublish ? "complete" : ""}`}>{canPublish ? "✓" : "!"}</span><div><h3>מוכן לפרסום?</h3><p>{published ? "הגרסה פורסמה" : "בדקו את כל הדרישות לפני פרסום."}</p></div></div><div className="check-list">{publishChecks.map((check) => <div key={check.label} className={check.complete ? "complete" : ""}><span>{check.complete ? "✓" : "○"}</span>{check.label}</div>)}</div><button className="pill-button primary full-button" disabled={!canPublish || published} onClick={publish}>{published ? "פורסם בהצלחה" : "פרסום גרסה חדשה"}</button></div><div className="version-card"><span className="eyebrow">היסטוריית גרסאות</span><div><strong>v1.0</strong><span className="status live">פורסם</span></div><p>פורסם ב־12.06.2024 · 128 השלמות</p><div><strong>v1.1</strong><span className="status draft">טיוטה</span></div><p>נערך עכשיו על ידי מנהל/ת</p></div></aside>
    </div>}
    {tab === "builder" && saved && <div className="saved-indicator">✓ הטיוטה נשמרה</div>}
  </section>;
}

function AdminOverview({ onBuilder }: { onBuilder: () => void }) {
  return <><div className="stat-grid"><div className="stat-card cream"><span>שאלונים פעילים</span><strong>01</strong><small>+1 החודש</small></div><div className="stat-card mint"><span>תלמידים שהשלימו</span><strong>128</strong><small>↑ 12% מהשבוע שעבר</small></div><div className="stat-card blue"><span>זמן השלמה ממוצע</span><strong>04:32</strong><small>מהיר ב־18 שניות</small></div></div><div className="admin-panel"><div className="panel-title"><div><span className="eyebrow">ניהול תוכן</span><h2>השאלונים שלי</h2></div><button className="pill-button primary" onClick={onBuilder}>+ שאלון חדש</button></div><div className="admin-table"><div className="table-row table-head"><span>שם השאלון</span><span>גרסה</span><span>סטטוס</span><span>הושלמו</span><span /></div><div className="table-row"><span className="title-cell"><span className="mini-icon coral">✦</span><strong>{questionnaire.title}</strong></span><span>v{questionnaire.version}.0</span><span><b className="status live">פעיל</b></span><span>128 / 160</span><button className="row-action" onClick={onBuilder}>עריכה ←</button></div><div className="table-row muted-row"><span className="title-cell"><span className="mini-icon">◒</span><strong>סגנונות למידה</strong></span><span>טיוטה</span><span><b className="status draft">טיוטה</b></span><span>—</span><button className="row-action" onClick={onBuilder}>המשך ←</button></div></div></div><div className="admin-note"><span>✦</span><div><strong>טיפ לבניית שאלון</strong><p>לפני פרסום, ודאו שלכל שאלה יש אפשרויות תשובה וכל מימד כולל טווחי פרשנות.</p></div></div></>;
}

function AssignmentsPanel() {
  return <div className="admin-panel panel-page"><div className="panel-title"><div><span className="eyebrow">ניהול גישה</span><h2>שיבוצים וקבוצות</h2><p>שלחו שאלונים לקבוצות תלמידים ועקבו אחר ההתקדמות.</p></div><button className="pill-button primary">+ שיבוץ חדש</button></div><div className="assignment-list"><div className="assignment-row"><div><strong>כיתה ז׳ · קבוצת בוקר</strong><span>{questionnaire.title}</span></div><b>32 / 40</b><span className="status live">פעיל עד 30.06</span><button className="row-action">ניהול ←</button></div><div className="assignment-row"><div><strong>כיתה ח׳ · כל השכבה</strong><span>{questionnaire.title}</span></div><b>96 / 120</b><span className="status live">פעיל עד 15.07</span><button className="row-action">ניהול ←</button></div><div className="assignment-row"><div><strong>צוות חינוכי · פיילוט</strong><span>סגנונות למידה</span></div><b>0 / 12</b><span className="status draft">טיוטה</span><button className="row-action">המשך ←</button></div></div></div>;
}

function AnalyticsPanel() {
  return <div className="admin-panel panel-page"><div className="panel-title"><div><span className="eyebrow">תובנות שימוש</span><h2>נתוני השלמה</h2><p>מעקב אחר קצב ההשלמה של השאלונים הפעילים.</p></div><select className="period-select" defaultValue="30"><option value="30">30 הימים האחרונים</option><option value="7">השבוע האחרון</option></select></div><div className="analytics-grid"><div className="analytics-highlight"><span>שיעור השלמה</span><strong>80%</strong><div className="big-meter"><span style={{ width: "80%" }} /></div><small>עלייה של 8% מהחודש שעבר</small></div><div className="analytics-highlight"><span>תשובות ביום</span><strong>12.8</strong><div className="bar-chart">{[35, 54, 42, 72, 60, 84, 68].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><small>ממוצע שבועי</small></div></div><div className="insight-row"><span>✦</span><div><strong>השאלה שהכי אהבו לענות עליה</strong><p>״קל לי לשתף אחרים ברעיונות ובמחשבות שלי״ · 94% השלימו אותה.</p></div></div></div>;
}
