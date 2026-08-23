import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { asset } from './lib/asset'
import './styles/theme.css'
import './styles/love-experience.css'
import './styles/cream-site.css'
import './styles/birthday-experience.css'
import './styles/crocodile-blessing.css'

document.documentElement.style.setProperty(
  '--lq-meadow-img',
  `url("${asset('love/quiz-bg.png')}")`,
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
