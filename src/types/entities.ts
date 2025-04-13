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

export type Chat = {
  id: string;
  request: string;
  response: string | null;
  error: string | null;
  rating: number | null;
  comment: string | null;
  userId: string;
  createdAt: string;
};
