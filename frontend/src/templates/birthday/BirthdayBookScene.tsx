import { useMemo, useState } from 'react'
import { BirthdayBookCover } from './BirthdayBookCover'
import { BirthdayBookInner, type BookSpreadData } from './BirthdayBookInner'

export function BirthdayBookScene({
  bookPhotos,
  blessings,
  leftBodies,
  leftSubtitle,
  photoCaptions,
  recipientName,
  senderName,
  coverMessage = 'แค่เธอคนพิเศษของฉัน',
}: {
  bookPhotos: string[]
  blessings: { spread1: string; spread3: string; spread5: string }
  leftBodies: { spread1: string; spread3: string; spread5: string }
  leftSubtitle: string
  photoCaptions: string[]
  recipientName: string
  senderName: string
  coverMessage?: string
}) {
  const spreads = useMemo<BookSpreadData[]>(() => {
    const photos = bookPhotos.filter(Boolean)
    const pick = (i: number) => photos[i] || ''
    const cap = (i: number) => photoCaptions[i]?.trim() || ''
    return [
      {
        leftPhoto: pick(0),
        rightPhoto: pick(1),
        blessing: blessings.spread1,
        leftBody: leftBodies.spread1,
        leftCaption: cap(0),
        rightCaption: cap(1),
      },
      {
        leftPhoto: pick(2),
        rightPhoto: pick(3),
        leftCaption: cap(2),
        rightCaption: cap(3),
      },
      {
        leftPhoto: pick(4),
        rightPhoto: pick(5),
        blessing: blessings.spread3,
        leftBody: leftBodies.spread3,
        leftCaption: cap(4),
        rightCaption: cap(5),
      },
      {
        leftPhoto: pick(6),
        rightPhoto: pick(7),
        leftCaption: cap(6),
        rightCaption: cap(7),
      },
      {
        leftPhoto: pick(8),
        rightPhoto: pick(9),
        blessing: blessings.spread5,
        leftBody: leftBodies.spread5,
        leftCaption: cap(8),
        rightCaption: cap(9),
      },
    ]
  }, [bookPhotos, blessings, leftBodies, photoCaptions])

  const [opened, setOpened] = useState(false)
  const [spreadIndex, setSpreadIndex] = useState(0)

  return (
    <section className={`bx-scene bx-scene--book ${opened ? 'bx-scene--book-open' : 'bx-scene--book-cover'}`}>
      {!opened ? (
        <BirthdayBookCover
          recipientName={recipientName}
          senderName={senderName}
          coverMessage={coverMessage}
          onOpen={() => setOpened(true)}
        />
      ) : (
        <BirthdayBookInner
          spreads={spreads}
          recipientName={recipientName}
          leftSubtitle={leftSubtitle}
          spreadIndex={spreadIndex}
          onSpreadIndexChange={setSpreadIndex}
        />
      )}
    </section>
  )
}
