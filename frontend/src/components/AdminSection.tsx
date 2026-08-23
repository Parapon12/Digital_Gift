import type { ReactNode } from 'react'

export function AdminSection({
  step,
  title,
  scene,
  help,
  children,
}: {
  step?: number | string
  title: string
  scene?: string
  help?: string
  children: ReactNode
}) {
  return (
    <section className="admin-section">
      <header className="admin-section-head">
        <div className="admin-section-title-row">
          {step != null ? <span className="admin-section-step">{step}</span> : null}
          <h3 className="admin-section-title">{title}</h3>
        </div>
        {scene ? <p className="admin-section-scene">หน้าจอ: {scene}</p> : null}
        {help ? <p className="admin-section-help">{help}</p> : null}
      </header>
      <div className="admin-section-body">{children}</div>
    </section>
  )
}
