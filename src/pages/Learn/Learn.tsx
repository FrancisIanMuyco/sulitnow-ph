import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, Search, Code, Shield, Wallet, Briefcase, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  icon: string;
  modules: { id: string; title: string; content: string; objectives: string[] }[];
}

const categoryColors: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  Programming: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', icon: <Code size={16} /> },
  'Digital Literacy': { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', icon: <Shield size={16} /> },
  'Financial Literacy': { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', icon: <Wallet size={16} /> },
  Freelancing: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', icon: <Briefcase size={16} /> },
};

export default function Learn() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [progress, setProgress] = useState<Record<string, number>>({});

  const courseFiles = [
    'python-basics', 'javascript-basics', 'internet-safety',
    'savings-basics', 'freelancing-101', 'content-creation',
  ];

  useEffect(() => {
    Promise.all(
      courseFiles.map(f =>
        fetch(`/data/courses/${f}.json`).then(r => r.ok ? r.json() : null).catch(() => null)
      )
    ).then(results => {
      setCourses(results.filter(Boolean));
      setLoading(false);
    });

    // Load progress from localStorage
    const saved: Record<string, number> = {};
    courseFiles.forEach(f => {
      const val = localStorage.getItem(`learn-progress-${f}`);
      if (val) saved[f] = parseInt(val, 10);
    });
    setProgress(saved);
  }, []);

  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalModules = courses.reduce((sum, c) => sum + c.modules.length, 0);
  const completedModules = Object.values(progress).reduce((sum, v) => sum + v, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1 flex items-center gap-2">
          <BookOpen size={24} className="text-primary" />
          Learn
        </h1>
        <p className="text-sm text-text-secondary">
          Original courses written by SulitNow PH — free, with certificates
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-primary">{courses.length}</p>
          <p className="text-[10px] text-text-muted">Courses</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-accent">{totalModules}</p>
          <p className="text-[10px] text-text-muted">Modules</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-green-600">{completedModules}</p>
          <p className="text-[10px] text-text-muted">Completed</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-blue-600">{new Set(courses.map(c => c.category)).size}</p>
          <p className="text-[10px] text-text-muted">Categories</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search courses... (e.g. Python, savings, freelancing)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-slate-800 border border-border text-text-secondary hover:border-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-16">
          <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm text-text-muted">Loading courses...</p>
        </div>
      )}

      {/* Course grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => {
            const cat = categoryColors[course.category] || categoryColors.Programming;
            const slug = course.id;
            const completed = progress[slug] || 0;
            const total = course.modules.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <Link
                key={course.id}
                to={`/learn/${slug}`}
                className="bg-white dark:bg-slate-800 border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
              >
                {/* Color bar */}
                <div className={`h-1.5 ${cat.bg}`} />

                <div className="p-4">
                  {/* Category + Level */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cat.bg} ${cat.text} border ${cat.border}`}>
                      {cat.icon}
                      {course.category}
                    </span>
                    <span className="text-[10px] text-text-muted">{course.level}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors mb-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[10px] text-text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <BookOpen size={10} />
                      {course.modules.length} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award size={10} />
                      Certificate
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-text-muted">
                        {completed}/{total} modules
                      </span>
                      <span className="text-[10px] font-medium text-primary">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {pct === 100 && (
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-green-600 font-medium">
                        <CheckCircle size={10} />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={40} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-sm text-text-muted">No courses found</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
