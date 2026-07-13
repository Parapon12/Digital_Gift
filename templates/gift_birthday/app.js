(function () {
  const data = typeof GIFT_DATA !== 'undefined' ? GIFT_DATA : {}
  let currentPhoto = 0
  const photos = data.photos || []

  const screens = {
    gift: document.getElementById('screen-gift'),
    message: document.getElementById('screen-message'),
    gallery: document.getElementById('screen-gallery'),
    finale: document.getElementById('screen-finale'),
  }

  function applyTheme() {
    if (!data.theme) return
    const r = document.documentElement
    Object.entries(data.theme).forEach(([k, v]) => {
      if (k === 'accent') return
      r.style.setProperty(`--${k === 'bg' ? 'bg' : k}`, v)
    })
  }

  function setText(id, text) {
    const el = document.getElementById(id)
    if (el) el.textContent = text
  }

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('active', 'entering'))
    const s = screens[name]
    if (s) s.classList.add('active', 'entering')
  }

  function populate() {
    document.title = `Happy Birthday — ${data.recipientName || 'You'}`
    setText('gift-overline', data.overline || 'Birthday Surprise')
    setText('gift-recipient', data.recipientName || 'คุณ')
    setText('msg-occasion', data.occasion || 'Happy Birthday')
    setText('msg-headline', data.headline || '')
    setText('msg-accent', data.headlineAccent || '')
    setText('msg-body', data.message || '')
    setText('msg-sender', data.senderName || '')
    setText('finale-text', `ขอให้ปีนี้เป็นปีที่ดีที่สุด — ${data.senderName || ''}`)

    if (data.age) {
      const badge = document.getElementById('age-badge')
      badge.textContent = data.age
      badge.hidden = false
    }

    if (data.musicUrl) {
      document.getElementById('bg-music').src = data.musicUrl
      document.getElementById('btn-music').hidden = false
    }

    if (data.videoUrl) {
      const m = data.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
      if (m) {
        document.getElementById('video-container').innerHTML =
          `<iframe src="https://www.youtube.com/embed/${m[1]}" allowfullscreen></iframe>`
        document.getElementById('video-container').hidden = false
      }
    }

    buildGallery()
  }

  function buildGallery() {
    const grid = document.getElementById('gallery-grid')
    grid.innerHTML = ''
    if (!photos.length) {
      grid.innerHTML = '<div class="gallery-item active"><div class="gallery-placeholder">🎂 Happy Birthday!</div></div>'
      document.getElementById('btn-prev-photo').style.display = 'none'
      document.getElementById('btn-next-photo').style.display = 'none'
      return
    }
    photos.forEach((src, i) => {
      const item = document.createElement('div')
      item.className = `gallery-item${i === 0 ? ' active' : ''}`
      item.innerHTML = `<img src="${src}" alt="Photo ${i + 1}">`
      grid.appendChild(item)
    })
    updateCounter()
  }

  function showPhoto(i) {
    const items = document.querySelectorAll('.gallery-item')
    if (!items.length) return
    currentPhoto = ((i % items.length) + items.length) % items.length
    items.forEach((el, idx) => el.classList.toggle('active', idx === currentPhoto))
    updateCounter()
  }

  function updateCounter() {
    const n = document.querySelectorAll('.gallery-item').length
    setText('photo-counter', `${currentPhoto + 1} / ${n}`)
  }

  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const colors = ['#ff6b9d', '#ffc93c', '#85c1ff', '#ff85b3', '#fff3d6']
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 80 + 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
    }))
    let frame = 0
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.forEach((p) => {
        p.y += (Math.cos(frame + p.d) + 2 + p.r / 2) * 0.8
        p.x += Math.sin(frame) * 0.5
        ctx.beginPath()
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.r, p.r * 0.6)
      })
      frame++
      if (frame < 200) requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    draw()
  }

  function openGift() {
    const scene = document.getElementById('cake-scene')
    scene.classList.add('blown')
    launchConfetti()
    setTimeout(() => showScreen('message'), 1500)
  }

  document.getElementById('cake-scene').addEventListener('click', openGift)
  document.getElementById('cake-scene').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openGift()
  })
  document.getElementById('btn-to-gallery').addEventListener('click', () => showScreen('gallery'))
  document.getElementById('btn-to-finale').addEventListener('click', () => { showScreen('finale'); launchConfetti() })
  document.getElementById('btn-prev-photo').addEventListener('click', () => showPhoto(currentPhoto - 1))
  document.getElementById('btn-next-photo').addEventListener('click', () => showPhoto(currentPhoto + 1))

  const audio = document.getElementById('bg-music')
  document.getElementById('btn-music').addEventListener('click', () => {
    if (audio.paused) { audio.play(); document.getElementById('music-icon').textContent = '♫' }
    else { audio.pause(); document.getElementById('music-icon').textContent = '♪' }
  })

  applyTheme()
  populate()
})()
