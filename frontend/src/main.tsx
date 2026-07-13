import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { asset } from './lib/asset'
import './styles/theme.css'
import './styles/cream-site.css'

document.documentElement.style.setProperty(
  '--lq-meadow-img',
  `url("${asset('love/quiz-meadow.png')}")`,
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
