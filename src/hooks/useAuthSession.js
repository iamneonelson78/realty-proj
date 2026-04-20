import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useAuthSession() {
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      session ? setSession(session) : clearSession()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      session ? setSession(session) : clearSession()
    })

    return () => subscription.unsubscribe()
  }, [setSession, clearSession])
}
