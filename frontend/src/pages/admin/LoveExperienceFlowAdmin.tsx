import { useEffect, useState, type FormEvent } from 'react'
import { adminApi } from '../../api/admin'
import { defaultContent } from '../../types'
import type {
  DemoContent,
  LoveArrowContent,
  LoveLetterContent,
  LoveQuizContent,
  MemoryStoryContent,
} from '../../types'
import { buildTemplateContent } from './buildTemplateContent'
import { DemoEditorShell, DemoFlowBlock, DemoMetaFields } from './DemoEditorShell'
import { LoveArrowAdminFields } from './LoveArrowAdminFields'
import { LoveLetterAdminFields } from './LoveLetterAdminFields'
import { LoveQuizAdminFields } from './LoveQuizAdminFields'
import { MemoryStoryAdminFields } from './MemoryStoryAdminFields'

const FLOW_SLUGS = ['love-quiz', 'love-letter', 'love-arrow', 'memory-story'] as const

function mergeContent<T extends Record<string, unknown>>(key: Parameters<typeof defaultContent>[0], raw: Record<string, unknown>) {
  return { ...(defaultContent(key) as T), ...raw } as T
}

export function LoveExperienceFlowAdmin() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [recipient, setRecipient] = useState('เธอ')
  const [sender, setSender] = useState('ฉัน')

  const [quizContent, setQuizContent] = useState<LoveQuizContent>(
    defaultContent('love_quiz') as LoveQuizContent,
  )
  const [letterContent, setLetterContent] = useState<LoveLetterContent>(
    defaultContent('love_letter') as LoveLetterContent,
  )
  const [arrowContent, setArrowContent] = useState<LoveArrowContent>(
    defaultContent('love_arrow') as LoveArrowContent,
  )
  const [memoryStoryContent, setMemoryStoryContent] = useState<MemoryStoryContent>(
    defaultContent('memory_story') as MemoryStoryContent,
  )

  useEffect(() => {
    Promise.all(FLOW_SLUGS.map((slug) => adminApi.getDemo(slug)))
      .then((demos) => {
        const bySlug = Object.fromEntries(demos.map((d) => [d.demo_slug, d])) as Record<
          string,
          DemoContent
        >

        const quiz = bySlug['love-quiz']
        if (quiz) {
          setRecipient(quiz.recipient_name)
          setSender(quiz.sender_name)
          setQuizContent(mergeContent('love_quiz', quiz.content || {}))
        }

        const letter = bySlug['love-letter']
        if (letter) setLetterContent(mergeContent('love_letter', letter.content || {}))

        const arrow = bySlug['love-arrow']
        if (arrow) setArrowContent(mergeContent('love_arrow', arrow.content || {}))

        const memory = bySlug['memory-story']
        if (memory) setMemoryStoryContent(mergeContent('memory_story', memory.content || {}))
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'โหลด flow ไม่สำเร็จ')
      })
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const empty = defaultContent('memory_page') as never
      const names = { recipient_name: recipient, sender_name: sender }

      const quizPayload = buildTemplateContent({
        templateKey: 'love_quiz',
        contentText: '{}',
        memoryContent: empty,
        quizContent: { ...quizContent, nextSlug: 'love-letter' },
        storyContent: defaultContent('love_story') as never,
        occasionContent: defaultContent('graduation') as never,
        birthdayContent: defaultContent('birthday') as never,
        memoryStoryContent,
        letterContent,
        arrowContent: { ...arrowContent, nextSlug: 'memory-story' },
      })

      const letterPayload = buildTemplateContent({
        templateKey: 'love_letter',
        contentText: '{}',
        memoryContent: empty,
        quizContent: defaultContent('love_quiz') as never,
        storyContent: defaultContent('love_story') as never,
        occasionContent: defaultContent('graduation') as never,
        birthdayContent: defaultContent('birthday') as never,
        memoryStoryContent: defaultContent('memory_story') as never,
        letterContent: { ...letterContent, nextSlug: 'love-arrow' },
        arrowContent,
      })

      const arrowPayload = buildTemplateContent({
        templateKey: 'love_arrow',
        contentText: '{}',
        memoryContent: empty,
        quizContent: defaultContent('love_quiz') as never,
        storyContent: defaultContent('love_story') as never,
        occasionContent: defaultContent('graduation') as never,
        birthdayContent: defaultContent('birthday') as never,
        memoryStoryContent: defaultContent('memory_story') as never,
        letterContent,
        arrowContent: { ...arrowContent, nextSlug: 'memory-story' },
      })

      const memoryPayload = buildTemplateContent({
        templateKey: 'memory_story',
        contentText: '{}',
        memoryContent: empty,
        quizContent: defaultContent('love_quiz') as never,
        storyContent: defaultContent('love_story') as never,
        occasionContent: defaultContent('graduation') as never,
        birthdayContent: defaultContent('birthday') as never,
        memoryStoryContent,
        letterContent,
        arrowContent,
      })

      await Promise.all([
        adminApi.updateDemo('love-quiz', { ...names, content: quizPayload }),
        adminApi.updateDemo('love-letter', { ...names, content: letterPayload }),
        adminApi.updateDemo('love-arrow', { ...names, content: arrowPayload }),
        adminApi.updateDemo('memory-story', { ...names, content: memoryPayload }),
      ])

      setSaved(true)
      window.setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DemoEditorShell
      subtitle="แก้ 4 หน้าต่อเนื่อง: ควิซ → จดหมาย → ลูกศร → Memory Story · ชื่อผู้รับ/ผู้ส่งใช้ร่วมทุกหน้า · บันทึกครั้งเดียวอัปเดตทั้ง flow"
      loading={loading}
      saving={saving}
      saved={saved}
      error={error}
      onSubmit={onSubmit}
      saveLabel="บันทึกทั้ง Love Experience (4 หน้า)"
    >
      <DemoMetaFields
        title=""
        recipient={recipient}
        sender={sender}
        onTitle={() => {}}
        onRecipient={setRecipient}
        onSender={setSender}
        showTitle={false}
      />

      <DemoFlowBlock step={1} title="ควิซความรัก" path="/demo/love-quiz">
        <LoveQuizAdminFields value={quizContent} onChange={setQuizContent} showFlowNext={false} />
      </DemoFlowBlock>

      <DemoFlowBlock step={2} title="จดหมายรัก" path="/demo/love-letter">
        <LoveLetterAdminFields value={letterContent} onChange={setLetterContent} />
      </DemoFlowBlock>

      <DemoFlowBlock step={3} title="Cupid ยิงลูกศร" path="/demo/love-arrow">
        <LoveArrowAdminFields value={arrowContent} onChange={setArrowContent} />
      </DemoFlowBlock>

      <DemoFlowBlock step={4} title="เรื่องราวความทรงจำ" path="/demo/memory-story">
        <MemoryStoryAdminFields value={memoryStoryContent} onChange={setMemoryStoryContent} />
      </DemoFlowBlock>
    </DemoEditorShell>
  )
}
