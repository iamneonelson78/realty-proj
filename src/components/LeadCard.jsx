import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import { Badge } from './ui/Badge'

export function LeadCard({ lead }) {
  const navigate = useNavigate()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { status: lead.status },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-medium text-slate-800 text-sm">{lead.name}</p>
        <Badge label={lead.source} />
      </div>
      {lead.contact_number && (
        <p className="text-xs text-slate-500 mb-1">📞 {lead.contact_number}</p>
      )}
      {lead.listings?.title && (
        <p className="text-xs text-slate-500 mb-2 truncate">🏢 {lead.listings.title}</p>
      )}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => navigate(`/leads/${lead.id}`)}
        className="text-xs text-emerald-600 hover:underline font-medium"
      >
        View details →
      </button>
    </div>
  )
}
