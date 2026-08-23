import { asset } from '../../lib/asset'
import { TIGER_PHOTO } from './constants'

function mascotClass(src: string) {
  return src.includes(TIGER_PHOTO) ? 'is-mascot' : undefined
}

export function KradSheet({
  title,
  subtitle,
  story,
  photoLeft,
  photoRight,
  photoCenter,
  closing,
  onContinue,
}: {
  title: string
  subtitle: string
  story: string
  photoLeft: string
  photoRight: string
  photoCenter: string
  closing: string
  onContinue: () => void
}) {
  return (
    <article className="krad-sheet">
      <h2 className="krad-title">{title}</h2>
      <p className="krad-subtitle">
        <span>✦</span> {subtitle} <span>✦</span>
      </p>
      <hr className="krad-rule" />
      {story ? <p className="krad-article">{story}</p> : null}
      {photoLeft || photoRight ? (
        <div className="krad-pair">
          {photoLeft ? <img className={mascotClass(photoLeft)} src={asset(photoLeft)} alt="" /> : <span />}
          {photoRight ? <img className={mascotClass(photoRight)} src={asset(photoRight)} alt="" /> : <span />}
        </div>
      ) : null}
      {photoCenter ? (
        <figure className="krad-center">
          <img className={mascotClass(photoCenter)} src={asset(photoCenter)} alt="" />
        </figure>
      ) : null}
      {closing ? (
        <>
          <hr className="krad-rule" />
          <p className="krad-closing">{closing}</p>
        </>
      ) : null}

      <button type="button" className="tiger-feet" onClick={onContinue}>
        <span className="tiger-feet-emoji" aria-hidden>
          🐾 🐾
        </span>
        <span className="tiger-feet-label">แตะตีนเสือเพื่อไปต่อ</span>
      </button>
    </article>
  )
}
