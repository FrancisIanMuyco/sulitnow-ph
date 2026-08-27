import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Card({ children, className = '', hover = false, onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`bg-white dark:bg-slate-800 border border-border rounded-xl card-shadow ${
        hover ? 'card-hover cursor-pointer' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-3 border-b border-border ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-4 ${className}`}>{children}</div>;
}
