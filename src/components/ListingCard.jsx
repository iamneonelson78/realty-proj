import { useState } from 'react'
import { MapPin, Megaphone, Pencil, Trash2 } from 'lucide-react'
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{listing.title}</h3>
            {listing.location && (
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {listing.location}
              </p>
            )}
          </div>
          <Badge label={listing.status} />
        </div>

        {listing.price && (
          <p className="text-brand-600 dark:text-brand-400 font-semibold">₱{Number(listing.price).toLocaleString()}/mo</p>
        )}

        {listing.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{listing.description}</p>
        )}

        {/* Performance stats */}
        <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Leads: <span className="font-semibold text-slate-700 dark:text-slate-300">12</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Closed: <span className="font-semibold text-slate-700 dark:text-slate-300">3</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <Button size="sm" variant="ghost" onClick={() => setFbOpen(true)}>
            <Megaphone size={13} /> FB Post
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil size={13} /> Edit
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            <Trash2 size={13} /> Delete
          </Button>
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
