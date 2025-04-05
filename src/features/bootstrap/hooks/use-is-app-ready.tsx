import { useAtomValue } from 'jotai';

import { isAppInitializedAtom } from '../atoms';

export function useIsAppReady() {
  return useAtomValue(isAppInitializedAtom);
}
