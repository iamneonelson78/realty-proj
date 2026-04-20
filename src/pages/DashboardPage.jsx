import { useListings } from '../hooks/useListings'
import { useLeads } from '../hooks/useLeads'
import { ReminderList } from '../components/ReminderList'
import { useCreateReminder } from '../hooks/useReminders'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useNavigate } from 'react-router-dom'

function StatCard({ label, value, color }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-sm`}>
      <p className="text-sm text-slate-500">{label}</p>
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
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <Button onClick={() => setReminderOpen(true)} variant="secondary" size="sm">
          + Reminder
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Available Listings" value={available} color="text-emerald-600" />
        <StatCard label="Total Listings" value={listings.length} color="text-slate-700" />
        <StatCard label="Active Leads" value={activeLeads} color="text-blue-600" />
        <StatCard label="Closed Deals" value={closed} color="text-purple-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-700">Upcoming Reminders</h2>
            <button onClick={() => setReminderOpen(true)} className="text-sm text-emerald-600 hover:underline">+ Add</button>
          </div>
          <ReminderList compact />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h2 className="font-semibold text-slate-700 mb-3">Recent Leads</h2>
          {leads.slice(0, 5).length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-400 text-sm mb-3">No leads yet</p>
              <Button size="sm" onClick={() => navigate('/leads')}>Add First Lead</Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {leads.slice(0, 5).map((lead) => (
                <li key={lead.id}>
                  <button
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="w-full text-left flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors"
                  >
                    <span className="text-sm text-slate-700">{lead.name}</span>
                    <span className="text-xs text-slate-400 capitalize">{lead.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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
