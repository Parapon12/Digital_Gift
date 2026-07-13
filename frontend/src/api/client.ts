import type { Gift, SiteConfig, TemplateInfo } from '../types'

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
  getSite: () => request<SiteConfig>('/api/site'),
  getTemplates: () => request<TemplateInfo[]>('/api/templates'),
  getGift: (publicId: string) => request<Gift>(`/api/gifts/${publicId}`),
  getDemo: (slug: string) => request<Gift>(`/api/demos/${slug}`),
}
