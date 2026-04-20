import { useState } from 'react'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Button } from './ui/Button'

const MOCK_LISTINGS = [
  { id: '1', title: 'Condo Unit A — BGC, Taguig' },
  { id: '2', title: 'House & Lot B — Quezon City' },
  { id: '3', title: '1BR Studio — Makati CBD' },
  { id: '4', title: 'Townhouse C — Pasig City' },
]

const empty = { name: '', contact_number: '', listing_id: '' }

export function QuickAddLeadModal({ onClose }) {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Name is required')
    setError('')
    console.log('Quick Add Lead:', form)
    onClose()
  }

  return (
    <Modal title="Quick Add Lead" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Name *"
          value={form.name}
          onChange={set('name')}
          placeholder="e.g. Juan Dela Cruz"
        />
        <Input
          label="Contact Number"
          value={form.contact_number}
          onChange={set('contact_number')}
          placeholder="e.g. 09171234567"
        />
        <Select label="Listing" value={form.listing_id} onChange={set('listing_id')}>
          <option value="">— Select a listing —</option>
          {MOCK_LISTINGS.map((l) => (
            <option key={l.id} value={l.id}>{l.title}</option>
          ))}
        </Select>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Lead</Button>
        </div>
      </form>
    </Modal>
  )
}
