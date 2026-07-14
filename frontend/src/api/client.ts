import type { Gift, SiteConfig, TemplateInfo } from '../types'
import { getLocalDemo, LOCAL_TEMPLATES } from '../data/demos'

const API_BASE = import.meta.env.VITE_API_URL || ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || 'request failed')
  }
  return data as T
}

export const api = {
  getSite: () =>
    request<SiteConfig>('/api/site').catch(() => ({
      line_url: 'https://line.me/ti/p/@giftlove',
      frontend_url: window.location.origin,
    })),

  getTemplates: () =>
    request<TemplateInfo[]>('/api/templates').catch(() => LOCAL_TEMPLATES),

  getGift: (publicId: string) => request<Gift>(`/api/gifts/${publicId}`),

  getDemo: async (slug: string) => {
    const local = getLocalDemo(slug)
    // Memory Page demo lives fully on the frontend so content stays rich without API lag.
    if (slug === 'memory-page' && local) return local
    try {
      return await request<Gift>(`/api/demos/${slug}`)
    } catch {
      if (local) return local
      throw new Error('ไม่พบ demo')
    }
  },
}
