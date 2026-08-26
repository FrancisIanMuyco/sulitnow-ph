import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 md:bottom-6 right-4 z-40 w-10 h-10 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center hover:scale-110 active:scale-95"
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
