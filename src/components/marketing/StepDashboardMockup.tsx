import { ArrowDown, ArrowUp } from 'lucide-react';
import { STEP_DASHBOARD } from '../../data/content';
import { DemoBadge, StatusBadge } from '../primitives';

/** Priority chip tones. 'danger'/'warning' have no StatusBadge equivalent
 * (its tone union is success | neutral | information), so alert priority
 * renders from plain token classes here rather than widening that union. */
const PRIORITY_TONE_CLASSES: Record<'Yüksek Öncelik' | 'Orta Öncelik', string> = {
  'Yüksek Öncelik': 'bg-danger text-danger-fg',
  'Orta Öncelik': 'bg-warning text-warning-fg',
};

/**
 * Ticket status badge. Three of the four statuses map cleanly onto
 * StatusBadge's tone union; "Kritik" needs to read as severe, which that
 * union can't express, so it renders from plain danger token classes
 * instead of trusting the seed data's tone field for that one row.
 */
function TicketStatus({ status, tone }: { status: string; tone: 'success' | 'neutral' | 'information' }) {
  if (status === 'Kritik') {
    return (
      <span className="inline-flex items-center rounded-full bg-danger px-3 py-1 font-mono text-xs font-bold text-danger-fg">
        {status}
      </span>
    );
  }
  return <StatusBadge label={status} tone={tone} shape="pill" />;
}

/**
 * Step 03 — honest HTML/CSS replacement for the raster "regional manager
 * dashboard" screenshot. Text is real markup driven by STEP_DASHBOARD
 * (seeded demo data), so it can never contain the baked-in defects (English
 * strings, a fabricated calendar date) the two prior raster/regeneration
 * attempts produced. Every timestamp is relative ("Bugün"/"Dün") — no
 * absolute date appears. Carries a DemoBadge per the page's rule for every
 * panel rendering mock data.
 *
 * Stacked single-column layout (not a 3-up grid or a data table) so the
 * panel stays readable at the ~half-viewport width this component renders
 * at on desktop, without any horizontal scroll or overflow.
 */
export function StepDashboardMockup() {
  const { nps, tickets, alerts } = STEP_DASHBOARD;

  return (
    <div className="w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-overlay sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-neutral-600">3CP · Bölge Yöneticisi Paneli · Bugün</span>
        <DemoBadge />
      </div>

      {/* Şube NPS Performansı */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
            Şube NPS Performansı
          </h4>
          <span className="font-mono text-[11px] text-neutral-400">Son 30 Gün</span>
        </div>
        <ul className="mt-3 space-y-2">
          {nps.map((row) => {
            const isUp = row.delta.startsWith('+');
            return (
              <li
                key={row.branch}
                className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 px-3 py-2.5"
              >
                <span className="truncate text-sm font-medium text-neutral-900">{row.branch}</span>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-sm font-bold tabular-nums text-neutral-900">
                    {row.score}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-xs font-bold tabular-nums ${
                      isUp ? 'text-success-fg' : 'text-danger-fg'
                    }`}
                  >
                    {isUp ? (
                      <ArrowUp size={12} aria-hidden="true" />
                    ) : (
                      <ArrowDown size={12} aria-hidden="true" />
                    )}
                    {row.delta}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Otomatik Oluşan Ticket'lar */}
      <div className="mt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
          Otomatik Oluşan Ticket&rsquo;lar
        </h4>
        <ul className="mt-3 space-y-2">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="rounded-lg border border-neutral-100 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold tabular-nums text-neutral-900">
                  {ticket.id}
                </span>
                <TicketStatus status={ticket.status} tone={ticket.tone} />
              </div>
              <p className="mt-1 truncate text-xs text-neutral-600">
                {ticket.branch} · {ticket.category}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-neutral-400">{ticket.time}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Kritik Uyarılar */}
      <div className="mt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
          Kritik Uyarılar
        </h4>
        <ul className="mt-3 space-y-2">
          {alerts.map((alert) => (
            <li key={alert.title} className="rounded-lg border border-neutral-200 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900">{alert.title}</p>
                  <p className="mt-0.5 truncate text-xs text-neutral-600">{alert.branch}</p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 font-mono text-xs font-bold ${
                    PRIORITY_TONE_CLASSES[alert.priority as 'Yüksek Öncelik' | 'Orta Öncelik']
                  }`}
                >
                  {alert.priority}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
