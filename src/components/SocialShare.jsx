// src/components/SocialShare.jsx
import React from 'react'
import { Twitter, Linkedin, Link2, Facebook } from 'lucide-react'

const SocialShare = () => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = 'Pravaah: AI summaries and guidance for Indian legal documents'

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  }

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy link: ', err)
    }
  }

  return (
    <div className="social-share mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Share Pravaah:</p>
      <div className="flex gap-2">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter size={16} />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={16} />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook size={16} />
        </a>
        <button
          onClick={copyShareLink}
          className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          aria-label="Copy share link"
        >
          <Link2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default SocialShare