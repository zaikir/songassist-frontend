export type Project = {
  id: string;
  name: string;
  language: string;
  country: string;
  city: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  language: string | null;
  country: string | null;
  city: string | null;
};
