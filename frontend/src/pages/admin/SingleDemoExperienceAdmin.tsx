import { useEffect, useState, type FormEvent } from 'react'

import { adminApi } from '../../api/admin'

import {

  defaultContent,

  type LoveStoryContent,

  type MemoryPageContent,
  type BirthdayContent,
  type CrocodileBlessingContent,
  type TemplateKey,
} from '../../types'
import { buildTemplateContent } from './buildTemplateContent'
import { DemoEditorShell, DemoMetaFields } from './DemoEditorShell'
import { BirthdayAdminFields } from './BirthdayAdminFields'
import { CrocodileBlessingAdminFields } from './CrocodileBlessingAdminFields'
import { LoveStoryAdminFields } from './LoveStoryAdminFields'
import { MemoryPageAdminFields } from './MemoryPageAdminFields'



const SLUG_META: Record<

  string,

  { templateKey: TemplateKey; title: string; subtitle: string }

> = {

  'love-story': {

    templateKey: 'love_story',

    title: 'เรื่องราวความรัก',

    subtitle: 'ล็อกรหัส → แดชบอร์ด → Polaroid → ซองรายเดือน — แก้รูปและข้อความทุกช่วง',

  },

  'memory-page': {

    templateKey: 'memory_page',

    title: 'หน้ารำลึกความทรงจำ',

    subtitle: 'หัวหน้า → ไทม์ไลน์รูป → จดหมายท้าย — แก้รูปและข้อความทีละช่วง',

  },

  birthday: {
    templateKey: 'birthday',
    title: 'วันเกิด',
    subtitle: 'ฝนหัวใจ → นับถอยหลัง → Happy birthday → สมุดรูป 5 หน้า',
  },
  'crocodile-blessing': {
    templateKey: 'crocodile_blessing',
    title: 'การ์ดพุงเสืออวยพร',
    subtitle: 'แตะพุงเสือ → คำอวยพรถึงคนสำคัญ → รูปซ้ายขวา → รูปกลาง → คำตบท้าย',
  },
}



function mergeContent<T extends Record<string, unknown>>(key: TemplateKey, raw: Record<string, unknown>) {

  return { ...(defaultContent(key) as T), ...raw } as T

}



export function SingleDemoExperienceAdmin({ slug }: { slug: string }) {

  const meta = SLUG_META[slug]

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  const [saved, setSaved] = useState(false)

  const [error, setError] = useState('')



  const [title, setTitle] = useState('')

  const [recipient, setRecipient] = useState('เธอ')

  const [sender, setSender] = useState('ฉัน')



  const [storyContent, setStoryContent] = useState<LoveStoryContent>(

    defaultContent('love_story') as LoveStoryContent,

  )

  const [memoryContent, setMemoryContent] = useState<MemoryPageContent>(
    defaultContent('memory_page') as MemoryPageContent,
  )
  const [birthdayContent, setBirthdayContent] = useState<BirthdayContent>(
    defaultContent('birthday') as BirthdayContent,
  )
  const [crocodileBlessingContent, setCrocodileBlessingContent] = useState<CrocodileBlessingContent>(
    defaultContent('crocodile_blessing') as CrocodileBlessingContent,
  )



  useEffect(() => {

    if (!meta) return

    adminApi

      .getDemo(slug)

      .then((d) => {

        setTitle(d.title)

        setRecipient(d.recipient_name)

        setSender(d.sender_name)

        const raw = (d.content || {}) as Record<string, unknown>

        const key = meta.templateKey

        if (key === 'love_story') setStoryContent(mergeContent(key, raw))

        if (key === 'memory_page') setMemoryContent(mergeContent(key, raw))
        if (key === 'birthday') setBirthdayContent(mergeContent(key, raw))
        if (key === 'crocodile_blessing') setCrocodileBlessingContent(mergeContent(key, raw))

      })

      .catch((err) => setError(err instanceof Error ? err.message : 'โหลดไม่สำเร็จ'))

      .finally(() => setLoading(false))

  }, [slug, meta])



  if (!meta) {

    return <p className="admin-loading">ไม่รองรับ demo นี้</p>

  }



  const templateKey = meta.templateKey



  const onSubmit = async (e: FormEvent) => {

    e.preventDefault()

    setSaving(true)

    setError('')

    setSaved(false)

    try {

      const content = buildTemplateContent({

        templateKey,

        contentText: '{}',

        memoryContent,

        quizContent: defaultContent('love_quiz') as never,

        storyContent,

        occasionContent: defaultContent('graduation') as never,
        birthdayContent,
        crocodileBlessingContent,

        memoryStoryContent: defaultContent('memory_story') as never,

        letterContent: defaultContent('love_letter') as never,

        arrowContent: defaultContent('love_arrow') as never,

      })

      await adminApi.updateDemo(slug, {

        title,

        recipient_name: recipient,

        sender_name: sender,

        content,

      })

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

      subtitle={meta.subtitle}

      demoSlug={slug}

      loading={loading}

      saving={saving}

      saved={saved}

      error={error}

      onSubmit={onSubmit}

      saveLabel={`บันทึก ${meta.title}`}

    >

      <DemoMetaFields

        title={title}

        recipient={recipient}

        sender={sender}

        onTitle={setTitle}

        onRecipient={setRecipient}

        onSender={setSender}

      />



      {templateKey === 'love_story' ? (

        <LoveStoryAdminFields value={storyContent} onChange={setStoryContent} />

      ) : null}

      {templateKey === 'memory_page' ? (
        <MemoryPageAdminFields value={memoryContent} onChange={setMemoryContent} />
      ) : null}
      {templateKey === 'birthday' ? (
        <BirthdayAdminFields value={birthdayContent} onChange={setBirthdayContent} />
      ) : null}
      {templateKey === 'crocodile_blessing' ? (
        <CrocodileBlessingAdminFields value={crocodileBlessingContent} onChange={setCrocodileBlessingContent} />
      ) : null}

    </DemoEditorShell>

  )

}

