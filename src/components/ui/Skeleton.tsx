export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-border rounded-xl p-4 space-y-3">
      <div className="skeleton h-8 w-8 rounded-lg" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  );
}

export function SkeletonLine({ width = 'full' }: { width?: string }) {
  return <div className={`skeleton h-3 w-${width}`} />;
}

export function SkeletonCircle({ size = 10 }: { size?: number }) {
  return <div className={`skeleton rounded-full`} style={{ width: size * 4, height: size * 4 }} />;
}

export function SkeletonToolGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
