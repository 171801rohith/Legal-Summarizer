import React, { useCallback, useState } from 'react'
import { Upload, FileText, Loader, AlertCircle, Scale, BookOpen, Users } from 'lucide-react'
import { generateSummary } from '../../services/summarization'
import { parsePDF, parseDOCX, loadSampleDocument } from '../../utils/fileParser'
import { getLegalTemplate } from '../../utils/legalTemplates'

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

  const handleFile = async (file) => {
    if (!file) return

    if (file.size > 25 * 1024 * 1024) { // 25MB for lawyers
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
      
      // Generate professional legal summary
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

  // ... (keep the same drag/drop handlers from previous DocumentUpload)

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
    <div className="component-card professional-upload">
      <div className="professional-header">
        <Scale className="professional-icon" />
        <div>
          <h2 className="professional-title">Legal Professional Document Analysis</h2>
          <p className="professional-subtitle">Advanced legal document processing with professional-grade analysis</p>
        </div>
      </div>
      
      {error && (
        <div className="error-state professional-error">
          <AlertCircle className="error-icon" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Document Type Selector */}
        <div className="form-group">
          <label className="form-label">Document Type</label>
          <select 
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="form-input"
          >
            <option value="general">General Legal Document</option>
            <option value="judgment">Court Judgment</option>
            <option value="contract">Contract/Agreement</option>
            <option value="statute">Statute/Legislation</option>
            <option value="pleading">Pleading/Application</option>
            <option value="research">Legal Research</option>
          </select>
        </div>

        {/* Drag & Drop Area */}
        <div className={`upload-area professional-upload-area ${dragActive ? 'drag-active' : ''} ${error ? 'has-error' : ''}`}>
          <Upload className="upload-icon" />
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              Drop legal document here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Court judgments, contracts, statutes, pleadings (PDF, DOC, DOCX, TXT) - Up to 25MB
            </p>
          </div>
          <input
            type="file"
            id="lawyer-file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => {
              setError('')
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0])
              }
            }}
            disabled={isLoading}
          />
          <label
            htmlFor="lawyer-file-upload"
            className="btn btn-primary mt-4"
            style={{display: 'inline-flex', opacity: isLoading ? 0.6 : 1}}
          >
            Choose Legal Document
          </label>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">or</p>
        </div>

        {/* Text Input */}
        <div className="form-group">
          <label htmlFor="lawyer-text-input" className="form-label">
            Paste Legal Document Content
          </label>
          <textarea
            id="lawyer-text-input"
            className="form-input textarea professional-textarea"
            placeholder="Paste complete legal document text for professional analysis..."
            onChange={() => setError('')}
            rows="8"
          />
          <button
            onClick={handlePasteText}
            disabled={isLoading}
            className="btn btn-primary w-full mt-3 professional-analyze-btn"
          >
            {isLoading ? (
              <>
                <Loader className="loading-spinner" />
                Analyzing Legal Document...
              </>
            ) : (
              <>
                <Scale size={16} />
                Analyze Document
              </>
            )}
          </button>
        </div>

        {/* Professional Templates */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <BookOpen size={16} className="mr-2" />
            Legal Document Templates:
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleTemplate('bailApplication')}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 px-3 rounded transition-colors text-left professional-template-btn"
            >
              <strong>Bail Application</strong>
              <br />
              <span className="text-xs opacity-75">Section 439 CrPC format</span>
            </button>
            <button
              onClick={() => handleTemplate('divorcePetition')}
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-3 rounded transition-colors text-left professional-template-btn"
            >
              <strong>Divorce Petition</strong>
              <br />
              <span className="text-xs opacity-75">Hindu Marriage Act, Section 13</span>
            </button>
            <button
              onClick={() => handleTemplate('consumerComplaint')}
              className="text-xs bg-green-100 hover:bg-green-200 text-green-800 py-3 px-3 rounded transition-colors text-left professional-template-btn"
            >
              <strong>Consumer Complaint</strong>
              <br />
              <span className="text-xs opacity-75">Consumer Protection Act, 2019</span>
            </button>
          </div>
        </div>

        {/* Sample Documents */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3 flex items-center">
            <Users size={16} className="mr-2" />
            Sample Legal Documents:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSampleDocument('short')}
              className="sample-btn professional-sample-btn"
            >
              Brief Judgment
            </button>
            <button
              onClick={() => handleSampleDocument('medium')}
              className="sample-btn professional-sample-btn"
            >
              Standard Case
            </button>
            <button
              onClick={() => handleSampleDocument('long')}
              className="sample-btn professional-sample-btn"
            >
              Complex Matter
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="loading-state professional-loading">
          <Loader className="loading-spinner" />
          <div>
            <p className="text-sm font-medium text-blue-800">Processing Legal Document</p>
            <p className="text-xs text-blue-600">Performing comprehensive legal analysis...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LawyerDocumentUpload