import { api } from './api';
import { Deal, Paginated, DealCreatePayload, DealUpdatePayload } from '../types/deal';

export async function fetchDeals(params: {
  page?: number;
  perPage?: number;
  q?: string;
  active?: boolean;
}): Promise<Paginated<Deal>> {
  const res = await api.get<Paginated<Deal>>('/deals', {
    params: {
      page: params.page ?? 1,
      per_page: params.perPage ?? 20,
      q: params.q ?? undefined,
      active: typeof params.active === 'boolean' ? params.active : undefined
    }
  });
  return res.data;
}

export async function createDeal(payload: DealCreatePayload): Promise<Deal> {
  const res = await api.post<Deal>('/deals', payload);
  return res.data;
}

export async function updateDeal(id: number, payload: DealUpdatePayload): Promise<Deal> {
  const res = await api.patch<Deal>(`/deals/${id}`, payload);
  return res.data;
}

export async function deleteDeal(id: number): Promise<void> {
  await api.delete(`/deals/${id}`);
}




