import { UserProfile } from './user.model';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

export interface Permission {
  method: string;
  path: string;
}

export interface SessionState {
  user: UserProfile | null;
  permissions: Permission[];
}