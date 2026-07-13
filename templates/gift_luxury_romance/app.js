(function () {
  const data = typeof GIFT_DATA !== 'undefined' ? GIFT_DATA : {}

  const screens = {
    gift: document.getElementById('screen-gift'),
    message: document.getElementById('screen-message'),
    gallery: document.getElementById('screen-gallery'),
    finale: document.getElementById('screen-finale'),
  }

  let currentPhoto = 0
  let photos = data.photos || []

  function applyTheme() {
    if (!data.theme) return
    const root = document.documentElement
    if (data.theme.bg) root.style.setProperty('--bg', data.theme.bg)
    if (data.theme.gold) root.style.setProperty('--gold', data.theme.gold)
    if (data.theme.orange) root.style.setProperty('--orange', data.theme.orange)
    if (data.theme.text) root.style.setProperty('--text', data.theme.text)
  }

  function populateContent() {
    document.title = `GiftLove — For ${data.recipientName || 'You'}`
    setText('gift-overline', data.overline || 'A Special Gift')
    setText('gift-recipient', data.recipientName || 'คุณ')
    setText('msg-occasion', data.occasion || '')
    setText('msg-headline', data.headline || '')
    setText('msg-accent', data.headlineAccent || '')
    setText('msg-body', data.message || '')
    setText('msg-sender', data.senderName || '')
    setText('finale-text', `ขอบคุณที่เข้ามาเป็นส่วนหนึ่งในชีวิตของฉัน — ${data.senderName || ''}`)

    if (data.specialDate) {
      const d = new Date(data.specialDate)
      const label = data.specialDateLabel || ''
      setText('msg-date', `${label} — ${d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}`)
    }

    if (data.musicUrl) {
      const audio = document.getElementById('bg-music')
      audio.src = data.musicUrl
      document.getElementById('btn-music').hidden = false
    }

    if (data.videoUrl) {
      const container = document.getElementById('video-container')
      const embedUrl = toEmbedUrl(data.videoUrl)
      if (embedUrl) {
        container.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
        container.hidden = false
      }
    }

    buildGallery()
  }

  function setText(id, text) {
    const el = document.getElementById(id)
    if (el) el.textContent = text
  }

  function toEmbedUrl(url) {
    if (!url) return null
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
    return url
  }

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('active', 'entering'))
    const screen = screens[name]
    if (screen) {
      screen.classList.add('active', 'entering')
    }
  }

  function openGiftBox() {
    const box = document.getElementById('gift-box')
    box.classList.add('opening')
    setTimeout(() => box.classList.add('opened'), 600)
    setTimeout(() => showScreen('message'), 1800)
  }

  function buildGallery() {
    const grid = document.getElementById('gallery-grid')
    grid.innerHTML = ''

    if (photos.length === 0) {
      const placeholder = document.createElement('div')
      placeholder.className = 'gallery-item active'
      placeholder.innerHTML = '<div class="gallery-placeholder">ความทรงจำของเรา</div>'
      grid.appendChild(placeholder)
      document.getElementById('btn-prev-photo').style.display = 'none'
      document.getElementById('btn-next-photo').style.display = 'none'
      document.getElementById('photo-counter').style.display = 'none'
      return
    }

    photos.forEach((src, i) => {
      const item = document.createElement('div')
      item.className = `gallery-item${i === 0 ? ' active' : ''}`
      item.innerHTML = `<img src="${src}" alt="Memory ${i + 1}" loading="lazy">`
      grid.appendChild(item)
    })
    updateCounter()
  }

  function showPhoto(index) {
    const items = document.querySelectorAll('.gallery-item')
    if (!items.length) return
    currentPhoto = ((index % items.length) + items.length) % items.length
    items.forEach((item, i) => item.classList.toggle('active', i === currentPhoto))
    updateCounter()
  }

  function updateCounter() {
    const items = document.querySelectorAll('.gallery-item')
    setText('photo-counter', `${currentPhoto + 1} / ${items.length}`)
  }

  function setupEvents() {
    const box = document.getElementById('gift-box')
    box.addEventListener('click', openGiftBox)
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openGiftBox()
    })

    document.getElementById('btn-to-gallery').addEventListener('click', () => showScreen('gallery'))
    document.getElementById('btn-to-finale').addEventListener('click', () => showScreen('finale'))
    document.getElementById('btn-prev-photo').addEventListener('click', () => showPhoto(currentPhoto - 1))
    document.getElementById('btn-next-photo').addEventListener('click', () => showPhoto(currentPhoto + 1))

    const musicBtn = document.getElementById('btn-music')
    const audio = document.getElementById('bg-music')
    musicBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play()
        musicBtn.classList.add('playing')
        document.getElementById('music-icon').textContent = '♫'
      } else {
        audio.pause()
        musicBtn.classList.remove('playing')
        document.getElementById('music-icon').textContent = '♪'
      }
    })
  }

  applyTheme()
  populateContent()
  setupEvents()
})()
