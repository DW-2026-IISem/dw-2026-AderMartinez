export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  status: 'active' | 'inactive';
}