// src/components/KeyHighlights.jsx
import React from 'react'
import { Star, Scale, Users, BookOpen } from 'lucide-react'

const KeyHighlights = ({ sections }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'verdict':
        return <Scale className="h-5 w-5 text-green-600" />
      case 'parties':
        return <Users className="h-5 w-5 text-blue-600" />
      case 'legal_sections':
        return <BookOpen className="h-5 w-5 text-purple-600" />
      default:
        return <Star className="h-5 w-5 text-yellow-600" />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'verdict':
        return 'Verdict'
      case 'parties':
        return 'Parties Involved'
      case 'legal_sections':
        return 'Legal Sections'
      default:
        return 'Key Point'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <Star className="mr-2 text-yellow-500" />
        Key Highlights
      </h2>
      
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-500 bg-blue-50 rounded-r-lg p-4"
          >
            <div className="flex items-start">
              {getIcon(section.type)}
              <div className="ml-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                  {getTypeLabel(section.type)}
                </span>
                <p className="text-sm text-gray-700">{section.content}</p>
                {section.relevance && (
                  <p className="text-xs text-gray-500 mt-1">
                    Relevance: {section.relevance}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KeyHighlights