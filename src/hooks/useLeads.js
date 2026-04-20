import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as leadsService from '../services/leads'

export function useLeads() {
  return useQuery({ queryKey: ['leads'], queryFn: leadsService.getLeads })
}

export function useLead(id) {
  return useQuery({ queryKey: ['lead', id], queryFn: () => leadsService.getLead(id), enabled: !!id })
}

export function useCreateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: leadsService.createLead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useUpdateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => leadsService.updateLead(id, updates),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['lead', id] })
    },
  })
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => leadsService.updateLeadStatus(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['leads'] })
      const previous = qc.getQueryData(['leads'])
      qc.setQueryData(['leads'], (old) =>
        old?.map((l) => (l.id === id ? { ...l, status } : l))
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(['leads'], ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useDeleteLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: leadsService.deleteLead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}
