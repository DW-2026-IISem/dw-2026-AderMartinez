export type Status = 'active' | 'inactive';
export type Money = number | string;

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export function toNumber(value: Money | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}