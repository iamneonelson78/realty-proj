import { useState } from 'react'
import { Button } from './ui/Button'

export function FbPostGenerator({ listing }) {
  const [copied, setCopied] = useState(false)

  const text = `🏠 FOR RENT: ${listing.title}
📍 ${listing.location || 'Location TBA'}
💰 ₱${listing.price ? Number(listing.price).toLocaleString() : 'Price TBA'}/month

${listing.description || ''}

Interested? DM me! 📩`

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        readOnly
        value={text}
        rows={8}
        className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-slate-50 resize-none font-mono"
      />
      <div className="flex gap-2">
        <Button onClick={handleCopy} variant={copied ? 'secondary' : 'primary'}>
          {copied ? '✅ Copied!' : '📋 Copy'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => window.open('https://facebook.com', '_blank')}
        >
          📘 Open Facebook
        </Button>
      </div>
    </div>
  )
}
