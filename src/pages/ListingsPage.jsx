import { useState } from 'react'
import { useListings, useCreateListing } from '../hooks/useListings'
import { ListingCard } from '../components/ListingCard'
import { ListingForm } from '../components/ListingForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

export function ListingsPage() {
  const { data: listings = [], isLoading } = useListings()
  const create = useCreateListing()
  const [createOpen, setCreateOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? listings : listings.filter((l) => l.status === filter)

  const handleCreate = async (values) => {
    await create.mutateAsync(values)
    setCreateOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Listings</h1>
        <Button onClick={() => setCreateOpen(true)}>+ Add Listing</Button>
      </div>

      <div className="flex gap-2">
        {['all', 'available', 'occupied'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg capitalize font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-slate-400 text-sm">Loading...</p>}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-400 mb-4">No listings found</p>
          <Button onClick={() => setCreateOpen(true)}>Add Your First Listing</Button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {createOpen && (
        <Modal title="New Listing" onClose={() => setCreateOpen(false)}>
          <ListingForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} loading={create.isPending} />
        </Modal>
      )}
    </div>
  )
}
