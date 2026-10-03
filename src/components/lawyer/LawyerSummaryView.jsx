import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FileText, Clock, BarChart3, Scale } from 'lucide-react'
import SocialShare from '../SocialShare'
import AudioPlayer from '../AudioPlayer'
import SummaryActions from '../SummaryActions'
import ResultNotices from '../ResultNotices'

const LEGAL_TERMS = ['section', 'article', 'act', 'rule', 'regulation', 'statute', 'precedent', 'jurisdiction']

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length
const readingMinutes = (text) => Math.ceil(countWords(text) / 300) // Lawyers read faster

const LawyerSummaryView = ({ originalText, summary, audioUrl, notices }) => {
  const [activeTab, setActiveTab] = useState('analysis')
  const contentRef = useRef(null)

  // Metrics compare against the source text, which isn't available for file uploads.
  const originalWords = countWords(originalText)
  const summaryWords = countWords(summary)
  const showMetrics = originalWords > 0
  const reduction = Math.round(((originalWords - summaryWords) / originalWords) * 100)
  const timeSaved = Math.round(((readingMinutes(originalText) - readingMinutes(summary)) / readingMinutes(originalText)) * 100)
  const termCount = LEGAL_TERMS.filter((term) => originalText.toLowerCase().includes(term)).length
  const complexity = termCount > 10 ? 'High' : termCount > 5 ? 'Medium' : 'Low'

  return (
    <div className="component-card professional-summary">
      <div className="summary-header">
        <div className="flex items-center gap-3">
          <Scale className="professional-summary-icon" />
          <div>
            <h2 className="summary-title">Legal Analysis Report</h2>
            <p className="professional-subtitle">Comprehensive document analysis for legal professionals</p>
          </div>
        </div>
        <SummaryActions
          text={summary}
          contentRef={contentRef}
          variant="professional"
          printLabel="Print Report"
          copyLabel="Copy Analysis"
        />
      </div>

      {showMetrics && (
        <div className="tabs no-print">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
          >
            <Scale className="w-4 h-4 inline mr-2" />
            Legal Analysis
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`tab ${activeTab === 'metrics' ? 'active' : ''}`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Professional Metrics
          </button>
        </div>
      )}

      <div>
        {(activeTab === 'analysis' || !showMetrics) && (
          <div>
            <div className="professional-analysis-content">
              <div className="analysis-header">
                <h3 className="analysis-title">Legal Document Analysis</h3>
                {showMetrics && <div className="complexity-badge">Complexity: {complexity}</div>}
              </div>
              <ResultNotices notices={notices} />
              <AudioPlayer src={audioUrl} />
              <div className="prose" ref={contentRef}>
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </div>
            <div className="no-print">
              <SocialShare />
            </div>
          </div>
        )}

        {activeTab === 'metrics' && showMetrics && (
          <div className="space-y-6 no-print">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Professional Metrics
            </h3>

            <div className="metrics-grid">
              <div className="metric-card">
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="metric-value">{reduction}%</p>
                <p className="metric-label">Content Reduction</p>
              </div>

              <div className="metric-card">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="metric-value">{timeSaved}%</p>
                <p className="metric-label">Time Saved</p>
              </div>

              <div className="metric-card">
                <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="metric-value">{readingMinutes(originalText)}→{readingMinutes(summary)}min</p>
                <p className="metric-label">Reading Time</p>
              </div>

              <div className="metric-card">
                <Scale className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <p className="metric-value">{complexity}</p>
                <p className="metric-label">Legal Complexity</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Original Document:</span>
                <span className="stat-value">{originalWords.toLocaleString()} words</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Analysis:</span>
                <span className="stat-value">{summaryWords.toLocaleString()} words</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Words Removed:</span>
                <span className="stat-value">{(originalWords - summaryWords).toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Retention Rate:</span>
                <span className="stat-value">{Math.round((summaryWords / originalWords) * 100)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LawyerSummaryView
