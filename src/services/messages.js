import { supabase } from '../lib/supabase'

export async function getMessagesByLead(leadId) {
  const { data, error } = await supabase
    .from('lead_messages')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createMessage(leadId, body) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('lead_messages')
    .insert({ lead_id: leadId, body, owner_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}
