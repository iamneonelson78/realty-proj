import { useState } from 'react'
import { useLeads, useCreateLead } from '../hooks/useLeads'
import { KanbanBoard } from '../components/KanbanBoard'
import { LeadForm } from '../components/LeadForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { QuickAddLeadModal } from '../components/QuickAddLeadModal'

export function LeadsPage() {
  const { data: leads = [], isLoading } = useLeads()
  const create = useCreateLead()
  const [createOpen, setCreateOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  const handleCreate = async (values) => {
    await create.mutateAsync(values)
    setCreateOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Pipeline</h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Drag leads between columns to update status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setQuickAddOpen(true)}>+ Quick Add Lead</Button>
          <Button onClick={() => setCreateOpen(true)}>+ Add Lead</Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-400 dark:text-slate-500 mb-4">No leads yet. Add your first one!</p>
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

      {quickAddOpen && <QuickAddLeadModal onClose={() => setQuickAddOpen(false)} />}
    </div>
  )
}
