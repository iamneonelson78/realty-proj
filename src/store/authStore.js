import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setSession: (session) => set({ session, user: session?.user ?? null, isLoading: false }),
  clearSession: () => set({ session: null, user: null, isLoading: false }),
}))
