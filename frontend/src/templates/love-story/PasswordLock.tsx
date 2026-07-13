import { useEffect, useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'

function passwordFromDate(iso?: string, fallback = '14022025') {
  if (!iso) return fallback
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return fallback
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = String(d.getFullYear())
  return `${dd}${mm}${yyyy}`
}

const DIGIT_COUNT = 8

export function PasswordLock({
  password,
  passwordHint,
  anniversaryDate,
  couplePhotoUrl,
  musicUrl,
  recipientName,
  senderName,
  onUnlock,
}: {
  password?: string
  passwordHint?: string
  anniversaryDate?: string
  couplePhotoUrl?: string
  musicUrl?: string
  recipientName: string
  senderName: string
  onUnlock: () => void
}) {
  const expected = useMemo(
    () => (password || passwordFromDate(anniversaryDate)).replace(/\D/g, '').slice(0, DIGIT_COUNT),
    [password, anniversaryDate],
  )

  const [digits, setDigits] = useState<string[]>(() => Array(DIGIT_COUNT).fill(''))
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!musicUrl) return
    const audio = new Audio(musicUrl)
    audio.loop = true
    audio.volume = 0.28
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [musicUrl])

  const pin = digits.join('')

  const setDigitAt = (index: number, value: string) => {
    const next = [...digits]
    next[index] = value
    setDigits(next)
    setError('')
  }

  const onDigitChange = (index: number, raw: string) => {
    const v = raw.replace(/\D/g, '').slice(-1)
    setDigitAt(index, v)
    if (v && index < DIGIT_COUNT - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const onDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'Enter') void unlock()
  }

  const onDigitPaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, DIGIT_COUNT)
    if (!text) return
    const next = Array(DIGIT_COUNT).fill('')
    text.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    const focusAt = Math.min(text.length, DIGIT_COUNT - 1)
    inputsRef.current[focusAt]?.focus()
  }

  const unlock = async () => {
    if (pin !== expected) {
      setError('รหัสยังไม่ถูก ลองอีกครั้งนะ')
      setShake(true)
      window.setTimeout(() => setShake(false), 450)
      return
    }
    setError('')
    try {
      await audioRef.current?.play()
    } catch {
      /* ignore */
    }
    onUnlock()
  }

  const photo = couplePhotoUrl || '/love/couple-demo.png'

  return (
    <section className={`ml-lock ${shake ? 'shake' : ''}`}>
      <div className="ml-petals" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <i key={i} style={{ ['--i' as string]: i }} />
        ))}
      </div>

      <div className="ml-grid">
        <div className="ml-main">
          {/* Compact hero for phones — form stays above the fold */}
          <div className="ml-mobile-hero">
            <img src={photo} alt="" className="ml-mobile-thumb" />
            <div>
              <p className="ml-brand ml-brand-sm">
                Memory Lock <i className="ml-heart" aria-hidden>♥</i>
              </p>
              <p className="ml-mobile-cap">เราเริ่มต้นเรื่องราวของเรา ♡</p>
            </div>
          </div>

          <p className="ml-brand ml-brand-desktop">
            Memory Lock <i className="ml-heart" aria-hidden>♥</i>
          </p>
          <h1>
            ใส่รหัสพิเศษ
            <span className="ml-h1-rest"> เพื่อเข้าสู่ความทรงจำของเรา <span aria-hidden>♡</span></span>
          </h1>
          <p className="ml-to">
            ถึง {recipientName || 'เธอ'} — จาก {senderName || 'ฉัน'}
          </p>

          <div className="ml-hint">
            คำใบ้ : {passwordHint || 'วัน เดือน ปี ที่เราเริ่มคบกัน'}
          </div>
          <p className="ml-example">ตัวอย่าง : 14022025</p>

          <div className="ml-pins" onPaste={onDigitPaste}>
            {digits.map((d, i) => (
              <span key={i} className="ml-pin-wrap">
                {i === 4 ? <span className="ml-dash" aria-hidden>—</span> : null}
                <input
                  ref={(el) => { inputsRef.current[i] = el }}
                  className="ml-pin"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={d}
                  aria-label={`หลักที่ ${i + 1}`}
                  onChange={(e) => onDigitChange(i, e.target.value)}
                  onKeyDown={(e) => onDigitKeyDown(i, e)}
                />
              </span>
            ))}
          </div>
          <p className="ml-pin-note">รหัสมี 8 หลัก (ววดดปปปป)</p>
          {error && <p className="ml-error">{error}</p>}

          <div className="ml-actions">
            <button type="button" className="ml-btn" onClick={() => void unlock()}>
              <span aria-hidden>🔒</span> เข้าสู่ความทรงจำ <span aria-hidden>❤</span>
            </button>
          </div>

          <div className="ml-footer">
            <span>🔐 ปลอดภัย</span>
            <span>💗 เก็บความทรงจำไว้ด้วยกัน</span>
            <span>✨ อย่าลืมรหัสนะ</span>
          </div>
        </div>

        <aside className="ml-side">
          <figure className="ml-polaroid">
            <span className="ml-tape" aria-hidden />
            <img src={photo} alt="รูปคู่" />
            <figcaption>
              เราเริ่มต้นเรื่องราวของเรา
              <span aria-hidden> ♡</span>
            </figcaption>
          </figure>

          <div className="ml-music">
            <span aria-hidden>♪</span>
            <p>เพลงนี้แทนใจฉันที่มีให้เธอ</p>
            <span aria-hidden>♥</span>
          </div>
        </aside>
      </div>
    </section>
  )
}
