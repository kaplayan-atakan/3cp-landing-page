import { Children, useMemo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import { cn } from '../../lib/utils';

interface AnimatedListProps {
  children: ReactNode;
  /** Per-item stagger, in milliseconds. */
  delay?: number;
  className?: string;
}

/**
 * Reveals its children bottom-up with a stagger, once, when scrolled into view.
 *
 * This renders a fixed list — it never synthesises a live stream. Every surface
 * that uses it must also carry a `DemoBadge`: the page sells auditability, and
 * an unlabelled fake feed would undercut that claim.
 */
export function AnimatedList({ children, delay = 40, className }: AnimatedListProps) {
  const reducedMotion = usePrefersReducedMotion();
  const items = useMemo(() => Children.toArray(children), [children]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{
            duration: 0.3,
            delay: (index * delay) / 1000,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}
