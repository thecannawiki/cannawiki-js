import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { OrientationProvider } from './providers/OrientationProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrientationProvider>
      <App />
    </OrientationProvider>
  </StrictMode>,
)
