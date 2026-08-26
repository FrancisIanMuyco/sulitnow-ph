import { useState, useEffect } from 'react';
import { GraduationCap, ExternalLink, Star, Users, Clock, Award, Search, Building2, RefreshCw, ChevronDown, ChevronUp, BookOpen, ListChecks } from 'lucide-react';

interface Course {
  id: string;
  platform: string;
  title: string;
  provider: string;
  description: string;
  rating: number | null;
  students: string | null;
  url: string;
  category: string;
  level: string;
  duration: string;
  certificate: boolean;
  skills: string[];
  free: boolean;
  modules: string[];
  lastVerified: string;
}

interface CoursesData {
  lastUpdated: string;
  courses: Course[];
  categories: { name: string; count: number; icon: string }[];
  platforms: { name: string; count: number }[];
  stats: {
    totalCourses: number;
    platforms: number;
    totalCategories: number;
    withCertificate: number;
  };
}

const platformColors: Record<string, { bg: string; text: string; border: string }> = {
  Coursera: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  edX: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  'Khan Academy': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  freeCodeCamp: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  YouTube: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
};

const levelColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
  'All Levels': 'bg-gray-100 text-gray-700',
};

export default function FreeCourses() {
  const [data, setData] = useState<CoursesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/free-courses.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = data ? ['All', ...data.categories.map(c => c.name)] : ['All'];
  const platforms = data ? ['All', ...data.platforms.map(p => p.name)] : ['All'];

  const filtered = data?.courses.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search || 
      c.title.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q));
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchPlat = selectedPlatform === 'All' || c.platform === selectedPlatform;
    return matchSearch && matchCat && matchPlat;
  }) || [];

  const toggleExpand = (id: string) => {
    setExpandedCourse(expandedCourse === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1 flex items-center gap-2">
            <GraduationCap size={24} className="text-primary" />
            Free Courses
          </h1>
          <p className="text-sm text-text-secondary">
            {data?.stats.totalCourses || 0} free courses • {data?.stats.platforms || 0} platforms • {data?.stats.withCertificate || 0} with certificates
          </p>
        </div>
        {data && (
          <span className="text-[10px] text-text-muted">
            Updated: {new Date(data.lastUpdated).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-primary">{data.stats.totalCourses}</p>
            <p className="text-[10px] text-text-muted">Total Courses</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-accent">{data.stats.platforms}</p>
            <p className="text-[10px] text-text-muted">Platforms</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-600">{data.stats.withCertificate}</p>
            <p className="text-[10px] text-text-muted">With Certificate</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-blue-600">{data.stats.totalCategories}</p>
            <p className="text-[10px] text-text-muted">Categories</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search courses, skills, providers... (e.g. Python, React, Google)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        <select
          value={selectedPlatform}
          onChange={e => setSelectedPlatform(e.target.value)}
          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-border rounded-lg text-xs font-medium text-text shrink-0"
        >
          {platforms.map(p => (
            <option key={p} value={p}>{p === 'All' ? 'All Platforms' : p}</option>
          ))}
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => {
          const count = cat === 'All' 
            ? data?.courses.length || 0 
            : data?.categories.find(c => c.name === cat)?.count || 0;
          const catData = data?.categories.find(c => c.name === cat);
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface-alt text-text-secondary hover:bg-border'
              }`}
            >
              {cat !== 'All' && <span>{catData?.icon || '📚'}</span>}
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-12">
          <RefreshCw size={24} className="text-text-muted mx-auto mb-2 animate-spin" />
          <p className="text-sm text-text-muted">Loading courses...</p>
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-text-muted mb-4">
          Showing {filtered.length} of {data?.courses.length || 0} courses
        </p>
      )}

      {/* Course Cards */}
      <div className="space-y-3">
        {filtered.map((course) => {
          const plat = platformColors[course.platform] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
          const lev = levelColors[course.level] || levelColors['All Levels'];
          const isExpanded = expandedCourse === course.id;
          
          return (
            <div key={course.id} className={`bg-white dark:bg-slate-800 border rounded-xl overflow-hidden transition-all hover:card-shadow ${plat.border}`}>
              {/* Main Card */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Platform + Cert */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${plat.bg} ${plat.text}`}>
                        {course.platform}
                      </span>
                      {course.certificate && (
                        <span className="flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                          <Award size={10} />
                          Certificate
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${lev}`}>
                        {course.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-text mb-0.5">{course.title}</h3>
                    
                    {/* Provider */}
                    <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
                      <Building2 size={10} />
                      {course.provider}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-text-secondary line-clamp-2 mb-2">{course.description}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="flex items-center gap-0.5 text-[10px] text-text-muted">
                        <Clock size={10} />
                        {course.duration}
                      </span>
                      {course.students && (
                        <span className="flex items-center gap-0.5 text-[10px] text-text-muted">
                          <Users size={10} />
                          {course.students}
                        </span>
                      )}
                      {course.rating && (
                        <span className="flex items-center gap-0.5 text-[10px] text-accent">
                          <Star size={10} className="fill-accent" />
                          {course.rating}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {course.skills.map(skill => (
                          <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-alt text-text-muted">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <a href={course.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors">
                      Start <ExternalLink size={10} />
                    </a>
                    {course.modules.length > 0 && (
                      <button
                        onClick={() => toggleExpand(course.id)}
                        className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 text-text-muted hover:text-text rounded-lg transition-colors"
                      >
                        <ListChecks size={10} />
                        {isExpanded ? 'Hide' : 'Modules'}
                        {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Modules */}
              {isExpanded && course.modules.length > 0 && (
                <div className="border-t border-border bg-surface-alt/50 px-4 py-3">
                  <h4 className="text-xs font-semibold text-text mb-2 flex items-center gap-1">
                    <BookOpen size={12} />
                    Course Modules ({course.modules.length})
                  </h4>
                  <ol className="space-y-1">
                    {course.modules.map((mod, i) => (
                      <li key={i} className="text-[11px] text-text-secondary flex items-start gap-2">
                        <span className="text-[10px] text-text-muted font-mono shrink-0 w-4 text-right">{i + 1}.</span>
                        {mod}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen size={32} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">No courses found matching your search.</p>
          <button onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedPlatform('All'); }}
                  className="text-xs text-primary mt-2 hover:underline">
            Clear filters
          </button>
        </div>
      )}

      {/* Platform Summary */}
      {data && (
        <div className="mt-8 bg-surface-alt border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text mb-3">Platforms</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {data.platforms.map(p => {
              const color = platformColors[p.name] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
              return (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlatform(selectedPlatform === p.name ? 'All' : p.name)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    selectedPlatform === p.name ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : `${color.border} hover:border-primary/30`
                  }`}
                >
                  <p className={`text-xs font-medium ${color.text}`}>{p.name}</p>
                  <p className="text-[10px] text-text-muted">{p.count} courses</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
