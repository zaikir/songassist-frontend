import { atom } from 'jotai';

const headerContainerRefAtom = atom<HTMLDivElement | null>(null);

export function useDashboardLayout() {
  return {
    headerContainerRefAtom,
  };
}
