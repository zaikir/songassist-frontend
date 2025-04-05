export type AuthContextValue = {
  user: User;
  loading: boolean;
  checkUserSession?: () => Promise<void>;
  setUser: (user: User) => void;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};
