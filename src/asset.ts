/**
 * Resolves a path that lives in /public against the app's base URL so links
 * work both at the domain root and on a GitHub Pages project subpath.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
