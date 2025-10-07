import React from 'react'
import { Volume2, Languages } from 'lucide-react'

const SimpleAudioButton = () => {
  return (
    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-200">
      <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        <Volume2 size={20} />
      </button>
      
      <div className="relative group">
        <button className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
          <Languages size={20} />
        </button>
        
        <div className="absolute right-0 top-full mt-1 w-40 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <div className="p-2">
            <p className="text-xs font-medium mb-1">Languages:</p>
            <div className="text-xs space-y-1">
              <div>English (US)</div>
              <div>English (India)</div>
              <div>Hindi</div>
              <div>Tamil</div>
              <div>Telugu</div>
              <div>Malayalam</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleAudioButton