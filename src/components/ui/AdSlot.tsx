interface AdSlotProps {
  position?: 'top' | 'middle' | 'bottom';
  className?: string;
}

export default function AdSlot({ position = 'middle', className = '' }: AdSlotProps) {
  // AdSense not configured yet — render empty reserved container
  // to prevent CLS when ads are eventually added
  return (
    <div
      className={`ad-slot ad-slot--${position} ${className}`}
      data-ad-position={position}
      style={{ minHeight: 0, minWidth: 0 }}
      aria-hidden="true"
    />
  );
}
