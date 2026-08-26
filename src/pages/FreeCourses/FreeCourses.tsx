import { useState, useEffect } from 'react';
import { GraduationCap, ExternalLink, Star, Users, Clock, Award, Filter, Search, BookOpen, Building2, RefreshCw } from 'lucide-react';

interface Course {
  platform: string;
  title: string;
  provider: string;
  rating: number | null;
  students: string | null;
  url: string;
  category: string;
  level: string;
  duration: string;
  certificate: boolean;
  free: boolean;
}

interface Category {
  name: string;
  count: number;
}

interface CoursesData {
  lastUpdated: string;
  courses: Course[];
  categories: Category[];
  stats: {
    totalCourses: number;
    platforms: number;
    totalCategories: number;
  };
}

const platformColors: Record<string, { bg: string; text: string }> = {
  Coursera: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  edX: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  'Khan Academy': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  freeCodeCamp: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  YouTube: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
};

const categoryIcons: Record<string, string> = {
  'Programming': '💻',
  'Web Development': '🌐',
  'Data Science & AI': '📊',
  'IT & Security': '🔒',
  'Design': '🎨',
  'Business': '💼',
  'Math': '🔢',
  'Science': '🔬',
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

  useEffect(() => {
    fetch('/data/free-courses.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const platforms = data ? [...new Set(data.courses.map(c => c.platform))] : [];
  const categories = data ? ['All', ...data.categories.map(c => c.name)] : ['All'];

  const filtered = data?.courses.filter(c => {
    const matchesSearch = !search || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'All' || c.platform === selectedPlatform;
    return matchesSearch && matchesCategory && matchesPlatform;
  }) || [];

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
            {data?.stats.totalCourses || 0} free courses from {data?.stats.platforms || 0} platforms
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
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-primary">{data.stats.totalCourses}</p>
            <p className="text-[10px] text-text-muted">Courses</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-accent">{data.stats.platforms}</p>
            <p className="text-[10px] text-text-muted">Platforms</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-600">{data.courses.filter(c => c.certificate).length}</p>
            <p className="text-[10px] text-text-muted">With Cert</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-blue-600">{data.stats.totalCategories}</p>
            <p className="text-[10px] text-text-muted">Categories</p>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search courses, providers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={selectedPlatform}
          onChange={e => setSelectedPlatform(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm text-text"
        >
          <option value="All">All Platforms</option>
          {platforms.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => {
          const count = cat === 'All' 
            ? data?.courses.length || 0 
            : data?.courses.filter(c => c.category === cat).length || 0;
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
              {cat !== 'All' && <span>{categoryIcons[cat] || '📚'}</span>}
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

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course, i) => {
          const platColor = platformColors[course.platform] || { bg: 'bg-gray-100', text: 'text-gray-700' };
          const levColor = levelColors[course.level] || levelColors['All Levels'];
          
          return (
            <div key={i} className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 hover:card-shadow transition-all flex flex-col">
              {/* Platform + Certificate */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${platColor.bg} ${platColor.text}`}>
                  {course.platform}
                </span>
                {course.certificate && (
                  <span className="flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                    <Award size={10} />
                    Certificate
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-text mb-1 line-clamp-2 flex-1">{course.title}</h3>
              
              {/* Provider */}
              <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
                <Building2 size={10} />
                {course.provider}
              </div>

              {/* Meta Row */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${levColor}`}>
                  {course.level}
                </span>
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

              {/* Category Badge */}
              <div className="mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-alt text-text-muted">
                  {categoryIcons[course.category] || '📚'} {course.category}
                </span>
              </div>

              {/* CTA */}
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-lg transition-colors"
              >
                Start Learning
                <ExternalLink size={10} />
              </a>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen size={32} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">No courses found matching your search.</p>
        </div>
      )}

      {/* Platforms Footer */}
      {data && (
        <div className="mt-8 bg-surface-alt border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-text mb-4 flex items-center gap-1.5">
            <Filter size={14} />
            Course Platforms
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {platforms.map(p => {
              const count = data.courses.filter(c => c.platform === p).length;
              const color = platformColors[p] || { bg: 'bg-gray-100', text: 'text-gray-700' };
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(selectedPlatform === p ? 'All' : p)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    selectedPlatform === p 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-white dark:bg-slate-800 hover:border-primary/30'
                  }`}
                >
                  <p className={`text-xs font-medium ${color.text}`}>{p}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{count} courses</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
