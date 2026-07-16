import { useCallback, useEffect, useState } from 'react';

/**
 * Tracks the user's `prefers-reduced-motion` setting so heavy visuals
 * (the animated hero background, marquees) can fall back to a static
 * presentation.
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

export type Theme = 'light' | 'dark';

/** Reads the theme the FOUC-guard script in index.html already stamped. */
function readTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/**
 * Current theme + toggle. The source of truth is the `data-theme` attribute
 * on <html> (set pre-paint by the inline script in index.html); toggling
 * updates the attribute and persists the explicit choice to localStorage.
 * The OS preference is only a fallback for visitors who never toggled —
 * we deliberately don't write it to storage on mount.
 */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(readTheme);

  // Several toggles can be mounted at once (desktop navbar + mobile menu);
  // observing the attribute keeps every instance's icon in sync no matter
  // which one flipped it.
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    // The attribute is the source of truth; state follows it.
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode / storage kapalı — tema yine de bu oturumda geçerli */
    }
    setTheme(next);
  }, []);

  return { theme, toggleTheme };
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
