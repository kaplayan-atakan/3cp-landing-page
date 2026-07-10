import { Check, Minus } from 'lucide-react';
import { ONBOARDING_STEPS, PERMISSION_MATRIX } from '../../data/content';
import { DemoBadge, Reveal, SectionHeader, TRANSITION } from '../primitives';

/**
 * A read-only preview of the Dense Matrix layout (design language §8.2): roles
 * down the side, actions across the top. Permission is never signalled by
 * colour alone — each cell pairs its icon with screen-reader text.
 *
 * The table scrolls inside its own container so the page body never does.
 */
function PermissionMatrix() {
  const { roles, actions, grid } = PERMISSION_MATRIX;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-neutral-900">
          Rol ve aksiyon bazlı izin matrisi
        </h3>
        <DemoBadge label="Örnek yapılandırma" />
      </div>

      <div className="overflow-x-auto">
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
                    <span className="inline-flex items-center justify-center">
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
                    </span>
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
 */
export function Onboarding() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container py-20">
        <SectionHeader
          number="05"
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

        <Reveal className="mx-5 mt-16 sm:mx-8 lg:mx-12">
          <PermissionMatrix />
        </Reveal>
      </div>
    </section>
  );
}
