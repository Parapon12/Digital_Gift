/** Visual/performance tier for Love Adventure 3D */
export type AdventureQuality = 'low' | 'medium' | 'high'

export function adventureQuality(width: number, height: number): AdventureQuality {
  const shortest = Math.min(width, height)
  const isPhone = width < 768 || shortest < 520
  const isTablet = !isPhone && (width < 1100 || shortest < 800)
  if (isPhone) return 'low'
  if (isTablet) return 'medium'
  return 'high'
}

export function isPortraitSize(width: number, height: number) {
  return height >= width
}

export const QUALITY = {
  low: {
    dprMax: 1.05,
    shadows: false,
    bloom: false,
    contactShadows: false,
    sparkles: 8,
    finaleSparkles: 12,
    petals: 12,
    hearts: 14,
    butterflies: false,
    flowerCount: 18,
    shadowMap: 512,
    terrainSegX: 28,
    terrainSegY: 14,
  },
  medium: {
    dprMax: 1.25,
    shadows: true,
    bloom: true,
    contactShadows: true,
    sparkles: 16,
    finaleSparkles: 22,
    petals: 18,
    hearts: 24,
    butterflies: true,
    flowerCount: 28,
    shadowMap: 768,
    terrainSegX: 36,
    terrainSegY: 18,
  },
  high: {
    dprMax: 1.5,
    shadows: true,
    bloom: true,
    contactShadows: true,
    sparkles: 28,
    finaleSparkles: 36,
    petals: 28,
    hearts: 40,
    butterflies: true,
    flowerCount: 42,
    shadowMap: 1024,
    terrainSegX: 48,
    terrainSegY: 24,
  },
} as const
