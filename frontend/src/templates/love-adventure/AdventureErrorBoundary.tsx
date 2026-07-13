import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { error: Error | null }

/** Catches WebGL / R3F crashes so phones still show a usable message */
export class AdventureErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="adv-webgl-fallback">
          <p>อุปกรณ์นี้เปิดฉาก 3D ไม่ได้</p>
          <small>ลองใช้ Chrome / Safari เวอร์ชันล่าสุด หรือเปิดบนคอมพิวเตอร์</small>
        </div>
      )
    }
    return this.props.children
  }
}
