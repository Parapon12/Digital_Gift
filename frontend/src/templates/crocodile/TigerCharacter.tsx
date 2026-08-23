import { asset } from '../../lib/asset'

export function TigerCharacter({
  waving,
  onBelly,
}: {
  waving: boolean
  onBelly: () => void
}) {
  return (
    <div className={`tiger-art${waving ? ' is-waving' : ''}`}>
      <img src={asset('tiger/tiger.png')} alt="" draggable={false} />
      <button
        type="button"
        className="tiger-belly"
        aria-label="แตะพุงเสือเพื่อเปิดกรอบของขวัญ"
        disabled={waving}
        onClick={onBelly}
      />
    </div>
  )
}
