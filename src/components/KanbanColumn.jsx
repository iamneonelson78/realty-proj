import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LeadCard } from './LeadCard'

const columnMeta = {
  new: { label: 'New', color: 'bg-blue-50 border-blue-200' },
  contacted: { label: 'Contacted', color: 'bg-yellow-50 border-yellow-200' },
  viewing: { label: 'Viewing', color: 'bg-purple-50 border-purple-200' },
  reserved: { label: 'Reserved', color: 'bg-orange-50 border-orange-200' },
  closed: { label: 'Closed', color: 'bg-emerald-50 border-emerald-200' },
}

export function KanbanColumn({ status, leads }) {
  const { setNodeRef } = useDroppable({ id: status })
  const meta = columnMeta[status]

  return (
    <div className={`flex flex-col rounded-xl border ${meta.color} min-w-[220px] w-full`}>
      <div className="px-3 py-2 border-b border-inherit">
        <span className="text-sm font-semibold text-slate-700">{meta.label}</span>
        <span className="ml-2 text-xs text-slate-400 font-normal">{leads.length}</span>
      </div>
      <div ref={setNodeRef} className="flex flex-col gap-2 p-2 min-h-[120px]">
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
