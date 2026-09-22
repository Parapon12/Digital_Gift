import type { Gift, SiteConfig, TemplateInfo } from '../types'
import { getLocalDemo, LOCAL_TEMPLATES, mergeTemplateCatalog } from '../data/demos'
import { LINE_URL } from '../lib/line'

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
  getSite: () => {
    if (!API_BASE) {
      return Promise.resolve({
        line_url: LINE_URL,
        frontend_url: typeof window !== 'undefined' ? window.location.origin : '',
      })
    }
    return request<SiteConfig>('/api/site').catch(() => ({
      line_url: LINE_URL,
      frontend_url: window.location.origin,
    }))
  },

  getTemplates: () => {
    if (!API_BASE) return Promise.resolve(LOCAL_TEMPLATES)
    return request<TemplateInfo[]>('/api/templates')
      .then(mergeTemplateCatalog)
      .catch(() => LOCAL_TEMPLATES)
  },

  getGift: (publicId: string) => request<Gift>(`/api/gifts/${publicId}`),

  getDemo: async (slug: string) => {
    if (slug === 'love-adventure') {
      throw new Error('ไม่พบ demo')
    }
    const local = getLocalDemo(slug)
    if (local) return local
    return request<Gift>(`/api/demos/${slug}`)
  },
}
