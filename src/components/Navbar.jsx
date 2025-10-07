import React from 'react'
import { Scale, User, Briefcase } from 'lucide-react'
import { usePortal } from '../context/PortalContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const { currentPortal, switchPortal } = usePortal()
  const { isDark } = useTheme()

  return (
    <nav className={`navbar ${isDark ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Scale className="navbar-logo" />
          <span className="navbar-title">Pravah</span>
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

        {/* Portal Badge */}
        <div className={`portal-badge ${currentPortal === 'lawyer' ? 'portal-badge-lawyer' : 'portal-badge-citizen'}`}>
          {currentPortal === 'lawyer' ? '⚖️ Legal Mode' : '👥 Citizen Mode'}
        </div>
      </div>
    </nav>
  )
}

export default Navbar