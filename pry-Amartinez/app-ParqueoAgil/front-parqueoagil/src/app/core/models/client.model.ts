export interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientResponse {
  clients: Client[];
  client?: Client;
}


export interface ClientPayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}