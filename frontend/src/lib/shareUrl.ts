/** Base origin used for QR / phone share links (LAN reachable when possible). */
let cachedShareOrigin = ''

function isLocalHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname === '::1'
}

export function currentOrigin() {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

/** Prefer LAN share origin when admin is editing on localhost. */
export async function resolveShareOrigin(): Promise<string> {
  if (typeof window === 'undefined') return ''
  const here = window.location
  // Already opened via phone/LAN IP — use that.
  if (!isLocalHost(here.hostname)) {
    cachedShareOrigin = here.origin
    return cachedShareOrigin
  }
  if (cachedShareOrigin) return cachedShareOrigin

  const envShare = (import.meta.env.VITE_SHARE_ORIGIN as string | undefined)?.trim()
  if (envShare) {
    cachedShareOrigin = envShare.replace(/\/$/, '')
    return cachedShareOrigin
  }

  try {
    const API_BASE = import.meta.env.VITE_API_URL || ''
    const res = await fetch(`${API_BASE}/api/site`)
    if (res.ok) {
      const data = (await res.json()) as { share_url?: string; frontend_url?: string }
      const share = (data.share_url || '').replace(/\/$/, '')
      if (share && !/localhost|127\.0\.0\.1/i.test(share)) {
        cachedShareOrigin = share
        return cachedShareOrigin
      }
    }
  } catch {
    // fall through
  }

  cachedShareOrigin = here.origin
  return cachedShareOrigin
}

export function giftSharePath(publicId: string) {
  const base = import.meta.env.BASE_URL || '/'
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base
  return `${prefix}/gift/${publicId}`
}

export async function giftShareUrl(publicId: string) {
  const origin = await resolveShareOrigin()
  return `${origin}${giftSharePath(publicId)}`
}
