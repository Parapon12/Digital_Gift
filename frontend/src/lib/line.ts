/** Official LINE OA — used by LINE buttons when not hidden (GitHub Pages sets VITE_HIDE_LINE). */
export const SHOW_LINE = import.meta.env.VITE_HIDE_LINE !== 'true'
export const LINE_URL = SHOW_LINE ? 'https://lin.ee/uoPtq9r' : ''

export function homeHash(hash: string) {
  return `${import.meta.env.BASE_URL || '/'}#${hash.replace(/^#/, '')}`
}
