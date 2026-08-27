import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Award, Calendar, User } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
}

export default function Certificate() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [name, setName] = useState('');
  const [showCert, setShowCert] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/data/courses/${slug}.json`)
      .then(r => r.json())
      .then(setCourse)
      .catch(() => {});
  }, [slug]);

  const handleGenerate = () => {
    if (name.trim()) setShowCert(true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, w, h, 'F');

    // Border
    doc.setDrawColor(26, 107, 60); // primary green
    doc.setLineWidth(2);
    doc.rect(10, 10, w - 20, h - 20);
    doc.setLineWidth(0.5);
    doc.rect(14, 14, w - 28, h - 28);

    // Header
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text('SULITNOW.PH', w / 2, 30, { align: 'center' });

    doc.setFontSize(28);
    doc.setTextColor(26, 107, 60);
    doc.text('Certificate of Completion', w / 2, 48, { align: 'center' });

    // Line
    doc.setDrawColor(245, 158, 11); // accent amber
    doc.setLineWidth(1);
    doc.line(w / 2 - 40, 54, w / 2 + 40, 54);

    // Body
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text('This certifies that', w / 2, 68, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text(name, w / 2, 82, { align: 'center' });

    // Underline name
    const nameWidth = doc.getTextWidth(name);
    doc.setDrawColor(26, 107, 60);
    doc.setLineWidth(0.3);
    doc.line(w / 2 - nameWidth / 2, 84, w / 2 + nameWidth / 2, 84);

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('has successfully completed the course', w / 2, 94, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(26, 107, 60);
    doc.text(course?.title || 'Course', w / 2, 106, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Duration: ${course?.duration || 'N/A'} | Category: ${course?.category || 'N/A'}`, w / 2, 116, { align: 'center' });

    // Date
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(10);
    doc.text(`Date: ${date}`, w / 2, 130, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Verified by SulitNow PH | sulitnow.ph', w / 2, h - 20, { align: 'center' });

    doc.save(`SulitNow-Certificate-${slug}.pdf`);
  };

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to={`/learn/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} />
        Back to Course
      </Link>

      {!showCert ? (
        <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4 flex items-center justify-center">
            <Award size={32} className="text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-text mb-2">Get Your Certificate</h1>
          <p className="text-sm text-text-secondary mb-6">
            Enter your name as you want it to appear on the certificate.
          </p>

          <div className="max-w-sm mx-auto space-y-3">
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!name.trim()}
              className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Certificate
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* On-screen certificate */}
          <div ref={certRef} className="bg-white border-2 border-primary/30 rounded-xl p-8 text-center mb-4" style={{ aspectRatio: '1.414' }}>
            <p className="text-xs text-text-muted tracking-[0.3em] uppercase mb-2">SulitNow.PH</p>
            <h1 className="text-3xl font-bold text-primary mb-1">Certificate of Completion</h1>
            <div className="w-20 h-0.5 bg-accent mx-auto my-4" />

            <p className="text-sm text-text-secondary mb-2">This certifies that</p>
            <p className="text-2xl font-bold text-text mb-2">{name}</p>
            <div className="w-48 h-px bg-primary/30 mx-auto mb-4" />

            <p className="text-sm text-text-secondary mb-1">has successfully completed the course</p>
            <p className="text-lg font-bold text-primary mb-3">{course.title}</p>

            <div className="flex items-center justify-center gap-4 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><Calendar size={10} />{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>Duration: {course.duration}</span>
              <span>Category: {course.category}</span>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-[9px] text-text-muted">Verified by SulitNow PH | sulitnow.ph</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              <Download size={14} />
              Download PDF
            </button>
            <button
              onClick={() => { setShowCert(false); setName(''); }}
              className="px-4 py-2.5 border border-border rounded-lg text-sm text-text-secondary hover:border-primary/50"
            >
              Change Name
            </button>
          </div>
        </>
      )}
    </div>
  );
}
