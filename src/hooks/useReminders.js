import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as remindersService from '../services/reminders'

export function useReminders() {
  return useQuery({ queryKey: ['reminders'], queryFn: remindersService.getUpcomingReminders })
}

export function useCreateReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: remindersService.createReminder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  })
}

export function useCompleteReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: remindersService.completeReminder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  })
}
