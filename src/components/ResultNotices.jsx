// src/components/ResultNotices.jsx
import React from 'react'
import { Info } from 'lucide-react'

const ResultNotices = ({ notices }) => {
  if (!notices?.length) return null

  return (
    <div className="result-notices no-print" role="status">
      {notices.map((notice) => (
        <p key={notice} className="result-notice">
          <Info size={16} className="result-notice-icon" />
          {notice}
        </p>
      ))}
    </div>
  )
}

export default ResultNotices
