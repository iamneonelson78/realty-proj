import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LeadCard } from './LeadCard'

const columnMeta = {
  new:       { label: 'New',       color: 'bg-blue-50   dark:bg-blue-950/30  border-blue-200   dark:border-blue-800' },
  contacted: { label: 'Contacted', color: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800' },
  viewing:   { label: 'Viewing',   color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800' },
  reserved:  { label: 'Reserved',  color: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' },
  closed:    { label: 'Closed',    color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' },
}

export function KanbanColumn({ status, leads }) {
  const { setNodeRef } = useDroppable({ id: status })
  const meta = columnMeta[status]

  return (
    <div className={`flex flex-col rounded-2xl border ${meta.color} min-w-[220px] w-full`}>
      <div className="px-3 py-2.5 border-b border-inherit">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{meta.label}</span>
        <span className="ml-2 text-xs text-slate-400 dark:text-slate-500 font-normal">{leads.length}</span>
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
