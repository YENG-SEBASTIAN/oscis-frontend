export type UserProfile = {
  id: string;
  avatar: string | null;
  date_of_birth: string;
  age: number;
  gender: string;
  bio: string;
  location: string;
  created_at: string;
  updated_at: string;
};

export type User = {
    id: string;
    email: string;
    username: string;
    is_active: boolean;
    is_staff: boolean;
};