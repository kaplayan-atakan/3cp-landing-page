export type ClassValue = string | false | null | undefined;

/**
 * Joins class names, dropping falsy entries. Deliberately dependency-free: the
 * codebase never emits conflicting Tailwind utilities for the same property, so
 * `tailwind-merge`'s conflict resolution would be dead weight.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
