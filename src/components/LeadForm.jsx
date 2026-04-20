import { useState } from 'react'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Button } from './ui/Button'
import { useListings } from '../hooks/useListings'

const empty = { name: '', contact_number: '', source: 'manual', status: 'new', listing_id: '' }

export function LeadForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...empty, ...initial, listing_id: initial.listing_id ?? '' })
  const [error, setError] = useState('')
  const { data: listings = [] } = useListings()

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Name is required')
    setError('')
    await onSubmit({ ...form, listing_id: form.listing_id || null })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Name *" value={form.name} onChange={set('name')} placeholder="e.g. Juan dela Cruz" />
      <Input label="Contact Number" value={form.contact_number} onChange={set('contact_number')} placeholder="09XX XXX XXXX" />
      <Select label="Source" value={form.source} onChange={set('source')}>
        <option value="facebook">Facebook</option>
        <option value="sms">SMS</option>
        <option value="manual">Manual</option>
      </Select>
      <Select label="Status" value={form.status} onChange={set('status')}>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="viewing">Viewing</option>
        <option value="reserved">Reserved</option>
        <option value="closed">Closed</option>
      </Select>
      <Select label="Linked Listing" value={form.listing_id} onChange={set('listing_id')}>
        <option value="">— No listing —</option>
        {listings.map((l) => (
          <option key={l.id} value={l.id}>{l.title}</option>
        ))}
      </Select>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Lead'}</Button>
      </div>
    </form>
  )
}
