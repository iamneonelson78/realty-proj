import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { LeadCard } from './LeadCard'
import { useUpdateLeadStatus } from '../hooks/useLeads'
import { useState } from 'react'

const STATUSES = ['new', 'contacted', 'viewing', 'reserved', 'closed']

export function KanbanBoard({ leads }) {
  const [activeId, setActiveId] = useState(null)
  const updateStatus = useUpdateLeadStatus()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s)
    return acc
  }, {})

  const activeLead = leads.find((l) => l.id === activeId)

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return
    const newStatus = over.id
    const lead = leads.find((l) => l.id === active.id)
    if (!lead || !STATUSES.includes(newStatus) || lead.status === newStatus) return
    updateStatus.mutate({ id: active.id, status: newStatus })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <KanbanColumn key={status} status={status} leads={byStatus[status]} />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? <LeadCard lead={activeLead} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
