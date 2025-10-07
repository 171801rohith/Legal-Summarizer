import React, { createContext, useContext, useState } from 'react'

const PortalContext = createContext()

export const usePortal = () => {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return context
}

export const PortalProvider = ({ children }) => {
  const [currentPortal, setCurrentPortal] = useState('citizen') // 'citizen' or 'lawyer'

  const switchPortal = (portal) => {
    setCurrentPortal(portal)
  }

  return (
    <PortalContext.Provider value={{ currentPortal, switchPortal }}>
      {children}
    </PortalContext.Provider>
  )
}