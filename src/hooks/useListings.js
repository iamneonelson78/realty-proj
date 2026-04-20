import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as listingsService from '../services/listings'

export function useListings() {
  return useQuery({ queryKey: ['listings'], queryFn: listingsService.getListings })
}

export function useListing(id) {
  return useQuery({ queryKey: ['listing', id], queryFn: () => listingsService.getListing(id), enabled: !!id })
}

export function useCreateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: listingsService.createListing,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listings'] }),
  })
}

export function useUpdateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => listingsService.updateListing(id, updates),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['listings'] })
      qc.invalidateQueries({ queryKey: ['listing', id] })
    },
  })
}

export function useDeleteListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: listingsService.deleteListing,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listings'] }),
  })
}
