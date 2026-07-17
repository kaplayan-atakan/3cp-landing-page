import { useEffect, useMemo, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import { cn } from '../../lib/utils';

/** Motion types the margin as a template-literal union; deriving it from the
 *  hook keeps this prop honest instead of re-declaring the union here. */
type ViewportMargin = NonNullable<Parameters<typeof useInView>[1]>['margin'];

interface NumberTickerProps {
  value: number;
  startValue?: number;
  decimalPlaces?: number;
  className?: string;
  /**
   * Bottom offset of the trigger line. The default holds the count back until
   * the figure is properly on screen, which is right for a ticker the reader
   * scrolls to.
   *
   * A caller that has already decided when the count belongs — the hero cues
   * its figures as the closing beat of a mount sequence — passes `'0px'`.
   * Otherwise a viewport tall enough to show the row but not to clear the
   * offset (960px, the most common desktop height, lands ~30px short) leaves
   * the figures reading zero until the reader happens to scroll.
   */
  viewportMargin?: ViewportMargin;
}

/**
 * Counts up to `value` the first time it scrolls into view, then never again.
 *
 * Figures are formatted for tr-TR and rendered with tabular numerals so the
 * element's width stays fixed while the digits change — animating a number that
 * reflows its own container would cause layout shift on every frame.
 */
export function NumberTicker({
  value,
  startValue = 0,
  decimalPlaces = 0,
  className,
  viewportMargin = '0px 0px -120px 0px',
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const motionValue = useMotionValue(startValue);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: viewportMargin });

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }),
    [decimalPlaces],
  );

  useEffect(() => {
    if (inView && !reducedMotion) motionValue.set(value);
  }, [inView, reducedMotion, motionValue, value]);

  /**
   * A figure that is already on screen when it mounts asks the DOM outright
   * instead of waiting to be told.
   *
   * The observer is the right answer for a figure the reader scrolls to, and it
   * stays the only path for those. But the hero mounts its figures mid-sequence,
   * already in view, and there the first callback does not arrive — measured:
   * the count sits at zero until any scroll nudges it, while a hand-made
   * observer with these exact options on this exact element reports
   * `isIntersecting` immediately. The mechanism is still unexplained, so rather
   * than tune around it, the case that needs no observer no longer has one.
   */
  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const onScreen = box.top < window.innerHeight && box.bottom > 0;
    if (onScreen) motionValue.set(value);
  }, [reducedMotion, motionValue, value]);

  useEffect(() => {
    if (reducedMotion) {
      if (ref.current) ref.current.textContent = formatter.format(value);
      return;
    }
    return spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = formatter.format(Number(latest.toFixed(decimalPlaces)));
      }
    });
  }, [spring, decimalPlaces, reducedMotion, value, formatter]);

  return (
    <span
      ref={ref}
      className={cn('inline-block tabular-nums', className)}
      // Assistive tech announces the destination, never the intermediate frames.
      aria-label={formatter.format(value)}
    >
      {formatter.format(startValue)}
    </span>
  );
}
