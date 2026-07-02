import { useEffect, useState } from 'react';

/**
 * Tracks the user's `prefers-reduced-motion` setting so heavy visuals
 * (the WebGPU hero shader) can fall back to a static presentation.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/**
 * Live Istanbul (Europe/Istanbul) time as HH:MM, refreshed every 30s.
 */
export function useIstanbulClock(): string {
  const [time, setTime] = useState('');

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Istanbul',
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}
