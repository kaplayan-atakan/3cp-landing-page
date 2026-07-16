import { type PointerEvent, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks';
import { cn } from '../lib/utils';

/** Canonical transition used across the whole page. */
export const TRANSITION =
  'transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]';

/* ------------------------------------------------------------------ */
/* TextRollButton                                                      */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'teal' | 'white';

interface TextRollButtonProps {
  label: string;
  href: string;
  variant?: ButtonVariant;
  /** Extra classes for padding / text-size overrides per placement. */
  className?: string;
  ariaLabel?: string;
}

/*
 * Theme notes:
 *  - teal variant lives on theme-aware surfaces: in dark the fill becomes
 *    teal-400, so the label flips to a dark navy via `content-inverse`
 *    (white in light — pixels unchanged there).
 *  - white variant only appears on the FIXED teal CTA band, so every colour
 *    is pinned to fixed primitives; the themed brand tokens would drift to
 *    teal-400-on-white (≈2.7:1) in dark.
 */
const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  teal: 'bg-brand-teal text-content-inverse hover:bg-brand-teal-hovered',
  white:
    'bg-white text-[rgb(var(--color-teal-700))] hover:bg-[rgb(var(--color-neutral-50-fixed))]',
};

const CIRCLE_VARIANTS: Record<ButtonVariant, string> = {
  teal: 'bg-surface-default text-brand-teal',
  white: 'bg-[rgb(var(--color-teal-700))] text-white',
};

/**
 * Pill button with the signature 3CP interactions:
 *  - the label "rolls" vertically on hover (duplicated inside an overflow-hidden
 *    20px window that translates -50%)
 *  - the arrow, inside a contrasting circle, rotates -45° on hover
 */
export function TextRollButton({
  label,
  href,
  variant = 'teal',
  className = '',
  ariaLabel,
}: TextRollButtonProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel ?? label}
      className={`group inline-flex items-center gap-2 rounded-full font-medium ${TRANSITION} ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      <span className="relative block h-[20px] overflow-hidden">
        <span
          className={`flex flex-col leading-[20px] ${TRANSITION} group-hover:-translate-y-1/2`}
        >
          <span className="block h-[20px]">{label}</span>
          <span className="block h-[20px]" aria-hidden="true">
            {label}
          </span>
        </span>
      </span>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${CIRCLE_VARIANTS[variant]}`}
      >
        <ArrowRight
          size={16}
          className={`${TRANSITION} group-hover:-rotate-45`}
          aria-hidden="true"
        />
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* StatusBadge                                                         */
/* ------------------------------------------------------------------ */

type BadgeTone = 'success' | 'neutral' | 'information';

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  /** 'pill' = rounded-full text-xs (sector strip); 'tag' = rounded text-[10px] (matrix). */
  shape?: 'pill' | 'tag';
  className?: string;
}

const BADGE_TONES: Record<BadgeTone, string> = {
  success: 'bg-success text-success-fg',
  neutral: 'bg-neutral-100 text-neutral-600',
  information: 'bg-information text-information-fg',
};

/**
 * Status is never conveyed by colour alone: the badge always carries an
 * all-caps text label in addition to its semantic background colour.
 */
