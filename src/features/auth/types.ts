import type { User } from 'src/types/entities';

export type AuthContextValue = {
  user: User;
  loading: boolean;
  checkUserSession?: () => Promise<void>;
  setUser: (user: User) => void;
};
