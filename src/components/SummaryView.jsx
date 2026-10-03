import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FileText, Clock, BarChart3 } from 'lucide-react'
import SocialShare from './SocialShare'
import AudioPlayer from './AudioPlayer'
import SummaryActions from './SummaryActions'
import ResultNotices from './ResultNotices'

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length
const readingMinutes = (text) => Math.ceil(countWords(text) / 200)

const SummaryView = ({ originalText, summary, audioUrl, notices }) => {
  const [activeTab, setActiveTab] = useState('summary')
  const contentRef = useRef(null)

  // Metrics compare against the source text, which isn't available for file uploads.
  const originalWords = countWords(originalText)
  const summaryWords = countWords(summary)
  const showMetrics = originalWords > 0
  const reduction = Math.round(((originalWords - summaryWords) / originalWords) * 100)
  const timeSaved = Math.round(((readingMinutes(originalText) - readingMinutes(summary)) / readingMinutes(originalText)) * 100)

  return (
    <div className="component-card">
      <div className="summary-header">
        <h2 className="summary-title">Document Summary</h2>
        <SummaryActions text={summary} contentRef={contentRef} printLabel="Print Summary" copyLabel="Copy" />
      </div>

      {showMetrics && (
        <div className="tabs no-print">
          <button
            onClick={() => setActiveTab('summary')}
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Summary
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`tab ${activeTab === 'metrics' ? 'active' : ''}`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Metrics
          </button>
        </div>
      )}

      <div>
        {(activeTab === 'summary' || !showMetrics) && (
          <div>
            <ResultNotices notices={notices} />
            <AudioPlayer src={audioUrl} />
            <div className="prose" ref={contentRef}>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
            <div className="no-print">
              <SocialShare />
            </div>
          </div>
        )}

        {activeTab === 'metrics' && showMetrics && (
          <div className="space-y-6 no-print">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reading Efficiency Metrics
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
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Original words:</span>
                <span className="stat-value">{originalWords.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Summary words:</span>
                <span className="stat-value">{summaryWords.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Words removed:</span>
                <span className="stat-value">{(originalWords - summaryWords).toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Reading time:</span>
                <span className="stat-value">
                  {readingMinutes(originalText)}min → {readingMinutes(summary)}min
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SummaryView
