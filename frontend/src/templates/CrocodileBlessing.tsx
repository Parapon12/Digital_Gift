import { useEffect, useMemo, useRef, useState } from 'react'
import type { CrocodileBlessingContent, Gift } from '../types'
import { TigerCharacter } from './crocodile/TigerCharacter'
import { KradSheet } from './crocodile/KradSheet'
import { BirthdayHappyScene } from './birthday/BirthdayHappyScene'
import {
  displayBlessingCopy,
  defaultCrocodileBlessingContent,
  blessingPhoto,
  TRIBUTE_FIRST,
  TRIBUTE_SECOND,
  TIGER_PHOTO,
} from './crocodile/constants'

type View = 'land' | 'scroll' | 'tribute'

export function CrocodileBlessing({ gift }: { gift: Gift }) {
  const content = (gift.content || {}) as CrocodileBlessingContent
  const [view, setView] = useState<View>('land')
  const [waving, setWaving] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const waveTimer = useRef(0)
  const defaults = defaultCrocodileBlessingContent()

  useEffect(() => () => window.clearTimeout(waveTimer.current), [])

  const openBelly = () => {
    if (view !== 'land' || waving) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setView('scroll')
      return
    }
    setWaving(true)
    waveTimer.current = window.setTimeout(() => {
      setWaving(false)
      setView('scroll')
    }, 1150)
  }

  const title = displayBlessingCopy(content.title, defaults.title)
  const eyebrow = displayBlessingCopy(content.eyebrow, defaults.eyebrow)
  const intro = displayBlessingCopy(content.intro, defaults.intro)
  const hint = displayBlessingCopy(content.hint, defaults.hint)
  const subtitle = displayBlessingCopy(content.subtitle, defaults.subtitle)
  const story = displayBlessingCopy(content.text1, defaults.text1)
  const closing = displayBlessingCopy(content.closing, defaults.closing)
  const photoLeft = blessingPhoto(content.photo1, defaults.photo1)
  const photoRight = blessingPhoto(content.photo2, defaults.photo2)
  const photoCenter = blessingPhoto(content.photo3, defaults.photo3)
  const floatPhotos = useMemo(
    () => [photoLeft, photoRight, photoCenter, TIGER_PHOTO].filter(Boolean),
    [photoLeft, photoRight, photoCenter],
  )

  useEffect(() => {
    if (view === 'scroll') {
      scrollRef.current?.scrollTo({ top: 0 })
      window.scrollTo({ top: 0 })
    }
  }, [view])

  return (
    <div className={`gator-root${view === 'scroll' ? ' is-reading' : ''}${view === 'tribute' ? ' is-tribute' : ''}`}>
      {view === 'land' ? (
        <div className="gator-stage">
          <p className="gator-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="gator-intro">{intro}</p>

          <div className="gator-frame">
            <TigerCharacter waving={waving} onBelly={openBelly} />
          </div>

          <p className="gator-hint">{hint}</p>
        </div>
      ) : null}

      {view === 'scroll' ? (
        <div ref={scrollRef} className="krad-page">
          <KradSheet
            title={title}
            subtitle={subtitle}
            story={story}
            photoLeft={photoLeft}
            photoRight={photoRight}
            photoCenter={photoCenter}
            closing={closing}
            onContinue={() => setView('tribute')}
          />
        </div>
      ) : null}

      {view === 'tribute' ? (
        <div className="tiger-tribute">
          <BirthdayHappyScene
            floatPhotos={floatPhotos}
            firstWord={TRIBUTE_FIRST}
            secondWord={TRIBUTE_SECOND}
            holdAtEnd
          />
        </div>
      ) : null}
    </div>
  )
}
