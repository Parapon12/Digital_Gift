/** Official LINE OA — used by LINE buttons when not hidden (GitHub Pages sets VITE_HIDE_LINE). */
export const SHOW_LINE = import.meta.env.VITE_HIDE_LINE !== 'true'
export const LINE_URL = SHOW_LINE ? 'https://lin.ee/uoPtq9r' : ''

/** Public TikTok — shown on the site footer, including GitHub Pages. */
export const TIKTOK_URL = 'https://www.tiktok.com/@user86599398332828'

export function homeHash(hash: string) {
  return `${import.meta.env.BASE_URL || '/'}#${hash.replace(/^#/, '')}`
}
