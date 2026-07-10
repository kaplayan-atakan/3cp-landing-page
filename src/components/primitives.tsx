import { Component, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks';

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

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  teal: 'bg-brand-teal text-white hover:bg-brand-teal-hovered',
  white: 'bg-white text-brand-teal hover:bg-neutral-50',
};

const CIRCLE_VARIANTS: Record<ButtonVariant, string> = {
  teal: 'bg-white text-brand-teal',
  white: 'bg-brand-teal text-white',
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
      <div className="mb-4 flex items-center">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 font-mono text-xs text-white">
          {number}
        </span>
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
          {pill}
        </span>
      </div>
      <h2 className="max-w-[900px] text-[clamp(1.5rem,4vw,2.8rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-neutral-900">
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
    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 font-mono text-[11px] text-neutral-600">
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
/* ShaderErrorBoundary                                                 */
/* ------------------------------------------------------------------ */

interface BoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
}

/**
 * Isolates the WebGPU hero shader: if the GPU pipeline fails to initialise on
 * a given device, we render the static gradient fallback instead of crashing
 * the page.
 */
export class ShaderErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
