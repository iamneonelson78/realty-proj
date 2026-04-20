import { useState } from 'react'
import { useLeads, useCreateLead } from '../hooks/useLeads'
import { KanbanBoard } from '../components/KanbanBoard'
import { LeadForm } from '../components/LeadForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

export function LeadsPage() {
  const { data: leads = [], isLoading } = useLeads()
  const create = useCreateLead()
  const [createOpen, setCreateOpen] = useState(false)

  const handleCreate = async (values) => {
    await create.mutateAsync(values)
    setCreateOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pipeline</h1>
          <p className="text-sm text-slate-500">Drag leads between columns to update status</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Add Lead</Button>
      </div>

      {isLoading ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-400 mb-4">No leads yet. Add your first one!</p>
          <Button onClick={() => setCreateOpen(true)}>Add First Lead</Button>
        </div>
      ) : (
        <KanbanBoard leads={leads} />
      )}

      {createOpen && (
        <Modal title="New Lead" onClose={() => setCreateOpen(false)}>
          <LeadForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} loading={create.isPending} />
        </Modal>
      )}
    </div>
  )
}
