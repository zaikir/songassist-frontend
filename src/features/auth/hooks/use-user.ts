import { useAtomValue } from 'jotai';

import { userAtom } from 'src/features/bootstrap';

import type { User } from '../types';

export function useUser() {
  return useAtomValue(userAtom) as User;
}
