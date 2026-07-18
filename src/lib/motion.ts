import type { Transition } from 'motion/react';

/**
 * The page's motion vocabulary.
 *
 * Apple replaced the physics triplet (mass / stiffness / damping) with two
 * parameters designers can actually reason about, because the triplet does not
 * describe how motion *feels*. Motion's spring exposes the same two under
 * different names:
 *
 *   bounce 0    ─ damping ratio 1.0 ─ critically damped, settles without overshoot
 *   bounce 0.2  ─ damping ratio ~0.8 ─ overshoots slightly
 *   duration    ─ "response": how quickly the value reaches the target.
 *                 Not a runtime — a spring's settle time emerges from its shape.
 *
 * The rule that decides which to use: **overshoot is earned by momentum.** A
 * panel that simply faded in must not bounce; something the pointer threw
 * should. Reaching for bounce because it "feels lively" is how motion starts
 * drawing attention to itself instead of to the content.
 */

/** Move / reposition — the default for anything the user can touch. */
export const SPRING_UI: Transition = { type: 'spring', bounce: 0, duration: 0.4 };

/** Drawers / sheets — snappier response, slight overshoot on arrival. */
export const SPRING_DRAWER: Transition = { type: 'spring', bounce: 0.2, duration: 0.3 };

/** Entrances: no overshoot. Nothing threw them, so nothing should bounce. */
export const SPRING_ENTRANCE: Transition = { type: 'spring', bounce: 0, duration: 0.5 };

/** Hand-off spring for a released gesture. Bounce is legitimate here — the
 * momentum is real — but stays small so a flick lands rather than wobbles. */
export const SPRING_MOMENTUM: Transition = { type: 'spring', bounce: 0.15, duration: 0.5 };

/**
 * Tween curves, for the cases where a spring is wrong: anything whose end
 * state must land on an exact frame, and anything driven by scroll rather than
 * by a pointer. These two mirror their `--motion-ease-out-*` counterparts in
 * styles/tokens.css; the CSS side also defines an `expo`, which only the CSS
 * `ease-out-expo` utility consumes — no JS animation reaches for it.
 */
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

/**
 * Where an exponentially-decelerating flick comes to rest, from the
 * *Designing Fluid Interfaces* sample code.
 *
 * Deliberately not the textbook v²/(2a): iOS ships this exponential-decay
 * form, and the difference is visible — the textbook curve stops short and
 * reads as friction, this one carries.
 *
 * @param velocity px/s at release.
 * @param decelerationRate 0.998 matches normal scroll feel; 0.99 is snappier.
 */
export function projectMomentum(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive resistance past a boundary. A hard stop reads as "frozen"; this
 * reads as "responsive, but there is nothing more here".
 *
 * @param overshoot how far past the bound the pointer has travelled.
 * @param dimension the size of the axis being dragged.
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/**
 * Velocity from a short position/time history, in px/s.
 *
 * Sampling the last few pointer events rather than the final pair matters: a
 * single pair straddling a slow frame reports a velocity the finger never had,
 * and the hand-off inherits that lie.
 */
export function velocityFrom(
  history: readonly { value: number; time: number }[],
  window = 100,
): number {
  if (history.length < 2) return 0;
  const last = history[history.length - 1];
  let first = history[0];
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (last.time - history[i].time > window) break;
    first = history[i];
  }
  const dt = last.time - first.time;
  if (dt <= 0) return 0;
  return ((last.value - first.value) / dt) * 1000;
}
