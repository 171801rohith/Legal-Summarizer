import React, { useState } from 'react'
import { Volume2, Languages, ChevronDown } from 'lucide-react'

const SimpleAudioPlayer = ({ size = 'default' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)')
  
  const buttonClass = size === 'small' ? 'p-2' : 'p-2'
  const iconSize = size === 'small' ? 16 : 18

  const languages = [
    'English (US)',
    'English (India)', 
    'Hindi',
    'Tamil',
    'Telugu',
    'Malayalam'
  ]

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
    setIsDropdownOpen(false)
  }

  return (
    <div className="audio-player">
      {/* Audio Play Button */}
      <button 
        className={`audio-btn ${buttonClass}`}
        title="Listen to summary (Feature coming soon)"
      >
        <Volume2 size={iconSize} />
      </button>
      
      {/* Language Dropdown */}
      <div className="language-dropdown">
        <button 
          className={`language-btn ${buttonClass} flex items-center gap-1`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="Select language"
        >
          <Languages size={iconSize} />
          <ChevronDown size={14} />
        </button>
        
        {isDropdownOpen && (
          <div className="language-menu">
            <div className="p-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Language
              </p>
              {languages.map((language) => (
                <button
                  key={language}
                  className={`language-option w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedLanguage === language 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleLanguageSelect(language)}
                >
                  {language}
                  {selectedLanguage === language && (
                    <span className="float-right">✓</span>
                  )}
                </button>
              ))}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                Text-to-speech coming soon
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleAudioPlayer