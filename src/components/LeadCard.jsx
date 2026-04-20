import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import { Phone, Building2, ArrowRight } from 'lucide-react'
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
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 shadow-sm cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{lead.name}</p>
        <Badge label={lead.source} />
      </div>
      {lead.contact_number && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
          <Phone size={11} /> {lead.contact_number}
        </p>
      )}
      {lead.listings?.title && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate flex items-center gap-1">
          <Building2 size={11} /> {lead.listings.title}
        </p>
      )}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => navigate(`/leads/${lead.id}`)}
        className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium flex items-center gap-1"
      >
        View details <ArrowRight size={11} />
      </button>
    </div>
  )
}
