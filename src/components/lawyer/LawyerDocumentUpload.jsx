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
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.type === 'application/msword') {
        text = await parseDOCX(file)
      } else if (file.type === 'text/plain') {
        text = await file.text()
      }

      if (!text || text.trim().length < 50) {
        throw new Error('Document appears to be empty or too short for analysis.')
      }

      onDocumentProcessed(text)
      
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
      onDocumentProcessed(text)
      const result = await generateSummary(text)
      onSummaryGenerated(result.summary)
      onKeySectionsFound(result.keySections)
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
      onDocumentProcessed(sampleText)
      const result = await generateSummary(sampleText)
      onSummaryGenerated(result.summary)
      onKeySectionsFound(result.keySections)
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
  }

  return (
    <div className="professional-component-card">
      {/* Professional Header with Audio Controls */}
      <div className="professional-header">
        <Scale className="professional-icon" />
        <div className="header-content">
          <h2 className="professional-title">Legal Professional Document Analysis</h2>
          <p className="professional-subtitle">Advanced legal document processing with professional-grade analysis</p>
        </div>
        
        {/* Audio and Language Controls */}
        <div className="audio-controls">
          <div className="audio-player professional">
            <button 
              className="audio-btn professional"
              title="Listen to analysis (Feature coming soon)"
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
                    <div className="language-note">
                      Professional TTS coming soon
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="professional-error-state">
          <AlertCircle className="professional-error-icon" />
          <p className="professional-error-text">{error}</p>
        </div>
      )}

      <div className="professional-space-y-6">
        {/* Document Type Selector */}
        <div className="document-type-section">
          <label className="document-type-label">Document Type</label>
          <select 
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="document-type-select"
          >
            <option value="general">General Legal Document</option>
            <option value="judgment">Court Judgment</option>
            <option value="contract">Contract/Agreement</option>
            <option value="statute">Statute/Legislation</option>
            <option value="pleading">Pleading/Application</option>
            <option value="research">Legal Research</option>
          </select>
        </div>

        {/* Professional Upload Area */}
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
            <p className="upload-subtext">Court judgments, contracts, statutes, pleadings (PDF, DOC, DOCX, TXT) - Up to 25MB</p>
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

        <div className="professional-divider">
          <span>or</span>
        </div>

        {/* Professional Text Input */}
        <div className="professional-text-input-section">
          <label htmlFor="lawyer-text-input" className="professional-text-input-label">
            Paste Legal Document Content
          </label>
          <textarea
            id="lawyer-text-input"
            className="professional-text-input"
            placeholder="Paste complete legal document text for professional analysis..."
            onChange={() => setError('')}
            rows="8"
          />
          
          {/* Professional Buttons */}
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
            
            <button
              onClick={handlePasteText}
              disabled={isLoading}
              className="professional-action-button professional-advise-button"
            >
              <BookOpen size={16} />
              Generate Advise
            </button>
          </div>
        </div>

        {/* Professional Templates Section */}
        <div className="professional-section">
          <p className="section-title">
            <BookOpen className="section-icon" />
            Legal Document Templates
          </p>
          <div className="professional-template-grid">
            <button
              onClick={() => handleTemplate('bailApplication')}
              className="professional-template-button bail-template"
            >
              <span className="template-strong">Bail Application</span>
              <span className="template-subtext">Section 439 CrPC format</span>
            </button>
            <button
              onClick={() => handleTemplate('divorcePetition')}
              className="professional-template-button divorce-template"
            >
              <span className="template-strong">Divorce Petition</span>
              <span className="template-subtext">Hindu Marriage Act, Section 13</span>
            </button>
            <button
              onClick={() => handleTemplate('consumerComplaint')}
              className="professional-template-button consumer-template"
            >
              <span className="template-strong">Consumer Complaint</span>
              <span className="template-subtext">Consumer Protection Act, 2019</span>
            </button>
          </div>
        </div>

        {/* Professional Sample Documents */}
        <div className="professional-section">
          <p className="section-title">
            <Users className="section-icon" />
            Sample Legal Documents
          </p>
          <div className="professional-sample-grid">
            <button
              onClick={() => handleSampleDocument('short')}
              className="professional-sample-button"
            >
              Brief Judgment
            </button>
            <button
              onClick={() => handleSampleDocument('medium')}
              className="professional-sample-button"
            >
              Standard Case
            </button>
            <button
              onClick={() => handleSampleDocument('long')}
              className="professional-sample-button"
            >
              Complex Matter
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="professional-loading-state">
            <Loader className="professional-loading-spinner" />
            <div>
              <p className="professional-loading-text">Processing Legal Document</p>
              <p className="professional-loading-subtext">Performing comprehensive legal analysis...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LawyerDocumentUpload