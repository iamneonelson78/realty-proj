import { supabase } from '../lib/supabase'

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*, listings(title, location)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getLead(id) {
  const { data, error } = await supabase
    .from('leads')
    .select('*, listings(id, title, location, price)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createLead(lead) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('leads')
    .insert({ ...lead, owner_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateLead(id, updates) {
  const { data, error } = await supabase
    .from('leads')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateLeadStatus(id, status) {
  return updateLead(id, { status })
}

export async function deleteLead(id) {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}
