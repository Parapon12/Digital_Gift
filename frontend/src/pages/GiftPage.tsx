import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { GiftRenderer } from '../templates/GiftRenderer'
import type { Gift } from '../types'

export function DemoPage() {
  const { slug } = useParams<{ slug: string }>()
  const [gift, setGift] = useState<Gift | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    api.getDemo(slug)
      .then(setGift)
      .catch((e) => setError(e instanceof Error ? e.message : 'โหลดไม่สำเร็จ'))
  }, [slug])

  if (error) {
    return (
      <section className="section container" style={{ textAlign: 'center' }}>
        <p>{error}</p>
        <Link to="/" className="btn-luxury" style={{ marginTop: 16, display: 'inline-block' }}>กลับหน้าแรก</Link>
      </section>
    )
  }

  if (!gift) {
    return <section className="section container" style={{ textAlign: 'center' }}><p>กำลังโหลด demo...</p></section>
  }

  return (
    <div className="gift-page">
      <div className="demo-banner">
        <span>โหมดตัวอย่าง · ไม่ใช่ของขวัญจริง</span>
        <Link to="/">กลับหน้าแรก</Link>
      </div>
      <GiftRenderer gift={gift} />
    </div>
  )
}

export function GiftPage() {
  const { id } = useParams<{ id: string }>()
  const [gift, setGift] = useState<Gift | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.getGift(id)
      .then(setGift)
      .catch((e) => setError(e instanceof Error ? e.message : 'โหลดไม่สำเร็จ'))
  }, [id])

  if (error) {
    return (
      <section className="section container" style={{ textAlign: 'center' }}>
        <h1 className="section-title">ไม่พบของขวัญ</h1>
        <p className="section-subtitle">{error}</p>
      </section>
    )
  }

  if (!gift) {
    return <section className="section container" style={{ textAlign: 'center' }}><p>กำลังเปิดของขวัญ...</p></section>
  }

  return (
    <div className="gift-page">
      <GiftRenderer gift={gift} />
    </div>
  )
}
