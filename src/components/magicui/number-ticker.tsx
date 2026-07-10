import { useEffect, useMemo, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import { cn } from '../../lib/utils';

interface NumberTickerProps {
  value: number;
  startValue?: number;
  decimalPlaces?: number;
  className?: string;
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
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const motionValue = useMotionValue(startValue);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: '0px 0px -120px 0px' });

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
