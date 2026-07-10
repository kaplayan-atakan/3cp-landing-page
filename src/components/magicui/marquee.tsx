import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks';
import { cn } from '../../lib/utils';

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  /** How many times the children are duplicated to keep the loop seamless. */
  repeat?: number;
  className?: string;
}

/**
 * Infinite scrolling strip. `--gap` and `--duration` feed the `marquee`
 * keyframes defined in tailwind.config.js.
 *
 * With reduced motion the animation is never attached and the duplicate copies
 * are dropped, leaving a single, manually scrollable row.
 */
export function Marquee({
  children,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  className,
}: MarqueeProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        reducedMotion && 'overflow-x-auto',
        className,
      )}
    >
      {Array.from({ length: reducedMotion ? 1 : repeat }, (_, index) => (
        <div
          key={index}
          // Only the first copy is exposed to assistive tech; the rest exist
          // solely to make the loop look seamless.
          aria-hidden={index > 0}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)]',
            vertical ? 'flex-col' : 'flex-row',
            !reducedMotion && (vertical ? 'animate-marquee-vertical' : 'animate-marquee'),
            !reducedMotion && reverse && '[animation-direction:reverse]',
            !reducedMotion && pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
