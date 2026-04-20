import { useReminders, useCompleteReminder, useCreateReminder } from '../hooks/useReminders'
import { Button } from './ui/Button'
import { useState } from 'react'

function formatDate(dt) {
  return new Date(dt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}

export function ReminderList({ leadId, compact }) {
  const { data: reminders = [], isLoading } = useReminders()
  const complete = useCompleteReminder()
  const create = useCreateReminder()
  const [title, setTitle] = useState('')
  const [remindAt, setRemindAt] = useState('')
  const [adding, setAdding] = useState(false)

  const filtered = leadId ? reminders.filter((r) => r.lead_id === leadId) : reminders

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim() || !remindAt) return
    await create.mutateAsync({ leadId: leadId ?? null, title, remindAt })
    setTitle('')
    setRemindAt('')
    setAdding(false)
  }

  if (isLoading) return <p className="text-sm text-slate-400">Loading reminders...</p>

  return (
    <div className="flex flex-col gap-3">
      {filtered.length === 0 && !adding && (
        <p className="text-sm text-slate-400 dark:text-slate-500">No upcoming reminders.</p>
      )}
      {filtered.map((r) => (
        <div key={r.id} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{r.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(r.remind_at)}</p>
            {!leadId && r.leads?.name && (
              <p className="text-xs text-slate-400 dark:text-slate-500">Lead: {r.leads.name}</p>
            )}
          </div>
          <Button size="sm" variant="secondary" onClick={() => complete.mutate(r.id)}>
            ✓ Done
          </Button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleCreate} className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <input
            className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Reminder title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="datetime-local"
            className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={create.isPending}>
              {create.isPending ? 'Saving...' : 'Add'}
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        !compact && (
          <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>+ Add reminder</Button>
        )
      )}
    </div>
  )
}
