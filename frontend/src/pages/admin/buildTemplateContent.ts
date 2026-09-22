import type {
  BirthdayContent,
  CrocodileBlessingContent,
  LoveArrowContent,
  LoveLetterContent,
  LoveQuizContent,
  LoveStoryContent,
  MemoryPageContent,
  MemoryStoryContent,
  OccasionContent,
  TemplateKey,
} from '../../types'

export function isOccasionTemplate(key: TemplateKey) {
  return key === 'graduation'
}

export interface TemplateContentState {
  templateKey: TemplateKey
  contentText: string
  memoryContent: MemoryPageContent
  quizContent: LoveQuizContent
  storyContent: LoveStoryContent
  occasionContent: OccasionContent
  birthdayContent: BirthdayContent
  crocodileBlessingContent?: CrocodileBlessingContent
  memoryStoryContent: MemoryStoryContent
  letterContent: LoveLetterContent
  arrowContent: LoveArrowContent
}

export function buildTemplateContent(state: TemplateContentState): Record<string, unknown> {
  const { templateKey } = state

  if (templateKey === 'memory_page') {
    return {
      ...state.memoryContent,
      entries: (state.memoryContent.entries || [])
        .filter((x) => x.imageUrl?.trim() && x.caption?.trim())
        .map((x) => ({
          id: x.id || crypto.randomUUID(),
          date: x.date?.trim() || undefined,
          caption: x.caption.trim(),
          imageUrl: x.imageUrl.trim(),
          secretNote: x.secretNote?.trim() || undefined,
        })),
    }
  }
  if (templateKey === 'love_quiz') {
    return {
      ...state.quizContent,
      photos: (state.quizContent.photos || []).map((p) => p.trim()).filter(Boolean),
      backgroundImageUrl: state.quizContent.backgroundImageUrl?.trim() || undefined,
      catRunImageUrl: state.quizContent.catRunImageUrl?.trim() || undefined,
      nextSlug: state.quizContent.nextSlug?.trim() || undefined,
    }
  }
  if (templateKey === 'love_story') {
    return {
      ...state.storyContent,
      memories: (state.storyContent.memories || [])
        .filter((m) => m.title.trim() || m.text.trim())
        .map((m) => ({
          ...m,
          title: m.title.trim(),
          text: m.text.trim(),
          imageUrl: m.imageUrl?.trim() || undefined,
        })),
      capsules: (state.storyContent.capsules || [])
        .filter((c) => c.title.trim() || (c.text || '').trim())
        .map((c) => ({
          ...c,
          id: c.id || crypto.randomUUID(),
          title: c.title.trim(),
          text: c.text?.trim() || '',
        })),
    }
  }
  if (templateKey === 'birthday') {
    const floatPhotos = (state.birthdayContent.floatPhotos || []).map((p) => p.trim()).filter(Boolean)
    const bookPhotos = (state.birthdayContent.bookPhotos || []).map((p) => p.trim()).filter(Boolean)
    if (floatPhotos.length > 0 && floatPhotos.length !== 12) {
      throw new Error('รูปลอยมุมบนต้องมี 12 รูป')
    }
    if (bookPhotos.length > 0 && bookPhotos.length !== 10) {
      throw new Error('รูปในสมุดต้องมี 10 รูป')
    }
    return {
      floatPhotos,
      bookPhotos,
      blessingSpread1: state.birthdayContent.blessingSpread1?.trim() || '',
      blessingSpread3: state.birthdayContent.blessingSpread3?.trim() || '',
      blessingSpread5: state.birthdayContent.blessingSpread5?.trim() || '',
      coverMessage: state.birthdayContent.coverMessage?.trim() || '',
      bookLeftSubtitle: state.birthdayContent.bookLeftSubtitle?.trim() || '',
      bookLeftBody1: state.birthdayContent.bookLeftBody1?.trim() || '',
      bookLeftBody3: state.birthdayContent.bookLeftBody3?.trim() || '',
      bookLeftBody5: state.birthdayContent.bookLeftBody5?.trim() || '',
      bookPhotoCaptions: (state.birthdayContent.bookPhotoCaptions || []).map((c) => c.trim()),
    }
  }
  if (templateKey === 'crocodile_blessing') {
    const photo1 = state.crocodileBlessingContent?.photo1?.trim() || ''
    const photo2 = state.crocodileBlessingContent?.photo2?.trim() || ''
    const photo3 = state.crocodileBlessingContent?.photo3?.trim() || ''
    const text1 = state.crocodileBlessingContent?.text1?.trim() || ''
    const closing = state.crocodileBlessingContent?.closing?.trim() || ''
    if (!photo1 || !photo2 || !photo3) {
      throw new Error('กราดพุงเสืออวยพรต้องมีรูปครบ 3 รูป')
    }
    if (!text1 || !closing) {
      throw new Error('กราดพุงเสืออวยพรต้องมีคำอวยพรและคำตบท้าย')
    }
    return {
      eyebrow: state.crocodileBlessingContent?.eyebrow?.trim() || '',
      title: state.crocodileBlessingContent?.title?.trim() || '',
      subtitle: state.crocodileBlessingContent?.subtitle?.trim() || '',
      intro: state.crocodileBlessingContent?.intro?.trim() || '',
      hint: state.crocodileBlessingContent?.hint?.trim() || '',
      photo1,
      text1,
      photo2,
      photo3,
      closing,
    }
  }
  if (templateKey === 'memory_story') {
    const memoryPhotos = (state.memoryStoryContent.memoryPhotos || []).map((p) => p.trim()).filter(Boolean)
    const galleryPhotos = (state.memoryStoryContent.galleryPhotos || []).map((p) => p.trim()).filter(Boolean)
    if (memoryPhotos.length < 2) {
      throw new Error('Memory Story ต้องมีรูปช่วงเปิดเรื่องอย่างน้อย 2 รูป')
    }
    if (memoryPhotos.length % 2 !== 0) {
      throw new Error('รูปช่วงเปิดเรื่องต้องเป็นจำนวนคู่ (2, 4, 6, 8 รูป)')
    }
    if (galleryPhotos.length < 1) {
      throw new Error('Memory Story ต้องมีรูปแกลเลอรี่อย่างน้อย 1 รูป')
    }
    return {
      memoryPhotos,
      galleryPhotos,
      endingWord: state.memoryStoryContent.endingWord?.trim() || 'love you',
    }
  }
  if (templateKey === 'love_letter') {
    return {
      nextSlug: state.letterContent.nextSlug?.trim() || undefined,
    }
  }
  if (templateKey === 'love_arrow') {
    return {
      loveMessage: state.arrowContent.loveMessage?.trim() || '',
      nextSlug: state.arrowContent.nextSlug?.trim() || undefined,
    }
  }
  if (isOccasionTemplate(templateKey)) {
    return {
      ...state.occasionContent,
      photos: (state.occasionContent.photos || []).map((p) => p.trim()).filter(Boolean),
    }
  }
  return JSON.parse(state.contentText) as Record<string, unknown>
}

export function templateUsesForm(key: TemplateKey) {
  return (
    key === 'memory_page' ||
    key === 'memory_story' ||
    key === 'love_quiz' ||
    key === 'love_story' ||
    key === 'love_letter' ||
    key === 'love_arrow' ||
    key === 'birthday' ||
    key === 'crocodile_blessing' ||
    isOccasionTemplate(key)
  )
}
