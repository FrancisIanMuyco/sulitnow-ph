import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LoadingBar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    // Simulate progress
    const t1 = setTimeout(() => setProgress(30), 50);
    const t2 = setTimeout(() => setProgress(60), 150);
    const t3 = setTimeout(() => setProgress(80), 300);
    const t4 = setTimeout(() => setProgress(100), 500);
    const t5 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
