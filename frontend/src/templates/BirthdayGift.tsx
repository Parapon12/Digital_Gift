import { useCallback, useMemo, useState } from 'react'
import type { BirthdayContent, Gift } from '../types'
import { DEFAULT_BLESSINGS, DEFAULT_BOOK_CAPTIONS, DEFAULT_BOOK_LEFT_SUBTITLE, DEFAULT_BOOK_PHOTOS, DEFAULT_LEFT_BODIES, DEFAULT_PART1_PHOTOS } from './birthday/constants'
import { BirthdayBookScene } from './birthday/BirthdayBookScene'
import { BirthdayHappyScene } from './birthday/BirthdayHappyScene'
import { BirthdayIntroScene } from './birthday/BirthdayIntroScene'

type Scene = 'intro' | 'happy' | 'book'

function normalizePhotos(raw: string[] | undefined, fallback: readonly string[]) {
  const list = (raw || []).map((p) => p.trim()).filter(Boolean)
  return list.length ? list : [...fallback]
}

export function BirthdayGift({ gift }: { gift: Gift }) {
  const content = (gift.content || {}) as BirthdayContent
  const [scene, setScene] = useState<Scene>('intro')

  const floatPhotos = useMemo(
    () => normalizePhotos(content.floatPhotos, DEFAULT_PART1_PHOTOS),
    [content.floatPhotos],
  )

  const bookPhotos = useMemo(
    () => normalizePhotos(content.bookPhotos, DEFAULT_BOOK_PHOTOS),
    [content.bookPhotos],
  )

  const blessings = useMemo(
    () => ({
      spread1: content.blessingSpread1?.trim() || DEFAULT_BLESSINGS.spread1,
      spread3: content.blessingSpread3?.trim() || DEFAULT_BLESSINGS.spread3,
      spread5: content.blessingSpread5?.trim() || DEFAULT_BLESSINGS.spread5,
    }),
    [content.blessingSpread1, content.blessingSpread3, content.blessingSpread5],
  )

  const leftBodies = useMemo(
    () => ({
      spread1: content.bookLeftBody1?.trim() || DEFAULT_LEFT_BODIES.spread1,
      spread3: content.bookLeftBody3?.trim() || DEFAULT_LEFT_BODIES.spread3,
      spread5: content.bookLeftBody5?.trim() || DEFAULT_LEFT_BODIES.spread5,
    }),
    [content.bookLeftBody1, content.bookLeftBody3, content.bookLeftBody5],
  )

  const photoCaptions = useMemo(() => {
    const raw = content.bookPhotoCaptions || []
    return Array.from({ length: 10 }, (_, i) => raw[i]?.trim() || DEFAULT_BOOK_CAPTIONS[i] || '')
  }, [content.bookPhotoCaptions])

  const goHappy = useCallback(() => setScene('happy'), [])
  const goBook = useCallback(() => setScene('book'), [])

  return (
    <div className="bx-root">
      {scene === 'intro' ? (
        <BirthdayIntroScene onComplete={goHappy} />
      ) : null}
      {scene === 'happy' ? (
        <BirthdayHappyScene floatPhotos={floatPhotos} onComplete={goBook} />
      ) : null}
      {scene === 'book' ? (
        <BirthdayBookScene
          bookPhotos={bookPhotos}
          blessings={blessings}
          leftBodies={leftBodies}
          leftSubtitle={content.bookLeftSubtitle?.trim() || DEFAULT_BOOK_LEFT_SUBTITLE}
          photoCaptions={photoCaptions}
          recipientName={gift.recipient_name}
          senderName={gift.sender_name}
          coverMessage={content.coverMessage?.trim() || 'แค่เธอคนพิเศษของฉัน'}
        />
      ) : null}
    </div>
  )
}
