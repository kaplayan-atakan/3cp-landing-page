import { useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { ONBOARDING_STEPS, PERMISSION_MATRIX } from '../../data/content';
import { EASE_OUT_QUART } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks';
import { DemoBadge, Reveal, SectionHeader, TRANSITION } from '../primitives';

/**
 * The wave's per-cell delay. 12 cells in reading order lands the last mark at
 * ~495ms — under the ~500-600ms ceiling a stagger has before its tail outlives
 * the reader's interest in it. Widen the grid and this constant is what has to
 * shrink.
 */
const CELL_STAGGER = 0.045;
const CELL_DURATION = 0.2;

/**
 * A read-only preview of the Dense Matrix layout (design language §8.2): roles
 * down the side, actions across the top. Permission is never signalled by
 * colour alone — each cell pairs its icon with screen-reader text.
 *
 * The grid itself is static and the marks are written into it, in reading order
 * — across one role's actions, then down to the next role. That is the order a
 * tenant actually configures this in, and it is the section's claim: there is
 * no fixed role set, so what you are watching is a permission model being
 * built rather than a feature list being ticked off. The denied cells ride the
 * same wave as the granted ones for the same reason — a wave that only landed
 * checkmarks would be a boast, not a configuration. It also lets the data's own
 * shape surface: the wave traces a descending staircase of privilege.
 *
 * The table scrolls inside its own container so the page body never does.
 */
function PermissionMatrix() {
  const { roles, actions, grid } = PERMISSION_MATRIX;
  const reducedMotion = usePrefersReducedMotion();

  // The ref sits on the scroller, not the card: the card's top edge crosses the
  // trigger line well before the table does, and the wave would run with the
  // grid still off-screen.
  const tableRef = useRef<HTMLDivElement>(null);
  const inView = useInView(tableRef, { once: true, margin: '0px 0px -100px 0px' });
  const play = inView || reducedMotion;

  return (
    <div className="rounded-xl border border-neutral-200 bg-surface-raised p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-neutral-900">
          Rol ve aksiyon bazlı izin matrisi
        </h3>
        <DemoBadge label="Örnek yapılandırma" />
      </div>

      {/* `relative` is load-bearing: the cells' sr-only spans are absolutely
          positioned, and without a positioned ancestor inside this scroller
          they resolve against an outer containing block, escape the clip, and
          drag the whole page 161px wide at 375px. */}
      <div ref={tableRef} className="relative overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <caption className="sr-only">
            Rol ve aksiyon bazlı izin matrisi — örnek bir yapılandırma
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-b border-neutral-200 pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600"
              >
                Rol
              </th>
              {actions.map((action) => (
                <th
                  key={action}
                  scope="col"
                  className="border-b border-neutral-200 px-4 pb-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-600"
                >
                  {action}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role, rowIndex) => (
              <tr key={role}>
                <th
                  scope="row"
                  className="border-b border-neutral-100 py-3 pr-4 text-left font-medium text-neutral-900"
                >
                  {role}
                </th>
                {grid[rowIndex].map((allowed, colIndex) => (
                  <td
                    key={actions[colIndex]}
                    className="border-b border-neutral-100 px-4 py-3 text-center"
                  >
                    <motion.span
                      className="inline-flex items-center justify-center"
                      initial={reducedMotion ? false : { opacity: 0, scale: 0.7 }}
                      animate={{ opacity: play ? 1 : 0, scale: play ? 1 : 0.7 }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : {
                              duration: CELL_DURATION,
                              delay: (rowIndex * actions.length + colIndex) * CELL_STAGGER,
                              ease: EASE_OUT_QUART,
                            }
                      }
                    >
                      {allowed ? (
                        <>
                          <Check size={16} className="text-brand-teal" aria-hidden="true" />
                          <span className="sr-only">izinli</span>
                        </>
                      ) : (
                        <>
                          <Minus size={16} className="text-neutral-400" aria-hidden="true" />
                          <span className="sr-only">izinsiz</span>
                        </>
                      )}
                    </motion.span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-neutral-600">
        Sabit rol seti yoktur. Her kiracı kendi rollerini tanımlar; izinler modül, kapsam ve
        aksiyon kırılımında verilir.
      </p>
    </div>
  );
}

/**
 * Section 5 — how a tenant goes live, and what configuring the panel actually
 * looks like. The four steps and the matrix are one story, so they share a
 * section rather than repeating each other across two.
 *
 * The hierarchy between the two is deliberate. The four steps are a sequence,
 * and a staggered reveal is enough to make that sequence readable — they do not
 * need a show, and giving them one would put them in competition with the
 * matrix. The matrix is the section's event, so the card holding it does not
 * perform: it is furniture, and what happens happens inside it.
 */
export function Onboarding() {
  return (
    <section className="bg-surface-default">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          pill="Kurulum ve Yönetim"
          title="Dört adımda kurulumdan canlıya"
        />

        <div className="grid grid-cols-1 gap-8 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {ONBOARDING_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.number} delay={index * 0.05}>
                <div
                  className={`flex h-full flex-col border-t-2 border-neutral-200 pt-6 hover:border-brand-teal ${TRANSITION}`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-mono text-2xl font-bold text-brand-teal">
                      {step.number}
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* No Reveal here: the card is the grid the permissions get written
            into, and a card that fades and rises while its own cells are
            filling would be two entrances competing for one moment. */}
        <div className="mx-5 mt-16 sm:mx-8 lg:mx-12">
          <PermissionMatrix />
        </div>
      </div>
    </section>
  );
}
