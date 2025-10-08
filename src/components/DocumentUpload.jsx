// src/components/DocumentUpload.jsx
import React, { useCallback, useState } from 'react'
import { Upload, FileText, Loader, AlertCircle, Scale, Volume2, Languages, ChevronDown, CheckCircle } from 'lucide-react'
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
  const [documentText, setDocumentText] = useState('')
  const [fileName, setFileName] = useState('') // Track file name
  const [textLoaded, setTextLoaded] = useState(false) // Track if text is loaded

  const languages = [
    'English (US)',
    'English (India)', 
    'Hindi',
    'Tamil',
    'Telugu',
    'Malayalam'
  ]

  // Language mapping for API
  const languageMap = {
    'English (US)': 'eng',
    'English (India)': 'eng',
    'Hindi': 'hin',
    'Tamil': 'tam', 
    'Telugu': 'tel',
    'Malayalam': 'mal'
  };

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

      // Store the text locally but DON'T call backend yet
      setDocumentText(text)
      setFileName(file.name)
      setTextLoaded(true)
      onDocumentProcessed(text) // Pass to parent for display
      setError('') // Clear errors

    } catch (error) {
      console.error('Error processing document:', error)
      setError(error.message || 'Error processing document. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasteText = () => {
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

    // Store the text locally but DON'T call backend yet
    setDocumentText(text)
    setFileName('Pasted Text')
    setTextLoaded(true)
    onDocumentProcessed(text) // Pass to parent for display
    setError('') // Clear any previous errors
  }

  const handleSampleDocument = (type) => {
    const sampleText = loadSampleDocument(type)
    const textarea = document.getElementById('text-input')
    textarea.value = sampleText

    // Store the sample text locally but DON'T call backend yet
    setDocumentText(sampleText)
    setFileName(`${type} Sample Document`)
    setTextLoaded(true)
    onDocumentProcessed(sampleText) // Pass to parent for display
    setError('') // Clear any previous errors
  }

  // THIS IS THE MAIN FUNCTION THAT CALLS THE BACKEND
  // Inside DocumentUpload.jsx

const handleGenerateSummary = async () => {
  if (!documentText) {
    setError('Please upload a document, paste text, or select a sample first.');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    const languageCode = languageMap[selectedLanguage] || 'eng';
    const result = await generateSummary(documentText, languageCode);

    onSummaryGenerated(result.summary);
    onKeySectionsFound(result.keySections || []);
  } catch (error) {
    console.error('Error generating summary:', error);
    setError(error.message || 'Failed to connect to backend. Ensure FastAPI is running on port 8000.');
  } finally {
    setIsLoading(false);
  }
};


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

  const handleTemplate = (templateType) => {
    const template = getLegalTemplate(templateType)
    const textarea = document.getElementById('text-input')
    textarea.value = template
    
    // Store template text locally but DON'T call backend yet
    setDocumentText(template)
    setFileName(`${templateType} Template`)
    setTextLoaded(true)
    onDocumentProcessed(template) // Pass to parent for display
    setError('') // Clear any previous errors
  }

  const clearDocument = () => {
    setDocumentText('')
    setFileName('')
    setTextLoaded(false)
    onDocumentProcessed('')
    onSummaryGenerated('')
    onKeySectionsFound([])
    
    // Clear textarea
    const textarea = document.getElementById('text-input')
    if (textarea) {
      textarea.value = ''
    }
    
    // Clear file input
    const fileInput = document.getElementById('file-upload')
    if (fileInput) {
      fileInput.value = ''
    }
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

      {/* Document Loaded Status */}
      {textLoaded && documentText && (
        <div className="document-status">
          <div className="status-success">
            <CheckCircle className="status-icon" />
            <div className="status-content">
              <p className="status-title">Document Ready for Analysis</p>
              <p className="status-subtitle">
                {fileName} loaded ({documentText.split(/\s+/).length} words)
                <button onClick={clearDocument} className="clear-btn">
                  Clear
                </button>
              </p>
            </div>
          </div>
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
            <p className="upload-subtext">Indian court judgments, legal acts (PDF, DOCX)</p>
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
              onClick={handleGenerateSummary}
              disabled={isLoading || !textLoaded}
              className="action-button summary-button"
            >
              {isLoading ? (
                <>
                  <Loader className="loading-spinner" />
                  Calling Backend API...
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
              className="action-button load-button"
            >
              <CheckCircle className="button-icon" />
              Load Text
            </button>
          </div>
        </div>

        {/* Sample Documents Section */}
        <div className="section-border">
          <p className="section-header">Try with sample document:</p>
          <div className="sample-buttons-grid">
            <button
              onClick={() => handleSampleDocument('short')}
              disabled={isLoading}
              className="sample-button"
            >
              Short Sample
            </button>
            <button
              onClick={() => handleSampleDocument('medium')}
              disabled={isLoading}
              className="sample-button"
            >
              Medium Sample
            </button>
            <button
              onClick={() => handleSampleDocument('long')}
              disabled={isLoading}
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
              disabled={isLoading}
              className="template-button bail-template"
            >
              📝 Bail Application Template
            </button>
            <button
              onClick={() => handleTemplate('divorcePetition')}
              disabled={isLoading}
              className="template-button divorce-template"
            >
              💔 Divorce Petition Template
            </button>
            <button
              onClick={() => handleTemplate('consumerComplaint')}
              disabled={isLoading}
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
              <p className="loading-text">Calling Backend API</p>
              <p className="loading-subtext">Sending document to FastAPI backend for summarization...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentUpload