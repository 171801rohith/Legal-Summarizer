import React, { useState } from 'react'
import DocumentUpload from './components/DocumentUpload'
import SummaryView from './components/SummaryView'
import LawyerSummaryView from './components/lawyer/LawyerSummaryView'
import Layout from './components/Layout'
import Navbar from './components/Navbar'
import { usePortal } from './context/PortalContext'

function App() {
  const [documentText, setDocumentText] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { currentPortal } = usePortal()
  const [resultPortal, setResultPortal] = useState(currentPortal)
  const isLawyer = currentPortal === 'lawyer'

  if (resultPortal !== currentPortal) {
    setResultPortal(currentPortal)
    setResult(null)
    setDocumentText('')
  }
  const ResultView = isLawyer ? LawyerSummaryView : SummaryView

  return (
    <Layout>
      <Navbar />

      <div className="app-container">
        <div className="header-section">
          <h1 className="main-title">
            {isLawyer ? 'Legal Professional Document Analyzer' : 'Legal Document Summarizer'}
          </h1>
          <p className="subtitle">
            {isLawyer
              ? 'Advanced legal document analysis with professional-grade insights and comprehensive reporting'
              : 'Upload Indian court judgments and legal documents to get concise, easy-to-understand summaries while maintaining legal accuracy.'
            }
          </p>
        </div>

        <div className="content-grid">
          {/* Left Column - Document Upload */}
          <div className="upload-column">
            {/* Keyed by portal so switching portals starts from a clean form */}
            <DocumentUpload
              key={currentPortal}
              audience={isLawyer ? 'professional' : 'human'}
              onDocumentProcessed={setDocumentText}
              onResult={setResult}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          {/* Right Column - Results */}
          <div className="results-column">
            {result ? (
              <ResultView
                originalText={documentText}
                summary={result.text}
                audioUrl={result.audioUrl}
                notices={result.notices}
              />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  {isLawyer ? '⚖️' : '📝'}
                </div>
                <h3>
                  {isLawyer ? 'No Legal Analysis Generated Yet' : 'No Summary Generated Yet'}
                </h3>
                <p>
                  {isLawyer
                    ? 'Upload a legal document or paste text to see comprehensive legal analysis and professional insights.'
                    : 'Upload a legal document or paste text to see the summary here.'
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
