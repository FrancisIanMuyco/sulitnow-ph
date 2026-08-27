import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Award, ChevronRight, CheckCircle, Circle, Lock } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  content: string;
  objectives: string[];
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  icon: string;
  modules: Module[];
  quiz: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }[];
  };
}

export default function CourseView() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/data/courses/${slug}.json`)
      .then(r => r.json())
      .then(data => {
        setCourse(data);
        setLoading(false);
        // Load progress
        const saved = localStorage.getItem(`learn-progress-${slug}`);
        if (saved) {
          const arr = JSON.parse(saved);
          setCompletedModules(new Set(arr));
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const toggleComplete = (moduleIdx: number) => {
    const next = new Set(completedModules);
    if (next.has(moduleIdx)) {
      next.delete(moduleIdx);
    } else {
      next.add(moduleIdx);
    }
    setCompletedModules(next);
    if (slug) {
      localStorage.setItem(`learn-progress-${slug}`, JSON.stringify([...next]));
    }
  };

  const allCompleted = course ? completedModules.size === course.modules.length : false;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center py-16">
          <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm text-text-muted">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-text-muted">Course not found.</p>
        <Link to="/learn" className="text-sm text-primary hover:underline mt-2 inline-block">Back to Learn</Link>
      </div>
    );
  }

  const module = course.modules[activeModule];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back */}
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} />
        All Courses
      </Link>

      {/* Course header */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 mb-4">
        <h1 className="text-xl font-bold text-text mb-1">{course.title}</h1>
        <p className="text-xs text-text-secondary mb-3">{course.subtitle}</p>
        <div className="flex items-center gap-3 text-[10px] text-text-muted">
          <span className="flex items-center gap-1"><BookOpen size={10} />{course.modules.length} modules</span>
          <span className="flex items-center gap-1"><Clock size={10} />{course.duration}</span>
          <span className="flex items-center gap-1"><Award size={10} />Certificate</span>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>{completedModules.size}/{course.modules.length} completed</span>
            <span className="font-medium text-primary">{Math.round((completedModules.size / course.modules.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(completedModules.size / course.modules.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar - module list */}
        <div className="hidden sm:block w-56 shrink-0">
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 sticky top-20">
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-2">Modules</p>
            <div className="space-y-1">
              {course.modules.map((m, i) => {
                const done = completedModules.has(i);
                const active = i === activeModule;
                return (
                  <button
                    key={m.id}
                    onClick={() => { setActiveModule(i); setShowQuiz(false); }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-text-secondary hover:bg-surface-alt'
                    }`}
                  >
                    {done ? (
                      <CheckCircle size={12} className="text-green-500 shrink-0" />
                    ) : (
                      <Circle size={12} className="text-text-muted shrink-0" />
                    )}
                    <span className="truncate">{m.title}</span>
                  </button>
                );
              })}
              {/* Quiz button */}
              <button
                onClick={() => setShowQuiz(true)}
                disabled={!allCompleted}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors mt-2 border-t border-border pt-2 ${
                  showQuiz
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 font-medium'
                    : allCompleted
                    ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10'
                    : 'text-text-muted cursor-not-allowed opacity-50'
                }`}
              >
                {allCompleted ? <Award size={12} className="shrink-0" /> : <Lock size={12} className="shrink-0" />}
                <span>Final Quiz</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile module selector */}
          <div className="sm:hidden mb-4">
            <select
              value={activeModule}
              onChange={e => { setActiveModule(parseInt(e.target.value)); setShowQuiz(false); }}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm text-text"
            >
              {course.modules.map((m, i) => (
                <option key={m.id} value={i}>
                  {completedModules.has(i) ? '✓ ' : ''}{m.title}
                </option>
              ))}
              <option value={-1} disabled={!allCompleted}>Final Quiz</option>
            </select>
          </div>

          {showQuiz ? (
            <QuizView
              questions={course.quiz.questions}
              courseSlug={course.id}
              onComplete={() => {}}
            />
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-border rounded-xl overflow-hidden">
              {/* Module header */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-[10px] text-text-muted mb-0.5">Module {activeModule + 1} of {course.modules.length}</p>
                <h2 className="text-lg font-bold text-text">{module.title}</h2>
              </div>

              {/* Module content */}
              <div className="px-4 py-4">
                <div
                  className="prose prose-sm dark:prose-invert max-w-none prose-p:text-text-secondary prose-headings:text-text prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-strong:text-text prose-li:text-text-secondary prose-blockquote:border-primary prose-blockquote:text-text-muted"
                  dangerouslySetInnerHTML={{ __html: module.content }}
                />
              </div>

              {/* Objectives */}
              {module.objectives.length > 0 && (
                <div className="px-4 py-3 border-t border-border bg-surface-alt">
                  <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1.5">What you learned</p>
                  <ul className="space-y-1">
                    {module.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                        <CheckCircle size={10} className="text-green-500 mt-0.5 shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation + mark complete */}
              <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                <button
                  onClick={() => toggleComplete(activeModule)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    completedModules.has(activeModule)
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {completedModules.has(activeModule) ? (
                    <><CheckCircle size={12} /> Completed</>
                  ) : (
                    <><Circle size={12} /> Mark as complete</>
                  )}
                </button>

                <div className="flex gap-2">
                  {activeModule > 0 && (
                    <button
                      onClick={() => setActiveModule(activeModule - 1)}
                      className="px-3 py-1.5 rounded-lg text-xs text-text-secondary border border-border hover:border-primary/50"
                    >
                      Previous
                    </button>
                  )}
                  {activeModule < course.modules.length - 1 ? (
                    <button
                      onClick={() => setActiveModule(activeModule + 1)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-primary text-white hover:bg-primary/90"
                    >
                      Next <ChevronRight size={12} className="inline" />
                    </button>
                  ) : !showQuiz ? (
                    <button
                      onClick={() => allCompleted && setShowQuiz(true)}
                      disabled={!allCompleted}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        allCompleted
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-gray-100 dark:bg-slate-700 text-text-muted cursor-not-allowed'
                      }`}
                    >
                      <Award size={12} className="inline mr-1" />
                      Take Quiz
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==================== QUIZ COMPONENT ==================== */

