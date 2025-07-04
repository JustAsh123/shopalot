import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { AuthProvider } from './context/useAuth'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider >
    <App />
    </AuthProvider>
  </StrictMode>,
)
