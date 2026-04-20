import { supabase } from '../lib/supabase'

export async function getListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getListing(id) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createListing(listing) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('listings')
    .insert({ ...listing, owner_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateListing(id, updates) {
  const { data, error } = await supabase
    .from('listings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteListing(id) {
  const { error } = await supabase.from('listings').delete().eq('id', id)
  if (error) throw error
}
