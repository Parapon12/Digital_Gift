import { AnimatePresence, motion } from 'framer-motion'
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
    let cancelled = false
    setError('')
    api.getDemo(slug)
      .then((next) => {
        if (!cancelled) setGift(next)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'โหลดไม่สำเร็จ')
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (error && !gift) {
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
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={slug || gift.public_id}
          className="gift-scene-swap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <GiftRenderer gift={gift} />
        </motion.div>
      </AnimatePresence>
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