export function StatusBadge({
  label,
  tone = 'neutral',
  shape = 'tag',
  className = '',
}: StatusBadgeProps) {
  const shapeClasses =
    shape === 'pill'
      ? 'rounded-full px-3 py-1 text-xs font-bold'
      : 'rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide';

  return (
    <span
      className={`inline-flex items-center font-mono ${shapeClasses} ${BADGE_TONES[tone]} ${className}`}
    >
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeader                                                       */
/* ------------------------------------------------------------------ */

interface SectionHeaderProps {
  number: string;
  pill: string;
  title: ReactNode;
}

export function SectionHeader({ number, pill, title }: SectionHeaderProps) {
  return (
    <div className="mb-12 px-5 sm:px-8 lg:px-12">
      <div className="mb-4 flex items-end gap-4">
        {/* Swiss Modernism numeral: large, thin, low-opacity mono figure —
            typographic scale only, same neutral-900 token as the rest of the page. */}
        <span className="font-mono text-[clamp(2rem,5vw,3.5rem)] font-thin leading-none tracking-tight text-neutral-900/20">
          {number}
        </span>
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
          {pill}
        </span>
      </div>
      <h2 className="max-w-[900px] text-[clamp(1.5rem,4vw,2.8rem)] font-serif font-semibold leading-[1.15] tracking-[-0.02em] text-neutral-900">
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal                                                              */
/* ------------------------------------------------------------------ */

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before the reveal starts. */
  delay?: number;
  className?: string;
}

/**
 * The page's single scroll-reveal primitive: a fade plus a 16px rise, once per
 * element. Only opacity and transform animate, so it never shifts layout.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* DemoBadge                                                           */
/* ------------------------------------------------------------------ */

/**
 * Marks a panel whose contents are seeded mock data.
 *
 * Mandatory on every surface that renders an AnimatedList. The page sells
 * tenant isolation and an immutable audit trail; an unlabelled fake feed would
 * undercut exactly the claim the surrounding section is making.
 */
export function DemoBadge({ label = 'Örnek görünüm · Demo verisi' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-surface-default px-3 py-1 font-mono text-[11px] text-neutral-600">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" aria-hidden="true" />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* StatPair                                                            */
/* ------------------------------------------------------------------ */

/** A metric over its label. Mono figures per the design language's metric scale. */
export function StatPair({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-mono text-xl font-bold tabular-nums text-neutral-900">{value}</p>
      <p className="mt-1 text-xs leading-snug text-neutral-600">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PremiumCard                                                         */
/* ------------------------------------------------------------------ */

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  /** Show the 1px teal hairline accent at the top edge. */
  hairline?: boolean;
  /** Optional mono tabular corner number (replaces phase badges). */
  cornerLabel?: string;
}

/**
 * Elevated content card with a hairline top accent and a soft hover lift.
 * Only box-shadow and transform animate (no layout shift); the lift is disabled
 * under reduced-motion. This is the single "designer's hand" card primitive.
 */
export function PremiumCard({ children, className, hairline = true, cornerLabel }: PremiumCardProps) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-neutral-200 bg-surface-raised p-6 shadow-raised transition-shadow duration-medium ease-smooth',
        !reducedMotion && 'hover:-translate-y-0.5 hover:shadow-overlay motion-safe:transition-[transform,box-shadow] motion-safe:active:scale-[0.99]',
        className,
      )}
    >
      {hairline && (
        <span
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-teal to-transparent opacity-70"
          aria-hidden="true"
        />
      )}
      {cornerLabel && (
        <span className="absolute right-4 top-4 font-mono text-xs tabular-nums text-neutral-400">
          {cornerLabel}
        </span>
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TiltCard                                                            */
/* ------------------------------------------------------------------ */

/** Max tilt in degrees — deliberately shallow so the card reads as a surface,
 * not a toy. */
const TILT_MAX_DEG = 5;

/** Spring configs: the tilt follows the pointer with a little momentum
 * (direct mapping feels artificial — see emil-design-eng on decorative
 * mouse-tracking), and settles crisply on leave. */
const TILT_SPRING = { stiffness: 260, damping: 24, mass: 0.6 };
const GLOW_SPRING = { stiffness: 180, damping: 26 };

/**
 * Opt-in pointer-tracking 3D tilt wrapper around PremiumCard. PremiumCard
 * itself is untouched — every existing call site keeps its exact behaviour;
 * only surfaces that explicitly choose TiltCard get the effect.
 *
 * The tilt is decorative, so it is fully disabled for touch pointers
 * (pointerType guard) and under prefers-reduced-motion (handlers no-op and
 * the springs never leave 0). A very faint token-teal glow follows the
 * pointer inside the card; it fades out on leave via its own spring.
 */
export function TiltCard({ children, className, hairline, cornerLabel }: PremiumCardProps) {
  const reducedMotion = usePrefersReducedMotion();

  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const glowImage = useMotionTemplate`radial-gradient(280px circle at ${glowX}% ${glowY}%, rgb(var(--color-teal-700) / 0.08), transparent 70%)`;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 2 * TILT_MAX_DEG);
    rotateX.set(-(py - 0.5) * 2 * TILT_MAX_DEG);
    glowX.set(px * 100);
    glowY.set(py * 100);
    glowOpacity.set(1);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowOpacity.set(0);
  };

  return (
    <motion.div
      className="h-full"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <PremiumCard className={className} hairline={hairline} cornerLabel={cornerLabel}>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: glowImage, opacity: glowOpacity }}
        />
        {children}
      </PremiumCard>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* GrainOverlay                                                        */
/* ------------------------------------------------------------------ */

/** Inline-SVG fractal-noise grain as a data-URI — no external fetch. Shared
 * by HeroBackground (Task 3) and any light section that wants the same
 * barely-there paper texture. Purely static (opacity only, no animation), so
 * it needs no reduced-motion gate. */
const GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface GrainOverlayProps {
  /** Opacity utility class; default matches the very-light touch used on light sections. */
  className?: string;
}

export function GrainOverlay({ className = 'opacity-[0.02]' }: GrainOverlayProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 mix-blend-multiply', className)}
      style={{ backgroundImage: GRAIN_DATA_URI }}
      aria-hidden="true"
    />
  );
}

