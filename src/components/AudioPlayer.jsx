// src/components/AudioPlayer.jsx
import React from 'react'
import { Volume2 } from 'lucide-react'

const AudioPlayer = ({ src }) => {
  if (!src) return null

  return (
    <div className="audio-player no-print">
      <Volume2 size={18} className="audio-player-icon" />
      <audio key={src} controls preload="none" src={src} className="audio-player-control">
        Your browser does not support audio playback.
      </audio>
    </div>
  )
}

export default AudioPlayer
