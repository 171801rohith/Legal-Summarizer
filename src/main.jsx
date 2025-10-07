import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { PortalProvider } from './context/PortalContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <PortalProvider>
        <App />
      </PortalProvider>
    </ThemeProvider>
  </React.StrictMode>,
)