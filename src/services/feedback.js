import { supabase } from '../lib/supabase'

export async function submitFeedback({ category, body, userId }) {
  const { error } = await supabase.from('feedback').insert({
    category,
    body: body.trim(),
    user_id: userId ?? null,
  })
  if (error) throw error
}
