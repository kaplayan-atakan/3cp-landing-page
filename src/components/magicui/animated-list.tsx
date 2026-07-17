import { Children, useMemo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import { EASE_OUT_QUART } from '../../lib/motion';
import { cn } from '../../lib/utils';

/**
 * Ceiling on the whole stagger, in milliseconds — not on the per-item step.
 *
 * A stagger is a cascade the reader watches; past about half a second they are
 * waiting on it instead. The step is what a call site asks for, but the spread
 * is what it actually costs, and the spread grows with the list. Clamping the
 * total means a longer list tightens its step rather than running long.
 */
const STAGGER_BUDGET_MS = 500;

interface AnimatedListProps {
  children: ReactNode;
  /** Requested per-item stagger, in milliseconds. Tightened if the list is long
   * enough that this step would overrun {@link STAGGER_BUDGET_MS}. */
  delay?: number;
  className?: string;
}

/**
 * Reveals its children bottom-up with a stagger, once, when scrolled into view.
 *
 * This renders a fixed list — it never synthesises a live stream. Every surface
 * that uses it must also carry a `DemoBadge`: the page sells auditability, and
 * an unlabelled fake feed would undercut that claim.
 *
 * The stagger is the one on this page that is *about* something. Both call sites
 * render entries that genuinely arrived one after another — an append-only audit
 * trail and a cross-branch activity feed — so items landing in sequence is a
 * description of the content, not decoration laid over it. That is also the
 * limit of the argument: it earns a stagger inside one list, and nothing else.
 */
export function AnimatedList({ children, delay = 40, className }: AnimatedListProps) {
  const reducedMotion = usePrefersReducedMotion();
  const items = useMemo(() => Children.toArray(children), [children]);

  /*
   * Reduced motion drops the animation wholesale rather than gating `initial`.
   *
   * Gating `initial` the way Reveal does is also correct — the hook reads the
   * preference during the first render, so `initial={false}` is in place before
   * anything mounts. It is avoided here because Reveal wraps one element and this
   * wraps a list: the gate would still build a motion tree and an
   * IntersectionObserver per row, and still compute a stagger, to arrive at no
   * motion at all. Returning the rows plainly says that outright, and leaves
   * nothing that a later edit could quietly re-animate.
   */
  if (reducedMotion) {
    return <div className={cn('flex flex-col gap-2', className)}>{items}</div>;
  }

  const step = Math.min(delay, STAGGER_BUDGET_MS / Math.max(items.length - 1, 1));

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          /*
           * 300ms, not the 500ms of the entrance band: a log row is a small thing
           * inside a panel that Reveal brings in over 400ms, and a child that
           * outlasts its container reads as lag. The curve was cubic-bezier(0.25,
           * 0.1, 0.25, 1) — the literal definition of CSS `ease`, an ease-in-out
           * whose slow start made each row hesitate before moving.
           */
          transition={{ duration: 0.3, delay: (index * step) / 1000, ease: EASE_OUT_QUART }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}
