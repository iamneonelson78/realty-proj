import { useState } from 'react'
import { Button } from './ui/Button'

const VARIANTS = ['Formal', 'Short', 'Tagalog']

export function FbPostGenerator({ listing }) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('Formal')

  const texts = {
    Formal: `🏠 FOR RENT: ${listing.title}
📍 ${listing.location || 'Location TBA'}
💰 ₱${listing.price ? Number(listing.price).toLocaleString() : 'Price TBA'}/month

${listing.description || 'A well-maintained unit ready for immediate occupancy.'}

We welcome serious inquiries. Please send us a direct message for viewing schedules and further details.`,

    Short: `🏠 ${listing.title} FOR RENT
📍 ${listing.location || 'TBA'} | 💰 ₱${listing.price ? Number(listing.price).toLocaleString() : 'TBA'}/mo
📩 DM to book a viewing!`,

    Tagalog: `🏠 PARA SA RENT: ${listing.title}
📍 ${listing.location || 'TBA'}
💰 ₱${listing.price ? Number(listing.price).toLocaleString() : 'TBA'} bawat buwan

${listing.description || ''}

Interesado? Mag-DM na! Mabilis na tugon. ✅`,
  }

  const text = texts[activeTab]

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Variant Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => { setActiveTab(v); setCopied(false) }}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === v
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <textarea
        readOnly
        value={text}
        rows={8}
        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 resize-none font-mono"
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
