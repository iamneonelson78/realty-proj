import { supabase } from '../lib/supabase'

export async function getUpcomingReminders() {
  const { data, error } = await supabase
    .from('reminders')
    .select('*, leads(name)')
    .eq('done', false)
    .order('remind_at', { ascending: true })
    .limit(20)
  if (error) throw error
  return data
}

export async function createReminder({ leadId, title, remindAt }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('reminders')
    .insert({ lead_id: leadId ?? null, title, remind_at: remindAt, owner_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function completeReminder(id) {
  const { data, error } = await supabase
    .from('reminders')
    .update({ done: true })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
