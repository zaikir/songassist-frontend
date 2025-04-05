import { useAtomValue } from 'jotai';

import { projectsAtom } from 'src/features/bootstrap';

export function useProjects() {
  return useAtomValue(projectsAtom);
}
