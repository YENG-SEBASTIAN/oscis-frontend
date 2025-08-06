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
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  short_name: string;
  phone_number: string | null;
  is_active: boolean;
  profile: UserProfile;
  created_at: string;
  updated_at: string;
};
