import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchDeals } from '../services/deals';
import { Deal, Paginated } from '../types/deal';

export function useDeals(params: { page?: number; perPage?: number; q?: string; active?: boolean }) {
  const key = ['deals', params];
  return useQuery<Paginated<Deal>>({
    queryKey: key,
    queryFn: () => fetchDeals(params)
  });
}

export function useInfiniteDeals(params: { perPage?: number; q?: string; active?: boolean }) {
  const pageSize = params.perPage ?? 20;
  return useInfiniteQuery<Paginated<Deal>>({
    queryKey: ['deals', 'infinite', params],
    // TanStack Query types pageParam as unknown; coerce to number with default
    queryFn: ({ pageParam }) =>
      fetchDeals({
        page: (pageParam as number | undefined) ?? 1,
        perPage: pageSize,
        q: params.q,
        active: params.active
      }),
    getNextPageParam: (lastPage) => (lastPage.has_next ? lastPage.page + 1 : undefined),
    initialPageParam: 1
  });
}