function QuizView({ questions, courseSlug, onComplete }: {
  questions: { id: string; question: string; options: string[]; correct: number; explanation: string }[];
  courseSlug: string;
  onComplete: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isCorrect = selected === q.correct;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      onComplete();
    }
  };

  const score = answers.reduce<number>((sum, a, i) => sum + (a === questions[i].correct ? 1 : 0), 0);
  const passed = score >= Math.ceil(questions.length * 0.7);

  if (finished) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-6 text-center">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
          {passed ? <Award size={32} className="text-green-600" /> : <BookOpen size={32} className="text-red-500" />}
        </div>
        <h2 className="text-xl font-bold text-text mb-2">
          {passed ? 'Congratulations!' : 'Keep Learning!'}
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          You scored {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
        </p>
        {passed ? (
          <Link
            to={`/learn/${courseSlug}/certificate`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            <Award size={16} />
            View Certificate
          </Link>
        ) : (
          <p className="text-xs text-text-muted">
            You need {Math.ceil(questions.length * 0.7)} correct answers to pass. Review the modules and try again!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-border rounded-xl overflow-hidden">
      {/* Progress */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex justify-between text-[10px] text-text-muted mb-1.5">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{score} correct so far</span>
        </div>
        <div className="w-full h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="px-4 py-4">
        <h3 className="text-base font-bold text-text mb-4">{q.question}</h3>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = 'border-border hover:border-primary/50';
            if (showResult) {
              if (i === q.correct) style = 'border-green-500 bg-green-50 dark:bg-green-900/20';
              else if (i === selected) style = 'border-red-500 bg-red-50 dark:bg-red-900/20';
              else style = 'border-border opacity-50';
            } else if (i === selected) {
              style = 'border-primary bg-primary/5';
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left text-sm text-text transition-colors ${style}`}
              >
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-medium shrink-0 ${
                  showResult && i === q.correct
                    ? 'border-green-500 bg-green-500 text-white'
                    : showResult && i === selected
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-border text-text-muted'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`mt-4 p-3 rounded-lg text-xs ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
            <p className="font-medium mb-0.5">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
            <p>{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Next */}
      {showResult && (
        <div className="px-4 py-3 border-t border-border flex justify-end">
          <button
            onClick={handleNext}
            className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            {current < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}
