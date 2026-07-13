/** Public asset path that respects Vite `base` (GitHub Pages subpath). */
export function asset(path: string): string {
  if (!path) return path
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${path.replace(/^\//, '')}`
}
