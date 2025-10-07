import React, { useState } from 'react'
import DocumentUpload from './components/DocumentUpload'
import SummaryView from './components/SummaryView'
import KeyHighlights from './components/KeyHighlights'
import LawyerDocumentUpload from './components/lawyer/LawyerDocumentUpload'
import LawyerSummaryView from './components/lawyer/LawyerSummaryView'
import Layout from './components/Layout'
import Navbar from './components/Navbar'
// import ThemeToggle from './components/ThemeToggle'
import { usePortal } from './context/PortalContext'
import './index.css'

function App() {
  const [documentText, setDocumentText] = useState('')
  const [summary, setSummary] = useState('')
  const [keySections, setKeySections] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { currentPortal } = usePortal()

  return (
    <Layout>
      <Navbar />
            
      <div className="app-container">
        <div className="header-section">
          <h1 className="main-title">
            {currentPortal === 'lawyer' ? 'Legal Professional Document Analyzer' : 'Legal Document Summarizer'}
          </h1>
          <p className="subtitle">
            {currentPortal === 'lawyer' 
              ? 'Advanced legal document analysis with professional-grade insights and comprehensive reporting'
              : 'Upload Indian court judgments and legal documents to get concise, easy-to-understand summaries while maintaining legal accuracy.'
            }
          </p>
        </div>

        <div className="content-grid">
          {/* Left Column - Document Upload */}
          <div className="upload-column">
            {currentPortal === 'lawyer' ? (
              <LawyerDocumentUpload
                onDocumentProcessed={setDocumentText}
                onSummaryGenerated={setSummary}
                onKeySectionsFound={setKeySections}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            ) : (
              <DocumentUpload
                onDocumentProcessed={setDocumentText}
                onSummaryGenerated={setSummary}
                onKeySectionsFound={setKeySections}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </div>

          {/* Right Column - Results */}
          <div className="results-column">
            {keySections.length > 0 && (
              currentPortal === 'lawyer' ? (
                <KeyHighlights sections={keySections} />
              ) : (
                <KeyHighlights sections={keySections} />
              )
            )}
            
            {summary && (
              currentPortal === 'lawyer' ? (
                <LawyerSummaryView 
                  originalText={documentText}
                  summary={summary}
                  keySections={keySections}
                />
              ) : (
                <SummaryView 
                  originalText={documentText}
                  summary={summary}
                />
              )
            )}

            {/* Empty state */}
            {!summary && keySections.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  {currentPortal === 'lawyer' ? '⚖️' : '📝'}
                </div>
                <h3>
                  {currentPortal === 'lawyer' 
                    ? 'No Legal Analysis Generated Yet' 
                    : 'No Summary Generated Yet'
                  }
                </h3>
                <p>
                  {currentPortal === 'lawyer'
                    ? 'Upload a legal document or paste text to see comprehensive legal analysis and professional insights.'
                    : 'Upload a legal document or paste text to see the summary and key highlights here.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App