import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function ExperienceShell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={`lx-root ${className}`.trim()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="lx-bg" aria-hidden />
      <div className="lx-veil" aria-hidden />
      {children}
    </motion.div>
  )
}
