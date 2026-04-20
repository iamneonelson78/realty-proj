import { useState } from 'react'
import { Input, Textarea } from './ui/Input'
import { Select } from './ui/Select'
import { Button } from './ui/Button'

const empty = { title: '', description: '', price: '', location: '', status: 'available' }

export function ListingForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...empty, ...initial })
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Title is required')
    setError('')
    await onSubmit({ ...form, price: form.price ? parseFloat(form.price) : null })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Title *" value={form.title} onChange={set('title')} placeholder="e.g. 2BR Condo in BGC" />
      <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Describe the unit..." />
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
