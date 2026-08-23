import { asset } from '../../lib/asset'

export function BookTextPage({
  leftSubtitle,
  body,
}: {
  leftSubtitle: string
  body: string
}) {
  return (
    <div className="bx-nb-page bx-nb-page--text">
      <span className="bx-nb-deco bx-nb-deco--heart-tl" aria-hidden>
        ♥
      </span>
      <span className="bx-nb-deco bx-nb-deco--cake" aria-hidden>
        🎂
      </span>
      <p className="bx-nb-script">Happy Birthday</p>
      <p className="bx-nb-subtitle">{leftSubtitle}</p>
      <p className="bx-nb-body">{body}</p>
      <span className="bx-nb-deco bx-nb-deco--sakura" aria-hidden>
        🌸
      </span>
      <span className="bx-nb-deco bx-nb-deco--doodle" aria-hidden>
        ♡
      </span>
    </div>
  )
}

export function BookPhotoPage({
  photoUrl,
  caption,
  recipientName,
  tilt = 'b',
  showForYou = true,
}: {
  photoUrl: string
  caption: string
  recipientName: string
  tilt?: 'a' | 'b'
  showForYou?: boolean
}) {
  return (
    <div className="bx-nb-page bx-nb-page--photo">
      {showForYou ? <p className="bx-nb-for-you">สำหรับ{recipientName || 'เธอ'} ♥</p> : null}
      <figure className={`bx-nb-polaroid bx-nb-polaroid--${tilt}`}>
        <span className="bx-nb-tape" aria-hidden />
        {photoUrl ? <img src={asset(photoUrl)} alt="" loading="eager" decoding="sync" /> : null}
        {caption ? <figcaption>{caption}</figcaption> : null}
        <span className="bx-nb-polaroid-heart" aria-hidden>
          ♥
        </span>
      </figure>
      <span className="bx-nb-deco bx-nb-deco--flowers-tr" aria-hidden>
        🌷
      </span>
      <span className="bx-nb-deco bx-nb-deco--ribbon" aria-hidden />
    </div>
  )
}

export function BookPolaroidOnly({ photoUrl, caption, tilt = 'a' }: { photoUrl: string; caption: string; tilt?: 'a' | 'b' }) {
  return (
    <div className="bx-nb-page bx-nb-page--photo bx-nb-page--photo-only">
      <figure className={`bx-nb-polaroid bx-nb-polaroid--${tilt}`}>
        <span className="bx-nb-tape" aria-hidden />
        {photoUrl ? <img src={asset(photoUrl)} alt="" loading="eager" decoding="sync" /> : null}
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </div>
  )
}
