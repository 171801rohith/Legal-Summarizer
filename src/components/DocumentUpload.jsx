// src/components/DocumentUpload.jsx
import React, { useCallback, useState } from 'react'
import { Upload, FileText, Loader, AlertCircle } from 'lucide-react'
import { generateSummary } from '../services/summarization'
import { parsePDF, parseDOCX, loadSampleDocument } from '../utils/fileParser'
import { getLegalTemplate } from '../utils/legalTemplates'

const DocumentUpload = ({ 
  onDocumentProcessed, 
  onSummaryGenerated, 
  onKeySectionsFound, 
  isLoading, 
  setIsLoading 
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

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

  // In the return statement of DocumentUpload.jsx, use this structure:
return (
  <div className="component-card">
    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
      <FileText className="mr-2" />
      Upload Legal Document
    </h2>
    
    {error && (
      <div className="error-state">
        <AlertCircle className="error-icon" />
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    )}
    
    <div className="space-y-4">
      {/* Drag and drop area */}
      <div className={`upload-area ${dragActive ? 'drag-active' : ''} ${error ? 'has-error' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}>
        <Upload className="upload-icon" />
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">
            Drop your legal document here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Indian court judgments, legal acts (PDF,DOCX,Image)
          </p>
        </div>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className="btn btn-primary mt-4"
          style={{display: 'inline-flex', opacity: isLoading ? 0.6 : 1}}
        >
          Choose File
        </label>
      </div>

      {/* Text input area */}
      <div className="form-group">
        <label htmlFor="text-input" className="form-label">
          Paste Legal Text Content
        </label>
        <textarea
          id="text-input"
          className="form-input textarea"
          placeholder="Paste Indian court judgment or legal document text here..."
          onChange={() => setError('')}
          rows="6"
        />
        <button
          onClick={handlePasteText}
          disabled={isLoading}
          className="btn btn-primary w-full mt-3"
        >
          {isLoading ? (
            <>
              <Loader className="loading-spinner" />
              Generating Summary...
            </>
          ) : (
            'Generate Summary'
          )}
        </button>
        <button
          onClick={handlePasteText}
          disabled={isLoading}
          className="btn btn-primary w-full mt-3"
        >
          {isLoading ? (
            <>
              <Loader className="loading-spinner" />
              Generating Advise...
            </>
          ) : (
            'Generate Advise'
          )}
        </button>
      </div>

      {/* Sample documents */}
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-3">Try with sample document:</p>
        <div className="sample-buttons">
          <button className="sample-btn" onClick={() => handleSampleDocument('short')}>
            Short Sample
          </button>
          <button className="sample-btn" onClick={() => handleSampleDocument('medium')}>
            Medium Sample
          </button>
          <button className="sample-btn" onClick={() => handleSampleDocument('long')}>
            Long Sample
          </button>
        </div>
      </div>
    </div>
    <div className="border-t pt-4">
  <p className="text-sm text-gray-600 mb-3">Quick legal templates:</p>
  <div className="grid grid-cols-1 gap-2">
    <button
      onClick={() => {
        const template = getLegalTemplate('bailApplication')
        document.getElementById('text-input').value = template
      }}
      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-3 rounded transition-colors text-left"
    >
      📝 Bail Application Template
    </button>
    <button
      onClick={() => {
        const template = getLegalTemplate('divorcePetition')
        document.getElementById('text-input').value = template
      }}
      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-3 rounded transition-colors text-left"
    >
      💔 Divorce Petition Template
    </button>
    <button
      onClick={() => {
        const template = getLegalTemplate('consumerComplaint')
        document.getElementById('text-input').value = template
      }}
      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-3 rounded transition-colors text-left"
    >
      ⚖️ Consumer Complaint Template
    </button>
  </div>
</div>

    {isLoading && (
      <div className="loading-state">
        <Loader className="loading-spinner" />
        <div>
          <p className="text-sm font-medium text-blue-800">Processing Document</p>
          <p className="text-xs text-blue-600">Analyzing legal content and generating summary...</p>
        </div>
      </div>
    )}
  </div>
)
}

export default DocumentUpload