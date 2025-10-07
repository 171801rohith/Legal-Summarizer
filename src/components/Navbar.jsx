// src/components/Navbar.jsx
import React from 'react'
import { Scale, User, Briefcase, Moon, Sun } from 'lucide-react'
import { usePortal } from '../context/PortalContext'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

const Navbar = () => {
  const { currentPortal, switchPortal } = usePortal()
  const { isDark, toggleTheme } = useTheme()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Scale className="navbar-logo" />
          <span className="navbar-title">Praavah</span>
        </div>

        {/* Portal Switcher */}
        <div className="portal-switcher">
          <button
            onClick={() => switchPortal('citizen')}
            className={`portal-btn ${currentPortal === 'citizen' ? 'portal-btn-active' : ''}`}
          >
            <User size={18} />
            <span>Citizen Portal</span>
          </button>
          
          <div className="portal-divider">|</div>
          
          <button
            onClick={() => switchPortal('lawyer')}
            className={`portal-btn ${currentPortal === 'lawyer' ? 'portal-btn-active' : ''}`}
          >
            <Briefcase size={18} />
            <span>Legal Professional Portal</span>
          </button>
        </div>

        {/* Right Side - Theme Toggle and Portal Badge */}
        <div className="navbar-right">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun size={20} className="theme-icon" />
            ) : (
              <Moon size={20} className="theme-icon" />
            )}
            <span className="theme-text">
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          {/* Portal Badge */}
          <div className={`portal-badge ${currentPortal === 'lawyer' ? 'portal-badge-lawyer' : 'portal-badge-citizen'}`}>
            {currentPortal === 'lawyer' ? '⚖️ Legal Mode' : '👥 Citizen Mode'}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar