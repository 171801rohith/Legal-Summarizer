// src/components/lawyer/LawyerDocumentUpload.jsx
import React, { useCallback, useState } from 'react'
import { Upload, FileText, Loader, AlertCircle, Scale, BookOpen, Users, Volume2, Languages, ChevronDown } from 'lucide-react'
import { generateSummary } from '../../services/summarization'
import { parsePDF, parseDOCX, loadSampleDocument } from '../../utils/fileParser'
import { getLegalTemplate } from '../../utils/legalTemplates'
import './LawyerDocumentUpload.css'

const LawyerDocumentUpload = ({
  onDocumentProcessed,
  onSummaryGenerated,
  onKeySectionsFound,
  isLoading,
  setIsLoading
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [documentType, setDocumentType] = useState('general')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)')
  const [documentText, setDocumentText] = useState('')
  const [fileName, setFileName] = useState('')

  const languages = [
    'English (US)',
    'English (India)', 
    'Hindi',
    'Tamil',
    'Telugu',
    'Malayalam'
  ]

  // Map language for backend
  const languageMap = {
    'English (US)': 'eng',
    'English (India)': 'eng',
    'Hindi': 'hin',
    'Tamil': 'tam',
    'Telugu': 'tel',
    'Malayalam': 'mal'
  }

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
    setIsDropdownOpen(false)
  }

  const handleFile = async (file) => {
    if (!file) return

    if (file.size > 25 * 1024 * 1024) {
      setError('File size too large. Please upload files smaller than 25MB.')
      return
    }

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/msword'
    ]
    
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      let text = ''
      if (file.type === 'application/pdf') {
        text = await parsePDF(file)
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword'
      ) {
        text = await parseDOCX(file)
      } else if (file.type === 'text/plain') {
        text = await file.text()
      }

      if (!text || text.trim().length < 50) {
        throw new Error('Document appears too short for analysis.')
      }

      setDocumentText(text)
      setFileName(file.name)
      onDocumentProcessed(text)

      // Call backend
      const languageCode = languageMap[selectedLanguage] || 'eng'
      const result = await generateSummary(text, languageCode)
      onSummaryGenerated(result.summary)
      onKeySectionsFound(result.keySections || [])
      
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
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError('')
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    setError('')
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0])
  }

  const handlePasteText = async () => {
    const textarea = document.getElementById('lawyer-text-input')
    const text = textarea.value.trim()
    
    if (!text) {
      setError('Please paste legal document content first.')
      return
    }

    if (text.length < 100) {
      setError('Text appears too short for comprehensive legal analysis.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      setDocumentText(text)
      setFileName('Pasted Text')
      onDocumentProcessed(text)

      const languageCode = languageMap[selectedLanguage] || 'eng'
      const result = await generateSummary(text, languageCode)
      onSummaryGenerated(result.summary)
      onKeySectionsFound(result.keySections || [])
    } catch (error) {
      setError(error.message || 'Error generating legal analysis.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleDocument = async (type) => {
    const sampleText = loadSampleDocument(type)
    const textarea = document.getElementById('lawyer-text-input')
    textarea.value = sampleText
    
    setIsLoading(true)
    setError('')
    
    try {
      setDocumentText(sampleText)
      setFileName(`${type} Sample Document`)
      onDocumentProcessed(sampleText)

      const languageCode = languageMap[selectedLanguage] || 'eng'
      const result = await generateSummary(sampleText, languageCode)
      onSummaryGenerated(result.summary)
      onKeySectionsFound(result.keySections || [])
    } catch (error) {
      setError(error.message || 'Error generating analysis.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplate = (templateType) => {
    const template = getLegalTemplate(templateType)
    const textarea = document.getElementById('lawyer-text-input')
    textarea.value = template
    setDocumentText(template)
    setFileName(`${templateType} Template`)
    onDocumentProcessed(template)
  }

  return (
    <div className="professional-component-card">
      {/* Header */}
      <div className="professional-header">
        <Scale className="professional-icon" />
        <div className="header-content">
          <h2 className="professional-title">Legal Professional Document Analysis</h2>
          <p className="professional-subtitle">Advanced AI analysis for legal professionals</p>
        </div>

        {/* Language Dropdown */}
        <div className="audio-controls">
          <div className="audio-player professional">
            <button 
              className="audio-btn professional"
              title="Listen (Coming Soon)"
            >
              <Volume2 size={18} />
            </button>
            <div className="language-dropdown professional">
              <button
                className="language-btn professional"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title="Select language"
              >
                <Languages size={16} />
                <ChevronDown size={12} />
              </button>
              {isDropdownOpen && (
                <div className="language-menu professional">
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="professional-error-state">
          <AlertCircle className="professional-error-icon" />
          <p className="professional-error-text">{error}</p>
        </div>
      )}

      {/* Upload + Text Input */}
      <div className="professional-space-y-6">
        <div className="document-type-section">
          <label className="document-type-label">Document Type</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="document-type-select"
          >
            <option value="general">General</option>
            <option value="judgment">Court Judgment</option>
            <option value="contract">Contract / Agreement</option>
            <option value="statute">Statute / Legislation</option>
            <option value="pleading">Pleading / Application</option>
            <option value="research">Legal Research</option>
          </select>
        </div>

        <div
          className={`professional-upload-area ${dragActive ? 'drag-active' : ''} ${error ? 'has-error' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="professional-upload-icon" />
          <div className="upload-text">
            <p className="upload-main-text">Drop legal document here</p>
            <p className="upload-subtext">PDF, DOC, DOCX, or TXT (Max 25MB)</p>
          </div>
          <input
            type="file"
            id="lawyer-file-upload"
            className="professional-file-input"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleChange}
            disabled={isLoading}
          />
          <label
            htmlFor="lawyer-file-upload"
            className={`professional-file-label ${isLoading ? 'disabled' : ''}`}
          >
            <Upload className="label-icon" />
            Choose Legal Document
          </label>
        </div>

        <div className="professional-divider"><span>or</span></div>

        <div className="professional-text-input-section">
          <label htmlFor="lawyer-text-input" className="professional-text-input-label">
            Paste Legal Document Content
          </label>
          <textarea
            id="lawyer-text-input"
            className="professional-text-input"
            placeholder="Paste complete legal document text here..."
            onChange={() => setError('')}
            rows="8"
          />
          <div className="professional-button-container">
            <button
              onClick={handlePasteText}
              disabled={isLoading}
              className="professional-action-button analyze-button"
            >
              {isLoading ? (
                <>
                  <Loader className="professional-loading-spinner" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <Scale size={16} />
                  Analyze Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="professional-loading-state">
          <Loader className="professional-loading-spinner" />
          <div>
            <p className="professional-loading-text">Processing Legal Document</p>
            <p className="professional-loading-subtext">Performing comprehensive analysis...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LawyerDocumentUpload
