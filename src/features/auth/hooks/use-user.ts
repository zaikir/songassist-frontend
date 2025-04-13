import type { User } from 'src/types/entities';

import { useAtomValue } from 'jotai';

import { userAtom } from 'src/features/bootstrap';

export function useUser() {
  return useAtomValue(userAtom) as User;
}
