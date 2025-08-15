export type Deal = {
  id: number;
  title: string;
  active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  per_page: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
};

export type DealCreatePayload = {
  title: string;
  description?: string;
};

export type DealUpdatePayload = Partial<Deal>;




