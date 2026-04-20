import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads'
import { useLeadMessages, useCreateMessage } from '../hooks/useLeadMessages'
import { useCreateReminder } from '../hooks/useReminders'
import { ReminderList } from '../components/ReminderList'
import { LeadForm } from '../components/LeadForm'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Phone, Building2, ArrowLeft } from 'lucide-react'

function formatDate(dt) {
  return new Date(dt).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}

function AddReminderInline({ leadId }) {
  const create = useCreateReminder()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [remindAt, setRemindAt] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !remindAt) return
    await create.mutateAsync({ leadId, title, remindAt })
    setTitle('')
    setRemindAt('')
    setOpen(false)
  }

  if (!open) {
    return <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>+ Add Reminder</Button>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      <input
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        placeholder="Reminder title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="datetime-local"
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        value={remindAt}
        onChange={(e) => setRemindAt(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={create.isPending}>Save</Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  )
}

export function LeadDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: lead, isLoading } = useLead(id)
  const { data: messages = [] } = useLeadMessages(id)
  const update = useUpdateLead()
  const remove = useDeleteLead()
  const createMsg = useCreateMessage(id)
  const [editOpen, setEditOpen] = useState(false)
  const [msgBody, setMsgBody] = useState('')

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!lead) return <p className="text-slate-500 dark:text-slate-400 text-sm">Lead not found.</p>

  const handleUpdate = async (values) => {
    await update.mutateAsync({ id, updates: values })
    setEditOpen(false)
  }

  const handleStatusChange = (e) => {
    update.mutate({ id, updates: { status: e.target.value } })
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this lead?')) return
    await remove.mutateAsync(id)
    navigate('/leads')
  }

  const handleSendMsg = async (e) => {
    e.preventDefault()
    if (!msgBody.trim()) return
    await createMsg.mutateAsync(msgBody)
    setMsgBody('')
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <button onClick={() => navigate('/leads')} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm self-start flex items-center gap-1">
        <ArrowLeft size={14} /> Back to Pipeline
      </button>

      {/* Lead Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{lead.name}</h1>
            {lead.contact_number && (
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5 mt-1">
                <Phone size={13} /> {lead.contact_number}
              </p>
            )}
            {lead.listings?.title && (
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5 mt-1">
                <Building2 size={13} /> {lead.listings.title}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge label={lead.source} />
            <Badge label={lead.status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Select value={lead.status} onChange={handleStatusChange} className="text-xs py-1">
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="viewing">Viewing</option>
            <option value="reserved">Reserved</option>
            <option value="closed">Closed</option>
          </Select>
          <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Notes / Messages</h2>
        <div className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto">
          {messages.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-500">No messages yet.</p>}
          {messages.map((msg) => (
            <div key={msg.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className="text-sm text-slate-700 dark:text-slate-200">{msg.body}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDate(msg.created_at)}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMsg} className="flex flex-col gap-2">
          <Textarea
            placeholder="Add a note or message..."
            value={msgBody}
            onChange={(e) => setMsgBody(e.target.value)}
            rows={2}
          />
          <Button type="submit" size="sm" disabled={createMsg.isPending}>
            {createMsg.isPending ? 'Saving...' : 'Add Note'}
          </Button>
        </form>
      </div>

      {/* Reminders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Reminders</h2>
        <ReminderList leadId={id} />
        <div className="mt-3">
          <AddReminderInline leadId={id} />
        </div>
      </div>

      {editOpen && (
        <Modal title="Edit Lead" onClose={() => setEditOpen(false)}>
          <LeadForm initial={lead} onSubmit={handleUpdate} onCancel={() => setEditOpen(false)} loading={update.isPending} />
        </Modal>
      )}
    </div>
  )
}
