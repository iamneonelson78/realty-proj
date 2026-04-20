import { useListings } from '../hooks/useListings'
import { useLeads } from '../hooks/useLeads'
import { ReminderList } from '../components/ReminderList'
import { useCreateReminder } from '../hooks/useReminders'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock } from 'lucide-react'

const MOCK_FOLLOWUPS = [
  { id: 1, name: 'Juan Dela Cruz', listing: 'Condo Unit A — BGC', time: '2:00 PM', done: false },
  { id: 2, name: 'Maria Santos',   listing: '1BR Studio — Makati', time: '3:30 PM', done: false },
  { id: 3, name: 'Pedro Reyes',    listing: 'Townhouse C — Pasig', time: '5:00 PM', done: false },
]

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}

export function DashboardPage() {
  const { data: listings = [] } = useListings()
  const { data: leads = [] } = useLeads()
  const navigate = useNavigate()
  const [reminderOpen, setReminderOpen] = useState(false)
  const create = useCreateReminder()
  const [title, setTitle] = useState('')
  const [remindAt, setRemindAt] = useState('')

  const available = listings.filter((l) => l.status === 'available').length
  const activeLeads = leads.filter((l) => !['closed'].includes(l.status)).length
  const closed = leads.filter((l) => l.status === 'closed').length
  const [followUps, setFollowUps] = useState(MOCK_FOLLOWUPS)

  const markDone = (id) => setFollowUps((prev) => prev.map((f) => f.id === id ? { ...f, done: true } : f))

  const handleAddReminder = async (e) => {
    e.preventDefault()
    if (!title || !remindAt) return
    await create.mutateAsync({ leadId: null, title, remindAt })
    setTitle('')
    setRemindAt('')
    setReminderOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <Button onClick={() => setReminderOpen(true)} variant="secondary" size="sm">
          + Reminder
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Available Listings" value={available} color="text-brand-600 dark:text-brand-400" />
        <StatCard label="Total Listings" value={listings.length} color="text-slate-700 dark:text-slate-200" />
        <StatCard label="Active Leads" value={activeLeads} color="text-blue-600 dark:text-blue-400" />
        <StatCard label="Closed Deals" value={closed} color="text-purple-600 dark:text-purple-400" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">Upcoming Reminders</h2>
            <button onClick={() => setReminderOpen(true)} className="text-sm text-brand-600 dark:text-brand-400 hover:underline">+ Add</button>
          </div>
          <ReminderList compact />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Recent Leads</h2>
          {leads.slice(0, 5).length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-3">No leads yet</p>
              <Button size="sm" onClick={() => navigate('/leads')}>Add First Lead</Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {leads.slice(0, 5).map((lead) => (
                <li key={lead.id}>
                  <button
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="w-full text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-3 py-2 transition-colors"
                  >
                    <span className="text-sm text-slate-700 dark:text-slate-200">{lead.name}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">{lead.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Today's Follow-ups */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-brand-600 dark:text-brand-400" />
          <h2 className="font-semibold text-slate-700 dark:text-slate-200">Today's Follow-ups</h2>
          <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">{followUps.filter((f) => !f.done).length} remaining</span>
        </div>
        {followUps.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No follow-ups for today 🎉</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {followUps.map((f) => (
              <li key={f.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${f.done ? 'opacity-50 bg-slate-50 dark:bg-slate-800/50' : 'bg-slate-50 dark:bg-slate-800'}`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium text-slate-800 dark:text-slate-100 ${f.done ? 'line-through' : ''}`}>{f.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{f.listing}</p>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{f.time}</span>
                {f.done ? (
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                ) : (
                  <button
                    onClick={() => markDone(f.id)}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium whitespace-nowrap border border-brand-200 dark:border-brand-800 rounded-lg px-2 py-1 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                  >
                    Mark as Done
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {reminderOpen && (
        <Modal title="Add Reminder" onClose={() => setReminderOpen(false)}>
          <form onSubmit={handleAddReminder} className="flex flex-col gap-4">
            <Input label="Reminder" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Follow up with Juan" />
            <Input label="Date & Time" type="datetime-local" value={remindAt} onChange={(e) => setRemindAt(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setReminderOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Saving...' : 'Add Reminder'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
