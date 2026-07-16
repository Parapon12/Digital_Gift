/** Parse YYYY-MM-DD at local midnight. */
export function parseAnniversaryDate(iso: string): Date | null {
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Add calendar months, clamping day to last day of target month (e.g. Jan 31 + 1mo → Feb 28). */
export function addCalendarMonths(base: Date, months: number): Date {
  const day = base.getDate()
  const totalMonths = base.getMonth() + months
  const targetYear = base.getFullYear() + Math.floor(totalMonths / 12)
  const targetMonth = ((totalMonths % 12) + 12) % 12
  const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate()
  return new Date(targetYear, targetMonth, Math.min(day, lastDay))
}

/** Unlock date for milestone N months after anniversary (month 1 → +1 month). */
export function getUnlockDate(anniversaryIso: string, monthIndex: number): Date | null {
  const base = parseAnniversaryDate(anniversaryIso)
  if (!base || monthIndex < 1) return null
  return addCalendarMonths(base, monthIndex)
}

export function canOpenCapsule(
  anniversaryIso: string | undefined,
  monthIndex: number,
  now: Date = new Date(),
): boolean {
  if (!anniversaryIso) return false
  const unlock = getUnlockDate(anniversaryIso, monthIndex)
  if (!unlock) return false
  return startOfDay(now).getTime() >= startOfDay(unlock).getTime()
}

export function daysUntilUnlock(
  anniversaryIso: string,
  monthIndex: number,
  now: Date = new Date(),
): number {
  const unlock = getUnlockDate(anniversaryIso, monthIndex)
  if (!unlock) return 0
  const diff = startOfDay(unlock).getTime() - startOfDay(now).getTime()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

/** 1 → "1 เดือน", 12 → "1 ปี", 15 → "1 ปี 3 เดือน", 24 → "2 ปี" */
export function formatMilestoneLabel(monthIndex: number): string {
  if (monthIndex <= 0) return ''
  if (monthIndex % 12 === 0) return `${monthIndex / 12} ปี`
  const years = Math.floor(monthIndex / 12)
  const months = monthIndex % 12
  if (years === 0) return `${months} เดือน`
  return `${years} ปี ${months} เดือน`
}

/** Resolve month index from capsule unlock fields (months rule or legacy years). */
export function capsuleMonthIndex(unlockRule: string, unlockValue = 1): number {
  if (unlockRule === 'years') return Math.max(1, unlockValue || 1) * 12
  if (unlockRule === 'months') return Math.max(1, unlockValue || 1)
  return 0
}

/** Calendar-accurate elapsed years / months / days from anniversary to now. */
export function calendarElapsed(anniversaryIso: string, now: Date = new Date()) {
  const start = parseAnniversaryDate(anniversaryIso)
  if (!start) return null

  const today = startOfDay(now)
  const begin = startOfDay(start)
  if (today.getTime() < begin.getTime()) {
    return { years: 0, months: 0, days: 0, daysTotal: 0 }
  }

  let years = today.getFullYear() - begin.getFullYear()
  let months = today.getMonth() - begin.getMonth()
  let days = today.getDate() - begin.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const daysTotal = Math.floor((today.getTime() - begin.getTime()) / 86_400_000)
  return { years, months, days, daysTotal }
}
