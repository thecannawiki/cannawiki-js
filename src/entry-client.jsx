import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { OrientationProvider } from './providers/OrientationProvider.tsx'

ReactDOM.hydrate(
    <StrictMode>
    <OrientationProvider>
      <App />
    </OrientationProvider>
  </StrictMode>,
  document.getElementById('app')
)