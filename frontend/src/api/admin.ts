import type { Gift, TemplateKey } from '../types'

const TOKEN_KEY = 'giftlove_jwt'

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY)
}

const API_BASE = import.meta.env.VITE_API_URL || ''

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    clearAdminToken()
    throw new Error('unauthorized')
  }
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || 'request failed')
  }
  return data as T
}

export interface LoginResult {
  token: string
  email: string
}

export interface CreateGiftBody {
  template_key: TemplateKey
  title: string
  recipient_name: string
  sender_name: string
  content: Record<string, unknown>
  is_published?: boolean
}

export interface UpdateGiftBody {
  title?: string
  recipient_name?: string
  sender_name?: string
  content?: Record<string, unknown>
  is_published?: boolean
}

export const adminApi = {
  login: (email: string, password: string) =>
    fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'login failed')
      return data as LoginResult
    }),

  listGifts: () => adminRequest<Gift[]>('/api/admin/gifts'),
  getGift: (id: string) => adminRequest<Gift>(`/api/admin/gifts/${id}`),
  createGift: (body: CreateGiftBody) =>
    adminRequest<Gift>('/api/admin/gifts', { method: 'POST', body: JSON.stringify(body) }),
  updateGift: (id: string, body: UpdateGiftBody) =>
    adminRequest<Gift>(`/api/admin/gifts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteGift: (id: string) =>
    adminRequest<{ message: string }>(`/api/admin/gifts/${id}`, { method: 'DELETE' }),

  upload: async (file: File) => {
    const token = getAdminToken()
    const body = new FormData()
    body.append('file', file)
    const res = await fetch(`${API_BASE}/api/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    })
    const data = await res.json().catch(() => ({}))
    if (res.status === 401) {
      clearAdminToken()
      throw new Error('unauthorized')
    }
    if (!res.ok) {
      throw new Error((data as { error?: string }).error || 'อัปโหลดไม่สำเร็จ')
    }
    const url = (data as { url?: string }).url || ''
    if (!url) throw new Error('อัปโหลดไม่สำเร็จ')
    // Dev proxy uses relative /uploads; production API may be on another host.
    if (url.startsWith('http') || !API_BASE) return url
    return `${API_BASE.replace(/\/$/, '')}${url}`
  },
}
