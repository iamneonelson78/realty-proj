import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as messagesService from '../services/messages'

export function useLeadMessages(leadId) {
  return useQuery({
    queryKey: ['leadMessages', leadId],
    queryFn: () => messagesService.getMessagesByLead(leadId),
    enabled: !!leadId,
  })
}

export function useCreateMessage(leadId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => messagesService.createMessage(leadId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leadMessages', leadId] }),
  })
}
