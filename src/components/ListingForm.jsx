import { useState } from 'react'
import { Input, Textarea } from './ui/Input'
import { Select } from './ui/Select'
import { Button } from './ui/Button'
import { Sparkles } from 'lucide-react'

const MOCK_DESCRIPTIONS = [
  'Beautiful and fully furnished unit with stunning city views. Features modern kitchen, spacious living area, 24/7 security, and resort-style amenities including pool and gym. Perfect for young professionals and small families.',
  'Cozy and well-maintained property in a prime location. Close to major malls, schools, and business districts. Includes parking slot and storage room. Move-in ready with complete furnishings.',
  'Bright and airy unit on a high floor with breathtaking views. Premium finishes throughout, smart home features, and a dedicated concierge service. Ideal for executives and expats.',
]

const empty = { title: '', description: '', price: '', location: '', status: 'available' }

export function ListingForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...empty, ...initial })
  const [error, setError] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleGenerate = () => {
    setAiLoading(true)
    setTimeout(() => {
      const mock = MOCK_DESCRIPTIONS[Math.floor(Math.random() * MOCK_DESCRIPTIONS.length)]
      setForm((f) => ({ ...f, description: mock }))
      setAiLoading(false)
    }, 600)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Title is required')
    setError('')
    await onSubmit({ ...form, price: form.price ? parseFloat(form.price) : null })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Title *" value={form.title} onChange={set('title')} placeholder="e.g. 2BR Condo in BGC" />
      <div className="flex flex-col gap-1">
        <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Describe the unit..." />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={aiLoading}
          className="self-end flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium px-2 py-1 rounded-lg border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors disabled:opacity-60"
        >
          {aiLoading ? (
            <>
              <span className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={12} />
              Generate with AI
            </>
          )}
        </button>
      </div>
      <Input label="Location" value={form.location} onChange={set('location')} placeholder="e.g. Taguig City" />
      <Input label="Price (₱/month)" type="number" value={form.price} onChange={set('price')} placeholder="15000" />
      <Select label="Status" value={form.status} onChange={set('status')}>
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
      </Select>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Listing'}</Button>
      </div>
    </form>
  )
}
