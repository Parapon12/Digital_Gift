(function () {
  const data = typeof GIFT_DATA !== 'undefined' ? GIFT_DATA : {}
  let currentPhoto = 0
  const photos = data.photos || []
  const screens = { gift: document.getElementById('screen-gift'), message: document.getElementById('screen-message'), gallery: document.getElementById('screen-gallery'), finale: document.getElementById('screen-finale') }

  function applyTheme() {
    if (!data.theme) return
    const r = document.documentElement
    if (data.theme.bg) r.style.setProperty('--bg', data.theme.bg)
    if (data.theme.gold) r.style.setProperty('--gold', data.theme.gold)
    if (data.theme.orange) r.style.setProperty('--orange', data.theme.orange)
    if (data.theme.text) r.style.setProperty('--text', data.theme.text)
  }
  function setText(id, t) { const el = document.getElementById(id); if (el) el.textContent = t }
  function showScreen(n) { Object.values(screens).forEach(s => s.classList.remove('active','entering')); screens[n]?.classList.add('active','entering') }

  function populate() {
    document.title = `Graduate — ${data.recipientName || 'You'}`
    setText('gift-overline', data.overline || 'Graduation Day')
    setText('gift-recipient', data.recipientName || 'บัณฑิต')
    setText('msg-occasion', data.occasion || '')
    setText('msg-headline', data.headline || '')
    setText('msg-accent', data.headlineAccent || '')
    setText('msg-body', data.message || '')
    setText('msg-sender', data.senderName || '')
    setText('finale-text', `อนาคตเป็นของคุณ — ${data.senderName || ''}`)
    if (data.degree) { const b = document.getElementById('degree-badge'); b.textContent = data.degree; b.style.display = 'inline-block' }
    if (data.specialDate) {
      const d = new Date(data.specialDate)
      setText('msg-date', `${data.specialDateLabel || ''} — ${d.toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' })}`)
    }
    if (data.musicUrl) { document.getElementById('bg-music').src = data.musicUrl; document.getElementById('btn-music').hidden = false }
    if (data.videoUrl) {
      const m = data.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
      if (m) { document.getElementById('video-container').innerHTML = `<iframe src="https://www.youtube.com/embed/${m[1]}" allowfullscreen></iframe>`; document.getElementById('video-container').hidden = false }
    }
    buildGallery()
  }

  function buildGallery() {
    const grid = document.getElementById('gallery-grid')
    grid.innerHTML = ''
    if (!photos.length) {
      grid.innerHTML = '<div class="gallery-item active"><div class="gallery-placeholder">🎓 Congratulations!</div></div>'
      document.getElementById('btn-prev-photo').style.display = 'none'
      document.getElementById('btn-next-photo').style.display = 'none'
      return
    }
    photos.forEach((src, i) => { const item = document.createElement('div'); item.className = `gallery-item${i===0?' active':''}`; item.innerHTML = `<img src="${src}" alt="Photo ${i+1}">`; grid.appendChild(item) })
    updateCounter()
  }
  function showPhoto(i) { const items = document.querySelectorAll('.gallery-item'); if (!items.length) return; currentPhoto = ((i%items.length)+items.length)%items.length; items.forEach((el,idx) => el.classList.toggle('active', idx===currentPhoto)); updateCounter() }
  function updateCounter() { setText('photo-counter', `${currentPhoto+1} / ${document.querySelectorAll('.gallery-item').length}`) }

  function openGift() {
    document.getElementById('grad-cap').classList.add('tossed')
    document.querySelector('.stars').classList.add('burst')
    setTimeout(() => showScreen('message'), 1600)
  }

  document.getElementById('cap-scene').addEventListener('click', openGift)
  document.getElementById('cap-scene').addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') openGift() })
  document.getElementById('btn-to-gallery').addEventListener('click', () => showScreen('gallery'))
  document.getElementById('btn-to-finale').addEventListener('click', () => showScreen('finale'))
  document.getElementById('btn-prev-photo').addEventListener('click', () => showPhoto(currentPhoto-1))
  document.getElementById('btn-next-photo').addEventListener('click', () => showPhoto(currentPhoto+1))
  const audio = document.getElementById('bg-music')
  document.getElementById('btn-music').addEventListener('click', () => { if (audio.paused) { audio.play(); document.getElementById('music-icon').textContent='♫' } else { audio.pause(); document.getElementById('music-icon').textContent='♪' } })

  applyTheme(); populate()
})()
