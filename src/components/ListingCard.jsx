import { useState } from 'react'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { ListingForm } from './ListingForm'
import { FbPostGenerator } from './FbPostGenerator'
import { useUpdateListing, useDeleteListing } from '../hooks/useListings'

export function ListingCard({ listing }) {
  const [editOpen, setEditOpen] = useState(false)
  const [fbOpen, setFbOpen] = useState(false)
  const update = useUpdateListing()
  const remove = useDeleteListing()

  const handleUpdate = async (values) => {
    await update.mutateAsync({ id: listing.id, updates: values })
    setEditOpen(false)
  }

  const handleDelete = () => {
    if (window.confirm('Delete this listing?')) remove.mutate(listing.id)
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-800">{listing.title}</h3>
            {listing.location && <p className="text-sm text-slate-500">📍 {listing.location}</p>}
          </div>
          <Badge label={listing.status} />
        </div>

        {listing.price && (
          <p className="text-emerald-700 font-semibold">₱{Number(listing.price).toLocaleString()}/mo</p>
        )}

        {listing.description && (
          <p className="text-sm text-slate-600 line-clamp-2">{listing.description}</p>
        )}

        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          <Button size="sm" variant="ghost" onClick={() => setFbOpen(true)}>📢 FB Post</Button>
          <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {editOpen && (
        <Modal title="Edit Listing" onClose={() => setEditOpen(false)}>
          <ListingForm initial={listing} onSubmit={handleUpdate} onCancel={() => setEditOpen(false)} loading={update.isPending} />
        </Modal>
      )}

      {fbOpen && (
        <Modal title="Facebook Post" onClose={() => setFbOpen(false)}>
          <FbPostGenerator listing={listing} />
        </Modal>
      )}
    </>
  )
}
