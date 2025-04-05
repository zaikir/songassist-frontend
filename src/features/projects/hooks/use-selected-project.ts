import { atom, useAtomValue } from 'jotai';

import { useProjects } from './use-projects';

export const selectedProjectIdAtom = atom('');

export function useSelectedProject() {
  const projects = useProjects();
  const selectedProjectId = useAtomValue(selectedProjectIdAtom);

  return projects.find((p) => p.id === selectedProjectId) ?? null;
}
