import { scoreColor } from '../../utils/sulitScore';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  const color = scoreColor(score);
  const ringColor = score >= 8
    ? 'ring-green-500/30'
    : score >= 6
    ? 'ring-yellow-500/30'
    : score >= 4
    ? 'ring-orange-500/30'
    : 'ring-red-500/30';

  return (
    <div className={`${sizes[size]} rounded-full border-2 border-current ${ringColor} ring-4 flex items-center justify-center font-bold ${color}`}>
      {score.toFixed(1)}
    </div>
  );
}
