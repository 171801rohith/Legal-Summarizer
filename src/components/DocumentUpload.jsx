// src/components/DocumentUpload.jsx
import React, { useCallback, useState } from 'react'
import { Upload, FileText, Loader, AlertCircle, Scale, Volume2, Languages, ChevronDown } from 'lucide-react'
import { generateSummary } from '../services/summarization'
import { parsePDF, parseDOCX, loadSampleDocument } from '../utils/fileParser'
import { getLegalTemplate } from '../utils/legalTemplates'
import './DocumentUpload.css'

const DocumentUpload = ({
  onDocumentProcessed,
  onSummaryGenerated,
  onKeySectionsFound,
  isLoading,
  setIsLoading
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)')

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

  const handleFile = async (file) => {
    if (!file) return

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Please upload files smaller than 10MB.')
      return
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload PDF, DOCX, or TXT files.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      let text = ''

      if (file.type === 'application/pdf') {
        text = await parsePDF(file)
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await parseDOCX(file)
      } else if (file.type === 'text/plain') {
        text = await file.text()
      }

      if (!text || text.trim().length < 50) {
        throw new Error('Document appears to be empty or too short for summarization.')
      }

      onDocumentProcessed(text)

      // Generate summary and key sections
      const result = await generateSummary(text)
      onSummaryGenerated(result.summary)
      onKeySectionsFound(result.keySections)

    } catch (error) {
      console.error('Error processing document:', error)
      setError(error.message || 'Error processing document. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError('')

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    setError('')
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handlePasteText = async () => {
    const textarea = document.getElementById('text-input')
    const text = textarea.value.trim()

    if (!text) {
      setError('Please paste some text content first.')
      return
    }

    if (text.length < 50) {
      setError('Text appears too short for meaningful summarization.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      onDocumentProcessed(text)
      const result = await generateSummary(text)
      onSummaryGenerated(result.summary)
      onKeySectionsFound(result.keySections)
    } catch (error) {
      setError(error.message || 'Error generating summary.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleDocument = async (type) => {
    const sampleText = loadSampleDocument(type)
    const textarea = document.getElementById('text-input')
    textarea.value = sampleText

    // Auto-generate summary for sample documents
    setIsLoading(true)
    setError('')

    try {
      onDocumentProcessed(sampleText)
      const result = await generateSummary(sampleText)
      onSummaryGenerated(result.summary)
      onKeySectionsFound(result.keySections)
    } catch (error) {
      setError(error.message || 'Error generating summary.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplate = (templateType) => {
    const template = getLegalTemplate(templateType)
    const textarea = document.getElementById('text-input')
    textarea.value = template
  }

  return (
    <div className="component-card">
      {/* Header with Audio Controls */}
      <div className="upload-header">
        <div className="header-left">
          <FileText className="header-icon" />
          <div>
            <h2 className="upload-title">Upload Legal Document</h2>
            <p className="upload-subtitle">Get AI-powered summaries of your legal documents</p>
          </div>
        </div>
        
        {/* Audio and Language Controls */}
        <div className="audio-controls">
          <div className="audio-player">
            {/* Audio Button */}
            <button 
              className="audio-btn"
              title="Listen to summary (Feature coming soon)"
            >
              <Volume2 size={20} />
            </button>
            
            {/* Language Dropdown */}
            <div className="language-dropdown">
              <button 
                className="language-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title="Select language"
              >
                <Languages size={18} />
                <ChevronDown size={14} />
              </button>
              
              {isDropdownOpen && (
                <div className="language-menu">
                  <div className="language-menu-content">
                    <p className="language-menu-title">Select Language</p>
                    {languages.map((language) => (
                      <button
                        key={language}
                        className={`language-option ${selectedLanguage === language ? 'selected' : ''}`}
                        onClick={() => handleLanguageSelect(language)}
                      >
                        {language}
                        {selectedLanguage === language && <span className="checkmark">✓</span>}
                      </button>
                    ))}
                    <div className="language-note">
                      Text-to-speech coming soon
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-state">
          <AlertCircle className="error-icon" />
          <p className="error-text">{error}</p>
        </div>
      )}

      <div className="upload-content">
        {/* Drag and drop area */}
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${error ? 'has-error' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="upload-icon" />
          <div className="upload-text">
            <p className="upload-main-text">Drop your legal document here</p>
            <p className="upload-subtext">Indian court judgments, legal acts (PDF, DOCX, TXT)</p>
          </div>
          <input
            type="file"
            id="file-upload"
            className="file-input"
            accept=".pdf,.docx,.txt"
            onChange={handleChange}
            disabled={isLoading}
          />
          <label
            htmlFor="file-upload"
            className={`file-label ${isLoading ? 'disabled' : ''}`}
          >
            <Upload className="label-icon" />
            Choose File
          </label>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        {/* Text Input Section */}
        <div className="text-input-section">
          <label htmlFor="text-input" className="text-input-label">
            Paste Legal Text Content
          </label>
          <textarea
            id="text-input"
            className="text-input"
            placeholder="Paste Indian court judgment or legal document text here..."
            onChange={() => setError('')}
            rows="6"
          />
          
          {/* Buttons */}
          <div className="button-container">
            <button
              onClick={handlePasteText}
              disabled={isLoading}
              className="action-button summary-button"
            >
              {isLoading ? (
                <>
                  <Loader className="loading-spinner" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <FileText className="button-icon" />
                  Generate Summary
                </>
              )}
            </button>
            
            <button
              onClick={handlePasteText}
              disabled={isLoading}
              className="action-button advise-button"
            >
              <Scale className="button-icon" />
              Generate Advise
            </button>
          </div>
        </div>

        {/* Sample Documents Section */}
        <div className="section-border">
          <p className="section-header">Try with sample document:</p>
          <div className="sample-buttons-grid">
            <button
              onClick={() => handleSampleDocument('short')}
              className="sample-button"
            >
              Short Sample
            </button>
            <button
              onClick={() => handleSampleDocument('medium')}
              className="sample-button"
            >
              Medium Sample
            </button>
            <button
              onClick={() => handleSampleDocument('long')}
              className="sample-button"
            >
              Long Sample
            </button>
          </div>
        </div>

        {/* Templates Section */}
        <div className="section-border">
          <p className="section-header">Quick legal templates:</p>
          <div className="template-buttons-grid">
            <button
              onClick={() => handleTemplate('bailApplication')}
              className="template-button bail-template"
            >
              📝 Bail Application Template
            </button>
            <button
              onClick={() => handleTemplate('divorcePetition')}
              className="template-button divorce-template"
            >
              💔 Divorce Petition Template
            </button>
            <button
              onClick={() => handleTemplate('consumerComplaint')}
              className="template-button consumer-template"
            >
              ⚖️ Consumer Complaint Template
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="loading-state">
            <Loader className="loading-spinner" />
            <div>
              <p className="loading-text">Processing Document</p>
              <p className="loading-subtext">Analyzing legal content and generating summary...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentUpload